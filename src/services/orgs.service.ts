import { GitHubClient } from "../github/client.js";

export class OrgsService {
    constructor(private readonly github: GitHubClient) {}

    listOrgs(per_page = 30, page?: number) {
        return this.github.api.rest.orgs
            .listForAuthenticatedUser({ per_page, page })
            .then((r) => r.data);
    }

    getOrg(org: string) {
        return this.github.api.rest.orgs.get({ org }).then((r) => r.data);
    }

    listOrgRepos(
        org: string,
        params?: {
            type?: "all" | "public" | "private" | "forks" | "sources" | "member";
            sort?: "created" | "updated" | "pushed" | "full_name";
            direction?: "asc" | "desc";
            per_page?: number;
            page?: number;
        },
    ) {
        return this.github.api.rest.repos
            .listForOrg({
                org,
                type: params?.type,
                sort: params?.sort,
                direction: params?.direction,
                per_page: params?.per_page ?? 30,
                page: params?.page,
            })
            .then((r) => r.data);
    }

    listMembers(org: string, per_page = 30, page?: number) {
        return this.github.api.rest.orgs
            .listMembers({ org, per_page, page })
            .then((r) => r.data);
    }
}
