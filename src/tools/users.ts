import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { UsersService } from "../services/users.service.js";
import { runTool } from "./response.js";

export function registerUsersTools(server: McpServer, service: UsersService): void {
    server.registerTool(
        "github_users_me",
        {
            title: "Get Authenticated User",
            description: "Get the currently authenticated GitHub user (from GITHUB_TOKEN)",
            inputSchema: {},
        },
        async () => runTool(() => service.getAuthenticated()),
    );

    server.registerTool(
        "github_users_get",
        {
            title: "Get User",
            description: "Get a GitHub user by username",
            inputSchema: {
                username: z.string(),
            },
        },
        async ({ username }) => runTool(() => service.getUser(username)),
    );

    server.registerTool(
        "github_users_followers",
        {
            title: "List My Followers",
            description: "List followers of the authenticated user",
            inputSchema: {
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ per_page, page }) => runTool(() => service.listFollowers(per_page, page)),
    );

    server.registerTool(
        "github_users_following",
        {
            title: "List Who I Follow",
            description: "List users the authenticated user is following",
            inputSchema: {
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ per_page, page }) => runTool(() => service.listFollowing(per_page, page)),
    );

    server.registerTool(
        "github_users_follow",
        {
            title: "Follow User",
            description: "Follow a GitHub user",
            inputSchema: {
                username: z.string(),
            },
        },
        async ({ username }) => runTool(() => service.followUser(username)),
    );

    server.registerTool(
        "github_users_unfollow",
        {
            title: "Unfollow User",
            description: "Unfollow a GitHub user",
            inputSchema: {
                username: z.string(),
            },
        },
        async ({ username }) => runTool(() => service.unfollowUser(username)),
    );
}
