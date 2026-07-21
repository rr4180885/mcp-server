import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GitHubClient } from "./github/client.js";
import { RepositoryService } from "./services/repository.service.js";
import { IssuesService } from "./services/issues.service.js";
import { PullsService } from "./services/pulls.service.js";
import { ContentsService } from "./services/contents.service.js";
import { BranchesService } from "./services/branches.service.js";
import { CommitsService } from "./services/commits.service.js";
import { SearchService } from "./services/search.service.js";
import { UsersService } from "./services/users.service.js";
import { GistsService } from "./services/gists.service.js";
import { ActionsService } from "./services/actions.service.js";
import { NotificationsService } from "./services/notifications.service.js";
import { OrgsService } from "./services/orgs.service.js";
import { registerRepositoryTools } from "./tools/repositories.js";
import { registerIssuesTools } from "./tools/issues.js";
import { registerPullsTools } from "./tools/pulls.js";
import { registerContentsTools } from "./tools/contents.js";
import { registerBranchesTools } from "./tools/branches.js";
import { registerCommitsTools } from "./tools/commits.js";
import { registerSearchTools } from "./tools/search.js";
import { registerUsersTools } from "./tools/users.js";
import { registerGistsTools } from "./tools/gists.js";
import { registerActionsTools } from "./tools/actions.js";
import { registerNotificationsTools } from "./tools/notifications.js";
import { registerOrgsTools } from "./tools/orgs.js";

export function createGithubMcpServer() {
    const server = new McpServer({
        name: "github-mcp-server",
        version: "1.0.0",
    });

    const github = new GitHubClient();

    registerRepositoryTools(server, new RepositoryService(github));
    registerIssuesTools(server, new IssuesService(github));
    registerPullsTools(server, new PullsService(github));
    registerContentsTools(server, new ContentsService(github));
    registerBranchesTools(server, new BranchesService(github));
    registerCommitsTools(server, new CommitsService(github));
    registerSearchTools(server, new SearchService(github));
    registerUsersTools(server, new UsersService(github));
    registerGistsTools(server, new GistsService(github));
    registerActionsTools(server, new ActionsService(github));
    registerNotificationsTools(server, new NotificationsService(github));
    registerOrgsTools(server, new OrgsService(github));

    return server;
}
