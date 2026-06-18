import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { app } from "./src/serverApp.js";

const PORT = 3000;

// Setup Vite Dev server or production build static folder
async function startServer() {
  // Always serve resources from the "public" directory statically at the root level first
  // so dynamically uploaded assets like public/*.pdf bypass other routing and render/download properly.
  app.use(express.static(path.join(process.cwd(), "public")));

  if (process.env.NODE_ENV !== "production") {
    console.log("Configuring Vite Dev Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    const publicPath = path.join(process.cwd(), "public");
    console.log(`Serving assets from: ${distPath} and ${publicPath}`);
    
    // Serve from dist first (compiled build assets)
    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      // If requesting a file extension (like .pdf, .png etc.) that was not found, return 404 instead of falling back to index.html
      const ext = path.extname(req.path);
      if (ext && ext !== ".html") {
        return res.status(404).send("File not found");
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VocosAI Server running at http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
  });
}

startServer();
