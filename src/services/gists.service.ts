import { GitHubClient } from "../github/client.js";

export class GistsService {
    constructor(private readonly github: GitHubClient) {}

    listGists(per_page = 30, page?: number) {
        return this.github.api.rest.gists
            .list({ per_page, page })
            .then((r) => r.data);
    }

    getGist(gist_id: string) {
        return this.github.api.rest.gists
            .get({ gist_id })
            .then((r) => r.data);
    }

    createGist(params: {
        description?: string;
        public?: boolean;
        files: Record<string, { content: string }>;
    }) {
        return this.github.api.rest.gists
            .create({
                description: params.description,
                public: params.public ?? false,
                files: params.files,
            })
            .then((r) => r.data);
    }

    updateGist(
        gist_id: string,
        params: {
            description?: string;
            files?: Record<string, { content?: string; filename?: string } | null>;
        },
    ) {
        return this.github.api.rest.gists
            .update({
                gist_id,
                description: params.description,
                files: params.files as
                    | { [key: string]: { content?: string; filename?: string | null } }
                    | undefined,
            })
            .then((r) => r.data);
    }

    deleteGist(gist_id: string) {
        return this.github.api.rest.gists
            .delete({ gist_id })
            .then(() => ({ deleted: true, gist_id }));
    }
}
