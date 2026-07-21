import { GitHubClient } from "../github/client.js";

export class UsersService {
    constructor(private readonly github: GitHubClient) {}

    getAuthenticated() {
        return this.github.api.rest.users.getAuthenticated().then((r) => r.data);
    }

    getUser(username: string) {
        return this.github.api.rest.users
            .getByUsername({ username })
            .then((r) => r.data);
    }

    listFollowers(per_page = 30, page?: number) {
        return this.github.api.rest.users
            .listFollowersForAuthenticatedUser({ per_page, page })
            .then((r) => r.data);
    }

    listFollowing(per_page = 30, page?: number) {
        return this.github.api.rest.users
            .listFollowedByAuthenticatedUser({ per_page, page })
            .then((r) => r.data);
    }

    followUser(username: string) {
        return this.github.api.rest.users
            .follow({ username })
            .then(() => ({ following: true, username }));
    }

    unfollowUser(username: string) {
        return this.github.api.rest.users
            .unfollow({ username })
            .then(() => ({ following: false, username }));
    }
}
