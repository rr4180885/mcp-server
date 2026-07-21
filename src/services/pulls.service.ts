import { GitHubClient } from "../github/client.js";

export class PullsService {
    constructor(private readonly github: GitHubClient) {}

    listPulls(
        owner: string,
        repo: string,
        params?: {
            state?: "open" | "closed" | "all";
            head?: string;
            base?: string;
            sort?: "created" | "updated" | "popularity" | "long-running";
            direction?: "asc" | "desc";
            per_page?: number;
            page?: number;
        },
    ) {
        return this.github.api.rest.pulls
            .list({
                owner,
                repo,
                state: params?.state ?? "open",
                head: params?.head,
                base: params?.base,
                sort: params?.sort,
                direction: params?.direction,
                per_page: params?.per_page ?? 30,
                page: params?.page,
            })
            .then((r) => r.data);
    }

    getPull(owner: string, repo: string, pull_number: number) {
        return this.github.api.rest.pulls
            .get({ owner, repo, pull_number })
            .then((r) => r.data);
    }

    createPull(
        owner: string,
        repo: string,
        params: {
            title: string;
            head: string;
            base: string;
            body?: string;
            draft?: boolean;
            maintainer_can_modify?: boolean;
        },
    ) {
        return this.github.api.rest.pulls
            .create({ owner, repo, ...params })
            .then((r) => r.data);
    }

    updatePull(
        owner: string,
        repo: string,
        pull_number: number,
        params: {
            title?: string;
            body?: string;
            state?: "open" | "closed";
            base?: string;
            maintainer_can_modify?: boolean;
        },
    ) {
        return this.github.api.rest.pulls
            .update({ owner, repo, pull_number, ...params })
            .then((r) => r.data);
    }

    mergePull(
        owner: string,
        repo: string,
        pull_number: number,
        params?: {
            commit_title?: string;
            commit_message?: string;
            merge_method?: "merge" | "squash" | "rebase";
        },
    ) {
        return this.github.api.rest.pulls
            .merge({ owner, repo, pull_number, ...params })
            .then((r) => r.data);
    }

    listFiles(
        owner: string,
        repo: string,
        pull_number: number,
        per_page = 100,
        page?: number,
    ) {
        return this.github.api.rest.pulls
            .listFiles({ owner, repo, pull_number, per_page, page })
            .then((r) => r.data);
    }

    listCommits(
        owner: string,
        repo: string,
        pull_number: number,
        per_page = 30,
        page?: number,
    ) {
        return this.github.api.rest.pulls
            .listCommits({ owner, repo, pull_number, per_page, page })
            .then((r) => r.data);
    }

    listReviews(owner: string, repo: string, pull_number: number) {
        return this.github.api.rest.pulls
            .listReviews({ owner, repo, pull_number })
            .then((r) => r.data);
    }

    createReview(
        owner: string,
        repo: string,
        pull_number: number,
        params: {
            body?: string;
            event?: "APPROVE" | "REQUEST_CHANGES" | "COMMENT";
            commit_id?: string;
        },
    ) {
        return this.github.api.rest.pulls
            .createReview({ owner, repo, pull_number, ...params })
            .then((r) => r.data);
    }

    listReviewComments(
        owner: string,
        repo: string,
        pull_number: number,
        per_page = 30,
        page?: number,
    ) {
        return this.github.api.rest.pulls
            .listReviewComments({ owner, repo, pull_number, per_page, page })
            .then((r) => r.data);
    }

    requestReviewers(
        owner: string,
        repo: string,
        pull_number: number,
        reviewers: string[],
        team_reviewers?: string[],
    ) {
        return this.github.api.rest.pulls
            .requestReviewers({
                owner,
                repo,
                pull_number,
                reviewers,
                team_reviewers,
            })
            .then((r) => r.data);
    }

    checkMerged(owner: string, repo: string, pull_number: number) {
        return this.github.api.rest.pulls
            .checkIfMerged({ owner, repo, pull_number })
            .then(() => ({ merged: true, owner, repo, pull_number }))
            .catch((error: { status?: number }) => {
                if (error.status === 404) {
                    return { merged: false, owner, repo, pull_number };
                }
                throw error;
            });
    }
}
