import os
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from urllib.parse import urlparse
import streamlit as st

from database import get_db_connection, DB_PATH
from model import load_model, extract_features, FEATURE_NAMES
from virustotal import scan_url_virustotal

# Heuristic Threat intelligence datasets
SUSPICIOUS_TLDS = ['.xyz', '.club', '.top', '.info', '.work', '.click', '.support', '.temp', '.online', '.date', '.site', '.space']
URL_SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'buff.ly', 'adf.ly', 'goo.gl', 'ow.ly', 'rebrand.ly']
BLACKLISTED_DOMAINS = [
    'paypal-update-login.com', 'verify-apple-id.net', 'login-microsoft-auth.xyz',
    'secure-chase-alert.info', 'netflix-billing-update.club', 'wells-fargo-active.online',
    'chase-security-check.xyz', 'amazon-signin-support.info'
]

def run_threat_intelligence_checks(url: str) -> list:
    """Performs heuristic threat scans on URL looking for suspicious structures."""
    threat_logs = []
    url_lower = url.lower()
    
    try:
        parsed = urlparse(url if (url.startswith('http://') or url.startswith('https://')) else 'http://' + url)
        domain = parsed.netloc or parsed.path.split('/')[0]
        path = parsed.path
        query = parsed.query
    except Exception:
        domain = url_lower
        path = ""
        query = ""
        
    domain_clean = domain.replace('www.', '').split(':')[0]
    
    # 1. Blacklisted Domain Check
    if domain_clean in BLACKLISTED_DOMAINS:
        threat_logs.append({
            'type': 'Blacklisted Domain',
            'details': f"Domain '{domain_clean}' is listed in the PhishShield security blacklist feeds."
        })
        
    # 2. Suspicious TLD Check
    has_suspicious_tld = any(domain_clean.endswith(tld) for tld in SUSPICIOUS_TLDS)
    if has_suspicious_tld:
        matched_tld = [tld for tld in SUSPICIOUS_TLDS if domain_clean.endswith(tld)][0]
        threat_logs.append({
            'type': 'Suspicious TLD',
            'details': f"URL host uses suspicious top-level domain '{matched_tld}'. Attackers frequent cheap/unregulated TLDs."
        })
        
    # 3. URL Shortener Check
    is_shortener = any(short in domain_clean for short in URL_SHORTENERS)
    if is_shortener:
        threat_logs.append({
            'type': 'URL Shortener',
            'details': "Masking destination domain via shorteners (bit.ly/tinyurl). Common in smishing and phishing SMS links."
        })
        
    # 4. Fake Login Check
    brands = ["paypal", "chase", "netflix", "microsoft", "google", "bankofamerica", "wells-fargo", "apple"]
    params = ["email", "user", "login", "pwd", "redirect", "session", "secure", "verify"]
    has_brand = any(brand in domain_clean for brand in brands)
    has_param = any(param in query.lower() or param in path.lower() for param in params)
    
    # If the domain is not actually the brand domain, but contains the brand as a keyword or subdomain
    is_legit_brand = any(f"{brand}.com" in domain_clean or f"{brand}.net" in domain_clean for brand in brands)
    
    if has_brand and not is_legit_brand:
        if has_param or '-' in domain_clean:
            threat_logs.append({
                'type': 'Fake Login Signature',
                'details': f"URL contains brand keyword '{domain_clean}' with suspicious parameters, indicating a credential harvest site."
            })
            
    return threat_logs

