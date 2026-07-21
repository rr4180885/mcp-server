import { GitHubClient } from "../github/client.js";

export class CommitsService {
    constructor(private readonly github: GitHubClient) {}

    listCommits(
        owner: string,
        repo: string,
        params?: {
            sha?: string;
            path?: string;
            author?: string;
            since?: string;
            until?: string;
            per_page?: number;
            page?: number;
        },
    ) {
        return this.github.api.rest.repos
            .listCommits({
                owner,
                repo,
                sha: params?.sha,
                path: params?.path,
                author: params?.author,
                since: params?.since,
                until: params?.until,
                per_page: params?.per_page ?? 30,
                page: params?.page,
            })
            .then((r) => r.data);
    }

    getCommit(owner: string, repo: string, ref: string) {
        return this.github.api.rest.repos
            .getCommit({ owner, repo, ref })
            .then((r) => r.data);
    }

    compareCommits(
        owner: string,
        repo: string,
        base: string,
        head: string,
    ) {
        return this.github.api.rest.repos
            .compareCommits({ owner, repo, base, head })
            .then((r) => r.data);
    }
}
