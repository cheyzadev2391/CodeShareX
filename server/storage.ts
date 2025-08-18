import { type CodeSnippet, type InsertCodeSnippet, type User, type InsertUser, type Session, users, codeSnippets, sessions } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, ilike, or, gt, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User methods
  createUser(userData: InsertUser & { password: string }): Promise<User>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  updateUser(id: string, userData: Partial<User>): Promise<User | undefined>;
  verifyPassword(email: string, password: string): Promise<User | null>;
  
  // Session methods
  createSession(userId: string): Promise<Session>;
  getSession(token: string): Promise<{ session: Session; user: User } | null>;
  deleteSession(token: string): Promise<void>;
  deleteUserSessions(userId: string): Promise<void>;
  
  // Password reset methods
  createResetToken(email: string): Promise<string | null>;
  validateResetToken(token: string): Promise<User | null>;
  resetPassword(token: string, newPassword: string): Promise<boolean>;
  
  // Code snippet methods
  createCodeSnippet(snippet: InsertCodeSnippet, userId?: string): Promise<CodeSnippet>;
  getCodeSnippet(id: string): Promise<CodeSnippet | undefined>;
  getAllCodeSnippets(): Promise<CodeSnippet[]>;
  getUserCodeSnippets(userId: string): Promise<CodeSnippet[]>;
  searchCodeSnippets(query: string, language?: string, category?: string): Promise<CodeSnippet[]>;
  incrementViews(id: string): Promise<void>;
  toggleLike(id: string): Promise<CodeSnippet | undefined>;
  deleteCodeSnippet(id: string, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async createUser(userData: InsertUser & { password: string }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [user] = await db.insert(users).values({
      ...userData,
      password: hashedPassword,
    }).returning();
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Session methods
  async createSession(userId: string): Promise<Session> {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    const [session] = await db.insert(sessions).values({
      userId,
      token,
      expiresAt,
    }).returning();
    return session;
  }

  async getSession(token: string): Promise<{ session: Session; user: User } | null> {
    const result = await db
      .select()
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(
        eq(sessions.token, token),
        gt(sessions.expiresAt, new Date())
      ));

    if (!result[0]) return null;
    
    return {
      session: result[0].sessions,
      user: result[0].users,
    };
  }

  async deleteSession(token: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.token, token));
  }

  async deleteUserSessions(userId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.userId, userId));
  }

  // Password reset methods
  async createResetToken(email: string): Promise<string | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    const resetToken = randomUUID();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.update(users)
      .set({ resetToken, resetTokenExpires })
      .where(eq(users.id, user.id));

    return resetToken;
  }

  async validateResetToken(token: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(
        eq(users.resetToken, token),
        gt(users.resetTokenExpires, new Date())
      ));
    
    return user || null;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await this.validateResetToken(token);
    if (!user) return false;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.update(users)
      .set({ 
        password: hashedPassword, 
        resetToken: null, 
        resetTokenExpires: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    return true;
  }

  // Code snippet methods
  async createCodeSnippet(insertSnippet: InsertCodeSnippet, userId?: string): Promise<CodeSnippet> {
    const [snippet] = await db.insert(codeSnippets).values({
      ...insertSnippet,
      userId,
      tags: insertSnippet.tags || null,
      isPublic: insertSnippet.isPublic ?? true,
      allowComments: insertSnippet.allowComments ?? true,
    }).returning();
    return snippet;
  }

  async getCodeSnippet(id: string): Promise<CodeSnippet | undefined> {
    const [snippet] = await db.select().from(codeSnippets).where(eq(codeSnippets.id, id));
    return snippet;
  }

  async getAllCodeSnippets(): Promise<CodeSnippet[]> {
    return await db
      .select()
      .from(codeSnippets)
      .where(eq(codeSnippets.isPublic, true))
      .orderBy(desc(codeSnippets.createdAt));
  }

  async getUserCodeSnippets(userId: string): Promise<CodeSnippet[]> {
    return await db
      .select()
      .from(codeSnippets)
      .where(eq(codeSnippets.userId, userId))
      .orderBy(desc(codeSnippets.createdAt));
  }

  async searchCodeSnippets(query: string, language?: string, category?: string): Promise<CodeSnippet[]> {
    let conditions = [eq(codeSnippets.isPublic, true)];
    
    if (query) {
      conditions.push(
        or(
          ilike(codeSnippets.title, `%${query}%`),
          ilike(codeSnippets.code, `%${query}%`)
        )!
      );
    }
    
    if (language && language !== "all") {
      conditions.push(eq(codeSnippets.language, language));
    }
    
    if (category && category !== "all") {
      conditions.push(eq(codeSnippets.category, category));
    }

    return await db
      .select()
      .from(codeSnippets)
      .where(and(...conditions))
      .orderBy(desc(codeSnippets.createdAt));
  }

  async incrementViews(id: string): Promise<void> {
    await db
      .update(codeSnippets)
      .set({ 
        views: sql`${codeSnippets.views} + 1`,
        updatedAt: new Date()
      })
      .where(eq(codeSnippets.id, id));
  }

  async toggleLike(id: string): Promise<CodeSnippet | undefined> {
    const [snippet] = await db
      .update(codeSnippets)
      .set({ 
        likes: sql`${codeSnippets.likes} + 1`,
        updatedAt: new Date()
      })
      .where(eq(codeSnippets.id, id))
      .returning();
    return snippet;
  }

  async deleteCodeSnippet(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(codeSnippets)
      .where(and(
        eq(codeSnippets.id, id),
        eq(codeSnippets.userId, userId)
      ))
      .returning();
    
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
