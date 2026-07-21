import { createHttpServer } from "./http/server.js";

const app = createHttpServer();

app.listen(3000, () => {
    console.log("🚀 Server listening on http://localhost:3000");
});