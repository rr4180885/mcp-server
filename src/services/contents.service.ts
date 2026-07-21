import { GitHubClient } from "../github/client.js";

export class ContentsService {
    constructor(private readonly github: GitHubClient) {}

    getContent(
        owner: string,
        repo: string,
        path: string,
        ref?: string,
    ) {
        return this.github.api.rest.repos
            .getContent({ owner, repo, path, ref })
            .then((r) => {
                const data = r.data;
                if (Array.isArray(data)) {
                    return data.map((item) => ({
                        name: item.name,
                        path: item.path,
                        type: item.type,
                        size: item.size,
                        sha: item.sha,
                        url: item.html_url,
                    }));
                }

                if (data.type === "file" && "content" in data && data.encoding === "base64") {
                    const decoded = Buffer.from(data.content, "base64").toString("utf8");
                    return {
                        name: data.name,
                        path: data.path,
                        sha: data.sha,
                        size: data.size,
                        encoding: "utf-8",
                        content: decoded,
                        html_url: data.html_url,
                        download_url: data.download_url,
                    };
                }

                return data;
            });
    }

    createOrUpdateFile(
        owner: string,
        repo: string,
        path: string,
        params: {
            message: string;
            content: string;
            sha?: string;
            branch?: string;
            committer?: { name: string; email: string };
            author?: { name: string; email: string };
        },
    ) {
        const content = Buffer.from(params.content, "utf8").toString("base64");
        return this.github.api.rest.repos
            .createOrUpdateFileContents({
                owner,
                repo,
                path,
                message: params.message,
                content,
                sha: params.sha,
                branch: params.branch,
                committer: params.committer,
                author: params.author,
            })
            .then((r) => r.data);
    }

    deleteFile(
        owner: string,
        repo: string,
        path: string,
        params: {
            message: string;
            sha: string;
            branch?: string;
        },
    ) {
        return this.github.api.rest.repos
            .deleteFile({
                owner,
                repo,
                path,
                message: params.message,
                sha: params.sha,
                branch: params.branch,
            })
            .then((r) => r.data);
    }
}
