// Mock data for PhishGuard AI

export const mockUser = {
  id: 1,
  name: "Alex Chen",
  email: "alex.chen@phishguard.ai",
  role: "Security Analyst",
  avatar: null,
  joinDate: "2024-01-15",
  plan: "Enterprise",
  scansUsed: 2847,
  scansLimit: 10000,
};

export const mockStats = {
  totalScans: 28470,
  safeUrls: 24210,
  threatsDetected: 3180,
  riskyDomains: 1080,
  accuracy: 99.2,
  avgScanTime: 1.4,
};

export const mockScanHistory = [
  {
    id: 1,
    url: "https://paypal-secure-login.tk/verify",
    status: "phishing",
    riskScore: 97,
    timestamp: "2025-06-11T10:23:11Z",
    domain: "paypal-secure-login.tk",
    ssl: false,
    domainAge: "3 days",
    country: "RU",
    ip: "185.220.101.47",
  },
  {
    id: 2,
    url: "https://google.com",
    status: "safe",
    riskScore: 2,
    timestamp: "2025-06-11T09:50:00Z",
    domain: "google.com",
    ssl: true,
    domainAge: "26 years",
    country: "US",
    ip: "142.250.80.46",
  },
  {
    id: 3,
    url: "https://amazon-account-verify.ml/login",
    status: "phishing",
    riskScore: 94,
    timestamp: "2025-06-11T09:12:44Z",
    domain: "amazon-account-verify.ml",
    ssl: false,
    domainAge: "1 day",
    country: "CN",
    ip: "103.45.67.89",
  },
  {
    id: 4,
    url: "https://github.com",
    status: "safe",
    riskScore: 1,
    timestamp: "2025-06-11T08:45:20Z",
    domain: "github.com",
    ssl: true,
    domainAge: "17 years",
    country: "US",
    ip: "140.82.112.4",
  },
  {
    id: 5,
    url: "https://secure-banking-update.xyz/chase",
    status: "phishing",
    riskScore: 99,
    timestamp: "2025-06-11T08:22:10Z",
    domain: "secure-banking-update.xyz",
    ssl: false,
    domainAge: "2 days",
    country: "NG",
    ip: "196.198.45.12",
  },
  {
    id: 6,
    url: "https://bit.ly/free-gift-card",
    status: "suspicious",
    riskScore: 68,
    timestamp: "2025-06-11T07:55:33Z",
    domain: "bit.ly",
    ssl: true,
    domainAge: "16 years",
    country: "US",
    ip: "67.199.248.11",
  },
  {
    id: 7,
    url: "https://microsoft.com/office",
    status: "safe",
    riskScore: 3,
    timestamp: "2025-06-11T07:30:00Z",
    domain: "microsoft.com",
    ssl: true,
    domainAge: "29 years",
    country: "US",
    ip: "20.236.44.162",
  },
  {
    id: 8,
    url: "https://netflix-billing.support/update-payment",
    status: "phishing",
    riskScore: 96,
    timestamp: "2025-06-11T07:05:55Z",
    domain: "netflix-billing.support",
    ssl: false,
    domainAge: "5 days",
    country: "RO",
    ip: "185.153.196.78",
  },
  {
    id: 9,
    url: "https://dropbox.com/share",
    status: "safe",
    riskScore: 5,
    timestamp: "2025-06-10T23:44:21Z",
    domain: "dropbox.com",
    ssl: true,
    domainAge: "17 years",
    country: "US",
    ip: "162.125.7.1",
  },
  {
    id: 10,
    url: "https://crypto-rewards-claim.io/wallet",
    status: "phishing",
    riskScore: 98,
    timestamp: "2025-06-10T22:33:10Z",
    domain: "crypto-rewards-claim.io",
    ssl: false,
    domainAge: "1 day",
    country: "UA",
    ip: "91.234.55.102",
  },
  {
    id: 11,
    url: "https://tinyurl.com/promotion2025",
    status: "suspicious",
    riskScore: 55,
    timestamp: "2025-06-10T21:10:00Z",
    domain: "tinyurl.com",
    ssl: true,
    domainAge: "21 years",
    country: "US",
    ip: "13.32.45.11",
  },
  {
    id: 12,
    url: "https://apple.com/support",
    status: "safe",
    riskScore: 2,
    timestamp: "2025-06-10T20:55:44Z",
    domain: "apple.com",
    ssl: true,
    domainAge: "27 years",
    country: "US",
    ip: "17.253.144.10",
  },
];

export const weeklyTrendData = [
  { day: "Mon", safe: 420, suspicious: 45, phishing: 120 },
  { day: "Tue", safe: 380, suspicious: 60, phishing: 98 },
  { day: "Wed", safe: 510, suspicious: 35, phishing: 145 },
  { day: "Thu", safe: 460, suspicious: 80, phishing: 110 },
  { day: "Fri", safe: 590, suspicious: 55, phishing: 165 },
  { day: "Sat", safe: 320, suspicious: 30, phishing: 88 },
  { day: "Sun", safe: 280, suspicious: 25, phishing: 72 },
];

