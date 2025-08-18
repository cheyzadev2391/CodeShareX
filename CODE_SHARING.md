# MinuslarDev - Türkçe Kod Paylaşım Platformu

Bu dosya, MinuslarDev platformunun tüm ana kodlarını içerir. Mobilde kolayca erişim için hazırlanmıştır.

## Kurulum Talimatları

1. Yeni bir klasör oluşturun: `mkdir minuslardev`
2. Klasöre girin: `cd minuslardev`
3. Package.json dosyasını oluşturun ve bağımlılıkları yükleyin
4. Aşağıdaki dosyaları ilgili klasörlerinde oluşturun
5. `npm install` komutuyla bağımlılıkları yükleyin
6. `npm run dev` komutuyla çalıştırın

## Klasör Yapısı
```
minuslardev/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── lib/
├── server/
├── shared/
└── config dosyaları
```

---

## PACKAGE.JSON
```json
{
  "name": "minuslardev",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "tsc && vite build",
    "start": "NODE_ENV=production tsx server/index.ts"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.2",
    "@neondatabase/serverless": "^0.9.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-aspect-ratio": "^1.0.3",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-context-menu": "^2.1.5",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-hover-card": "^1.0.7",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-menubar": "^1.0.4",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-toggle": "^1.0.3",
    "@radix-ui/react-toggle-group": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@tailwindcss/typography": "^0.5.10",
    "@tailwindcss/vite": "^4.0.0-alpha.25",
    "@tanstack/react-query": "^5.17.19",
    "@types/express": "^4.17.21",
    "@types/express-session": "^1.17.10",
    "@types/node": "^20.11.5",
    "@types/passport": "^1.0.16",
    "@types/passport-local": "^1.0.38",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "cmdk": "^0.2.0",
    "date-fns": "^3.2.0",
    "drizzle-kit": "^0.20.10",
    "drizzle-orm": "^0.29.3",
    "drizzle-zod": "^0.5.1",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "framer-motion": "^10.18.0",
    "lucide-react": "^0.309.0",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "postcss": "^8.4.33",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.49.3",
    "tailwind-merge": "^2.2.0",
    "tailwindcss": "^3.4.1",
    "tailwindcss-animate": "^1.0.7",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.12",
    "wouter": "^3.0.0",
    "zod": "^3.22.4"
  }
}
```

---

## SHARED/SCHEMA.TS
```typescript
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const codeSnippets = pgTable("code_snippets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  code: text("code").notNull(),
  language: text("language").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
  isPublic: boolean("is_public").notNull().default(true),
  allowComments: boolean("allow_comments").notNull().default(true),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCodeSnippetSchema = createInsertSchema(codeSnippets).omit({
  id: true,
  views: true,
  likes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCodeSnippet = z.infer<typeof insertCodeSnippetSchema>;
export type CodeSnippet = typeof codeSnippets.$inferSelect;
```

---

## SERVER/STORAGE.TS
```typescript
import { type CodeSnippet, type InsertCodeSnippet } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createCodeSnippet(snippet: InsertCodeSnippet): Promise<CodeSnippet>;
  getCodeSnippet(id: string): Promise<CodeSnippet | undefined>;
  getAllCodeSnippets(): Promise<CodeSnippet[]>;
  searchCodeSnippets(query: string, language?: string, category?: string): Promise<CodeSnippet[]>;
  incrementViews(id: string): Promise<void>;
  toggleLike(id: string): Promise<CodeSnippet | undefined>;
}

export class MemStorage implements IStorage {
  private codeSnippets: Map<string, CodeSnippet>;

  constructor() {
    this.codeSnippets = new Map();
  }

  async createCodeSnippet(insertSnippet: InsertCodeSnippet): Promise<CodeSnippet> {
    const id = randomUUID();
    const now = new Date();
    const snippet: CodeSnippet = {
      ...insertSnippet,
      id,
      tags: insertSnippet.tags || null,
      isPublic: insertSnippet.isPublic ?? true,
      allowComments: insertSnippet.allowComments ?? true,
      views: 0,
      likes: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.codeSnippets.set(id, snippet);
    return snippet;
  }

  async getCodeSnippet(id: string): Promise<CodeSnippet | undefined> {
    return this.codeSnippets.get(id);
  }

  async getAllCodeSnippets(): Promise<CodeSnippet[]> {
    return Array.from(this.codeSnippets.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async searchCodeSnippets(
    query: string,
    language?: string,
    category?: string
  ): Promise<CodeSnippet[]> {
    const allSnippets = await this.getAllCodeSnippets();
    return allSnippets.filter((snippet) => {
      const matchesQuery = 
        snippet.title.toLowerCase().includes(query.toLowerCase()) ||
        snippet.code.toLowerCase().includes(query.toLowerCase()) ||
        snippet.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesLanguage = !language || snippet.language === language;
      const matchesCategory = !category || snippet.category === category;
      
      return matchesQuery && matchesLanguage && matchesCategory && snippet.isPublic;
    });
  }

  async incrementViews(id: string): Promise<void> {
    const snippet = this.codeSnippets.get(id);
    if (snippet) {
      snippet.views += 1;
      snippet.updatedAt = new Date();
      this.codeSnippets.set(id, snippet);
    }
  }

  async toggleLike(id: string): Promise<CodeSnippet | undefined> {
    const snippet = this.codeSnippets.get(id);
    if (snippet) {
      snippet.likes += 1;
      snippet.updatedAt = new Date();
      this.codeSnippets.set(id, snippet);
      return snippet;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
```

---

## SERVER/ROUTES.TS
```typescript
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
```

---

## SERVER/INDEX.TS
```typescript
import express from "express";
import { registerRoutes } from "./routes";
import { setupVite } from "./vite";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {
  const server = await registerRoutes(app);
  
  if (process.env.NODE_ENV !== "production") {
    await setupVite(app);
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
```

---

## SERVER/VITE.TS
```typescript
import { Express } from "express";
import { createServer as createViteServer, ViteDevServer } from "vite";

let vite: ViteDevServer;

export const setupVite = async (app: Express) => {
  vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);
};
```

---

## CLIENT/SRC/MAIN.TSX
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## CLIENT/SRC/APP.TSX
```tsx
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import Share from "@/pages/share";
import Gallery from "@/pages/gallery";
import Search from "@/pages/search";
import NotFound from "@/pages/not-found";

function App() {
  const [currentSection, setCurrentSection] = useState('home');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen bg-gradient-to-br from-dark-green via-gray-900 to-black text-white font-inter">
          <Header currentSection={currentSection} onSectionChange={setCurrentSection} />
          
          <main className="container mx-auto px-6 py-8">
            {currentSection === 'home' && <Home onNavigate={setCurrentSection} />}
            {currentSection === 'share' && <Share />}
            {currentSection === 'gallery' && <Gallery />}
            {currentSection === 'search' && <Search />}
          </main>

          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
```

Bu dosyayı mobilde kolayca görüntüleyebilir ve tüm kodu kopyalayabilirsiniz. Geriye kalan frontend componentleri de ekleyeyim mi?