import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { NotificationsService } from "../services/notifications.service.js";
import { runTool } from "./response.js";

export function registerNotificationsTools(
    server: McpServer,
    service: NotificationsService,
): void {
    server.registerTool(
        "github_notifications_list",
        {
            title: "List Notifications",
            description: "List GitHub notifications for the authenticated user",
            inputSchema: {
                all: z.boolean().optional(),
                participating: z.boolean().optional(),
                since: z.string().optional(),
                before: z.string().optional(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async (args) => runTool(() => service.listNotifications(args)),
    );

    server.registerTool(
        "github_notifications_mark_read",
        {
            title: "Mark Notifications Read",
            description: "Mark all notifications as read",
            inputSchema: {
                last_read_at: z.string().optional().describe("ISO 8601 timestamp"),
            },
        },
        async ({ last_read_at }) => runTool(() => service.markAsRead(last_read_at)),
    );

    server.registerTool(
        "github_notifications_thread_get",
        {
            title: "Get Notification Thread",
            description: "Get a notification thread by id",
            inputSchema: {
                thread_id: z.number().int(),
            },
        },
        async ({ thread_id }) => runTool(() => service.getThread(thread_id)),
    );

    server.registerTool(
        "github_notifications_thread_mark_read",
        {
            title: "Mark Thread Read",
            description: "Mark a notification thread as read",
            inputSchema: {
                thread_id: z.number().int(),
            },
        },
        async ({ thread_id }) => runTool(() => service.markThreadAsRead(thread_id)),
    );
}
