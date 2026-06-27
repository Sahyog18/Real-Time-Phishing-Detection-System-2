<div align="center">

# 🛡️ Real-Time Phishing Detection System

**ML-based phishing URL detection using Random Forest & Flask**

![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-Web%20App-black?style=flat-square&logo=flask)
![RandomForest](https://img.shields.io/badge/Random%20Forest-ML%20Model-green?style=flat-square)
![Accuracy](https://img.shields.io/badge/Accuracy-~95%25-brightgreen?style=flat-square)
![Dataset](https://img.shields.io/badge/Dataset-UCI%20Phishing-orange?style=flat-square)

</div>

---

## 📌 Abstract

A real-time phishing URL detection system built using **Random Forest Classifier** trained on the **UCI Phishing Websites Dataset**. The system extracts 30+ URL and webpage features, classifies a given URL as *phishing* or *legitimate* in real time, and serves predictions via a **Flask web interface**. The model achieves approximately **95% accuracy**, making it a reliable tool for cybersecurity threat detection.

---

## 1. Introduction

Phishing attacks are one of the most common cyber threats, tricking users into revealing sensitive information through fake websites. Manual detection is slow and error-prone. This project automates phishing URL detection using machine learning — analyzing URL structure, domain properties, and HTML content features to classify websites instantly.

### Objectives
- Extract meaningful features from URLs and web pages
- Train a high-accuracy ML classifier on real phishing data
- Deploy the model as a real-time web app using Flask
- Provide instant phishing/legitimate verdict to the user

---

## 2. Dataset

| Property | Details |
|----------|---------|
| Source | UCI Machine Learning Repository |
| Dataset | Phishing Websites Dataset |
| Total Samples | ~11,000 URLs |
| Features | 30 URL + webpage attributes |
| Classes | Phishing (-1) / Suspicious (0) / Legitimate (1) |
| Split | 80% Train / 20% Test |

**Key Features Used:**
- URL length, use of IP address, `@` symbol in URL
- Domain age, HTTPS presence, SSL certificate validity
- Page rank, web traffic, links in tags
- Redirects, popups, iframe usage

---

## 3. Methodology

```
Input URL
    ↓
Feature Extraction (30+ attributes from URL + HTML)
    ↓
Random Forest Classifier (trained on UCI dataset)
    ↓
Prediction → Phishing / Legitimate
    ↓
Result displayed on Flask Web UI
```

**Why Random Forest?**
- Handles high-dimensional feature space well
- Resistant to overfitting compared to single Decision Tree
- Provides feature importance scores for interpretability
- No need for feature scaling

---

## 4. Implementation

### Tech Stack

| Component | Technology |
|-----------|-----------|
| Language | Python 3.9+ |
| ML Model | Random Forest (scikit-learn) |
| Web Framework | Flask |
| Feature Extraction | BeautifulSoup, Requests, Whois |
| Dataset | UCI Phishing Websites |

### Project Structure

```
Real-Time-Phishing-Detection-System/
│
├── app.py                  ← Flask server + prediction API
├── model.pkl               ← Trained Random Forest model
├── feature_extraction.py   ← URL & HTML feature extractor
├── train_model.py          ← Model training script
├── dataset/
│   └── phishing.csv        ← UCI dataset
├── templates/
│   └── index.html          ← Web UI
├── requirements.txt        ← Dependencies
└── README.md
```

---

## 5. Setup & Run

```bash
# 1. Clone the repo
git clone https://github.com/Sahyog18/Real-Time-Phishing-Detection-System-2.git
cd Real-Time-Phishing-Detection-System-2

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the app
python app.py

# 4. Open in browser
http://127.0.0.1:5000
```

---

## 6. Results

| Metric | Value |
|--------|-------|
| Model | Random Forest Classifier |
| Accuracy | ~95% |
| Precision | ~0.94 |
| Recall | ~0.95 |
| F1-Score | ~0.94 |
| Dataset | UCI Phishing Websites |

---

## 7. Future Scope

- Add deep learning model (LSTM) for sequential URL pattern detection
- Browser extension integration for real-time browsing protection
- REST API for third-party integration
- Expand dataset with newer phishing URLs

---

## 8. References

1. UCI ML Repository, *Phishing Websites Dataset*, 2012. [Online]. Available: https://archive.ics.uci.edu/ml/datasets/phishing+websites
2. L. Breiman, "Random Forests," *Machine Learning*, vol. 45, pp. 5–32, 2001.
3. A. Subasi et al., "Phishing Website Detection using Machine Learning," *Procedia Computer Science*, 2017.

---

## 👤 Author

**Sahyog** — B.E. Computer Engineering, RTMNU Nagpur
GitHub: [@Sahyog18](https://github.com/Sahyog18)
