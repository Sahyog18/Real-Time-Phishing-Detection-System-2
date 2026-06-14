# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

<<<<<<< HEAD
If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
### Prerequisites
- Python 3.9 to 3.13 installed on your system.

### Step 1: Clone or Open Workspace
Ensure the code files are located in your target directory:
```bash
cd "c:/Users/user/OneDrive/Desktop/real time detection"
```

### Step 2: Create a Virtual Environment (Optional but Recommended)
```bash
python -m venv venv
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Run Model Training & Database Setup
Initialize the SQLite schema tables and run ML optimization benchmarks to train scikit-learn models:
```bash
# Set up database tables
python -c "import database"

# Train models and generate models/phishing_model.pkl
python -c "import model; model.train_and_evaluate()"
```

### Step 5: Start Streamlit Portal
Run the web application locally:
```bash
streamlit run app.py
```
The application will launch in your browser automatically (default: `http://localhost:8501`).

---

## 🛡️ Security Features
- **Bcrypt Password Cryptography:** Salts and hashes passwords, rendering them resistant to rainbow table audits.
- **SQL Injection Prevention:** Uses parameterized SQLite bindings for all databases transactions.
- **Role-Based Access Control (RBAC):** Restricts administrative functions (`pages/admin.py`) and user history logs (`pages/reports.py`) by checking backend session variables. Unauthorized redirects are stopped before page renders.
- **API Key Masking:** Collects VirusTotal and Gemini API keys dynamically through active UI sessions rather than exposed files.

---

## 🚀 GitHub Setup Instructions

1. **Initialize Git Repository:**
   ```bash
   git init
   ```
2. **Add Files & Commit:**
   ```bash
   git add .
   git commit -m "feat: initial release of PhishShield Phishing Portal"
   ```
3. **Link to Remote GitHub Repository:**
   Create a blank repository on [GitHub](https://github.com), then run:
   ```bash
   git remote add origin https://github.com/your-username/PhishShield-Detection.git
   git branch -M main
   git push -u origin main
   ```

---

## ☁️ Streamlit Cloud Deployment Instructions

1. **Commit and Push:** Ensure all changes (specifically `requirements.txt` and `.gitignore`) are pushed to your GitHub repository.
2. **Sign In:** Go to [Streamlit Community Cloud](https://share.streamlit.io/) and log in with your GitHub account.
3. **Deploy App:**
   - Click **New App**.
   - Select your Repository, Branch (`main`), and Main File Path (`app.py`).
4. **Configure Secrets (Optional):**
   If you wish to set permanent API keys, expand **Advanced settings** in the deploy window and paste keys under Secrets:
   ```toml
   GEMINI_API_KEY = "your-google-gemini-key"
   VT_API_KEY = "your-virustotal-key"
   ```
5. **Deploy:** Click **Deploy!** Streamlit will provision containers, install dependencies from `requirements.txt`, and host the portal live.
>>>>>>> 751fef2288cd8dbab442a9c99c68eef23d31ac49
