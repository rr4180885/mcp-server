import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ContentsService } from "../services/contents.service.js";
import { runTool } from "./response.js";

export function registerContentsTools(
    server: McpServer,
    service: ContentsService,
): void {
    server.registerTool(
        "github_contents_get",
        {
            title: "Get File or Directory",
            description:
                "Get file contents (decoded to UTF-8) or list a directory in a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                path: z.string().describe("File or directory path, e.g. src/index.ts or '' for root"),
                ref: z.string().optional().describe("Branch, tag, or commit SHA"),
            },
        },
        async ({ owner, repo, path, ref }) =>
            runTool(() => service.getContent(owner, repo, path, ref)),
    );

    server.registerTool(
        "github_contents_create_or_update",
        {
            title: "Create or Update File",
            description:
                "Create or update a file via the Contents API. For updates, pass the current file sha.",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                path: z.string(),
                message: z.string().describe("Commit message"),
                content: z.string().describe("File content as plain text (will be base64-encoded)"),
                sha: z.string().optional().describe("Required when updating an existing file"),
                branch: z.string().optional(),
            },
        },
        async ({ owner, repo, path, ...params }) =>
            runTool(() => service.createOrUpdateFile(owner, repo, path, params)),
    );

    server.registerTool(
        "github_contents_delete",
        {
            title: "Delete File",
            description: "Delete a file from a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                path: z.string(),
                message: z.string(),
                sha: z.string(),
                branch: z.string().optional(),
            },
        },
        async ({ owner, repo, path, ...params }) =>
            runTool(() => service.deleteFile(owner, repo, path, params)),
    );
}
