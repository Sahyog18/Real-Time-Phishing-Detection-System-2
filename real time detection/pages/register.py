import streamlit as st
from auth import init_session_state, register_user, is_logged_in

st.set_page_config(page_title="PhishShield - Register", page_icon="📝", layout="centered")
init_session_state()

st.title("📝 Create Security Account")
st.write("Register to access custom dashboards, URL history log, and downloadable PDF reports.")

if is_logged_in():
    st.info(f"You are already authenticated as **{st.session_state.username}**.")
else:
    with st.form("register_form"):
        username = st.text_input("Username", placeholder="Choose a unique username")
        email = st.text_input("Email Address", placeholder="user@organization.com")
        password = st.text_input("Password", type="password", placeholder="Enter strong password")
        confirm_password = st.text_input("Confirm Password", type="password", placeholder="Repeat password")
        
        # Role selection for demo validation (allows easy switching between Admin/User profiles)
        role = st.selectbox(
            "Account Security Role", 
            options=["user", "admin"], 
            format_func=lambda x: "Standard User" if x == "user" else "Security Administrator (Admin)"
        )
        
        submit = st.form_submit_button("Sign Up")
        
        if submit:
            if not username or not email or not password:
                st.error("All fields are required.")
            elif password != confirm_password:
                st.error("Passwords do not match. Please verify passwords.")
            elif len(password) < 6:
                st.error("Password must be at least 6 characters long.")
            else:
                success, msg = register_user(username, password, email, role)
                if success:
                    st.success(f"Account registered successfully! Please head to the **Login** page to sign in.")
                else:
                    st.error(msg)
                    
    st.info("💡 Already registered? Navigate to the **Login** page to sign in.")
