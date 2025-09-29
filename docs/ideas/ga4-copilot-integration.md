# GA4-to-Repo Analytics + Copilot Agent Integration

Status: Idea brief
Owner: Marketing/Eng
Target repo: EllieEdwardsMarketingLeadgenSite

Objective
- Automatically pull key GA4 metrics for the live site on a schedule and save them in-repo as both raw data and human-readable summaries.
- Make those files first-class context for GitHub Copilot Agent in VS Code so we can ask analytics questions directly in the code workspace.

Why
- Centralize analytics alongside code and content to tighten the feedback loop.
- Enable quick, grounded Q&A in Copilot Agent: performance, trends, and opportunities.

Deliverables
- GitHub Actions workflow: .github/workflows/ga4-sync.yml
- Script to query GA4 and write files: scripts/ga4_sync.py (or scripts/ga4_sync.ts)
- Data storage: data/analytics/ga4/YYYY-MM-DD.json (and/or .csv)
- Human summary: docs/analytics/latest.md (+ optional weekly rollups)

Initial data scope
- Date ranges: last 7 days, last 28/30 days
- Dimensions: pagePath, pageTitle, source/medium, deviceCategory, country, eventName (for key events)
- Metrics (GA4):
  - activeUsers, newUsers
  - sessions, sessionsPerUser
  - views (aka screenPageViews)
  - userEngagementDuration, averageSessionDuration
  - bounceRate
  - eventCount, conversions (if configured)

Security and setup
- Create a Google Cloud service account with Google Analytics Data API enabled.
- Grant that service account Viewer access to the GA4 property.
- Generate a JSON key for the service account.
- Add GitHub repo secrets:
  - GA4_PROPERTY_ID: GA4 property numeric ID
  - GA4_SERVICE_ACCOUNT_KEY: the full JSON key as a single-line string (you can paste JSON; GitHub Secrets will store it safely)

Repository structure changes
- scripts/ga4_sync.py (query GA4 Data API, write JSON/CSV, and produce a Markdown summary)
- data/analytics/ga4/ (raw data snapshots)
- docs/analytics/latest.md (human-readable summary used by Copilot)

Workflow outline (example)
```yaml
name: GA4 Sync
on:
  workflow_dispatch:
  schedule:
    - cron: '0 6 * * *' # 06:00 UTC daily
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install deps
        run: pip install google-analytics-data pandas
      - name: Run GA4 sync
        env:
          GA4_PROPERTY_ID: ${{ secrets.GA4_PROPERTY_ID }}
          GA4_SERVICE_ACCOUNT_KEY: ${{ secrets.GA4_SERVICE_ACCOUNT_KEY }}
        run: python scripts/ga4_sync.py
      - name: Commit changes
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore(analytics): update GA4 data"
          file_pattern: |
            data/analytics/ga4/**
            docs/analytics/**
```

Script sketch (Python)
```python
# scripts/ga4_sync.py
import os, json, datetime, pathlib
from google.oauth2 import service_account
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import RunReportRequest, DateRange, Dimension, Metric

PROP_ID = os.environ["GA4_PROPERTY_ID"]
key_json = os.environ["GA4_SERVICE_ACCOUNT_KEY"]
creds = service_account.Credentials.from_service_account_info(json.loads(key_json))
client = BetaAnalyticsDataClient(credentials=creds)

# Helper to run a report
def run_report(date_range):
    request = RunReportRequest(
        property=f"properties/{{PROP_ID}}",
        date_ranges=[DateRange(start_date=date_range[0], end_date=date_range[1])],
        dimensions=[
            {"name": "pagePath"},
            {"name": "pageTitle"},
            {"name": "sourceMedium"},
            {"name": "deviceCategory"},
            {"name": "country"},
        ],
        metrics=[
            {"name": "activeUsers"},
            {"name": "newUsers"},
            {"name": "sessions"},
            {"name": "views"},
            {"name": "userEngagementDuration"},
            {"name": "bounceRate"},
        ],
        limit=50000,
    )
    return client.run_report(request)

# Date ranges
today = datetime.date.today()
last7 = ((today - datetime.timedelta(days=7)).isoformat(), today.isoformat())
last28 = ((today - datetime.timedelta(days=28)).isoformat(), today.isoformat())

out_dir = pathlib.Path("data/analytics/ga4")
out_dir.mkdir(parents=True, exist_ok=True)

reports = {"last7": run_report(last7), "last28": run_report(last28)}

# Serialize rows into simple lists of dicts
payload = {}
for key, report in reports.items():
    rows = []
    for r in report.rows:
        dim = {d.name: v for d, v in zip(report.dimension_headers, r.dimension_values)}
        met = {m.name: v for m, v in zip(report.metric_headers, r.metric_values)}
        # Convert all values to strings, project numbers where possible
        row = {**{k: v.value for k, v in dim.items()}, **{k: v.value for k, v in met.items()}}
        rows.append(row)
    payload[key] = rows

# Write daily snapshot
snapshot_path = out_dir / f"{today.isoformat()}.json"
with open(snapshot_path, "w", encoding="utf-8") as f:
    json.dump(payload, f, ensure_ascii=False, indent=2)

# Build a lightweight human summary
top_pages = sorted(payload["last7"], key=lambda x: float(x.get("views", 0) or 0), reverse=True)[:10]
summary_lines = [
    "# Latest GA4 summary",
    f"Date: {{today.isoformat()}}",
    "",
    "Top pages by views (last 7 days):",
]
for i, row in enumerate(top_pages, 1):
    summary_lines.append(f"- {{i}}. {{row.get('pageTitle','(no title)')}} — {{row.get('views','0')}} views — {{row.get('pagePath','/')}}")

summary_path = pathlib.Path("docs/analytics")
summary_path.mkdir(parents=True, exist_ok=True)
with open(summary_path / "latest.md", "w", encoding="utf-8") as f:
    f.write("\n".join(summary_lines))
```

Copilot Agent usage in VS Code
- Keep summaries in docs/analytics/latest.md; weekly rollups optional under docs/analytics/weekly/.
- Ask Copilot Agent things like:
  - "Based on docs/analytics/latest.md, which landing pages underperformed week over week?"
  - "Summarize the top sources driving sessions in data/analytics/ga4/2025-*.json."
- Reference file paths explicitly for best grounding.

Notes and options
- Frequency: start daily; adjust to traffic cadence.
- File formats: JSON + Markdown; add CSV if needed.
- Branching: okay to commit to main; or write to a data/analytics branch and PR weekly.
- Metrics names vary slightly across GA4 SDK versions (v1 vs beta). If the above metrics error, switch to the stable client from google.analytics.data_v1 and align metric names accordingly.
- For secrets, storing the full JSON as GA4_SERVICE_ACCOUNT_KEY is simplest; you can also split into GA4_CLIENT_EMAIL and GA4_PRIVATE_KEY if you prefer.