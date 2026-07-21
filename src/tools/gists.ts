import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GistsService } from "../services/gists.service.js";
import { runTool } from "./response.js";

export function registerGistsTools(server: McpServer, service: GistsService): void {
    server.registerTool(
        "github_gists_list",
        {
            title: "List Gists",
            description: "List gists for the authenticated user",
            inputSchema: {
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ per_page, page }) => runTool(() => service.listGists(per_page, page)),
    );

    server.registerTool(
        "github_gists_get",
        {
            title: "Get Gist",
            description: "Get a gist by id",
            inputSchema: {
                gist_id: z.string(),
            },
        },
        async ({ gist_id }) => runTool(() => service.getGist(gist_id)),
    );

    server.registerTool(
        "github_gists_create",
        {
            title: "Create Gist",
            description: "Create a gist. files is a map of filename -> { content }",
            inputSchema: {
                description: z.string().optional(),
                public: z.boolean().optional(),
                files: z.record(z.string(), z.object({ content: z.string() })),
            },
        },
        async (args) => runTool(() => service.createGist(args)),
    );

    server.registerTool(
        "github_gists_update",
        {
            title: "Update Gist",
            description: "Update a gist. Pass null for a file value to delete it.",
            inputSchema: {
                gist_id: z.string(),
                description: z.string().optional(),
                files: z
                    .record(
                        z.string(),
                        z
                            .object({
                                content: z.string().optional(),
                                filename: z.string().optional(),
                            })
                            .nullable(),
                    )
                    .optional(),
            },
        },
        async ({ gist_id, ...params }) => runTool(() => service.updateGist(gist_id, params)),
    );

    server.registerTool(
        "github_gists_delete",
        {
            title: "Delete Gist",
            description: "Delete a gist",
            inputSchema: {
                gist_id: z.string(),
            },
        },
        async ({ gist_id }) => runTool(() => service.deleteGist(gist_id)),
    );
}
