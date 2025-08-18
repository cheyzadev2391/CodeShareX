import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCodeSnippetSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new code snippet
  app.post("/api/code", async (req, res) => {
    try {
      const validatedData = insertCodeSnippetSchema.parse(req.body);
      const snippet = await storage.createCodeSnippet(validatedData);
      res.json(snippet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      } else {
        res.status(500).json({ message: "Sunucu hatası" });
      }
    }
  });

  // Get a specific code snippet
  app.get("/api/code/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const snippet = await storage.getCodeSnippet(id);
      
      if (!snippet) {
        return res.status(404).json({ message: "Kod bulunamadı" });
      }

      // Increment view count
      await storage.incrementViews(id);
      
      res.json(snippet);
    } catch (error) {
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  // Get all code snippets
  app.get("/api/code", async (req, res) => {
    try {
      const snippets = await storage.getAllCodeSnippets();
      const publicSnippets = snippets.filter(s => s.isPublic);
      res.json(publicSnippets);
    } catch (error) {
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  // Search code snippets
  app.get("/api/search", async (req, res) => {
    try {
      const { q: query, language, category } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Arama sorgusu gerekli" });
      }

      const results = await storage.searchCodeSnippets(
        query,
        language as string,
        category as string
      );
      
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  // Like a code snippet
  app.post("/api/code/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      const snippet = await storage.toggleLike(id);
      
      if (!snippet) {
        return res.status(404).json({ message: "Kod bulunamadı" });
      }
      
      res.json(snippet);
    } catch (error) {
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
