# AIED Design Hub — Project Brief

## Project owner
Laurel Silvester, secondary English teacher and AI Lead, Rototuna Senior High School, Hamilton, Aotearoa New Zealand. OE4BW (Open Education for a Better World, UNESCO-affiliated) developer.

## What this project is
The AIED Design Hub is a free online resource for New Zealand secondary English teachers, built as an Open Education Resource (OER) through OE4BW. It brings together vetted AI tools, AI literacy frameworks, classroom scenarios, and current news, organised to support lesson and unit planning.

Full working title: "The AIED Design Hub: An Agentic OER for Inclusive and Ethical AI Integration in Education."

## Problem it solves
Most NZ schools lack a formal AI policy. Teachers feel pressure to use AI well but lack time and technical confidence to audit their own practice. Students use AI heavily but are reluctant to engage with AI literacy as a standalone topic. The Hub embeds AI literacy naturally into existing planning workflows rather than teaching it separately.

## Planned features (four modules)
1. **UNESCO-grounded lesson idea generator** — teacher enters a topic, gets activity suggestions aligned to UNESCO AI Competency Frameworks.
2. **Live AI news integration** — surfaces current news relevant to a lesson topic, for real-world discussion hooks.
3. **Assessment auditor and traffic light generator** — teacher uploads an assessment brief, gets it checked against Leon Furze's AI Assessment Scale (AIAS) v2, with a downloadable traffic-light badge communicating permitted AI use to students.
4. **Vetted AI tool matchmaker** — recommends specific AI tools per lesson, each with a safety/privacy tick-box rating (cost, data privacy, education guardrails, accessibility).

The most interactive priority right now is the **vetted AI tool matchmaker** with search/filter and traffic-light tagging.

## Platform decisions made so far
- **Main site:** Paid, self-hosted WordPress (WordPress.org), not Google Sites or WordPress.com. Chosen because Google Sites cannot support search/filter functionality needed for the matchmaker.
- **LLM integration approach:** Option 3 — build the AI tool (chat assistant / matchmaker) as a **separate, standalone web app**, hosted independently (e.g. GitHub Pages or Netlify, free), and **embedded into WordPress via iframe**. Chosen over embedding API calls directly into WordPress (Option 2) for maintainability and risk isolation: a fault in the standalone tool won't take down the main site.
- **Model choice for LLM features:** Claude Haiku 4.5 recommended as the default (cheapest current-generation model, sufficient for Q&A/matchmaking tasks). Sonnet 4.6 only if reasoning needs increase.
- **Cost estimate:** roughly $5–30/month in API costs depending on uptake, plus ~$5–15/month WordPress hosting. Prompt caching recommended to cut input costs further since the system prompt/curriculum context will be reused on every call.

## Known conflict to resolve
Hui notes from 12 June 2026 record that **Google Sites was confirmed at that meeting** for survey/platform hosting. This predates the WordPress decision made since. Laurel needs to clarify with her OE4BW partner/mentor (Martha Mosha) whether this refers to the survey only or the full Hub, and update the team accordingly.

## Project status (as of late June 2026)
- **Phase 1 (Teacher Needs Survey):** Ethics clearance obtained. Survey live, distributed via NZATE, Ministry of Education (awareness only), and department colleagues. Window roughly two weeks, aiming to review responses before Laurel's holidays.
- **Ethics framework:** Drawing on NZARE Ethical Guidelines, ICTD/ICT4D Minimum Ethical Standards, and a University of Cologne example ethics statement, with NZ-specific considerations (Te Tiriti o Waitangi) flagged for further development.
- **Key collaborator:** Martha Mosha (marthamosha@gmail.com), reviewing survey design and ethics.
- **Build skills:** Laurel is a beginner coder — has installed VS Code and GitHub, is self-teaching, wants to build developer capacity through this project using Claude Code.
- **Next milestones:** mid-project deadline end of June/first week of July; survey review; building the matchmaker prototype; resolving the WordPress vs Google Sites conflict.

## Style and tone preferences
- No em dashes, ever.
- Warm, professional tone. Te reo Māori conventions used naturally (Kia ora, Ngā mihi).
- Concise, clear writing.

## What's needed from this point (suggested Claude Code starting tasks)
1. Set up a Git repository and basic project structure for the standalone matchmaker tool.
2. Build the tool matchmaker as a searchable/filterable web app (HTML/JS or a lightweight framework), with a simple JSON or Google Sheet-backed data source Laurel can edit herself.
3. Add the traffic-light tagging system to each tool entry (cost, data privacy, guardrails, accessibility).
4. Set up deployment to GitHub Pages or Netlify.
5. Prepare the iframe embed code for WordPress once the WordPress host is set up.
6. Longer term: assessment auditor module, lesson idea generator, news integration.
