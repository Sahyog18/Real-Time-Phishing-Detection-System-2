import os
import streamlit as st
import google.generativeai as genai

def get_expert_response(user_query: str, last_scan_details: dict = None) -> str:
    """Generates an expert-level cybersecurity response for standard (offline/rule) mode."""
    q = user_query.lower()
    
    # Context injected if there is a recent scan
    scan_context = ""
    if last_scan_details:
        scan_context = (
            f"Regarding your last scanned URL (<b>{last_scan_details.get('url')}</b>):<br/>"
            f"• <b>Classification:</b> {last_scan_details.get('prediction')}<br/>"
            f"• <b>Risk Level:</b> {last_scan_details.get('risk_level')}<br/>"
            f"• <b>Confidence Score:</b> {last_scan_details.get('confidence', 0.0)*100:.2f}%<br/><br/>"
        )
        
    if "phishing" in q or "spoof" in q or "fake" in q:
        return (
            f"{scan_context}"
            "<b>Phishing</b> is a social engineering attack where malicious actors mimic legitimate brands "
            "to trick individuals into sharing sensitive data (like passwords, bank credentials, SSNs).<br/><br/>"
            "<b>Key Phishing Indicators:</b><br/>"
            "1. <b>Lookalike Domains (Typosquatting):</b> URL spelling errors, e.g., <i>paypa1.com</i> or <i>amz-verification.xyz</i>.<br/>"
            "2. <b>Suspicious Subdomains:</b> Legitimate brands placed as subdomains on hostile servers, e.g., <i>paypal.com.login-verify.xyz</i>.<br/>"
            "3. <b>Urgent Tone:</b> Threats of account suspension or urgent action requirement.<br/>"
            "4. <b>Lack of HTTPS:</b> Although many modern phishing sites do adopt SSL, the lack of it is a definitive red flag."
        )
        
    elif "https" in q or "ssl" in q or "secure" in q:
        return (
            f"{scan_context}"
            "<b>HTTPS (Hypertext Transfer Protocol Secure)</b> ensures that the connection between your browser and the "
            "website is encrypted, shielding data from interception. However:<br/><br/>"
            "⚠️ <b>HTTPS DOES NOT MEAN A WEBSITE IS SAFE.</b><br/>"
            "Attackers can easily obtain free SSL/TLS certificates (e.g. from Let's Encrypt). Over 80% of phishing URLs "
            "now run on HTTPS. HTTPS only guarantees that the data is sent securely, even if it is sent directly to a thief!"
        )
        
    elif "prevent" in q or "protect" in q or "avoid" in q or "tips" in q:
        return (
            "Here is a checklist of **Cybersecurity Best Practices** to prevent phishing:<br/><br/>"
            "• <b>Check Sender Address:</b> Verify that email headers match the actual sender domain.<br/>"
            "• <b>Never click direct links:</b> Instead, navigate to the portal via a bookmark or search engine.<br/>"
            "• <b>Use Multi-Factor Authentication (MFA):</b> This limits damage even if credentials are stolen.<br/>"
            "• <b>Implement Password Managers:</b> Managers will not auto-fill credentials on lookalike domains.<br/>"
            "• <b>Keep Software Updated:</b> Install operating system security patches to prevent drive-by exploits."
        )
        
    elif "virustotal" in q or "vt" in q or "threat intel" in q:
        return (
            f"{scan_context}"
            "<b>VirusTotal</b> aggregates security scans from over 70 antivirus engines and URL/domain blacklists. "
            "It provides real-time community scores on whether a domain has been flagged in malicious activity.<br/><br/>"
            "• <b>Harmless:</b> Clean indicators from scanning engines.<br/>"
            "• <b>Malicious/Suspicious:</b> Blacklisted by firewalls, security sandboxes, or verified threat feeds.<br/>"
            "• <b>Undetected:</b> The domain is either brand new (zero day) or hasn't been crawled. A score of 0 does not fully guarantee safety!"
        )
        
    elif "url" in q or "link" in q or "shortener" in q or "dots" in q or "hyphen" in q:
        return (
            f"{scan_context}"
            "Our ML module extracts several structure metrics to score URL risk levels:<br/><br/>"
            "• <b>URL Length:</b> Phishing URLs often pack redirection parameters, stretching lengths.<br/>"
            "• <b>Dot Counts:</b> Excessive subdomains (e.g., <i>login.verify.paypal.com.net-update.net</i>) increase dots.<br/>"
            "• <b>Hyphens:</b> Brands rarely use hyphens in main domain names; attackers use them to chain keywords (e.g., <i>apple-id-verify-alert.com</i>).<br/>"
            "• <b>Shorteners:</b> Shorteners (e.g., bit.ly, tinyurl) mask the true destination. They are popular in phishing SMS (smishing) campaigns."
        )
        
    elif "how" in q or "scan" in q or "use" in q:
        return (
            "<b>How to use PhishShield:</b><br/>"
            "1. Navigate to the <b>URL Scanner</b> tab.<br/>"
            "2. Input the URL you wish to check.<br/>"
            "3. Click <b>Scan URL</b>.<br/>"
            "4. View the Risk Assessment, Confidence Score, and VirusTotal reports.<br/>"
            "5. If logged in, you can download a full PDF threat report and review historical scans on your dashboard."
        )
        
    else:
        return (
            f"{scan_context}"
            "Hello! I am your <b>AI Cybersecurity Assistant</b>. I can help you evaluate URLs, analyze threats, "
            "and answer general security questions.<br/><br/>"
            "<b>Try asking me:</b><br/>"
            "• <i>How do I protect myself from phishing?</i><br/>"
            "• <i>Why does a phishing site have HTTPS?</i><br/>"
            "• <i>What features do you analyze in a URL?</i><br/>"
            "• <i>Tell me about VirusTotal scanning metrics.</i>"
        )

