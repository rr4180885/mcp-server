import type { Request, Response } from "express";
import { randomUUID } from "crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";

import { createGithubMcpServer } from "../server.js";

const transports: Record<string, StreamableHTTPServerTransport> = {};

function log(req: Request, extra?: string) {
    const sessionId = req.headers["mcp-session-id"];
    console.log(
        `[mcp] ${req.method} ${req.path} session=${sessionId ?? "-"} bodyMethod=${(req.body as { method?: string })?.method ?? "-"} ${extra ?? ""}`,
    );
}

export async function handleMcpRequest(req: Request, res: Response) {
    log(req);
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    try {
        let transport: StreamableHTTPServerTransport;

        if (sessionId && transports[sessionId]) {
            transport = transports[sessionId];
        } else if (!sessionId && isInitializeRequest(req.body)) {
            transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: () => randomUUID(),
                enableJsonResponse: true,
                onsessioninitialized: (id) => {
                    transports[id] = transport;
                    console.log(`[mcp] session initialized: ${id}`);
                },
            });

            transport.onclose = async () => {
                if (transport.sessionId) {
                    console.log(`[mcp] session closed: ${transport.sessionId}`);
                    delete transports[transport.sessionId];
                }
            };

            const server = createGithubMcpServer();
            await server.connect(transport);
            console.log("[mcp] server connected with registered tools");
        } else {
            res.status(sessionId ? 404 : 400).json({
                jsonrpc: "2.0",
                id: (req.body as { id?: unknown })?.id ?? null,
                error: {
                    code: -32000,
                    message: sessionId
                        ? "Session not found. Re-initialize the MCP connection."
                        : "Bad Request: invalid or missing MCP session",
                },
            });
            return;
        }

        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error("[mcp] POST error:", error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: "2.0",
                id: null,
                error: {
                    code: -32603,
                    message: error instanceof Error ? error.message : "Internal error",
                },
            });
        }
    }
}

/** GET (SSE stream) and DELETE (session close) for an existing MCP session */
export async function handleMcpSessionRequest(req: Request, res: Response) {
    log(req);
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    if (!sessionId || !transports[sessionId]) {
        // Cursor opens an SSE stream after connect; 404 is the protocol-correct
        // response for unknown sessions and forces a clean re-initialize.
        res.status(404).send("Session not found");
        return;
    }

    try {
        await transports[sessionId].handleRequest(req, res);
    } catch (error) {
        console.error("[mcp] session request error:", error);
        if (!res.headersSent) {
            res.status(500).send("Internal error");
        }
    }
}
