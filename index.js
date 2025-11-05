import express from "express";
import fs from "fs";
import path from "path";

const __dirname = process.cwd();
const app = express();

const DEFAULT_LIMIT = 50;

const sleepFn = (ms) => new Promise(r => setTimeout(r, ms || 0));

const parseQuery = (req) => {
  const limit = Number(req.query.limit ?? DEFAULT_LIMIT);
  const skip = Number(req.query.skip ?? 0);
  const sleep = Number(req.query.sleep ?? 0);
  return { limit, skip, sleep };
};

// ---- LOAD JSON DATA ----
const POSTS = JSON.parse(fs.readFileSync(path.join(__dirname, "data/posts.json"), "utf-8"));
const TODOS = JSON.parse(fs.readFileSync(path.join(__dirname, "data/todos.json"), "utf-8"));
const PROFILES = JSON.parse(fs.readFileSync(path.join(__dirname, "data/users.json"), "utf-8"));

// ---- LIST ENDPOINTS ----

app.get("/api/posts", async (req, res) => {
  const { limit, skip, sleep } = parseQuery(req);
  const slice = POSTS.slice(skip, skip + limit);
  await sleepFn(sleep);
  res.json({ meta: { total: POSTS.length, limit, skip }, data: slice });
});

app.get("/api/todos", async (req, res) => {
  const { limit, skip, sleep } = parseQuery(req);
  const slice = TODOS.slice(skip, skip + limit);
  await sleepFn(sleep);
  res.json({ meta: { total: TODOS.length, limit, skip }, data: slice });
});

app.get("/api/profiles", async (req, res) => {
  const { limit, skip, sleep } = parseQuery(req);
  const slice = PROFILES.slice(skip, skip + limit);
  await sleepFn(sleep);
  res.json({ meta: { total: PROFILES.length, limit, skip }, data: slice });
});

// ---- SINGLE ITEM ----

app.get("/api/posts/:id", async (req, res) => {
  const { sleep } = parseQuery(req);
  const item = POSTS.find(p => p.id == req.params.id);
  await sleepFn(sleep);
  if (!item) return res.status(404).json({ error: "not found" });
  res.json(item);
});

app.get("/api/todos/:id", async (req, res) => {
  const { sleep } = parseQuery(req);
  const item = TODOS.find(p => p.id == req.params.id);
  await sleepFn(sleep);
  if (!item) return res.status(404).json({ error: "not found" });
  res.json(item);
});

app.get("/api/profiles/:id", async (req, res) => {
  const { sleep } = parseQuery(req);
  const item = PROFILES.find(p => p.id == req.params.id);
  await sleepFn(sleep);
  if (!item) return res.status(404).json({ error: "not found" });
  res.json(item);
});


// local dev
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
