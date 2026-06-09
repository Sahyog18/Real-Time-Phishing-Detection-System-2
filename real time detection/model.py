import os
import re
import pickle
import hashlib
import numpy as np
import pandas as pd
from urllib.parse import urlparse
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

# Try to import XGBoost, fallback to GradientBoostingClassifier if not available
try:
    from xgboost import XGBClassifier
    HAS_XGB = True
except ImportError:
    from sklearn.ensemble import GradientBoostingClassifier as XGBClassifier
    HAS_XGB = False

MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "phishing_model.pkl")

# List of features in ordering
FEATURE_NAMES = [
    'url_length', 'num_dots', 'num_hyphens', 'https_presence', 
    'ip_address', 'suspicious_keywords', 'domain_age', 'redirect_count', 'special_chars'
]

def extract_features(url: str) -> dict:
    """Extracts 9 key features from a URL for ML classification."""
    # Ensure scheme is present for parsing
    if not (url.startswith('http://') or url.startswith('https://')):
        raw_url = 'http://' + url
    else:
        raw_url = url
        
    try:
        parsed_url = urlparse(raw_url)
        domain = parsed_url.netloc or parsed_url.path.split('/')[0]
        path = parsed_url.path
    except Exception:
        domain = ""
        path = ""
    
    # 1. URL Length
    url_length = len(raw_url)
    
    # 2. Number of Dots
    num_dots = raw_url.count('.')
    
    # 3. Number of Hyphens
    num_hyphens = raw_url.count('-')
    
    # 4. HTTPS Presence
    https_presence = 1 if raw_url.lower().startswith('https://') else 0
    
    # 5. IP Address Detection
    ip_pattern = r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$'
    # Clean port if present
    domain_ip = domain.split(':')[0] if ':' in domain else domain
    ip_address = 1 if re.match(ip_pattern, domain_ip) else 0
    
    # 6. Suspicious Keywords
    keywords = ['login', 'verify', 'secure', 'update', 'banking', 'signin', 'ebayisapi', 'webscr', 'account', 'admin', 'credential', 'password']
    suspicious_keywords = sum(1 for kw in keywords if kw in raw_url.lower())
    
    # 7. Domain Age (Deterministic Mock based on domain name)
    popular_domains = {
        'google.com': 9800, 'github.com': 6400, 'microsoft.com': 11300, 
        'amazon.com': 10200, 'paypal.com': 8700, 'apple.com': 10500,
        'netflix.com': 8800, 'google.co.in': 7500, 'gmail.com': 9000,
        'yahoo.com': 10600, 'linkedin.com': 8200, 'wikipedia.org': 8500,
        'facebook.com': 8100, 'twitter.com': 7300, 'youtube.com': 7700
    }
    domain_clean = domain.lower().replace('www.', '').split(':')[0]
    if domain_clean in popular_domains:
        domain_age = popular_domains[domain_clean]
    else:
        # Generate a deterministic age based on the hash (15 to 1200 days)
        hash_val = int(hashlib.md5(domain_clean.encode('utf-8')).hexdigest(), 16)
        domain_age = 15 + (hash_val % 1185)
        
    # 8. Redirect Count (indicated by // inside path, or multiple schemes)
    redirect_count = path.count('//') + path.count('http') + path.count('https')
    
    # 9. Special Characters
    special_chars = sum(raw_url.count(c) for c in ['@', '?', '=', '&', '%'])
    
    return {
        'url_length': url_length,
        'num_dots': num_dots,
        'num_hyphens': num_hyphens,
        'https_presence': https_presence,
        'ip_address': ip_address,
        'suspicious_keywords': suspicious_keywords,
        'domain_age': domain_age,
        'redirect_count': redirect_count,
        'special_chars': special_chars
    }

