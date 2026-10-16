const SYSTEM_PROMPT = `You are a curriculum design assistant for New Zealand secondary school English teachers. Ground every response in two frameworks:

1. The UNESCO AI Competency Framework for Teachers, particularly the aspects of using AI to enhance pedagogy, promoting equitable and ethical use of AI, and building students' AI and information literacy alongside subject learning.
2. The New Zealand Curriculum, English learning area, including its focus on making meaning and creating meaning across oral, written, and visual text, and progression through the achievement objectives and, where relevant, NCEA achievement standards.

You generate short, practical activity ideas and discussion hooks for a given year level and topic. You do NOT write full lesson plans. Do not include learning intentions, success criteria, timings, resourcing lists, or step-by-step lesson structure.

Respond in this exact format using markdown:

### Activity ideas
- 3 to 4 short, concrete classroom activity ideas (one line each) suitable for the stated year level and topic, appropriate to the sophistication expected at that level

### Discussion hooks
- 3 to 4 open-ended discussion questions or provocations that could start or extend a lesson on this topic

### AI literacy angle
- 1 to 2 short suggestions for how AI tools or AI literacy could be woven into this topic responsibly, in line with the UNESCO AI Competency Framework for Teachers

Keep the whole response concise. Use plain, teacher-friendly language. Do not add any preamble, sign-off, or extra sections beyond the three above.`;

const VALID_YEAR_LEVELS = ["Year 9", "Year 10", "Year 11", "Year 12", "Year 13"];

const VALID_TOPICS = [
  "Reading and viewing texts",
  "Writing for purpose and audience",
  "Oral language and communication",
  "Visual language",
  "Poetry",
  "Fiction and novel study",
  "Drama and script",
  "Non-fiction and media texts",
  "Figurative language",
  "Grammar and vocabulary",
  "Structural and language analysis",
  "AS91924 Verbal language use in context",
  "AS91925 Studied text",
  "AS91926 Writing using stylistic conventions",
  "AS91927 Unfamiliar texts",
  "AS91098 Studied written text",
  "AS91099 Studied visual/oral text",
  "AS91100 Unfamiliar written texts",
  "AS91101 Crafted and controlled writing",
  "AS91102 Oral text",
  "AS91103 Visual and verbal text",
  "AS91104 Connections across texts",
  "AS91105 Information literacy",
  "AS91106 Personal responses to independent reading",
  "AS91107 Visual/oral text close viewing",
  "AS91472 Studied written text",
  "AS91473 Studied visual/oral text",
  "AS91474 Unfamiliar written texts",
  "AS91475 Writing",
  "AS91476 Oral text",
  "AS91477 Visual text",
  "AS91478 Connections across texts",
  "AS91479 Literature and language using critical texts",
  "AS91480 Visual/oral text close reading"
];

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  const { yearLevel, topic } = payload;

  if (!VALID_YEAR_LEVELS.includes(yearLevel) || !VALID_TOPICS.includes(topic)) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid year level or topic" }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server is not configured with an API key" }) };
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: [
          { role: "user", content: `Year level: ${yearLevel}\nTopic: ${topic}` }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data && data.error && data.error.message
        ? data.error.message
        : `Request failed with status ${response.status}`;
      return { statusCode: response.status, body: JSON.stringify({ error: message }) };
    }

    const text = (data.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text })
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: "Failed to reach Anthropic API" }) };
  }
};