def get_gemini_response(api_key: str, user_query: str, last_scan_details: dict = None) -> str:
    """Generates an LLM response from Google Gemini."""
    try:
        genai.configure(api_key=api_key)
        # Using gemini-1.5-flash as the standard fast LLM
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        system_prompt = (
            "You are an expert AI Cybersecurity Assistant. Answer cybersecurity questions, explain phishing risks, "
            "analyze URLs, and suggest prevention guidelines. Be professional, detailed, and clear. Format output in markdown."
        )
        
        context = ""
        if last_scan_details:
            context = (
                f"\nContext of the user's last scanned URL:\n"
                f"- URL: {last_scan_details.get('url')}\n"
                f"- Prediction: {last_scan_details.get('prediction')}\n"
                f"- Risk Level: {last_scan_details.get('risk_level')}\n"
                f"- Confidence: {last_scan_details.get('confidence', 0.0)*100:.2f}%\n"
            )
            
        full_prompt = f"{system_prompt}\n{context}\nUser Query: {user_query}"
        
        response = model.generate_content(full_prompt)
        return response.text
    except Exception as e:
        print(f"Gemini API error: {e}")
        # Fall back to heuristic response with error annotation
        fallback = get_expert_response(user_query, last_scan_details)
        return f"*Note: Gemini API failed ({str(e)}). Displaying fallback expert responder.*<br/><br/>{fallback}"

def render_chatbot_ui():
    """Renders the chatbot chat interface inside Streamlit."""
    st.title("🛡️ AI Security Assistant")
    st.write("Ask questions about phishing, web safety, or analyze the features of your scanned URLs.")
    
    # Fetch API Key from session state/env
    gemini_key = st.session_state.get("gemini_api_key", os.environ.get("GEMINI_API_KEY", ""))
    
    # Initialize Chat History
    if "chat_messages" not in st.session_state:
        st.session_state.chat_messages = [
            {"role": "assistant", "content": "Hello! I am your PhishShield Cybersecurity Assistant. How can I help protect you today?"}
        ]
        
    # Get last scan from session state
    last_scan = st.session_state.get("last_scan_result", None)
    
    # Display Chat History
    for msg in st.session_state.chat_messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"], unsafe_allow_html=True)
            
    # Quick Action Buttons
    st.write("---")
    st.write("💡 **Quick Questions:**")
    cols = st.columns(3)
    q1 = "How do I spot lookalike URLs?"
    q2 = "Is HTTPS always safe?"
    q3 = "What makes a link suspicious?"
    
    prompt = None
    if cols[0].button(q1, key="q1_btn"):
        prompt = q1
    if cols[1].button(q2, key="q2_btn"):
        prompt = q2
    if cols[2].button(q3, key="q3_btn"):
        prompt = q3
        
    # Chat Input
    user_input = st.chat_input("Ask about security threats, phishing vectors, or safe browsing...")
    
    if user_input:
        prompt = user_input
        
    if prompt:
        # Add user message
        st.session_state.chat_messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.write(prompt)
            
        # Generate response
        with st.chat_message("assistant"):
            with st.spinner("Analyzing queries against security feeds..."):
                if gemini_key:
                    response = get_gemini_response(gemini_key, prompt, last_scan)
                else:
                    response = get_expert_response(prompt, last_scan)
                st.markdown(response, unsafe_allow_html=True)
                
        # Add assistant message
        st.session_state.chat_messages.append({"role": "assistant", "content": response})
        st.rerun()
