import os
import streamlit as st
import pandas as pd
from auth import init_session_state, is_logged_in, get_current_user
from database import get_db_connection
from report_generator import generate_pdf_report

st.set_page_config(page_title="PhishShield - Security Reports", page_icon="📄", layout="wide")
init_session_state()

# 1. Access Control
if not is_logged_in():
    st.warning("🔒 Access Denied. Please navigate to the **Login** page to sign in first.")
    st.stop()

user = get_current_user()

st.title("📄 PDF Security Reports Archivist")
st.write("Browse your scanned URL logs, view threat metrics, and export professional PDF audit reports.")

# 2. Fetch User's Scans
conn = get_db_connection()
cursor = conn.cursor()

try:
    cursor.execute(
        """
        SELECT id, url, prediction, confidence, risk_level, vt_malicious, vt_suspicious, vt_harmless, scanned_at 
        FROM scan_history 
        WHERE user_id = ? 
        ORDER BY scanned_at DESC
        """,
        (user['id'],)
    )
    scans = [dict(row) for row in cursor.fetchall()]
finally:
    conn.close()

if not scans:
    st.info("No scan history found. Head over to the **URL Scanner** page to perform your first audit.")
else:
    st.write(f"Showing **{len(scans)}** logged scan operations:")
    
    for scan in scans:
        scan_id = scan['id']
        url = scan['url']
        risk = scan['risk_level']
        prediction = scan['prediction']
        confidence = scan['confidence']
        scanned_at = scan['scanned_at']
        
        # Color accent styling based on risk level
        if risk == "High":
            accent_c = "🔴"
            status_text = f"<font color='red'><b>{prediction}</b></font>"
        elif risk == "Medium":
            accent_c = "🟠"
            status_text = f"<font color='orange'><b>{prediction}</b></font>"
        else:
            accent_c = "🟢"
            status_text = f"<font color='green'><b>{prediction}</b></font>"
            
        with st.container():
            st.markdown(
                f"""
                <div style="background-color:rgba(148, 163, 184, 0.05); padding:15px; border-radius:8px; border: 1px solid rgba(148, 163, 184, 0.1); margin-bottom:10px;">
                    <span style="font-size: 1.25em;">{accent_c} <b>{url}</b></span><br/>
                    <span>Status: {status_text} | Confidence: <b>{confidence*100:.1f}%</b> | Scanned on: <i>{scanned_at}</i></span>
                </div>
                """, 
                unsafe_allow_html=True
            )
            
            # Action button columns
            action_cols = st.columns([1, 6])
            
            # Button to trigger PDF generation and download
            with action_cols[0]:
                if st.button("Generate PDF", key=f"gen_pdf_{scan_id}"):
                    # Fetch threat logs for this scan
                    conn = get_db_connection()
                    cursor = conn.cursor()
                    try:
                        cursor.execute("SELECT threat_type as type, details FROM threat_logs WHERE scan_id = ?", (scan_id,))
                        threats = [dict(row) for row in cursor.fetchall()]
                    finally:
                        conn.close()
                        
                    # Reconstruct scan data dictionary
                    scan_data = {
                        'scan_id': scan_id,
                        'url': url,
                        'prediction': prediction,
                        'confidence': confidence,
                        'risk_level': risk
                    }
                    
                    # Reconstruct VirusTotal metrics
                    vt_data = {
                        'malicious': scan['vt_malicious'],
                        'suspicious': scan['vt_suspicious'],
                        'harmless': scan['vt_harmless'],
                        'provider': 'VirusTotal (Archived Log)'
                    }
                    
                    pdf_filename = f"report_archive_{scan_id}.pdf"
                    pdf_path = generate_pdf_report(scan_data, vt_data, threats, pdf_filename)
                    
                    if os.path.exists(pdf_path):
                        with open(pdf_path, "rb") as f:
                            pdf_bytes = f.read()
                            
                        st.download_button(
                            label="📥 Download Now",
                            data=pdf_bytes,
                            file_name=f"PhishShield_Report_{scan_id}.pdf",
                            mime="application/pdf",
                            key=f"dl_pdf_{scan_id}"
                        )
                        st.success("PDF Compiled! Click Download Now.")
                    else:
                        st.error("Could not compile report.")
            
            st.write("")
