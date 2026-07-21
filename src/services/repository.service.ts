import { GitHubClient } from "../github/client.js";

export class RepositoryService {
    constructor(private readonly github: GitHubClient) {}

    listRepositories(params?: {
        visibility?: "all" | "public" | "private";
        affiliation?: string;
        type?: "all" | "owner" | "public" | "private" | "member";
        sort?: "created" | "updated" | "pushed" | "full_name";
        direction?: "asc" | "desc";
        per_page?: number;
        page?: number;
    }) {
        return this.github.api.rest.repos
            .listForAuthenticatedUser({
                visibility: params?.visibility,
                affiliation: params?.affiliation,
                type: params?.type,
                sort: params?.sort ?? "updated",
                direction: params?.direction,
                per_page: params?.per_page ?? 100,
                page: params?.page,
            })
            .then((r) => r.data);
    }

    getRepository(owner: string, repo: string) {
        return this.github.api.rest.repos
            .get({ owner, repo })
            .then((r) => r.data);
    }

    createRepository(params: {
        name: string;
        description?: string;
        private?: boolean;
        homepage?: string;
        auto_init?: boolean;
        gitignore_template?: string;
        license_template?: string;
    }) {
        return this.github.api.rest.repos
            .createForAuthenticatedUser(params)
            .then((r) => r.data);
    }

    updateRepository(
        owner: string,
        repo: string,
        params: {
            name?: string;
            description?: string;
            homepage?: string;
            private?: boolean;
            has_issues?: boolean;
            has_projects?: boolean;
            has_wiki?: boolean;
            default_branch?: string;
            archived?: boolean;
        },
    ) {
        return this.github.api.rest.repos
            .update({ owner, repo, ...params })
            .then((r) => r.data);
    }

    deleteRepository(owner: string, repo: string) {
        return this.github.api.rest.repos
            .delete({ owner, repo })
            .then(() => ({ deleted: true, owner, repo }));
    }

    listLanguages(owner: string, repo: string) {
        return this.github.api.rest.repos
            .listLanguages({ owner, repo })
            .then((r) => r.data);
    }

    listTopics(owner: string, repo: string) {
        return this.github.api.rest.repos
            .getAllTopics({ owner, repo })
            .then((r) => r.data);
    }

    replaceTopics(owner: string, repo: string, names: string[]) {
        return this.github.api.rest.repos
            .replaceAllTopics({ owner, repo, names })
            .then((r) => r.data);
    }

    forkRepository(owner: string, repo: string, organization?: string) {
        return this.github.api.rest.repos
            .createFork({ owner, repo, organization })
            .then((r) => r.data);
    }

    listForks(owner: string, repo: string, per_page = 30, page?: number) {
        return this.github.api.rest.repos
            .listForks({ owner, repo, per_page, page })
            .then((r) => r.data);
    }

    starRepository(owner: string, repo: string) {
        return this.github.api.rest.activity
            .starRepoForAuthenticatedUser({ owner, repo })
            .then(() => ({ starred: true, owner, repo }));
    }

    unstarRepository(owner: string, repo: string) {
        return this.github.api.rest.activity
            .unstarRepoForAuthenticatedUser({ owner, repo })
            .then(() => ({ starred: false, owner, repo }));
    }

    listStarred(per_page = 30, page?: number) {
        return this.github.api.rest.activity
            .listReposStarredByAuthenticatedUser({ per_page, page })
            .then((r) => r.data);
    }

    listReleases(owner: string, repo: string, per_page = 30, page?: number) {
        return this.github.api.rest.repos
            .listReleases({ owner, repo, per_page, page })
            .then((r) => r.data);
    }

    getRelease(owner: string, repo: string, release_id: number) {
        return this.github.api.rest.repos
            .getRelease({ owner, repo, release_id })
            .then((r) => r.data);
    }

    getLatestRelease(owner: string, repo: string) {
        return this.github.api.rest.repos
            .getLatestRelease({ owner, repo })
            .then((r) => r.data);
    }

    createRelease(
        owner: string,
        repo: string,
        params: {
            tag_name: string;
            name?: string;
            body?: string;
            draft?: boolean;
            prerelease?: boolean;
            target_commitish?: string;
        },
    ) {
        return this.github.api.rest.repos
            .createRelease({ owner, repo, ...params })
            .then((r) => r.data);
    }

    listTags(owner: string, repo: string, per_page = 30, page?: number) {
        return this.github.api.rest.repos
            .listTags({ owner, repo, per_page, page })
            .then((r) => r.data);
    }

    listContributors(owner: string, repo: string, per_page = 30, page?: number) {
        return this.github.api.rest.repos
            .listContributors({ owner, repo, per_page, page })
            .then((r) => r.data);
    }
}
