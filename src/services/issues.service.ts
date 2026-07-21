import { GitHubClient } from "../github/client.js";

export class IssuesService {
    constructor(private readonly github: GitHubClient) {}

    listIssues(
        owner: string,
        repo: string,
        params?: {
            state?: "open" | "closed" | "all";
            labels?: string;
            sort?: "created" | "updated" | "comments";
            direction?: "asc" | "desc";
            assignee?: string;
            creator?: string;
            mentioned?: string;
            milestone?: string;
            per_page?: number;
            page?: number;
        },
    ) {
        return this.github.api.rest.issues
            .listForRepo({
                owner,
                repo,
                state: params?.state ?? "open",
                labels: params?.labels,
                sort: params?.sort,
                direction: params?.direction,
                assignee: params?.assignee,
                creator: params?.creator,
                mentioned: params?.mentioned,
                milestone: params?.milestone,
                per_page: params?.per_page ?? 30,
                page: params?.page,
            })
            .then((r) => r.data);
    }

    listMyIssues(params?: {
        filter?: "assigned" | "created" | "mentioned" | "subscribed" | "repos" | "all";
        state?: "open" | "closed" | "all";
        labels?: string;
        sort?: "created" | "updated" | "comments";
        direction?: "asc" | "desc";
        per_page?: number;
        page?: number;
    }) {
        return this.github.api.rest.issues
            .listForAuthenticatedUser({
                filter: params?.filter ?? "all",
                state: params?.state ?? "open",
                labels: params?.labels,
                sort: params?.sort,
                direction: params?.direction,
                per_page: params?.per_page ?? 30,
                page: params?.page,
            })
            .then((r) => r.data);
    }

    getIssue(owner: string, repo: string, issue_number: number) {
        return this.github.api.rest.issues
            .get({ owner, repo, issue_number })
            .then((r) => r.data);
    }

    createIssue(
        owner: string,
        repo: string,
        params: {
            title: string;
            body?: string;
            assignees?: string[];
            labels?: string[];
            milestone?: number;
        },
    ) {
        return this.github.api.rest.issues
            .create({ owner, repo, ...params })
            .then((r) => r.data);
    }

    updateIssue(
        owner: string,
        repo: string,
        issue_number: number,
        params: {
            title?: string;
            body?: string;
            state?: "open" | "closed";
            state_reason?: "completed" | "not_planned" | "reopened" | null;
            assignees?: string[];
            labels?: string[];
            milestone?: number | null;
        },
    ) {
        return this.github.api.rest.issues
            .update({ owner, repo, issue_number, ...params })
            .then((r) => r.data);
    }

    listComments(
        owner: string,
        repo: string,
        issue_number: number,
        per_page = 30,
        page?: number,
    ) {
        return this.github.api.rest.issues
            .listComments({ owner, repo, issue_number, per_page, page })
            .then((r) => r.data);
    }

    createComment(
        owner: string,
        repo: string,
        issue_number: number,
        body: string,
    ) {
        return this.github.api.rest.issues
            .createComment({ owner, repo, issue_number, body })
            .then((r) => r.data);
    }

    updateComment(
        owner: string,
        repo: string,
        comment_id: number,
        body: string,
    ) {
        return this.github.api.rest.issues
            .updateComment({ owner, repo, comment_id, body })
            .then((r) => r.data);
    }

    deleteComment(owner: string, repo: string, comment_id: number) {
        return this.github.api.rest.issues
            .deleteComment({ owner, repo, comment_id })
            .then(() => ({ deleted: true, comment_id }));
    }

    addLabels(
        owner: string,
        repo: string,
        issue_number: number,
        labels: string[],
    ) {
        return this.github.api.rest.issues
            .addLabels({ owner, repo, issue_number, labels })
            .then((r) => r.data);
    }

    removeLabel(
        owner: string,
        repo: string,
        issue_number: number,
        name: string,
    ) {
        return this.github.api.rest.issues
            .removeLabel({ owner, repo, issue_number, name })
            .then((r) => r.data);
    }

    listLabels(owner: string, repo: string, per_page = 30, page?: number) {
        return this.github.api.rest.issues
            .listLabelsForRepo({ owner, repo, per_page, page })
            .then((r) => r.data);
    }
}
