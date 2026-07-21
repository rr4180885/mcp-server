import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createGithubMcpServer } from "./server.js";

async function main() {
    const server = createGithubMcpServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((error) => {
    console.error("Failed to start GitHub MCP server:", error);
    process.exit(1);
});
