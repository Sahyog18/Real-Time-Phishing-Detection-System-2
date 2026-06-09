import streamlit as st
from auth import init_session_state, is_logged_in
from chatbot import render_chatbot_ui

# Note: st.set_page_config is called inside render_chatbot_ui or at the top of the entrypoint file.
# If called inside, we must ensure it is the very first Streamlit command.
# In render_chatbot_ui we do not call st.set_page_config, so we call it here.
st.set_page_config(page_title="PhishShield - AI Assistant", page_icon="🤖", layout="wide")

init_session_state()

# 1. Access Control
if not is_logged_in():
    st.warning("🔒 Access Denied. Please navigate to the **Login** page to sign in first.")
    st.stop()

# 2. Render Chat Interface
render_chatbot_ui()