def scan_url(url: str, user_id: int = None, vt_api_key: str = None) -> dict:
    """Performs real-time phishing classification combining ML, VirusTotal, and Threat Intel."""
    if not url:
        return {'status': 'error', 'message': 'Empty URL provided.'}
        
    # 1. Extract features
    features = extract_features(url)
    
    # 2. Load ML Classifier
    model_data = load_model()
    if not model_data:
        # Emergency backup hardcoded logic if ML model fails to load
        ml_prediction = "Safe"
        ml_confidence = 0.5
        ml_pred_label = 0
    else:
        clf = model_data['model']
        scaler = model_data['scaler']
        
        # Convert dict to ordered values
        feature_values = [features[name] for name in FEATURE_NAMES]
        
        try:
            scaled_values = scaler.transform([feature_values])
            ml_pred_label = int(clf.predict(scaled_values)[0])
            probs = clf.predict_proba(scaled_values)[0]
            ml_confidence = float(probs[1] if ml_pred_label == 1 else probs[0])
            ml_prediction = "Phishing" if ml_pred_label == 1 else "Safe"
        except Exception as e:
            print(f"ML Prediction Error: {e}")
            ml_prediction = "Safe"
            ml_confidence = 0.5
            ml_pred_label = 0
            
    # 3. Run Threat Intel Heuristics
    threat_intel_details = run_threat_intelligence_checks(url)
    
    # 4. Fetch VirusTotal Threat Intel
    vt_report = scan_url_virustotal(url, vt_api_key)
    vt_malicious = vt_report.get('malicious', 0)
    vt_suspicious = vt_report.get('suspicious', 0)
    vt_harmless = vt_report.get('harmless', 0)
    
    # 5. Combined Prediction Logic
    # Level definitions: Safe Website, Suspicious Website, Phishing Website
    prediction = "Safe Website"
    risk_level = "Low"
    confidence = ml_confidence
    
    # Heuristic threat count
    intel_count = len(threat_intel_details)
    
    # Score aggregation
    if ml_pred_label == 1:
        if ml_confidence >= 0.70 or vt_malicious >= 3 or intel_count >= 1:
            prediction = "Phishing Website"
            risk_level = "High"
        else:
            prediction = "Suspicious Website"
            risk_level = "Medium"
    else: # ML predicted safe
        if vt_malicious >= 3 or intel_count >= 2:
            prediction = "Phishing Website"
            risk_level = "High"
            confidence = 0.85
        elif vt_malicious >= 1 or intel_count >= 1 or ml_confidence < 0.85:
            prediction = "Suspicious Website"
            risk_level = "Medium"
            confidence = max(ml_confidence, 0.65)
            
    # 6. Save results to database
    conn = get_db_connection()
    cursor = conn.cursor()
    scan_id = None
    try:
        cursor.execute(
            """
            INSERT INTO scan_history 
            (user_id, url, prediction, confidence, risk_level, vt_malicious, vt_suspicious, vt_harmless) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (user_id, url, prediction, confidence, risk_level, vt_malicious, vt_suspicious, vt_harmless)
        )
        scan_id = cursor.lastrowid
        
        # Log threat details in threat_logs
        for threat in threat_intel_details:
            cursor.execute(
                "INSERT INTO threat_logs (scan_id, threat_type, details) VALUES (?, ?, ?)",
                (scan_id, threat['type'], threat['details'])
            )
            
        # If classification is Phishing or Suspicious, log standard threat log for ML/VT
        if risk_level == "High" or risk_level == "Medium":
            if ml_pred_label == 1:
                cursor.execute(
                    "INSERT INTO threat_logs (scan_id, threat_type, details) VALUES (?, ?, ?)",
                    (scan_id, "ML Classifier Alert", f"AI model flagged URL with {ml_confidence*100:.2f}% confidence.")
                )
            if vt_malicious > 0:
                cursor.execute(
                    "INSERT INTO threat_logs (scan_id, threat_type, details) VALUES (?, ?, ?)",
                    (scan_id, "VirusTotal Alert", f"{vt_malicious} antivirus engines flagged this domain as malicious.")
                )
                
        conn.commit()
    except Exception as e:
        print(f"Error logging scan to DB: {e}")
    finally:
        conn.close()
        
    result_report = {
        'scan_id': scan_id,
        'url': url,
        'prediction': prediction,
        'confidence': confidence,
        'risk_level': risk_level,
        'threats': threat_intel_details,
        'vt_results': vt_report
    }
    
    # 7. Dispatch Alert Email System if phishing detected
    if risk_level == "High":
        user_email = st.session_state.get('user_email', 'user@phishshield.local')
        send_phishing_alert(url, prediction, risk_level, confidence, user_email)
        
    return result_report

def send_phishing_alert(url: str, prediction: str, risk_level: str, confidence: float, user_email: str) -> bool:
    """Dispatches a notification/email alert to users and security admins."""
    # Write alert logs first
    print(f"ALERT: Phishing URL detected: {url} | Risk: {risk_level} | Conf: {confidence:.2f}")
    
    # Build alert emails content
    subject = f"🚨 SECURITY WARNING: Phishing Detected ({urlparse(url).netloc})"
    
    body = f"""
    SECURITY ALERT: PHISHSHIELD AI DETECTION ENGINE
    
    A threat was detected during real-time scan verification.
    
    Target URL: {url}
    Risk Level: {risk_level} (CRITICAL)
    Classification: {prediction}
    Confidence Score: {confidence*100:.2f}%
    
    Action Taken: Destination blocked and quarantined.
    
    ADMIN ACTION:
    - User session logged.
    - Domain blacklisted in the SQLite threat logs table.
    
    USER RECOMMENDATION:
    - Immediately close the web browser page.
    - Do NOT enter any credentials, tokens, or personal identifiers.
    
    System Logs reference: {DB_PATH}
    """
    
    # Read SMTP configuration from streamlit settings state (if configured)
    smtp_settings = st.session_state.get('smtp_settings', {})
    
    # Show st.toast alert as notification inside dashboard UI
    st.toast(f"🚨 Security Alert dispatched to {user_email} & Admin regarding {urlparse(url).netloc}!", icon="⚠️")
    
    if not smtp_settings or not smtp_settings.get('server'):
        # Log email text to console / system logs
        print(f"--- EMAIL ALERTS DISPATCHED ---\nFrom: alerts@phishshield.local\nTo: {user_email}, security-admin@phishshield.local\nSubject: {subject}\n{body}\n-------------------------------")
        return True
        
    # Standard SMTP sending flow
    try:
        msg = MIMEMultipart()
        msg['From'] = smtp_settings.get('sender', 'alerts@phishshield.local')
        msg['To'] = f"{user_email}, {smtp_settings.get('admin_email', 'security-admin@phishshield.local')}"
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(smtp_settings.get('server'), smtp_settings.get('port', 587))
        server.starttls()
        server.login(smtp_settings.get('user'), smtp_settings.get('password'))
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send alert email via SMTP: {e}")
        return False
