<div align="center">

<img src="docs/demo.gif" alt="PhishScan Demo" width="850" />

# 🛡️ PhishScan
### AI-Powered Phishing Email Detector

Paste any suspicious email and get an instant phishing-risk score, URL reputation results, indicator breakdown, and a clear AI explanation.

<br />

[![OpenAI GPT-4o](https://img.shields.io/badge/AI-OpenAI%20GPT--4o-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.com/)
[![n8n](https://img.shields.io/badge/Automation-n8n-EA4B71?style=flat-square&logo=n8n&logoColor=white)](https://n8n.io/)
[![VirusTotal](https://img.shields.io/badge/URL%20Security-VirusTotal-394EFF?style=flat-square&logo=virustotal&logoColor=white)](https://www.virustotal.com/)
[![Security](https://img.shields.io/badge/Use-Defensive%20Security-16A34A?style=flat-square&logo=shield&logoColor=white)](#ethical-use)

<br />

`🔍 0–10 risk score` &nbsp; • &nbsp; `🧠 AI explanation` &nbsp; • &nbsp; `🔗 URL scanning` &nbsp; • &nbsp; `⚡ Real-time results`

</div>

---

## ✨ What is PhishScan?

**PhishScan** is a web-based phishing email detector that helps users understand whether an email is potentially dangerous.

Paste an email's headers and body into the interface. PhishScan uses AI and URL threat intelligence to identify common phishing signals, check suspicious links, and return a simple, evidence-based report.

Instead of only saying *“safe”* or *“phishing,”* PhishScan explains **why** an email was flagged—making it useful for security awareness, training, and defensive review.

> ⚠️ **Important:** PhishScan is an assistant for human review. It does not guarantee that an email is safe or malicious.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| 📊 **0–10 Risk Score** | Quickly understand the estimated phishing risk of an email. |
| 🚦 **Clear Verdict** | Receive an easy-to-read result such as Safe, Suspicious, or Phishing. |
| 🧠 **AI Analysis** | GPT-4o reviews the message for phishing techniques and suspicious language. |
| 🔗 **URL Reputation Checks** | Extracted links are checked with the VirusTotal API. |
| 🚩 **10 Security Indicators** | Each email is assessed against common phishing patterns. |
| 💬 **Plain-English Explanation** | Understand what was detected without needing cybersecurity expertise. |
| ⚡ **Real-Time Results** | Results are returned directly to the web interface after analysis. |
| 🧪 **Batch Testing** | Test multiple sample emails using the included Python script. |

---

## 🧠 How It Works

```text
┌─────────────────────┐
│  1. Paste an Email  │
│ Headers + Body Text │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  2. Frontend Sends  │
│ Request to n8n      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  3. n8n Extracts    │
│ URLs + Email Signals│
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌───────────┐ ┌──────────────┐
│ GPT-4o AI │ │ VirusTotal   │
│ Analysis  │ │ URL Scan     │
└─────┬─────┘ └──────┬───────┘
      │              │
      └──────┬───────┘
             ▼
┌─────────────────────┐
│  4. Risk Report     │
│ Score + Explanation │
└─────────────────────┘
```

1. **Paste an email** — Add the email body and, where possible, its full headers.
2. **Send for analysis** — The frontend sends the content to an n8n webhook.
3. **Extract email data** — n8n prepares the email and identifies URLs.
4. **Analyse phishing signals** — GPT-4o evaluates the email against 10 phishing indicators.
5. **Check link reputation** — VirusTotal scans extracted URLs for malicious activity.
6. **Return the results** — PhishScan displays the score, verdict, findings, and explanation.

---

## 🏗️ Architecture

<div align="center">

<img src="docs/architecture.png" alt="PhishScan Architecture" width="850" />

</div>

| Layer | Technology | Role |
| :--- | :--- | :--- |
| 🖥️ Frontend | HTML, CSS, Vanilla JavaScript | Email input form and results dashboard |
| ⚙️ Workflow | n8n | Webhook handling, automation, and API orchestration |
| 🧠 AI Engine | OpenAI GPT-4o | Phishing analysis and structured explanations |
| 🛡️ Threat Intelligence | VirusTotal API | Malicious URL reputation analysis |
| 🧪 Testing | Python 3 | Batch processing sample emails |

---

## 🚩 Phishing Indicators Analysed

| # | Indicator | What PhishScan Looks For |
| :---: | :--- | :--- |
| 1 | 🎭 **Spoofed sender** | Sender name does not match the sending domain. |
| 2 | ⏰ **Urgency language** | Pressure phrases such as “Act now” or “Verify immediately.” |
| 3 | 🔗 **Mismatched URLs** | The visible link text differs from the actual destination. |
| 4 | 🕵️ **Suspicious domain** | Lookalike domains such as `paypa1.com` or `amaz0n.net`. |
| 5 | 🔐 **Credential request** | Requests for passwords, card details, codes, or personal data. |
| 6 | 👤 **Generic greeting** | Generic language such as “Dear Customer.” |
| 7 | ✍️ **Grammar errors** | Unusual spelling, phrasing, or writing quality. |
| 8 | 📎 **Unexpected attachment** | Attachments that appear unsolicited or unexpected. |
| 9 | ⚠️ **Reward or threat** | Threats of account closure or promises of prizes and refunds. |
| 10 | 📧 **Unusual sender domain** | Business messages sent from unrelated or free email accounts. |

---

## 📊 Risk Score Guide

| Score | Risk Level | Suggested Action |
| :---: | :--- | :--- |
| `0–2` | 🟢 Low Risk | Few obvious phishing signals detected. Stay aware. |
| `3–5` | 🟡 Review Carefully | Verify suspicious requests before responding or clicking. |
| `6–7` | 🟠 Suspicious | Avoid links and attachments until independently verified. |
| `8–10` | 🔴 High Risk | Treat the email as potentially malicious and report it if appropriate. |

---

## 💻 Run Locally

### Prerequisites

You will need:

- An n8n instance — self-hosted or n8n Cloud
- An OpenAI API key
- A VirusTotal API key
- Python 3 for batch testing
- A modern web browser

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/phishing-detector.git
cd phishing-detector
```

### 2. Set Up Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Add your credentials:

```env
OPENAI_API_KEY=sk-...
VIRUSTOTAL_API_KEY=...
N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/phishing-analyze
```

> Never share or commit your API keys.

### 3. Import the n8n Workflow

1. Open your n8n dashboard.
2. Select **Import workflow**.
3. Import `n8n-workflow/phishing-detector.json`.
4. Add your OpenAI and VirusTotal credentials.
5. Activate the workflow.

### 4. Update the Frontend Webhook URL

Open `frontend/app.js` and configure the webhook:

```js
const WEBHOOK_URL = "https://your-n8n-instance/webhook/phishing-analyze";
const DEMO_MODE = false;
```

### 5. Start the Frontend

Option A — Open the file directly:

```bash
open frontend/index.html
```

Option B — Run a local server:

```bash
cd frontend
python3 -m http.server 8080
```

Open this address in your browser:

```text
http://localhost:8080
```

---

## 🧪 Batch Testing

Test all included sample emails with the batch-test script:

```bash
cd scripts
pip install requests tabulate
python3 batch-test.py
```

Example output:

```text
File                      Score  Verdict     Top indicator
────────────────────────  ─────  ──────────  ─────────────────────
sample-phishing-01.txt     8     phishing    suspicious_domain
sample-phishing-02.txt     7     phishing    credential_request
sample-legit-01.txt        1     safe        generic_greeting
sample-legit-02.txt        0     safe        —
```

---

## 📁 Project Structure

```text
phishing-detector/
│
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── styles.css
│
├── n8n-workflow/
│   └── phishing-detector.json
│
├── scripts/
│   └── batch-test.py
│
├── test-emails/
│   ├── sample-phishing-01.txt
│   ├── sample-phishing-02.txt
│   ├── sample-legit-01.txt
│   └── sample-legit-02.txt
│
├── docs/
│   ├── demo.gif
│   └── architecture.png
│
├── .env.example
└── README.md
```

---

## 🔐 Security & Privacy Notes

- Use HTTPS for production deployments.
- Never expose your OpenAI or VirusTotal API keys in frontend code.
- Avoid storing sensitive email content unless you have a clear retention policy.
- Use anonymised sample emails for testing.
- Review n8n execution logs and restrict access where necessary.
- Always verify suspicious messages through an official, independent channel.

---

## ⚖️ Ethical Use

PhishScan is built for **educational and defensive cybersecurity purposes only**.

- ✅ Analyse only emails you are authorised to inspect.
- ✅ Use results to support human security review.
- ✅ Keep test emails anonymised and free of real personal data.
- ❌ Do not use this tool to process private emails without permission.
- ❌ Do not make fully automated decisions about people based only on the output.
- ❌ Do not use this project for phishing, evasion, impersonation, or harmful activity.

---

## 🤝 Contributing

Contributions and ideas are welcome.

Potential future improvements include:

- `.eml` file upload support
- Attachment hash and malware scanning
- SPF, DKIM, and DMARC analysis
- Domain age and WHOIS signals
- Multi-language phishing detection
- PDF and JSON report export
- User feedback for false positives and false negatives
- Authentication for team-based use

---

## 👤 Author

Built by **[Jamiu Sosanya](https://www.linkedin.com/in/sosanya-temitope)** as part of a cybersecurity portfolio.

[LinkedIn](https://www.linkedin.com/in/sosanya-temitope) • [GitHub](https://github.com/Jamiu-Sosanya)

---

<div align="center">

Built to make phishing analysis clearer, faster, and more understandable. 🛡️

⭐ If you find this project useful, consider giving it a star.

</div>
