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
