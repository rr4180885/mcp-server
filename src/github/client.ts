import { Octokit } from "@octokit/rest";
import { env } from "../config/env.js";

export class GitHubClient {
    private readonly octokit: Octokit;

    constructor() {
        if (!env.githubToken) {
            throw new Error(
                "GITHUB_TOKEN is not set. Add it to your .env file so the MCP server can call the GitHub API.",
            );
        }

        this.octokit = new Octokit({ auth: env.githubToken });
    }

    get api(): Octokit {
        return this.octokit;
    }
}
