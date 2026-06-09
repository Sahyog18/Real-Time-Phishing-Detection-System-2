import streamlit as st
import pandas as pd
from auth import init_session_state, is_logged_in, is_admin, get_current_user
from admin import get_all_users, delete_user, get_all_scan_history, delete_scan, get_admin_logs, export_scans_csv
from dashboard import generate_model_comparison_chart

st.set_page_config(page_title="PhishShield - Admin Panel", page_icon="🔐", layout="wide")
init_session_state()

# 1. Access Control
if not is_logged_in():
    st.warning("🔒 Access Denied. Please navigate to the **Login** page to sign in first.")
    st.stop()
    
if not is_admin():
    st.error("🛑 Security Exception: Access Denied. Administrative privileges required.")
    st.info("Please request your administrator to elevate your user role configuration.")
    st.stop()

admin_user = get_current_user()

st.title("🔐 Administration Control Panel")
st.write(f"Auditing session: **{admin_user['username']}** | Role: **Security Administrator**")

# 2. Setup Administration Tabs
tabs = st.tabs([
    "👥 User Management", 
    "🔍 Global Scan Logs", 
    "📊 System Analytics & Audits", 
    "📥 Export Security Data"
])

# ================= TAB 1: USER MANAGEMENT =================
with tabs[0]:
    st.subheader("System Access Profiles")
    users = get_all_users()
    
    if not users:
        st.write("No users registered.")
    else:
        df_users = pd.DataFrame(users)
        df_users.columns = ["User ID", "Username", "Email Address", "Security Role", "Registered Timestamp"]
        st.dataframe(df_users, use_container_width=True, hide_index=True)
        
        st.write("---")
        st.write("### 🛑 Decommission User Account")
        
        # User deletion interface
        deletable_users = [u for u in users if u['id'] != admin_user['id']]
        if not deletable_users:
            st.info("No other user accounts available to delete.")
        else:
            user_options = {f"{u['username']} (ID: {u['id']} - Role: {u['role']})": u for u in deletable_users}
            selected_option = st.selectbox("Select user account to delete", options=list(user_options.keys()))
            
            target_user = user_options[selected_option]
            
            with st.form("delete_user_form"):
                st.warning(f"Warning: Deleting user '{target_user['username']}' is irreversible and removes their personal history.")
                confirm_check = st.checkbox("Confirm absolute deletion")
                submit_delete = st.form_submit_button("Delete Account")
                
                if submit_delete:
                    if not confirm_check:
                        st.error("Deletion rejected: Check confirmation box.")
                    else:
                        success = delete_user(admin_user['id'], target_user['id'], target_user['username'])
                        if success:
                            st.success(f"User '{target_user['username']}' successfully deleted.")
                            st.rerun()
                        else:
                            st.error("Failed to delete user. Check database logs.")

# ================= TAB 2: GLOBAL SCAN LOGS =================
with tabs[1]:
    st.subheader("Global Scanned URLs Audit Log")
    scans = get_all_scan_history()
    
    if not scans:
        st.info("No scan history logged in database.")
    else:
        df_scans = pd.DataFrame(scans)
        df_scans.columns = ["Scan ID", "Scanned by", "Target URL", "AI Prediction", "Confidence Score", "Risk Rating", "Timestamp"]
        df_scans["Confidence Score"] = df_scans["Confidence Score"].map(lambda x: f"{x*100:.1f}%")
        
        st.dataframe(df_scans, use_container_width=True, hide_index=True)
        
        st.write("---")
        st.write("### 🗑️ Remove Scan Records")
        
        scan_options = {f"ID: {s['id']} | URL: {s['url'][:60]}...": s for s in scans}
        selected_scan_opt = st.selectbox("Select scan entry to delete", options=list(scan_options.keys()))
        target_scan = scan_options[selected_scan_opt]
        
        if st.button("Delete Scan Record", key="delete_scan_record_btn"):
            success = delete_scan(admin_user['id'], target_scan['id'], target_scan['url'])
            if success:
                st.success("Scan record successfully deleted.")
                st.rerun()
            else:
                st.error("Failed to delete scan record.")

# ================= TAB 3: SYSTEM ANALYTICS & AUDITS =================
with tabs[2]:
    st.subheader("AI/ML Engine Benchmark comparison")
    
    # Model comparison Plotly chart
    with st.spinner("Loading model evaluations..."):
        try:
            comparison_chart = generate_model_comparison_chart()
            st.plotly_chart(comparison_chart, use_container_width=True)
        except Exception as e:
            st.error(f"Error loading model benchmark metrics: {e}")
            
    st.write("---")
    st.subheader("📝 Administrative Actions Audit Trail")
    
    admin_logs = get_admin_logs()
    if not admin_logs:
        st.write("No administrative actions logged yet.")
    else:
        df_logs = pd.DataFrame(admin_logs)
        df_logs.columns = ["Log ID", "Admin Username", "Action Type", "Details / Impact", "Timestamp"]
        st.dataframe(df_logs, use_container_width=True, hide_index=True)

# ================= TAB 4: EXPORT SECURITY DATA =================
with tabs[3]:
    st.subheader("Export Threat Intelligence Logs")
    st.write("Download the entire URL scan database log sheet in standard CSV formatting for external analysis and training feeds.")
    
    try:
        csv_data = export_scans_csv()
        st.download_button(
            label="📥 Export Full Scan History (CSV)",
            data=csv_data,
            file_name="PhishShield_System_ScanHistory.csv",
            mime="text/csv"
        )
    except Exception as e:
        st.error(f"Failed to compile export: {e}")
