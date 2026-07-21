import { GitHubClient } from "../github/client.js";

export class ActionsService {
    constructor(private readonly github: GitHubClient) {}

    listWorkflows(owner: string, repo: string, per_page = 30, page?: number) {
        return this.github.api.rest.actions
            .listRepoWorkflows({ owner, repo, per_page, page })
            .then((r) => r.data);
    }

    listWorkflowRuns(
        owner: string,
        repo: string,
        params?: {
            workflow_id?: string | number;
            branch?: string;
            status?:
                | "completed"
                | "action_required"
                | "cancelled"
                | "failure"
                | "neutral"
                | "skipped"
                | "stale"
                | "success"
                | "timed_out"
                | "in_progress"
                | "queued"
                | "requested"
                | "waiting"
                | "pending";
            per_page?: number;
            page?: number;
        },
    ) {
        if (params?.workflow_id !== undefined) {
            return this.github.api.rest.actions
                .listWorkflowRuns({
                    owner,
                    repo,
                    workflow_id: params.workflow_id,
                    branch: params.branch,
                    status: params.status,
                    per_page: params.per_page ?? 30,
                    page: params.page,
                })
                .then((r) => r.data);
        }

        return this.github.api.rest.actions
            .listWorkflowRunsForRepo({
                owner,
                repo,
                branch: params?.branch,
                status: params?.status,
                per_page: params?.per_page ?? 30,
                page: params?.page,
            })
            .then((r) => r.data);
    }

    getWorkflowRun(owner: string, repo: string, run_id: number) {
        return this.github.api.rest.actions
            .getWorkflowRun({ owner, repo, run_id })
            .then((r) => r.data);
    }

    triggerWorkflow(
        owner: string,
        repo: string,
        workflow_id: string | number,
        ref: string,
        inputs?: Record<string, string>,
    ) {
        return this.github.api.rest.actions
            .createWorkflowDispatch({
                owner,
                repo,
                workflow_id,
                ref,
                inputs,
            })
            .then(() => ({
                triggered: true,
                owner,
                repo,
                workflow_id,
                ref,
                inputs: inputs ?? {},
            }));
    }

    cancelWorkflowRun(owner: string, repo: string, run_id: number) {
        return this.github.api.rest.actions
            .cancelWorkflowRun({ owner, repo, run_id })
            .then(() => ({ cancelled: true, run_id }));
    }

    rerunWorkflow(owner: string, repo: string, run_id: number) {
        return this.github.api.rest.actions
            .reRunWorkflow({ owner, repo, run_id })
            .then(() => ({ rerun: true, run_id }));
    }

    listJobsForRun(owner: string, repo: string, run_id: number) {
        return this.github.api.rest.actions
            .listJobsForWorkflowRun({ owner, repo, run_id })
            .then((r) => r.data);
    }
}
