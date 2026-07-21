import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { BranchesService } from "../services/branches.service.js";
import { runTool } from "./response.js";

export function registerBranchesTools(
    server: McpServer,
    service: BranchesService,
): void {
    server.registerTool(
        "github_branches_list",
        {
            title: "List Branches",
            description: "List branches in a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ owner, repo, per_page, page }) =>
            runTool(() => service.listBranches(owner, repo, per_page, page)),
    );

    server.registerTool(
        "github_branches_get",
        {
            title: "Get Branch",
            description: "Get a branch by name",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                branch: z.string(),
            },
        },
        async ({ owner, repo, branch }) =>
            runTool(() => service.getBranch(owner, repo, branch)),
    );

    server.registerTool(
        "github_branches_create",
        {
            title: "Create Branch",
            description: "Create a branch from a commit SHA",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                branch: z.string(),
                from_sha: z.string().describe("Commit SHA to branch from"),
            },
        },
        async ({ owner, repo, branch, from_sha }) =>
            runTool(() => service.createBranch(owner, repo, branch, from_sha)),
    );

    server.registerTool(
        "github_branches_delete",
        {
            title: "Delete Branch",
            description: "Delete a branch",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                branch: z.string(),
            },
        },
        async ({ owner, repo, branch }) =>
            runTool(() => service.deleteBranch(owner, repo, branch)),
    );

    server.registerTool(
        "github_branches_rename",
        {
            title: "Rename Branch",
            description: "Rename a branch",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                branch: z.string(),
                new_name: z.string(),
            },
        },
        async ({ owner, repo, branch, new_name }) =>
            runTool(() => service.renameBranch(owner, repo, branch, new_name)),
    );

    server.registerTool(
        "github_git_get_ref",
        {
            title: "Get Git Ref",
            description: "Get a git reference, e.g. heads/main or tags/v1.0.0",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                ref: z.string().describe("Ref without refs/ prefix, e.g. heads/main"),
            },
        },
        async ({ owner, repo, ref }) => runTool(() => service.getRef(owner, repo, ref)),
    );
}