export const monthlyTrendData = [
  { month: "Jan", threats: 340, scans: 2100 },
  { month: "Feb", threats: 280, scans: 1950 },
  { month: "Mar", threats: 420, scans: 2400 },
  { month: "Apr", threats: 380, scans: 2200 },
  { month: "May", threats: 510, scans: 2800 },
  { month: "Jun", threats: 295, scans: 1800 },
];

export const pieChartData = [
  { name: "Safe", value: 85, color: "#22C55E" },
  { name: "Suspicious", value: 4, color: "#F59E0B" },
  { name: "Phishing", value: 11, color: "#EF4444" },
];

export const threatTypeData = [
  { type: "Credential Harvest", count: 1240, percent: 39 },
  { type: "Malware Distribution", count: 820, percent: 26 },
  { type: "Fake Login Pages", count: 640, percent: 20 },
  { type: "Pharming", count: 320, percent: 10 },
  { type: "Vishing / Smishing", count: 160, percent: 5 },
];

export const mockUsers = [
  { id: 1, name: "Alex Chen", email: "alex.chen@corp.com", role: "Analyst", scans: 2847, status: "active", plan: "Enterprise" },
  { id: 2, name: "Sarah Miller", email: "sarah.m@techco.com", role: "Admin", scans: 1204, status: "active", plan: "Pro" },
  { id: 3, name: "James Wilson", email: "j.wilson@bank.com", role: "Analyst", scans: 3891, status: "active", plan: "Enterprise" },
  { id: 4, name: "Priya Sharma", email: "priya@startup.io", role: "Developer", scans: 456, status: "inactive", plan: "Free" },
  { id: 5, name: "Michael Brown", email: "m.brown@edu.org", role: "Analyst", scans: 789, status: "active", plan: "Pro" },
  { id: 6, name: "Lisa Davis", email: "lisa.d@security.net", role: "Admin", scans: 5102, status: "active", plan: "Enterprise" },
];

export const blacklistedDomains = [
  { domain: "paypal-secure-login.tk", addedDate: "2025-06-11", category: "Credential Harvest", reporter: "AI Engine" },
  { domain: "amazon-account-verify.ml", addedDate: "2025-06-10", category: "Phishing", reporter: "User Report" },
  { domain: "secure-banking-update.xyz", addedDate: "2025-06-10", category: "Banking Fraud", reporter: "AI Engine" },
  { domain: "netflix-billing.support", addedDate: "2025-06-09", category: "Subscription Scam", reporter: "AI Engine" },
  { domain: "crypto-rewards-claim.io", addedDate: "2025-06-09", category: "Crypto Scam", reporter: "Threat Intel" },
  { domain: "apple-id-locked.gq", addedDate: "2025-06-08", category: "Credential Harvest", reporter: "AI Engine" },
];

export const aiThreatFactors = [
  { factor: "Domain Spoofing Pattern", severity: "critical", score: 95, description: "Domain mimics a well-known brand with minor character substitution." },
  { factor: "SSL Certificate Missing", severity: "high", score: 85, description: "No valid HTTPS certificate detected. Data transmission is unencrypted." },
  { factor: "Newly Registered Domain", severity: "high", score: 80, description: "Domain registered within the last 7 days — common phishing tactic." },
  { factor: "Suspicious TLD", severity: "medium", score: 72, description: "Top-level domain (.tk, .ml, .gq) commonly abused by phishers." },
  { factor: "URL Redirect Chain", severity: "medium", score: 65, description: "Multiple redirects detected that obscure the true destination." },
  { factor: "Known Phishing IP", severity: "critical", score: 98, description: "IP address found in global threat intelligence blacklist databases." },
];

export const securityRecommendations = [
  "Do not enter any personal information or login credentials on this website.",
  "Report this URL to your IT security team immediately.",
  "Clear browser cookies and cache if you accidentally visited this page.",
  "Enable multi-factor authentication on all important accounts.",
  "Use a password manager to detect fake login pages automatically.",
  "Verify URLs by checking the official company website directly.",
];

export const notificationData = [
  { id: 1, type: "threat", message: "High-risk phishing URL detected and blocked", time: "2 min ago", read: false },
  { id: 2, type: "success", message: "Scan report exported successfully", time: "15 min ago", read: false },
  { id: 3, type: "warning", message: "3 suspicious domains flagged this hour", time: "1 hour ago", read: true },
  { id: 4, type: "info", message: "AI model updated to version 3.2.1", time: "3 hours ago", read: true },
  { id: 5, type: "threat", message: "Blacklist updated with 12 new domains", time: "6 hours ago", read: true },
];
