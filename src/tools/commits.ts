import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CommitsService } from "../services/commits.service.js";
import { runTool } from "./response.js";

export function registerCommitsTools(
    server: McpServer,
    service: CommitsService,
): void {
    server.registerTool(
        "github_commits_list",
        {
            title: "List Commits",
            description: "List commits in a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                sha: z.string().optional().describe("SHA or branch to start listing from"),
                path: z.string().optional(),
                author: z.string().optional(),
                since: z.string().optional().describe("ISO 8601 timestamp"),
                until: z.string().optional().describe("ISO 8601 timestamp"),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ owner, repo, ...params }) =>
            runTool(() => service.listCommits(owner, repo, params)),
    );

    server.registerTool(
        "github_commits_get",
        {
            title: "Get Commit",
            description: "Get a commit by SHA or ref",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                ref: z.string(),
            },
        },
        async ({ owner, repo, ref }) =>
            runTool(() => service.getCommit(owner, repo, ref)),
    );

    server.registerTool(
        "github_commits_compare",
        {
            title: "Compare Commits",
            description: "Compare two commits or branches",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                base: z.string(),
                head: z.string(),
            },
        },
        async ({ owner, repo, base, head }) =>
            runTool(() => service.compareCommits(owner, repo, base, head)),
    );
}
