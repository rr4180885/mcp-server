import express from "express";
import type { Express } from "express";
import { handleMcpRequest, handleMcpSessionRequest } from "./mcp.js";

export function createHttpServer(): Express {
    const app = express();

    app.use(express.json());

    app.get("/health", (_req, res) => {
        res.status(200).json({
            status: "ok",
            service: "github-mcp-server",
        });
    });

    app.post("/mcp", handleMcpRequest);
    app.get("/mcp", handleMcpSessionRequest);
    app.delete("/mcp", handleMcpSessionRequest);

    return app;
}