def generate_synthetic_dataset(size: int = 1500) -> pd.DataFrame:
    """Generates a high-quality, realistic synthetic URL dataset."""
    safe_domains = [
        "google.com", "github.com", "microsoft.com", "amazon.com", "paypal.com",
        "apple.com", "netflix.com", "wikipedia.org", "linkedin.com", "yahoo.com",
        "youtube.com", "facebook.com", "stackoverflow.com", "medium.com", "reddit.com"
    ]
    
    safe_paths = [
        "/", "/search?q=cybersecurity", "/about", "/contact-us", "/docs/api/v1",
        "/user/settings/profile", "/post/2026/phishing-detection", "/index.html",
        "/feed", "/watch?v=dQw4w9WgXcQ", "/groups/networking", "/questions/1234"
    ]
    
    phishing_brands = ["paypal", "amazon", "netflix", "microsoft", "google", "apple", "chase", "wells-fargo", "bankofamerica", "ebay"]
    phishing_keywords = ["secure", "login", "update", "verify", "account", "signin", "billing", "recovery", "alert"]
    phishing_tlds = [".xyz", ".info", ".top", ".club", ".click", ".support", ".temp", ".online", ".work"]
    
    data = []
    
    half_size = size // 2
    
    # Generate Safe URLs (Label = 0)
    for i in range(half_size):
        domain = np.random.choice(safe_domains)
        path = np.random.choice(safe_paths)
        scheme = "https://" if np.random.rand() > 0.1 else "http://"
        url = f"{scheme}{domain}{path}"
        features = extract_features(url)
        features['label'] = 0  # 0 for Safe
        data.append(features)
        
    # Generate Phishing URLs (Label = 1)
    for i in range(half_size):
        # Type of phishing URL
        phish_type = np.random.choice(["typo", "keyword", "ip", "shortener", "subdomain"])
        
        if phish_type == "typo":
            brand = np.random.choice(phishing_brands)
            domain = brand.replace('a', '4').replace('o', '0').replace('l', '1').replace('i', '1') + np.random.choice(phishing_tlds)
            path = "/" + np.random.choice(phishing_keywords)
            url = f"http://{domain}{path}"
            
        elif phish_type == "keyword":
            brand = np.random.choice(phishing_brands)
            kw = np.random.choice(phishing_keywords)
            domain = f"{brand}-{kw}-verification" + np.random.choice(phishing_tlds)
            path = f"/login.php?email=user@domain.com"
            url = f"http://{domain}{path}"
            
        elif phish_type == "ip":
            ip = f"{np.random.randint(100, 220)}.{np.random.randint(0, 255)}.{np.random.randint(0, 255)}.{np.random.randint(1, 254)}"
            brand = np.random.choice(phishing_brands)
            url = f"http://{ip}/{brand}/login.html"
            
        elif phish_type == "shortener":
            short = np.random.choice(["bit.ly", "tinyurl.com", "t.co", "is.gd"])
            path = "/" + "".join(np.random.choice(list("abcdefghijklmnopqrstuvwxyz0123456789"), 6))
            url = f"https://{short}{path}"
            
        else: # subdomain phishing
            brand = np.random.choice(phishing_brands)
            kw1 = np.random.choice(phishing_keywords)
            kw2 = np.random.choice(phishing_keywords)
            url = f"http://{brand}.com.{kw1}-{kw2}-alert.secure-server.xyz/signin"
            
        features = extract_features(url)
        features['label'] = 1  # 1 for Phishing
        data.append(features)
        
    return pd.DataFrame(data)

def train_and_evaluate() -> dict:
    """Trains Logistic Regression, Random Forest, and XGBoost/Gradient Boosting, comparing metrics."""
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)
        
    # Generate dataset
    df = generate_synthetic_dataset(1500)
    
    X = df[FEATURE_NAMES]
    y = df['label']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Standardize features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Define models
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'XGBoost': XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42) if HAS_XGB else XGBClassifier(random_state=42)
    }
    
    results = {}
    best_f1 = 0
    best_model_name = ""
    best_model_obj = None
    
    for name, clf in models.items():
        # Train
        clf.fit(X_train_scaled, y_train)
        
        # Predict
        preds = clf.predict(X_test_scaled)
        probs = clf.predict_proba(X_test_scaled)[:, 1]
        
        # Metrics
        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds)
        rec = recall_score(y_test, preds)
        f1 = f1_score(y_test, preds)
        auc = roc_auc_score(y_test, probs)
        
        results[name] = {
            'accuracy': float(acc),
            'precision': float(prec),
            'recall': float(rec),
            'f1_score': float(f1),
            'roc_auc': float(auc)
        }
        
        # Save best model
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model_obj = clf
            
    # Save best model details to pickle
    model_artifact = {
        'model': best_model_obj,
        'scaler': scaler,
        'model_name': best_model_name,
        'feature_names': FEATURE_NAMES,
        'metrics': results,
        'is_xgb_fallback': not HAS_XGB
    }
    
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model_artifact, f)
        
    print(f"Best model '{best_model_name}' saved to: {MODEL_PATH}")
    return model_artifact

def load_model() -> dict | None:
    """Loads the pre-trained ML model, scaler, and evaluation metrics."""
    if not os.path.exists(MODEL_PATH):
        # Auto-train if model file doesn't exist
        try:
            return train_and_evaluate()
        except Exception as e:
            print(f"Error auto-training model: {e}")
            return None
            
    try:
        with open(MODEL_PATH, 'rb') as f:
            return pickle.load(f)
    except Exception as e:
        print(f"Error loading model: {e}")
        return None
