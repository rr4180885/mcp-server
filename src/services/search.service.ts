import { GitHubClient } from "../github/client.js";

export class SearchService {
    constructor(private readonly github: GitHubClient) {}

    searchRepositories(
        q: string,
        params?: {
            sort?: "stars" | "forks" | "help-wanted-issues" | "updated";
            order?: "asc" | "desc";
            per_page?: number;
            page?: number;
        },
    ) {
        return this.github.api.rest.search
            .repos({
                q,
                sort: params?.sort,
                order: params?.order,
                per_page: params?.per_page ?? 30,
                page: params?.page,
            })
            .then((r) => r.data);
    }

    searchIssues(
        q: string,
        params?: {
            sort?: "comments" | "reactions" | "reactions-+1" | "reactions--1" | "reactions-smile" | "reactions-thinking_face" | "reactions-heart" | "reactions-tada" | "interactions" | "created" | "updated";
            order?: "asc" | "desc";
            per_page?: number;
            page?: number;
        },
    ) {
        return this.github.api.rest.search
            .issuesAndPullRequests({
                q,
                sort: params?.sort,
                order: params?.order,
                per_page: params?.per_page ?? 30,
                page: params?.page,
            })
            .then((r) => r.data);
    }

    searchCode(
        q: string,
        params?: {
            sort?: "indexed";
            order?: "asc" | "desc";
            per_page?: number;
            page?: number;
        },
    ) {
        return this.github.api.rest.search
            .code({
                q,
                sort: params?.sort,
                order: params?.order,
                per_page: params?.per_page ?? 30,
                page: params?.page,
            })
            .then((r) => r.data);
    }

    searchUsers(
        q: string,
        params?: {
            sort?: "followers" | "repositories" | "joined";
            order?: "asc" | "desc";
            per_page?: number;
            page?: number;
        },
    ) {
        return this.github.api.rest.search
            .users({
                q,
                sort: params?.sort,
                order: params?.order,
                per_page: params?.per_page ?? 30,
                page: params?.page,
            })
            .then((r) => r.data);
    }
}
