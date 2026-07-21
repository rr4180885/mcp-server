import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { OrgsService } from "../services/orgs.service.js";
import { runTool } from "./response.js";

export function registerOrgsTools(server: McpServer, service: OrgsService): void {
    server.registerTool(
        "github_orgs_list",
        {
            title: "List My Organizations",
            description: "List organizations for the authenticated user",
            inputSchema: {
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ per_page, page }) => runTool(() => service.listOrgs(per_page, page)),
    );

    server.registerTool(
        "github_orgs_get",
        {
            title: "Get Organization",
            description: "Get an organization by login",
            inputSchema: {
                org: z.string(),
            },
        },
        async ({ org }) => runTool(() => service.getOrg(org)),
    );

    server.registerTool(
        "github_orgs_repos_list",
        {
            title: "List Organization Repos",
            description: "List repositories for an organization",
            inputSchema: {
                org: z.string(),
                type: z
                    .enum(["all", "public", "private", "forks", "sources", "member"])
                    .optional(),
                sort: z.enum(["created", "updated", "pushed", "full_name"]).optional(),
                direction: z.enum(["asc", "desc"]).optional(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ org, ...params }) => runTool(() => service.listOrgRepos(org, params)),
    );

    server.registerTool(
        "github_orgs_members_list",
        {
            title: "List Organization Members",
            description: "List public members of an organization",
            inputSchema: {
                org: z.string(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ org, per_page, page }) =>
            runTool(() => service.listMembers(org, per_page, page)),
    );
}
