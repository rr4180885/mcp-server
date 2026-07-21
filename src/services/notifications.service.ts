import { GitHubClient } from "../github/client.js";

export class NotificationsService {
    constructor(private readonly github: GitHubClient) {}

    listNotifications(params?: {
        all?: boolean;
        participating?: boolean;
        since?: string;
        before?: string;
        per_page?: number;
        page?: number;
    }) {
        return this.github.api.rest.activity
            .listNotificationsForAuthenticatedUser({
                all: params?.all,
                participating: params?.participating,
                since: params?.since,
                before: params?.before,
                per_page: params?.per_page ?? 30,
                page: params?.page,
            })
            .then((r) => r.data);
    }

    markAsRead(last_read_at?: string) {
        return this.github.api.rest.activity
            .markNotificationsAsRead({ last_read_at })
            .then(() => ({ marked_as_read: true, last_read_at: last_read_at ?? null }));
    }

    markThreadAsRead(thread_id: number) {
        return this.github.api.rest.activity
            .markThreadAsRead({ thread_id })
            .then(() => ({ marked_as_read: true, thread_id }));
    }

    getThread(thread_id: number) {
        return this.github.api.rest.activity
            .getThread({ thread_id })
            .then((r) => r.data);
    }
}
