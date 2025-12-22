import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { chromium } from "playwright";
import { z } from "zod";

const server = new McpServer({
  name: "playwright-mcp",
  version: "1.0.0",
});

// Shared browser state
let browser;
let context;
let page;

/**
 * Ensure browser is running
 */
async function ensureBrowser() {
  if (!browser) {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
  }
}

/**
 * browser.open
 */
server.tool(
  "browser_open",
  {
    url: z.string().describe("URL to open"),
  },
  async ({ url }) => {
    await ensureBrowser();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    return {
      content: [
        {
          type: "text",
          text: `Opened ${url}`,
        },
      ],
    };
  }
);

/**
 * browser.screenshot
 */
server.tool(
  "browser_screenshot",
  {
    fullPage: z.boolean().optional().describe("Capture full page"),
  },
  async ({ fullPage = true }) => {
    if (!page) {
      throw new Error("No page open. Call browser.open first.");
    }

    const buffer = await page.screenshot({
      fullPage,
      type: "png",
    });

    return {
      content: [
        {
          type: "image",
          data: buffer.toString("base64"),
          mimeType: "image/png",
        },
      ],
    };
  }
);

/**
 * Connect via stdio (required for Antigranity)
 */
const transport = new StdioServerTransport();
await server.connect(transport);



