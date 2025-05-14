import { Hono } from "hono";
import { handle } from "hono/vercel";
import user from "./user";
import product from "./product";

const app = new Hono().basePath("/api");

app.route("/user", user);
app.route("/product", product);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof app;
