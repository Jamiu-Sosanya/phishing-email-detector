# PhishScan — AI Phishing Email Detector

> Paste any email. Get a 0–10 risk score, 10 indicator breakdown, and a plain-English AI explanation in seconds.

![Demo](docs/demo.gif)

---

## How it works

1. User pastes an email (headers + body) into the web UI
2. Frontend sends a POST request to an n8n webhook
3. n8n pre-processes the email and extracts URLs
4. GPT-4o scores the email across 10 phishing indicators and returns structured JSON
5. VirusTotal API checks each URL for malicious reputation
6. Results are merged and returned to the frontend in real time

![Architecture](docs/architecture.png)

---

## Tech stack

| Component        | Tool                          |
|-----------------|-------------------------------|
| Automation       | n8n (self-hosted or cloud)    |
| AI model         | OpenAI GPT-4o                 |
| URL reputation   | VirusTotal API (free tier)    |
| Frontend         | HTML / CSS / Vanilla JS       |
| Batch testing    | Python 3                      |

---

## Phishing indicators scored

| # | Indicator              | Description                                      |
|---|------------------------|--------------------------------------------------|
| 1 | Spoofed sender         | From name doesn't match sending domain           |
| 2 | Urgency language       | "Act now", "account suspended", "verify immediately" |
| 3 | Mismatched URLs        | Display text shows different domain than href    |
| 4 | Suspicious domain      | Lookalike domains (paypa1.com, amaz0n.net)       |
| 5 | Credential request     | Asks for password, card number, SSN              |
| 6 | Generic greeting       | "Dear Customer" — no personalisation            |
| 7 | Grammar errors         | Unusual phrasing or spelling mistakes            |
| 8 | Unexpected attachment  | Mentions attachment when none is expected        |
| 9 | Reward or threat       | Promises prize or threatens account closure      |
|10 | Unusual sender domain  | Corporate email sent from Gmail/Yahoo            |

---

## Run locally

**Prerequisites:** n8n instance, OpenAI API key, VirusTotal API key (free)

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/phishing-detector.git
cd phishing-detector

# 2. Import the n8n workflow
# Open n8n → Import → select n8n-workflow/phishing-detector.json
# Set your OpenAI and VirusTotal credentials in n8n

# 3. Update the webhook URL
# Open frontend/app.js and set WEBHOOK_URL to your n8n webhook URL
# Set DEMO_MODE = false

# 4. Open the frontend
open frontend/index.html
# (or serve with: python3 -m http.server 8080)
```

---

## Batch test

Run all sample emails through the API and see results in a table:

```bash
cd scripts
pip install requests tabulate
python3 batch-test.py
```

Sample output:
```
File                      Score  Verdict     Top indicator
────────────────────────  ─────  ──────────  ──────────────────
sample-phishing-01.txt     8     phishing    suspicious_domain
sample-phishing-02.txt     7     phishing    credential_request
sample-legit-01.txt        1     safe        generic_greeting
sample-legit-02.txt        0     safe        —
```

---

## Environment variables

Copy `.env.example` to `.env` and fill in your keys:

```
OPENAI_API_KEY=sk-...
VIRUSTOTAL_API_KEY=...
N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/phishing-analyze
```

---

## Ethical use

This tool is built for **educational and defensive security purposes only**.

- All sample emails in `/test-emails` are anonymised and contain no real personal data
- Do not use this tool to process emails without the knowledge of the sender or recipient
- Do not use outputs to make automated decisions about individuals without human review

---

## Author

Built by [Your Name] as part of a cybersecurity portfolio.  
[LinkedIn](#) · [GitHub](#)
