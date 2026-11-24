import "dotenv/config"
import express from "express"
import mongoose from "mongoose"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { ScenePack } from "./models/ScenePack.mjs"

const app = express()
const port = Number(process.env.API_PORT || 4000)
const mongoUri = process.env.MONGODB_URI
const projectRoot = fileURLToPath(new URL("..", import.meta.url))
const frontendBuild = resolve(projectRoot, "dist")

app.disable("x-powered-by")
app.use(express.json({ limit: "32kb" }))

if (mongoUri) {
  mongoose.connect(mongoUri).catch(() => {
    console.error("MongoDB connection failed. Check MONGODB_URI and the database network allowlist.")
  })
}

app.get("/api/health", (_request, response) => {
  const connected = mongoose.connection.readyState === 1
  response.status(mongoUri && !connected ? 503 : 200).json({
    status: connected ? "ok" : "waiting-for-database",
    database: {
      configured: Boolean(mongoUri),
      connected,
    },
  })
})

app.get("/api/scene-packs", async (_request, response) => {
  if (mongoose.connection.readyState !== 1) {
    response.status(503).json({ error: "MongoDB is not connected." })
    return
  }

  try {
    const scenePacks = await ScenePack.find().select("-__v").sort({ createdAt: -1 }).lean()
    response.json({ data: scenePacks })
  } catch {
    response.status(500).json({ error: "Could not load scene packs." })
  }
})

app.use(express.static(frontendBuild, { index: false }))
app.use((request, response, next) => {
  if (request.method !== "GET" || request.path.startsWith("/api/")) {
    next()
    return
  }

  response.sendFile(resolve(frontendBuild, "index.html"), (error) => {
    if (error) next(error)
  })
})

app.use((_error, _request, response, _next) => {
  response.status(500).json({ error: "An unexpected server error occurred." })
})

app.listen(port, "0.0.0.0", () => {
  console.info(`Express API listening on port ${port}`)
})
