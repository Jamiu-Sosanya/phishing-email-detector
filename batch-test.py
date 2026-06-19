#!/usr/bin/env python3
"""
batch-test.py — Run all sample emails through the PhishScan webhook
and print a results table. Saves output to results.csv.

Usage:
  pip install requests tabulate
  python3 batch-test.py
"""

import os
import json
import csv
import requests
from pathlib import Path
from tabulate import tabulate

# ── Config ───────────────────────────────────────────────────
WEBHOOK_URL = os.getenv('N8N_WEBHOOK_URL', 'https://YOUR-N8N-INSTANCE/webhook/phishing-analyze')
TEST_DIR    = Path(__file__).parent.parent / 'test-emails'
OUTPUT_CSV  = Path(__file__).parent.parent / 'docs' / 'batch-results.csv'
# ────────────────────────────────────────────────────────────

VERDICT_ICONS = { 'safe': '✓', 'suspicious': '?', 'phishing': '✗' }

def analyse(email_text: str) -> dict:
    try:
        res = requests.post(
            WEBHOOK_URL,
            json={'email': email_text},
            timeout=30
        )
        res.raise_for_status()
        return res.json()
    except Exception as e:
        return {'error': str(e)}

def main():
    email_files = sorted(TEST_DIR.glob('*.txt'))
    if not email_files:
        print(f'No .txt files found in {TEST_DIR}')
        return

    rows = []
    csv_rows = []

    print(f'\nRunning {len(email_files)} emails through PhishScan...\n')

    for path in email_files:
        email_text = path.read_text(encoding='utf-8')
        result = analyse(email_text)

        if 'error' in result:
            rows.append([path.name, 'ERR', 'error', result['error'][:50]])
            csv_rows.append({'file': path.name, 'score': 'ERR', 'verdict': 'error', 'top_indicator': result['error']})
            continue

        score    = result.get('overall_score', '?')
        verdict  = result.get('verdict', '?')
        top_ind  = result.get('top_indicator', '—')
        icon     = VERDICT_ICONS.get(verdict, '?')

        rows.append([path.name, score, f'{icon} {verdict}', top_ind])
        csv_rows.append({'file': path.name, 'score': score, 'verdict': verdict, 'top_indicator': top_ind})

        print(f'  {path.name}: score={score} verdict={verdict}')

    print('\n' + tabulate(
        rows,
        headers=['File', 'Score', 'Verdict', 'Top indicator'],
        tablefmt='rounded_outline'
    ))

    # Save CSV
    OUTPUT_CSV.parent.mkdir(exist_ok=True)
    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['file', 'score', 'verdict', 'top_indicator'])
        writer.writeheader()
        writer.writerows(csv_rows)

    print(f'\nResults saved to {OUTPUT_CSV}')

if __name__ == '__main__':
    main()
