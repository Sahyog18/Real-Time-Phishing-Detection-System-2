import os
import streamlit as st
from urllib.parse import urlparse
from auth import init_session_state, is_logged_in, get_current_user
from scanner import scan_url
from report_generator import generate_pdf_report

st.set_page_config(page_title="PhishShield - URL Scanner", page_icon="🔍", layout="wide")
init_session_state()

# 1. Access Control
if not is_logged_in():
    st.warning("🔒 Access Denied. Please navigate to the **Login** page to sign in first.")
    st.stop()

user = get_current_user()

st.title("🔍 Real-Time URL Threat Scanner")
st.write("Submit suspicious links to run AI model prediction, VirusTotal engine intelligence, and structural threat audit.")

# 2. Main Scan Form
url_input = st.text_input(
    "Target URL for Inspection", 
    placeholder="e.g. https://secure-login-paypal.com/signin or google.com",
    help="Enter the exact URL string. The scanner will parse both main domain features and sub-directories/queries."
)

scan_clicked = st.button("🚀 Analyze Domain Safety", type="primary")

if scan_clicked or st.session_state.get('auto_scan', False):
    # Reset auto_scan flag if active
    if st.session_state.get('auto_scan', False):
        st.session_state.auto_scan = False
        
    if not url_input.strip():
        st.error("Please enter a valid URL.")
    else:
        # Visual loading spinner
        with st.spinner("Decoding URL structure & running AI classification models..."):
            # Clean URL schema format if not present
            clean_url = url_input.strip()
            if not (clean_url.startswith('http://') or clean_url.startswith('https://')):
                clean_url = 'https://' + clean_url
                
            vt_key = st.session_state.get('vt_api_key', None)
            
            try:
                # Run the complete scanning engine
                result = scan_url(clean_url, user_id=user['id'], vt_api_key=vt_key)
                
                # Store scan results in session state for chatbot context
                st.session_state.last_scan_result = result
                
                # Output Presentation
                st.write("---")
                st.subheader("🛡️ Scan Threat Assessment")
                
                cols = st.columns([2, 1])
                
                with cols[0]:
                    pred = result['prediction']
                    risk = result['risk_level']
                    conf = result['confidence'] * 100
                    
                    # Style based on Risk Levels
                    if risk == "High":
                        box_bg = "#FEE2E2"
                        border_c = "#EF4444"
                        text_c = "#DC2626"
                        status_msg = "🚨 DANGER: PHISHING DOMAIN DETECTED"
                    elif risk == "Medium":
                        box_bg = "#FEF3C7"
                        border_c = "#F59E0B"
                        text_c = "#D97706"
                        status_msg = "⚠️ WARNING: SUSPICIOUS ACTIVITY INDICATORS FOUND"
                    else:
                        box_bg = "#DCFCE7"
                        border_c = "#10B981"
                        text_c = "#16A34A"
                        status_msg = "✅ SAFE: NO CRITICAL THREATS DETECTED"
                        
                    st.markdown(
                        f"""
                        <div style="background-color:{box_bg}; border: 1.5px solid {border_c}; border-radius:10px; padding:20px; color:{text_c};">
                            <h3 style="margin-top:0; font-weight:700;">{status_msg}</h3>
                            <p style="font-size:1.15em; margin: 5px 0;">URL: <b>{result['url']}</b></p>
                            <p style="font-size:1.1em; margin:0;">AI Confidence Score: <b>{conf:.2f}%</b></p>
                        </div>
                        """, 
                        unsafe_allow_html=True
                    )
                    
                    st.write("#### Heuristic Features Identified")
                    threats = result['threats']
                    if not threats:
                        st.write("✔️ URL structure matches safe, standard templates. (No suspicious TLDs, no shorteners, no typo domains).")
                    else:
                        for idx, threat in enumerate(threats):
                            st.warning(f"🔍 **[{threat['type']}]** {threat['details']}")
                            
                    st.write("#### AI Security Assistant Advice")
                    if risk == "High":
                        st.error("❗ **Do NOT open this page or insert credentials.** This URL mimics standard secure logins to capture sensitive authentication tokens.")
                    elif risk == "Medium":
                        st.warning("⚠️ **Exercise extreme caution.** The URL contains suspicious features such as lookalike spelling or unregistered cheap TLDs. Do not download files.")
                    else:
                        st.success("✔️ This URL appears clean. Ensure the connection is HTTPS before typing sensitive profile information.")
                        
                with cols[1]:
                    st.write("#### VirusTotal Gateway Intel")
                    vt = result['vt_results']
                    
                    st.markdown(
                        f"""
                        - 🔴 **Malicious Engines:** {vt['malicious']} / 70+
                        - 🟠 **Suspicious Engines:** {vt['suspicious']}
                        - 🟢 **Harmless/Clean:** {vt['harmless']}
                        - ⚙️ **Source:** {vt['provider']}
                        """, 
                        unsafe_allow_html=True
                    )
                    
                    st.write("---")
                    st.write("#### Actions & Reports")
                    
                    # Generate PDF Report
                    pdf_filename = f"report_{result['scan_id']}.pdf"
                    pdf_path = generate_pdf_report(result, vt, threats, pdf_filename)
                    
                    if os.path.exists(pdf_path):
                        with open(pdf_path, "rb") as f:
                            pdf_bytes = f.read()
                        
                        st.download_button(
                            label="📥 Download PDF Threat Report",
                            data=pdf_bytes,
                            file_name=f"PhishShield_Report_{result['scan_id']}.pdf",
                            mime="application/pdf",
                            key="download_report_btn"
                        )
                    else:
                        st.error("Error building PDF file.")
                        
                    st.write("")
                    # Quick Chat navigation guide
                    st.info("💬 Want an in-depth security analysis? Navigate to the **AI Assistant** tab. The assistant will auto-load this URL context.")
                    
            except Exception as e:
                st.error(f"Execution Error during URL scanning: {str(e)}")
                import traceback
                print(traceback.format_exc())
