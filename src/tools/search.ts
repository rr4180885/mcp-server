import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { SearchService } from "../services/search.service.js";
import { runTool } from "./response.js";

export function registerSearchTools(server: McpServer, service: SearchService): void {
    server.registerTool(
        "github_search_repositories",
        {
            title: "Search Repositories",
            description: "Search GitHub repositories (GitHub search syntax supported)",
            inputSchema: {
                q: z.string(),
                sort: z.enum(["stars", "forks", "help-wanted-issues", "updated"]).optional(),
                order: z.enum(["asc", "desc"]).optional(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ q, ...params }) => runTool(() => service.searchRepositories(q, params)),
    );

    server.registerTool(
        "github_search_issues",
        {
            title: "Search Issues and PRs",
            description: "Search issues and pull requests",
            inputSchema: {
                q: z.string(),
                sort: z
                    .enum([
                        "comments",
                        "reactions",
                        "reactions-+1",
                        "reactions--1",
                        "reactions-smile",
                        "reactions-thinking_face",
                        "reactions-heart",
                        "reactions-tada",
                        "interactions",
                        "created",
                        "updated",
                    ])
                    .optional(),
                order: z.enum(["asc", "desc"]).optional(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ q, ...params }) => runTool(() => service.searchIssues(q, params)),
    );

    server.registerTool(
        "github_search_code",
        {
            title: "Search Code",
            description: "Search code across GitHub",
            inputSchema: {
                q: z.string(),
                sort: z.enum(["indexed"]).optional(),
                order: z.enum(["asc", "desc"]).optional(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ q, ...params }) => runTool(() => service.searchCode(q, params)),
    );

    server.registerTool(
        "github_search_users",
        {
            title: "Search Users",
            description: "Search GitHub users",
            inputSchema: {
                q: z.string(),
                sort: z.enum(["followers", "repositories", "joined"]).optional(),
                order: z.enum(["asc", "desc"]).optional(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ q, ...params }) => runTool(() => service.searchUsers(q, params)),
    );
}
