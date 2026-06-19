// ── CONFIG ──────────────────────────────────────────────────
// Replace this with your actual n8n webhook URL after setting up the workflow
const WEBHOOK_URL = 'https://YOUR-N8N-INSTANCE/webhook/phishing-analyze';

// Set to true to use mock data while developing the frontend (no API call made)
const DEMO_MODE = true;
// ────────────────────────────────────────────────────────────

const INDICATOR_LABELS = {
  spoofed_sender:        'Spoofed sender',
  urgency_language:      'Urgency language',
  mismatched_urls:       'Mismatched URLs',
  suspicious_domain:     'Suspicious domain',
  credential_request:    'Credential request',
  generic_greeting:      'Generic greeting',
  grammar_errors:        'Grammar errors',
  unexpected_attachment: 'Unexpected attachment',
  reward_or_threat:      'Reward or threat',
  unusual_sender_domain: 'Unusual sender domain',
};

const SAMPLE_EMAIL = `From: security-alert@paypa1-support.com
To: customer@example.com
Subject: URGENT: Your account has been suspended

Dear Customer,

We have detected unusual activity on your PayPal account. Your account has been temporarily suspended.

You must verify your identity within 24 hours or your account will be permanently closed.

Click here to verify now: http://paypal-verify.suspicious-site.ru/login

Please provide your:
- Full name
- Password
- Credit card number and CVV

Failure to act immediately will result in legal proceedings.

Regards,
PayPal Security Team`;

const MOCK_RESPONSE = {
  overall_score: 9,
  verdict: 'phishing',
  indicators: {
    spoofed_sender: 1,
    urgency_language: 1,
    mismatched_urls: 1,
    suspicious_domain: 1,
    credential_request: 1,
    generic_greeting: 1,
    grammar_errors: 0,
    unexpected_attachment: 0,
    reward_or_threat: 1,
    unusual_sender_domain: 1,
  },
  explanation: 'This email shows 9 out of 10 phishing indicators. The sender domain (paypa1-support.com) is a lookalike of PayPal\'s real domain, the email demands credentials and threatens account closure, and the link points to a suspicious Russian domain. This is almost certainly a phishing attempt.',
  top_indicator: 'suspicious_domain',
  urls: [
    { url: 'http://paypal-verify.suspicious-site.ru/login', flagged: true, vt_malicious: 14 },
  ],
};

// ── DOM helpers ─────────────────────────────────────────────
const $ = id => document.getElementById(id);

function showEl(id)  { $(id).style.display = ''; }
function hideEl(id)  { $(id).style.display = 'none'; }

// ── Char counter ────────────────────────────────────────────
$('emailInput').addEventListener('input', () => {
  const len = $('emailInput').value.length;
  $('charCount').textContent = `${len.toLocaleString()} character${len !== 1 ? 's' : ''}`;
});

// ── Load sample ─────────────────────────────────────────────
function loadSample() {
  $('emailInput').value = SAMPLE_EMAIL;
  $('charCount').textContent = `${SAMPLE_EMAIL.length.toLocaleString()} characters`;
}

// ── Loading messages ─────────────────────────────────────────
const loadingMessages = [
  'Extracting email metadata...',
  'Scanning for urgency patterns...',
  'Checking URL reputation...',
  'Running AI analysis...',
  'Calculating risk score...',
];
let loadingInterval = null;

function startLoadingMessages() {
  let i = 0;
  $('loadingText').textContent = loadingMessages[0];
  loadingInterval = setInterval(() => {
    i = (i + 1) % loadingMessages.length;
    $('loadingText').textContent = loadingMessages[i];
  }, 1200);
}

function stopLoadingMessages() {
  clearInterval(loadingInterval);
  loadingInterval = null;
}

// ── Main analyse function ────────────────────────────────────
async function analyse() {
  const email = $('emailInput').value.trim();
  if (!email) {
    $('emailInput').focus();
    return;
  }

  // Reset UI
  hideEl('results');
  hideEl('errorBanner');
  showEl('loading');
  $('analyseBtn').disabled = true;
  startLoadingMessages();

  try {
    let data;

    if (DEMO_MODE) {
      // Simulate network latency in demo mode
      await new Promise(r => setTimeout(r, 2800));
      data = MOCK_RESPONSE;
    } else {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      data = await res.json();
    }

    renderResults(data);

  } catch (err) {
    console.error('PhishScan error:', err);
    $('errorText').textContent = `Error: ${err.message}. Check your webhook URL in app.js or enable DEMO_MODE.`;
    showEl('errorBanner');
  } finally {
    stopLoadingMessages();
    hideEl('loading');
    $('analyseBtn').disabled = false;
  }
}

// ── Render results ───────────────────────────────────────────
function renderResults(data) {
  const { overall_score, verdict, indicators, explanation, urls } = data;

  // Score + verdict
  const scoreEl = $('verdictScore');
  scoreEl.textContent = overall_score;
  scoreEl.className = `verdict-score ${verdict}`;

  const pillEl = $('verdictPill');
  pillEl.textContent = verdict.charAt(0).toUpperCase() + verdict.slice(1);
  pillEl.className = `verdict-pill ${verdict}`;

  $('verdictExplanation').textContent = explanation;

  // Indicators
  const grid = $('indicatorsGrid');
  grid.innerHTML = '';
  for (const [key, label] of Object.entries(INDICATOR_LABELS)) {
    const flagged = indicators[key] === 1;
    const chip = document.createElement('div');
    chip.className = `indicator-chip${flagged ? ' flagged' : ''}`;
    chip.innerHTML = `<span class="ind-dot"></span><span class="indicator-label">${label}</span>`;
    grid.appendChild(chip);
  }

  // URLs
  if (urls && urls.length > 0) {
    const list = $('urlList');
    list.innerHTML = urls.map(u => `
      <div class="url-row">
        <span class="url-text">${escapeHTML(u.url)}</span>
        <span class="url-badge ${u.flagged ? 'flagged' : 'clean'}">
          ${u.flagged ? `Malicious (${u.vt_malicious} VT detections)` : 'Clean'}
        </span>
      </div>
    `).join('');
    showEl('urlSection');
  } else {
    hideEl('urlSection');
  }

  showEl('results');
  $('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Helpers ──────────────────────────────────────────────────
function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
