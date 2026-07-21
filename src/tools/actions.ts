import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ActionsService } from "../services/actions.service.js";
import { runTool } from "./response.js";

const workflowStatus = z.enum([
    "completed",
    "action_required",
    "cancelled",
    "failure",
    "neutral",
    "skipped",
    "stale",
    "success",
    "timed_out",
    "in_progress",
    "queued",
    "requested",
    "waiting",
    "pending",
]);

export function registerActionsTools(
    server: McpServer,
    service: ActionsService,
): void {
    server.registerTool(
        "github_actions_workflows_list",
        {
            title: "List Workflows",
            description: "List GitHub Actions workflows in a repository",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ owner, repo, per_page, page }) =>
            runTool(() => service.listWorkflows(owner, repo, per_page, page)),
    );

    server.registerTool(
        "github_actions_runs_list",
        {
            title: "List Workflow Runs",
            description: "List workflow runs for a repository (optionally filter by workflow id)",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                workflow_id: z.union([z.string(), z.number()]).optional(),
                branch: z.string().optional(),
                status: workflowStatus.optional(),
                per_page: z.number().int().min(1).max(100).optional(),
                page: z.number().int().min(1).optional(),
            },
        },
        async ({ owner, repo, ...params }) =>
            runTool(() => service.listWorkflowRuns(owner, repo, params)),
    );

    server.registerTool(
        "github_actions_runs_get",
        {
            title: "Get Workflow Run",
            description: "Get a workflow run by id",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                run_id: z.number().int(),
            },
        },
        async ({ owner, repo, run_id }) =>
            runTool(() => service.getWorkflowRun(owner, repo, run_id)),
    );

    server.registerTool(
        "github_actions_workflow_dispatch",
        {
            title: "Trigger Workflow",
            description: "Trigger a workflow_dispatch event",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                workflow_id: z.union([z.string(), z.number()]).describe("Workflow file name or id"),
                ref: z.string().describe("Git ref (branch or tag) to run on"),
                inputs: z.record(z.string(), z.string()).optional(),
            },
        },
        async ({ owner, repo, workflow_id, ref, inputs }) =>
            runTool(() => service.triggerWorkflow(owner, repo, workflow_id, ref, inputs)),
    );

    server.registerTool(
        "github_actions_runs_cancel",
        {
            title: "Cancel Workflow Run",
            description: "Cancel a workflow run",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                run_id: z.number().int(),
            },
        },
        async ({ owner, repo, run_id }) =>
            runTool(() => service.cancelWorkflowRun(owner, repo, run_id)),
    );

    server.registerTool(
        "github_actions_runs_rerun",
        {
            title: "Rerun Workflow",
            description: "Re-run a workflow run",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                run_id: z.number().int(),
            },
        },
        async ({ owner, repo, run_id }) =>
            runTool(() => service.rerunWorkflow(owner, repo, run_id)),
    );

    server.registerTool(
        "github_actions_jobs_list",
        {
            title: "List Jobs For Run",
            description: "List jobs for a workflow run",
            inputSchema: {
                owner: z.string(),
                repo: z.string(),
                run_id: z.number().int(),
            },
        },
        async ({ owner, repo, run_id }) =>
            runTool(() => service.listJobsForRun(owner, repo, run_id)),
    );
}
