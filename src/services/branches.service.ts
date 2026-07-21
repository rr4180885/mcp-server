import { GitHubClient } from "../github/client.js";

export class BranchesService {
    constructor(private readonly github: GitHubClient) {}

    listBranches(owner: string, repo: string, per_page = 30, page?: number) {
        return this.github.api.rest.repos
            .listBranches({ owner, repo, per_page, page })
            .then((r) => r.data);
    }

    getBranch(owner: string, repo: string, branch: string) {
        return this.github.api.rest.repos
            .getBranch({ owner, repo, branch })
            .then((r) => r.data);
    }

    createBranch(
        owner: string,
        repo: string,
        branch: string,
        from_sha: string,
    ) {
        return this.github.api.rest.git
            .createRef({
                owner,
                repo,
                ref: `refs/heads/${branch}`,
                sha: from_sha,
            })
            .then((r) => r.data);
    }

    deleteBranch(owner: string, repo: string, branch: string) {
        return this.github.api.rest.git
            .deleteRef({
                owner,
                repo,
                ref: `heads/${branch}`,
            })
            .then(() => ({ deleted: true, owner, repo, branch }));
    }

    renameBranch(
        owner: string,
        repo: string,
        branch: string,
        new_name: string,
    ) {
        return this.github.api.rest.repos
            .renameBranch({ owner, repo, branch, new_name })
            .then((r) => r.data);
    }

    getRef(owner: string, repo: string, ref: string) {
        return this.github.api.rest.git
            .getRef({ owner, repo, ref })
            .then((r) => r.data);
    }
}
