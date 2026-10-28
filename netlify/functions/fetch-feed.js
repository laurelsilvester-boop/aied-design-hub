const FEEDS = {
  edsurge: "https://www.edsurge.com/articles_rss",
  hechinger: "https://hechingerreport.org/feed/",
  edweek: "https://www.edweek.org/feed.rss",
  theverge: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml"
};

function decodeEntities(str) {
  if (!str) return "";
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&amp;/g, "&")
    .trim();
}

function extractTag(block, tagName) {
  const match = block.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function extractAtomLink(block) {
  const altMatch = block.match(/<link\b[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["'][^>]*\/?>/i);
  if (altMatch) return altMatch[1];
  const anyMatch = block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
  return anyMatch ? anyMatch[1] : "";
}

function parseFeed(xml) {
  const items = [];

  const rssItems = xml.match(/<item\b[^>]*>[\s\S]*?<\/item>/gi) || [];
  for (const block of rssItems) {
    items.push({
      title: extractTag(block, "title"),
      link: extractTag(block, "link") || extractAtomLink(block),
      pubDate: extractTag(block, "pubDate") || extractTag(block, "dc:date")
    });
  }

  if (items.length === 0) {
    const entries = xml.match(/<entry\b[^>]*>[\s\S]*?<\/entry>/gi) || [];
    for (const block of entries) {
      items.push({
        title: extractTag(block, "title"),
        link: extractAtomLink(block),
        pubDate: extractTag(block, "published") || extractTag(block, "updated")
      });
    }
  }

  return items.filter((item) => item.title && item.link);
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const source = event.queryStringParameters && event.queryStringParameters.source;
  const feedUrl = FEEDS[source];

  if (!feedUrl) {
    return { statusCode: 400, body: JSON.stringify({ status: "error", message: "Unknown feed source" }) };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(feedUrl, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; AIEDDesignHubBot/1.0)" },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "error", message: `Feed responded with HTTP ${res.status}` })
      };
    }

    const xml = await res.text();
    const items = parseFeed(xml);

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "public, max-age=600"
      },
      body: JSON.stringify({ status: "ok", items })
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "error", message: "Failed to fetch or parse feed" })
    };
  }
};
