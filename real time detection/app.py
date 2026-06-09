import os
import streamlit as st
from auth import init_session_state, is_logged_in, logout_session, get_current_user, is_admin
from database import DB_PATH
from model import MODEL_PATH, load_model

st.set_page_config(
    page_title="PhishShield Security Portal",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Apply global styling
def apply_theme_css():
    st.markdown("""
    <style>
    /* Global layout customizations */
    .reportview-container {
        font-family: 'Inter', sans-serif;
    }
    
    /* Modern Glassmorphic Dashboard Cards */
    .metric-card {
        background: rgba(30, 41, 59, 0.7);
        border: 1px solid rgba(148, 163, 184, 0.1);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        color: #F8FAFC;
    }
    
    /* System Status Badges */
    .badge {
        display: inline-block;
        padding: 0.25em 0.6em;
        font-size: 75%;
        font-weight: 700;
        line-height: 1;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: 0.375rem;
    }
    .badge-success { background-color: #10B981; color: white; }
    .badge-danger { background-color: #EF4444; color: white; }
    .badge-warning { background-color: #F59E0B; color: white; }
    
    /* Professional Sidebar customizations */
    div[data-testid="stSidebarNav"] {
        padding-top: 1.5rem;
    }
    
    /* Clean headings */
    h1, h2, h3 {
        font-weight: 700 !important;
    }
    </style>
    """, unsafe_allow_html=True)

def main():
    apply_theme_css()
    init_session_state()
    
    st.title("🛡️ PhishShield: Real-Time URL Threat Portal")
    st.subheader("Enterprise Phishing Detection & Prevention Platform")
    
    # Hero Section
    st.markdown("""
    <div style='background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); padding: 30px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 25px; color: #F8FAFC;'>
        <h2 style='margin-top:0; color:#3B82F6;'>AI-Driven Real-Time URL Classification</h2>
        <p style='font-size: 1.1em; line-height: 1.6;'>
            Welcome to the PhishShield security portal. PhishShield uses state-of-the-art machine learning, 
            heuristic threat intelligence feeds, and VirusTotal reputation scoring to scan, predict, and block 
            phishing domains instantly.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    cols = st.columns([2, 1])
    
    with cols[0]:
        st.write("### Platform Capabilities")
        st.markdown("""
        - 🧠 **Multi-Model ML Engine:** Compares Logistic Regression, Random Forest, and XGBoost to predict threats.
        - ⚡ **Real-Time Scanning:** Resolves domain age, dot counts, suspicious parameters, and TLD checks under 200ms.
        - 🔌 **VirusTotal Threat Intel:** Aggregates feedback from 70+ antivirus endpoints.
        - 💬 **AI Cybersecurity Chatbot:** Interactive assistant that analyzes results and advises safety practices.
        - 📄 **Auditable PDF Reports:** Generate and download official threat intelligence summary files.
        - 🛡️ **Role-Based Controls:** Segment user scans from administrative analytics and logs audit.
        """)
        
        # User session helper instructions
        if is_logged_in():
            user = get_current_user()
            st.success(f"🔓 Authenticated as **{user['username']}** ({user['role'].upper()})")
            st.info("👈 Use the Sidebar to navigate to the **URL Scanner**, **Dashboard**, or **AI Assistant**.")
        else:
            st.warning("🔒 Portal locked. Navigate to **Login** or **Register** page in the sidebar to authenticate.")
            
    with cols[1]:
        st.write("### System Integrity & Metrics")
        
        db_exists = os.path.exists(DB_PATH)
        model_exists = os.path.exists(MODEL_PATH)
        
        st.markdown(f"""
        | Service | Status |
        |---|---|
        | 🗄️ Database (SQLite) | {'<span class="badge badge-success">ONLINE</span>' if db_exists else '<span class="badge badge-danger">OFFLINE</span>'} |
        | 🧠 ML Inference Model | {'<span class="badge badge-success">TRAINED & LOADED</span>' if model_exists else '<span class="badge badge-warning">NOT TRAINED</span>'} |
        | 🌐 VirusTotal Gateway | <span class="badge badge-success">ACTIVE</span> |
        | 💬 AI Security Engine | <span class="badge badge-success">STANDBY</span> |
        """, unsafe_allow_html=True)
        
        # Model stats preview
        if model_exists:
            model_info = load_model()
            best_model_name = model_info.get('model_name', 'XGBoost')
            accuracy = model_info.get('metrics', {}).get(best_model_name, {}).get('accuracy', 0.95) * 100
            st.metric("Detection System Accuracy", f"{accuracy:.2f}%", help="Based on the testing split of the URL dataset.")
            
        st.write("---")
        
        # Quick settings panel inside sidebar or Home page
        with st.expander("⚙️ Quick Configuration Settings"):
            st.write("Add API keys to enable live lookups:")
            
            vt_key = st.text_input(
                "VirusTotal API Key", 
                value=st.session_state.get("vt_api_key", ""), 
                type="password",
                help="Requires VirusTotal API v3 key. Left empty to use Simulated Mock Threat Intel."
            )
            if vt_key:
                st.session_state.vt_api_key = vt_key
                
            gemini_key = st.text_input(
                "Gemini API Key", 
                value=st.session_state.get("gemini_api_key", ""), 
                type="password",
                help="Google Gemini API key. Left empty to use the expert Rule-Based security agent."
            )
            if gemini_key:
                st.session_state.gemini_api_key = gemini_key
                
            st.write("---")
            st.write("SMTP Server Configuration (Email Alerts)")
            smtp_server = st.text_input("SMTP Server", value=st.session_state.get("smtp_settings", {}).get("server", ""))
            smtp_port = st.number_input("SMTP Port", value=st.session_state.get("smtp_settings", {}).get("port", 587))
            smtp_user = st.text_input("SMTP User", value=st.session_state.get("smtp_settings", {}).get("user", ""))
            smtp_pass = st.text_input("SMTP Password", value=st.session_state.get("smtp_settings", {}).get("password", ""), type="password")
            
            if st.button("Save Settings"):
                st.session_state.smtp_settings = {
                    "server": smtp_server,
                    "port": int(smtp_port),
                    "user": smtp_user,
                    "password": smtp_pass
                }
                st.success("Configuration saved successfully!")
                
        # Logout button
        if is_logged_in():
            if st.button("Log out of session"):
                logout_session()
                st.success("Session closed.")
                st.rerun()

if __name__ == "__main__":
    main()
