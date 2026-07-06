# AIED Design Hub: AI Tool Matchmaker

A free, searchable directory of vetted AI tools for NZ secondary English teachers, with traffic-light safety ratings for cost, privacy, education guardrails, and accessibility.

Built as a standalone web app (HTML, CSS, JavaScript — no frameworks) so it can be hosted on GitHub Pages and embedded into WordPress via an iframe.

An Open Education Resource developed through OE4BW (UNESCO).

---

## How to run it locally

You need to serve the files with a local web server — browsers block `fetch()` when you open HTML files directly.

The easiest option:
1. Open the project folder in VS Code.
2. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
3. Right-click `index.html` and choose "Open with Live Server".

Your browser will open at `http://127.0.0.1:5500` and the matchmaker will load.

---

## How to add or edit tools

Open `data/tools.json` in any text editor. Each tool follows this pattern:

```json
{
  "id": "tool-name-lowercase-no-spaces",
  "name": "Tool Name",
  "url": "https://example.com",
  "category": "Lesson Planning",
  "description": "One or two sentences describing what the tool does and when you'd use it.",
  "tags": ["keyword one", "keyword two"],
  "ratings": {
    "cost":          "green",
    "privacy":       "amber",
    "guardrails":    "green",
    "accessibility": "amber"
  },
  "notes": {
    "cost":          "Brief note on pricing.",
    "privacy":       "Brief note on data/privacy.",
    "guardrails":    "Brief note on safety features.",
    "accessibility": "Brief note on accessibility."
  }
}
```

Rating values are `"green"`, `"amber"`, or `"red"`.

**Traffic light guide:**

| Rating | Cost | Privacy | Guardrails | Accessibility |
|--------|------|---------|------------|---------------|
| Green  | Free | Strong privacy protections | Education-specific guardrails | Good WCAG compliance |
| Amber  | Freemium (free tier available) | Some concerns, review before use | General content filters only | Partial or untested |
| Red    | Paid only | Significant concerns | Minimal or no guardrails | Known gaps |

Separate tool entries with a comma inside the `"tools": [...]` array. Save the file and refresh the page.

---

## Deployment to GitHub Pages

1. Push this repository to GitHub.
2. Go to Settings > Pages.
3. Set Source to "Deploy from a branch", select `main`, folder `/` (root).
4. Save. Your site will be live at `https://yourusername.github.io/aied-design-hub/`.

---

## Embedding in WordPress (iframe)

Once the site is deployed, paste this into a WordPress block (use a Custom HTML block):

```html
<iframe
  src="https://yourusername.github.io/aied-design-hub/"
  width="100%"
  height="800"
  style="border: none; border-radius: 8px;"
  title="AIED Design Hub: AI Tool Matchmaker"
  loading="lazy"
></iframe>
```

Adjust the `height` value to suit your page layout.

---

## Project structure

```
aied-design-hub/
├── index.html          Main page
├── css/
│   └── styles.css      All styling
├── js/
│   └── app.js          Search, filter, and card rendering
├── data/
│   └── tools.json      The tool database (edit this to add tools)
└── README.md
```
