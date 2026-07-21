import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PullsService } from "../services/pulls.service.js";
import { runTool } from "./response.js";

export function registerPullsTools(server: McpServer, service: PullsService): void {
    server.registerTool(
        "github_pulls_list",
        {
            title: "List Pull Requests",
            description: "List pull requests in a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                state: z.enum(["open", "closed", "all"]).optional(),
                head: z.string().optional(),
                base: z.string().optional(),
                sort: z.enum(["created", "updated", "popularity", "long-running"]).optional(),
                direction: z.enum(["asc", "desc"]).optional(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ owner, repo, ...params }) =>
            runTool(() => service.listPulls(owner, repo, params)),
    );

    server.registerTool(
        "github_pulls_get",
        {
            title: "Get Pull Request",
            description: "Get a pull request by number",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                pull_number: z.number().int(),
            },
        },
        async ({ owner, repo, pull_number }) =>
            runTool(() => service.getPull(owner, repo, pull_number)),
    );

    server.registerTool(
        "github_pulls_create",
        {
            title: "Create Pull Request",
            description: "Create a pull request",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                title: z.string(),
                head: z.string().describe("Branch with changes, e.g. feature-branch or user:branch"),
                base: z.string().describe("Branch to merge into, e.g. main"),
                body: z.string().optional(),
                draft: z.boolean().optional(),
                maintainer_can_modify: z.boolean().optional(),
            },
        },
        async ({ owner, repo, ...params }) =>
            runTool(() => service.createPull(owner, repo, params)),
    );

    server.registerTool(
        "github_pulls_update",
        {
            title: "Update Pull Request",
            description: "Update a pull request",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                pull_number: z.number().int(),
                title: z.string().optional(),
                body: z.string().optional(),
                state: z.enum(["open", "closed"]).optional(),
                base: z.string().optional(),
                maintainer_can_modify: z.boolean().optional(),
            },
        },
        async ({ owner, repo, pull_number, ...params }) =>
            runTool(() => service.updatePull(owner, repo, pull_number, params)),
    );

    server.registerTool(
        "github_pulls_merge",
        {
            title: "Merge Pull Request",
            description: "Merge a pull request",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                pull_number: z.number().int(),
                commit_title: z.string().optional(),
                commit_message: z.string().optional(),
                merge_method: z.enum(["merge", "squash", "rebase"]).optional(),
            },
        },
        async ({ owner, repo, pull_number, ...params }) =>
            runTool(() => service.mergePull(owner, repo, pull_number, params)),
    );

    server.registerTool(
        "github_pulls_files",
        {
            title: "List PR Files",
            description: "List files changed in a pull request",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                pull_number: z.number().int(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ owner, repo, pull_number, per_page, page }) =>
            runTool(() => service.listFiles(owner, repo, pull_number, per_page, page)),
    );

    server.registerTool(
        "github_pulls_commits",
        {
            title: "List PR Commits",
            description: "List commits on a pull request",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                pull_number: z.number().int(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ owner, repo, pull_number, per_page, page }) =>
            runTool(() => service.listCommits(owner, repo, pull_number, per_page, page)),
    );

    server.registerTool(
        "github_pulls_reviews_list",
        {
            title: "List PR Reviews",
            description: "List reviews on a pull request",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                pull_number: z.number().int(),
            },
        },
        async ({ owner, repo, pull_number }) =>
            runTool(() => service.listReviews(owner, repo, pull_number)),
    );

    server.registerTool(
        "github_pulls_reviews_create",
        {
            title: "Create PR Review",
            description: "Submit a pull request review",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                pull_number: z.number().int(),
                body: z.string().optional(),
                event: z.enum(["APPROVE", "REQUEST_CHANGES", "COMMENT"]).optional(),
                commit_id: z.string().optional(),
            },
        },
        async ({ owner, repo, pull_number, ...params }) =>
            runTool(() => service.createReview(owner, repo, pull_number, params)),
    );

    server.registerTool(
        "github_pulls_review_comments_list",
        {
            title: "List PR Review Comments",
            description: "List review comments on a pull request",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                pull_number: z.number().int(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ owner, repo, pull_number, per_page, page }) =>
            runTool(() => service.listReviewComments(owner, repo, pull_number, per_page, page)),
    );

    server.registerTool(
        "github_pulls_request_reviewers",
        {
            title: "Request PR Reviewers",
            description: "Request reviewers for a pull request",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                pull_number: z.number().int(),
                reviewers: z.array(z.string()),
                team_reviewers: z.array(z.string()).optional(),
            },
        },
        async ({ owner, repo, pull_number, reviewers, team_reviewers }) =>
            runTool(() =>
                service.requestReviewers(owner, repo, pull_number, reviewers, team_reviewers),
            ),
    );

    server.registerTool(
        "github_pulls_is_merged",
        {
            title: "Check If PR Merged",
            description: "Check whether a pull request has been merged",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                pull_number: z.number().int(),
            },
        },
        async ({ owner, repo, pull_number }) =>
            runTool(() => service.checkMerged(owner, repo, pull_number)),
    );
}
