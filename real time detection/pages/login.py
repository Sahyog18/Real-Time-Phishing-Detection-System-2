import streamlit as st
from auth import init_session_state, authenticate_user, login_session, is_logged_in, reset_password, logout_session

st.set_page_config(page_title="PhishShield - Login", page_icon="🔐", layout="centered")
init_session_state()

st.title("🔐 Secure Portal Login")
st.write("Access the PhishShield detection engine and dashboard services.")

if is_logged_in():
    st.info(f"You are currently logged in as **{st.session_state.username}**.")
    if st.button("Log Out"):
        logout_session()
        st.success("Session closed successfully.")
        st.rerun()
else:
    # Login Form
    with st.form("login_form"):
        username = st.text_input("Username", placeholder="Enter your username")
        password = st.text_input("Password", type="password", placeholder="Enter your password")
        submit = st.form_submit_button("Sign In")
        
        if submit:
            if not username or not password:
                st.error("Please provide both username and password.")
            else:
                user = authenticate_user(username, password)
                if user:
                    login_session(user)
                    st.success(f"Welcome back, {username}! Access granted.")
                    st.rerun()
                else:
                    st.error("Invalid username or password. Please try again.")
                    
    # Forgot Password Expander
    with st.expander("🔑 Forgot Password?"):
        st.write("Provide details matching your registration record to reset your credentials.")
        with st.form("forgot_password_form"):
            user_reset = st.text_input("Username")
            email_reset = st.text_input("Email Address")
            new_password = st.text_input("New Password", type="password")
            confirm_password = st.text_input("Confirm New Password", type="password")
            reset_submit = st.form_submit_button("Reset Password")
            
            if reset_submit:
                if new_password != confirm_password:
                    st.error("Passwords do not match.")
                elif not user_reset or not email_reset or not new_password:
                    st.error("All fields are required to verify identity.")
                else:
                    success, msg = reset_password(user_reset, email_reset, new_password)
                    if success:
                        st.success(msg)
                    else:
                        st.error(msg)
                        
    st.info("💡 Don't have an account? Navigate to the **Register** page to sign up.")
