Real-Time Phishing URL Detection System Using Machine Learning
Sahyog

Department of Computer Engineering

RTMNU University, Nagpur, Maharashtra, India

Abstract
Phishing attacks are one of the most dangerous cyber threats today. Attackers create fake URLs that look like real websites to steal user credentials and sensitive data. This paper presents a real-time phishing URL detection system that uses machine learning to classify any URL as phishing or legitimate. The system extracts lexical and structural features from the URL and applies a Random Forest classifier trained on the UCI Phishing Dataset. The system achieves an accuracy of 95.3%, precision of 94.1%, and recall of 96.2%. A Flask-based web interface allows users to paste any URL and get an instant prediction without visiting the site.
Keywords — phishing detection, URL classification, machine learning, Random Forest, cybersecurity, Flask.

I. INTRODUCTION
The growth of the internet has brought a massive rise in cybercrime. Phishing is one of the most common attack methods used by hackers today. Attackers create fake websites that look exactly like trusted platforms such as banks, government portals, and e-commerce sites. Users are tricked through emails, SMS, or social media into clicking these malicious links and entering their personal information.
Traditional blacklist-based approaches cannot keep up with the speed at which new phishing URLs are created. Machine learning offers a smarter and more adaptive solution by learning patterns from URL structures without needing to load the actual website.
This project makes the following contributions:

A feature extraction pipeline that pulls 16 lexical and structural features from raw URL strings
A Random Forest classifier trained on the UCI Phishing Dataset for real-time URL classification
A lightweight Flask web application for accessible real-time detection
Comparison against baseline classifiers including Logistic Regression and Decision Tree


II. RELATED WORK
Several researchers have worked on phishing URL detection using machine learning. Mohammad et al. proposed a hybrid feature set using URL, HTML, and domain-based features, achieving 97.5% accuracy using a neural network. However, their approach required loading page content, making it unsuitable for real-time use.
Sahingoz et al. tested seven different machine learning classifiers on NLP-based URL features. Random Forest achieved the highest accuracy of 97.98% on a balanced dataset of 73,575 URLs.
Buber et al. used natural language processing combined with SVM to detect phishing URLs without visiting the target website, achieving 95.4% accuracy.
The system proposed in this paper similarly avoids loading the target page and works only on the URL string itself, making it safe, fast, and deployable in real environments.

III. DATASET
The UCI Machine Learning Repository Phishing Websites Dataset is used in this study. It contains 11,055 instances collected from real phishing and legitimate websites. For this project, 16 URL-specific features are selected, excluding HTML and JavaScript-based features so that the system can work in real time without visiting the URL.
ClassCountLegitimate4,898Phishing6,157Total11,055
Table I: UCI Phishing Dataset Class Distribution

IV. METHODOLOGY
The system works in four stages: data preprocessing, feature extraction, model training, and real-time prediction through a web interface.
A. Feature Extraction
The following 16 features are extracted directly from the URL string:

URL length and total character count
Number of dots, hyphens, and underscores
Presence of @ symbol and double slashes in the domain
Whether HTTP or HTTPS is used
Number of subdomains
Whether an IP address is used instead of a domain name
Presence of suspicious keywords such as login, secure, verify, bank, account
Whether a URL shortening service is used

B. Model Training
The dataset is split 80% for training and 20% for testing using stratified sampling. A Random Forest classifier with 100 decision trees is trained using Scikit-learn. Hyperparameter tuning is done using 5-fold cross-validation. The Random Forest approach reduces overfitting compared to a single decision tree and also provides feature importance scores.
C. System Architecture
The trained model is saved using Python's pickle module and connected to a Flask REST API. The web interface takes a raw URL as input, sends it to the backend for feature extraction and prediction, and returns the result with a confidence score — all in real time.

V. EXPERIMENTAL RESULTS
The model is tested on 2,211 held-out URL instances. Table II shows the performance of the Random Forest model compared to two baseline classifiers.
ModelAccuracyPrecisionRecallF1 ScoreLogistic Regression88.4%87.9%89.1%88.5%Decision Tree91.7%90.3%92.5%91.4%Random Forest95.3%94.1%96.2%95.1%
Table II: Comparative Model Performance
The Random Forest model outperforms both baselines across all metrics. The high recall of 96.2% is especially important here because missing a phishing URL is far more dangerous than a false alarm.
Top features ranked by importance score:

Use of IP address instead of domain — 0.18
URL length — 0.14
Number of dots — 0.11
HTTPS presence — 0.10
Suspicious keyword count — 0.09


VI. DISCUSSION
The results show that URL-only features are enough to detect phishing with high accuracy — no need to visit or load the target website. This makes the system safe and practical for real-world use in browser extensions, email filters, and enterprise security tools.
The Flask interface gives an average response time of 120ms, which is fast enough for real-time use. The main limitation is that the model may struggle against newly registered domains that have clean URL structures but malicious intent.

VII. CONCLUSION
This paper presented a real-time phishing URL detection system using a Random Forest classifier trained on the UCI Phishing Dataset. The system achieves 95.3% accuracy using 16 lexical URL features and is deployed through a simple Flask web interface. Future work will explore LSTM and BERT-based models for better sequence understanding, a Chrome browser extension, and adding DNS and WHOIS data as additional features.

REFERENCES
[1] R. M. Mohammad, F. Thabtah, and L. McCluskey, "An assessment of features related to phishing websites using an automated technique," in Proc. ICITST, 2012, pp. 492–497.
[2] O. K. Sahingoz, E. Buber, O. Demir, and B. Diri, "Machine learning based phishing detection from URLs," Expert Syst. Appl., vol. 117, pp. 345–357, 2019.
[3] E. Buber, B. Diri, and O. K. Sahingoz, "Detecting phishing attacks from URL by using NLP techniques," in Proc. CSOS, 2017, pp. 1–6.
[4] UCI Machine Learning Repository, "Phishing Websites Dataset," 2015. [Online]. Available: https://archive.ics.uci.edu/ml/datasets/phishing+websites
