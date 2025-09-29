# Agentic Content Assistant – How It Works

A client‑friendly overview of the loop powering our AI suggestions in Tina (About → SEO and beyond).

## Diagram (inline)

```mermaid
flowchart TD
	A[Inputs\n• Brand voice & goals\n• Page context\n• SEO guardrails\n• Site content (RAG)] --> B[1) Retrieve & Ground]
	B --> C[2) Generate Variants]
	C --> OA[OpenAI: Generate k variants]
	OA --> D[3) QA & Revise Loop\n• length/clarity\n• banned phrases\n• grounded facts]
	D --> OB[OpenAI: QA revise (≤ n per variant)]
	OB --> D
	D --> E[4) Score & Select]
	E --> F[5) Human Apply (CMS)\n• per-field Apply]
	F --> G[6) Save & Publish]
	G -.-> H[7) Reporting\nJSON/Markdown audit]
	A -. Optional .-> I[(SERP Research)]
	I -.-> B
	%% Single-pass fallback when agentic is off
	A -. agentic off .-> SP[OpenAI: Single-pass draft]
	SP -.-> F
```

ASCII fallback (if Mermaid isn’t available):

```
Inputs --> Retrieve & Ground --> Generate Variants --> [OpenAI: Generate k variants] -->
QA & Revise --> [OpenAI: QA revise (<= n per variant)] --(loop until pass)--> Score & Select -->
Human Apply --> Save & Publish --(logs)--> Reporting

agentic off: Inputs --> [OpenAI: Single-pass draft] --> Human Apply
```

## When are OpenAI calls made?

- Generate variants: one OpenAI call per variant (k). Default k = 2 (configurable).
- QA revise loop: up to n OpenAI calls per variant (n). Default n = 2 (configurable). Stops early if compliant.
- Single‑pass mode: for non‑agentic flows, a single OpenAI call produces the draft (no variant/QA loop).
- Retrieval, scoring/selection, and reporting do not call OpenAI.

## Plain‑English explainer

- Inputs: We combine your brand voice, page context, goals (Replace/Improve), and SEO guardrails with a snapshot of your site content.
- Retrieve & ground: A lightweight search (TF‑IDF) pulls the most relevant snippets from your own pages. These are cited so the model stays truthful.
- Generate variants: The model creates multiple options from the same brief while following tone/locale rules.
- QA & revise loop: Deterministic checks enforce constraints (e.g., title 50–60 chars, description 150–160, banned phrases). If a draft fails, it’s revised.
- Score & select: We pick the best compliant draft using a simple scoring rubric.
- Human apply (CMS): You preview suggestions inside the field and apply them individually (e.g., Meta Title only). Nothing is overwritten blindly.
- Save & publish: Approved changes are saved via Tina and published as normal.
- Reporting: Each run can emit a JSON/Markdown report for auditability and learning.

## Why clients like it

- Grounded in your content: No hallucinations—facts are pulled from your site.
- Human‑in‑the‑loop: Editors stay in control and apply only what’s useful.
- Transparent: Every decision is logged (what was checked, revised, and why).
- Fast iteration: Variants + QA mean you get polished output quickly.

## Where it’s used first

- About → SEO assistant (Meta Title & Description), with field‑level Apply.
- About → Hero and Approach body suggestions.

This architecture generalises to Services, Blog, and Case Studies with the same pattern.
