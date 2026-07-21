import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RepositoryService } from "../services/repository.service.js";
import { runTool } from "./response.js";

export function registerRepositoryTools(
    server: McpServer,
    service: RepositoryService,
): void {
    server.registerTool(
        "github_repositories_list",
        {
            title: "List My Repositories",
            description: "List repositories for the authenticated GitHub user",
            inputSchema: {
                visibility: z.enum(["all", "public", "private"]).optional(),
                sort: z.enum(["created", "updated", "pushed", "full_name"]).optional(),
                direction: z.enum(["asc", "desc"]).optional(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async (args) => runTool(() => service.listRepositories(args)),
    );

    server.registerTool(
        "github_repositories_get",
        {
            title: "Get Repository",
            description: "Get details for a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
            },
        },
        async ({ owner, repo }) => runTool(() => service.getRepository(owner, repo)),
    );

    server.registerTool(
        "github_repositories_create",
        {
            title: "Create Repository",
            description: "Create a new repository for the authenticated user",
            inputSchema: {
                name: z.string(),
                description: z.string().optional(),
                private: z.boolean().optional(),
                homepage: z.string().optional(),
                auto_init: z.boolean().optional(),
                gitignore_template: z.string().optional(),
                license_template: z.string().optional(),
            },
        },
        async (args) => runTool(() => service.createRepository(args)),
    );

    server.registerTool(
        "github_repositories_update",
        {
            title: "Update Repository",
            description: "Update repository settings",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                name: z.string().optional(),
                description: z.string().optional(),
                homepage: z.string().optional(),
                private: z.boolean().optional(),
                has_issues: z.boolean().optional(),
                has_projects: z.boolean().optional(),
                has_wiki: z.boolean().optional(),
                default_branch: z.string().optional(),
                archived: z.boolean().optional(),
            },
        },
        async ({ owner, repo, ...params }) =>
            runTool(() => service.updateRepository(owner, repo, params)),
    );

    server.registerTool(
        "github_repositories_delete",
        {
            title: "Delete Repository",
            description: "Delete a repository (requires delete_repo scope)",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
            },
        },
        async ({ owner, repo }) => runTool(() => service.deleteRepository(owner, repo)),
    );

    server.registerTool(
        "github_repositories_languages",
        {
            title: "List Repository Languages",
            description: "List languages used in a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
            },
        },
        async ({ owner, repo }) => runTool(() => service.listLanguages(owner, repo)),
    );

    server.registerTool(
        "github_repositories_topics_list",
        {
            title: "List Repository Topics",
            description: "List topics for a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
            },
        },
        async ({ owner, repo }) => runTool(() => service.listTopics(owner, repo)),
    );

    server.registerTool(
        "github_repositories_topics_replace",
        {
            title: "Replace Repository Topics",
            description: "Replace all topics on a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                names: z.array(z.string()),
            },
        },
        async ({ owner, repo, names }) =>
            runTool(() => service.replaceTopics(owner, repo, names)),
    );

    server.registerTool(
        "github_repositories_fork",
        {
            title: "Fork Repository",
            description: "Fork a repository to your account or an organization",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                organization: z.string().optional(),
            },
        },
        async ({ owner, repo, organization }) =>
            runTool(() => service.forkRepository(owner, repo, organization)),
    );

    server.registerTool(
        "github_repositories_forks_list",
        {
            title: "List Forks",
            description: "List forks of a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ owner, repo, per_page, page }) =>
            runTool(() => service.listForks(owner, repo, per_page, page)),
    );

    server.registerTool(
        "github_repositories_star",
        {
            title: "Star Repository",
            description: "Star a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
            },
        },
        async ({ owner, repo }) => runTool(() => service.starRepository(owner, repo)),
    );

    server.registerTool(
        "github_repositories_unstar",
        {
            title: "Unstar Repository",
            description: "Unstar a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
            },
        },
        async ({ owner, repo }) => runTool(() => service.unstarRepository(owner, repo)),
    );

    server.registerTool(
        "github_repositories_starred_list",
        {
            title: "List Starred Repositories",
            description: "List repositories starred by the authenticated user",
            inputSchema: {
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ per_page, page }) => runTool(() => service.listStarred(per_page, page)),
    );

    server.registerTool(
        "github_releases_list",
        {
            title: "List Releases",
            description: "List releases for a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ owner, repo, per_page, page }) =>
            runTool(() => service.listReleases(owner, repo, per_page, page)),
    );

    server.registerTool(
        "github_releases_get",
        {
            title: "Get Release",
            description: "Get a release by id",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                release_id: z.number().int(),
            },
        },
        async ({ owner, repo, release_id }) =>
            runTool(() => service.getRelease(owner, repo, release_id)),
    );

    server.registerTool(
        "github_releases_latest",
        {
            title: "Get Latest Release",
            description: "Get the latest published release for a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
            },
        },
        async ({ owner, repo }) => runTool(() => service.getLatestRelease(owner, repo)),
    );

    server.registerTool(
        "github_releases_create",
        {
            title: "Create Release",
            description: "Create a new release",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                tag_name: z.string(),
                name: z.string().optional(),
                body: z.string().optional(),
                draft: z.boolean().optional(),
                prerelease: z.boolean().optional(),
                target_commitish: z.string().optional(),
            },
        },
        async ({ owner, repo, ...params }) =>
            runTool(() => service.createRelease(owner, repo, params)),
    );

    server.registerTool(
        "github_tags_list",
        {
            title: "List Tags",
            description: "List tags for a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ owner, repo, per_page, page }) =>
            runTool(() => service.listTags(owner, repo, per_page, page)),
    );

    server.registerTool(
        "github_contributors_list",
        {
            title: "List Contributors",
            description: "List contributors for a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ owner, repo, per_page, page }) =>
            runTool(() => service.listContributors(owner, repo, per_page, page)),
    );
}
