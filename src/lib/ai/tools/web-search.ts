/**
 * Web Search & Browsing Tool Implementation for Vercel AI SDK
 * Provides autonomous web scouting capabilities with zero API key dependencies
 */

export interface WebSearchResultItem {
  title: string;
  url: string;
  domain: string;
  snippet: string;
}

export interface WebSearchResponse {
  query: string;
  results: WebSearchResultItem[];
  source: string;
  timestamp: string;
}

function cleanHtmlText(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractDomain(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "web";
  }
}

function decodeUddgUrl(rawHref: string): string {
  try {
    const match = rawHref.match(/uddg=([^&"]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
  } catch {
    // Return cleaned href
  }
  return rawHref.startsWith("//") ? `https:${rawHref}` : rawHref;
}

/**
 * Searches the live web using DuckDuckGo
 */
export async function searchWeb(query: string, maxResults = 5): Promise<WebSearchResponse> {
  const timestamp = new Date().toISOString();
  const trimmed = query.trim();

  if (!trimmed) {
    return {
      query: "",
      results: [],
      source: "DuckDuckGo Web Index",
      timestamp,
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(trimmed)}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Web search returned HTTP ${response.status}`);
    }

    const html = await response.text();
    const results: WebSearchResultItem[] = [];

    // Match all result titles and snippets
    const titleMatches = [...html.matchAll(/<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    const snippetMatches = [...html.matchAll(/<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g)];

    const count = Math.min(maxResults, titleMatches.length);

    for (let i = 0; i < count; i++) {
      const rawHref = titleMatches[i][1];
      const rawTitle = titleMatches[i][2];
      const rawSnippet = snippetMatches[i] ? snippetMatches[i][1] : "";

      const cleanTitle = cleanHtmlText(rawTitle);
      const cleanSnippet = cleanHtmlText(rawSnippet);
      const resolvedUrl = decodeUddgUrl(rawHref);

      if (resolvedUrl && cleanTitle) {
        results.push({
          title: cleanTitle,
          url: resolvedUrl,
          domain: extractDomain(resolvedUrl),
          snippet: cleanSnippet || "Direct reference link found in web index.",
        });
      }
    }

    return {
      query: trimmed,
      results,
      source: "DuckDuckGo Live Index",
      timestamp,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Search service unavailable";
    return {
      query: trimmed,
      results: [
        {
          title: `Search Query: "${trimmed}"`,
          url: `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`,
          domain: "duckduckgo.com",
          snippet: `Live query dispatched. Status: ${errorMsg}. Tap the link to view web results directly.`,
        },
      ],
      source: "Search Gateway (Direct Link)",
      timestamp,
    };
  }
}

/**
 * Deep page fetcher to read page contents and summaries
 */
export async function fetchWebPage(urlStr: string): Promise<{
  url: string;
  domain: string;
  title: string;
  excerpt: string;
  status: number;
}> {
  try {
    const parsed = new URL(urlStr);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Invalid URL protocol. Only HTTP and HTTPS are permitted.");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(urlStr, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,text/plain;q=0.9",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const html = await res.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? cleanHtmlText(titleMatch[1]) : parsed.hostname;

    // Strip scripts, styles, etc.
    const cleaned = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ")
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, " ")
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, " ")
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, " ");

    const text = cleanHtmlText(cleaned);
    const excerpt = text.slice(0, 1500) + (text.length > 1500 ? "..." : "");

    return {
      url: urlStr,
      domain: extractDomain(urlStr),
      title,
      excerpt,
      status: res.status,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Page read failure";
    return {
      url: urlStr,
      domain: extractDomain(urlStr),
      title: "Content Unavailable",
      excerpt: `Failed to fetch page content: ${errorMsg}`,
      status: 500,
    };
  }
}
