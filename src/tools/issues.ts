import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { IssuesService } from "../services/issues.service.js";
import { runTool } from "./response.js";

export function registerIssuesTools(server: McpServer, service: IssuesService): void {
    server.registerTool(
        "github_issues_list",
        {
            title: "List Repository Issues",
            description: "List issues in a repository (excludes pull requests in most cases depending on filters)",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                state: z.enum(["open", "closed", "all"]).optional(),
                labels: z.string().optional().describe("Comma-separated label names"),
                sort: z.enum(["created", "updated", "comments"]).optional(),
                direction: z.enum(["asc", "desc"]).optional(),
                assignee: z.string().optional(),
                creator: z.string().optional(),
                mentioned: z.string().optional(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ owner, repo, ...params }) =>
            runTool(() => service.listIssues(owner, repo, params)),
    );

    server.registerTool(
        "github_issues_list_mine",
        {
            title: "List My Issues",
            description: "List issues across repositories for the authenticated user",
            inputSchema: {
                filter: z
                    .enum(["assigned", "created", "mentioned", "subscribed", "repos", "all"])
                    .optional(),
                state: z.enum(["open", "closed", "all"]).optional(),
                labels: z.string().optional(),
                sort: z.enum(["created", "updated", "comments"]).optional(),
                direction: z.enum(["asc", "desc"]).optional(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async (args) => runTool(() => service.listMyIssues(args)),
    );

    server.registerTool(
        "github_issues_get",
        {
            title: "Get Issue",
            description: "Get a single issue by number",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                issue_number: z.number().int(),
            },
        },
        async ({ owner, repo, issue_number }) =>
            runTool(() => service.getIssue(owner, repo, issue_number)),
    );

    server.registerTool(
        "github_issues_create",
        {
            title: "Create Issue",
            description: "Create a new issue",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                title: z.string(),
                body: z.string().optional(),
                assignees: z.array(z.string()).optional(),
                labels: z.array(z.string()).optional(),
                milestone: z.number().int().optional(),
            },
        },
        async ({ owner, repo, ...params }) =>
            runTool(() => service.createIssue(owner, repo, params)),
    );

    server.registerTool(
        "github_issues_update",
        {
            title: "Update Issue",
            description: "Update an issue (title, body, state, labels, assignees)",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                issue_number: z.number().int(),
                title: z.string().optional(),
                body: z.string().optional(),
                state: z.enum(["open", "closed"]).optional(),
                state_reason: z.enum(["completed", "not_planned", "reopened"]).nullable().optional(),
                assignees: z.array(z.string()).optional(),
                labels: z.array(z.string()).optional(),
                milestone: z.number().int().nullable().optional(),
            },
        },
        async ({ owner, repo, issue_number, ...params }) =>
            runTool(() => service.updateIssue(owner, repo, issue_number, params)),
    );

    server.registerTool(
        "github_issues_comments_list",
        {
            title: "List Issue Comments",
            description: "List comments on an issue",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                issue_number: z.number().int(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ owner, repo, issue_number, per_page, page }) =>
            runTool(() => service.listComments(owner, repo, issue_number, per_page, page)),
    );

    server.registerTool(
        "github_issues_comments_create",
        {
            title: "Comment on Issue",
            description: "Add a comment to an issue",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                issue_number: z.number().int(),
                body: z.string(),
            },
        },
        async ({ owner, repo, issue_number, body }) =>
            runTool(() => service.createComment(owner, repo, issue_number, body)),
    );

    server.registerTool(
        "github_issues_comments_update",
        {
            title: "Update Issue Comment",
            description: "Update an issue comment",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                comment_id: z.number().int(),
                body: z.string(),
            },
        },
        async ({ owner, repo, comment_id, body }) =>
            runTool(() => service.updateComment(owner, repo, comment_id, body)),
    );

    server.registerTool(
        "github_issues_comments_delete",
        {
            title: "Delete Issue Comment",
            description: "Delete an issue comment",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                comment_id: z.number().int(),
            },
        },
        async ({ owner, repo, comment_id }) =>
            runTool(() => service.deleteComment(owner, repo, comment_id)),
    );

    server.registerTool(
        "github_issues_labels_add",
        {
            title: "Add Issue Labels",
            description: "Add labels to an issue",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                issue_number: z.number().int(),
                labels: z.array(z.string()),
            },
        },
        async ({ owner, repo, issue_number, labels }) =>
            runTool(() => service.addLabels(owner, repo, issue_number, labels)),
    );

    server.registerTool(
        "github_issues_labels_remove",
        {
            title: "Remove Issue Label",
            description: "Remove a label from an issue",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                issue_number: z.number().int(),
                name: z.string(),
            },
        },
        async ({ owner, repo, issue_number, name }) =>
            runTool(() => service.removeLabel(owner, repo, issue_number, name)),
    );

    server.registerTool(
        "github_labels_list",
        {
            title: "List Repo Labels",
            description: "List labels defined in a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ owner, repo, per_page, page }) =>
            runTool(() => service.listLabels(owner, repo, per_page, page)),
    );
}
