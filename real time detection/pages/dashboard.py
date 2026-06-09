import streamlit as st
import pandas as pd
from auth import init_session_state, is_logged_in, get_current_user, is_admin
from dashboard import (
    get_dashboard_kpis, 
    generate_risk_pie_chart, 
    generate_threat_categories_chart, 
    generate_trend_line_chart
)

st.set_page_config(page_title="PhishShield - Dashboard", page_icon="📊", layout="wide")
init_session_state()

# 1. Access Control
if not is_logged_in():
    st.warning("🔒 Access Denied. Please navigate to the **Login** page to sign in first.")
    st.stop()
    
user = get_current_user()
is_user_admin = is_admin()

st.title("📊 Security Analytics Dashboard")
st.write(f"Welcome, **{user['username']}** ({user['role'].upper()}). Monitor scan patterns and indicators.")

# 2. Admin Scope Toggle
view_scope_id = user['id']
if is_user_admin:
    scope = st.radio(
        "Dashboard Analysis Scope",
        options=["Global (All Users)", "Personal (My Scans Only)"],
        horizontal=True
    )
    if "Global" in scope:
        view_scope_id = None # database functions will fetch system-wide metrics

# 3. Fetch KPIs
kpis = get_dashboard_kpis(view_scope_id)

# 4. Render KPI Cards
cols = st.columns(4)

with cols[0]:
    st.markdown(
        f"""
        <div style="background-color:#1E293B; border-left: 5px solid #3B82F6; padding:15px; border-radius:8px; color:white;">
            <p style="margin:0; font-size: 0.9em; text-transform: uppercase; color:#94A3B8;">Total Scanned</p>
            <h2 style="margin:5px 0 0 0; font-size:2.2em; font-weight:700;">{kpis['total_scanned']}</h2>
        </div>
        """, 
        unsafe_allow_html=True
    )

with cols[1]:
    st.markdown(
        f"""
        <div style="background-color:#1E293B; border-left: 5px solid #EF4444; padding:15px; border-radius:8px; color:white;">
            <p style="margin:0; font-size: 0.9em; text-transform: uppercase; color:#94A3B8;">Threats Detected</p>
            <h2 style="margin:5px 0 0 0; font-size:2.2em; font-weight:700; color:#FCA5A5;">{kpis['threats_detected']}</h2>
        </div>
        """, 
        unsafe_allow_html=True
    )

with cols[2]:
    st.markdown(
        f"""
        <div style="background-color:#1E293B; border-left: 5px solid #10B981; padding:15px; border-radius:8px; color:white;">
            <p style="margin:0; font-size: 0.9em; text-transform: uppercase; color:#94A3B8;">Safe Sites Scanned</p>
            <h2 style="margin:5px 0 0 0; font-size:2.2em; font-weight:700; color:#A7F3D0;">{kpis['safe_urls']}</h2>
        </div>
        """, 
        unsafe_allow_html=True
    )

with cols[3]:
    st.markdown(
        f"""
        <div style="background-color:#1E293B; border-left: 5px solid #8B5CF6; padding:15px; border-radius:8px; color:white;">
            <p style="margin:0; font-size: 0.9em; text-transform: uppercase; color:#94A3B8;">ML System Accuracy</p>
            <h2 style="margin:5px 0 0 0; font-size:2.2em; font-weight:700; color:#DDD6FE;">{kpis['accuracy']*100:.2f}%</h2>
        </div>
        """, 
        unsafe_allow_html=True
    )

st.write("---")

# 5. Interactive Plotly Visualizations Grid
plot_cols = st.columns(2)

with plot_cols[0]:
    risk_pie = generate_risk_pie_chart(view_scope_id)
    st.plotly_chart(risk_pie, use_container_width=True)

with plot_cols[1]:
    threat_bars = generate_threat_categories_chart(view_scope_id)
    st.plotly_chart(threat_bars, use_container_width=True)

trend_line = generate_trend_line_chart(view_scope_id)
st.plotly_chart(trend_line, use_container_width=True)

st.write("---")

# 6. Recent Activities Table
st.subheader("📝 Recent Scanning Operations")
recent = kpis['recent_scans']

if not recent:
    st.info("No scan activities registered yet. Access the URL Scanner to analyze domains.")
else:
    df_recent = pd.DataFrame(recent)
    df_recent.columns = ["Scan ID", "Scanned URL", "Prediction Class", "AI Confidence Score", "Risk Level", "Scanned Timestamp"]
    
    # Format confidence score as percentage
    df_recent["AI Confidence Score"] = df_recent["AI Confidence Score"].map(lambda x: f"{x*100:.1f}%")
    
    # Custom colored table cells style simulation
    st.dataframe(
        df_recent.style.map(
            lambda x: "color: #EF4444; font-weight: bold;" if x == "High" or x == "Phishing Website" 
            else ("color: #F59E0B; font-weight: bold;" if x == "Medium" or x == "Suspicious Website" 
            else ("color: #10B981; font-weight: bold;" if x == "Low" or x == "Safe Website" else "")),
            subset=["Prediction Class", "Risk Level"]
        ),
        use_container_width=True,
        hide_index=True
    )
