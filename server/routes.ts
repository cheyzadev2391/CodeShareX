import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  loginSchema, 
  registerSchema, 
  resetPasswordSchema, 
  newPasswordSchema, 
  updateProfileSchema, 
  changeEmailSchema, 
  changePasswordSchema, 
  insertCodeSnippetSchema,
  type User 
} from "@shared/schema";
import { z } from "zod";

// Middleware to check authentication
interface AuthRequest extends Request {
  user?: User;
}

async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "Oturum gereklidir" });
  }

  const sessionData = await storage.getSession(token);
  if (!sessionData) {
    return res.status(401).json({ error: "Geçersiz veya süresi dolmuş oturum" });
  }

  req.user = sessionData.user;
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ==================== AUTH ROUTES ====================
  
  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if email already exists
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ error: "Bu e-posta adresi zaten kullanılıyor" });
      }
      
      // Check if username already exists
      const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ error: "Bu kullanıcı adı zaten kullanılıyor" });
      }
      
      // Create user
      const user = await storage.createUser(validatedData);
      const session = await storage.createSession(user.id);
      
      res.json({ 
        user: { ...user, password: undefined }, 
        token: session.token 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        console.error("Register error:", error);
        res.status(500).json({ error: "Sunucu hatası" });
      }
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.verifyPassword(validatedData.email, validatedData.password);
      if (!user) {
        return res.status(401).json({ error: "E-posta veya şifre yanlış" });
      }
      
      const session = await storage.createSession(user.id);
      
      res.json({ 
        user: { ...user, password: undefined }, 
        token: session.token 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        console.error("Login error:", error);
        res.status(500).json({ error: "Sunucu hatası" });
      }
    }
  });

  // Logout
  app.post("/api/auth/logout", requireAuth, async (req: AuthRequest, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        await storage.deleteSession(token);
      }
      res.json({ message: "Çıkış yapıldı" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Sunucu hatası" });
    }
  });

  // Get current user
  app.get("/api/auth/me", requireAuth, async (req: AuthRequest, res) => {
    res.json({ ...req.user, password: undefined });
  });

  // Forgot password - request reset token
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const validatedData = resetPasswordSchema.parse(req.body);
      const resetToken = await storage.createResetToken(validatedData.email);
      
      if (resetToken) {
        // In real app, send email with reset link
        // For demo, return token directly
        res.json({ 
          message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi",
          resetToken // Remove this in production
        });
      } else {
        res.json({ message: "Eğer bu e-posta kayıtlı ise, şifre sıfırlama bağlantısı gönderilmiştir" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        console.error("Forgot password error:", error);
        res.status(500).json({ error: "Sunucu hatası" });
      }
    }
  });

  // Reset password with token
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const validatedData = newPasswordSchema.parse(req.body);
      const success = await storage.resetPassword(validatedData.token, validatedData.password);
      
      if (success) {
        res.json({ message: "Şifreniz başarıyla sıfırlandı" });
      } else {
        res.status(400).json({ error: "Geçersiz veya süresi dolmuş token" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        console.error("Reset password error:", error);
        res.status(500).json({ error: "Sunucu hatası" });
      }
    }
  });

  // ==================== PROFILE ROUTES ====================

  // Update profile info
  app.put("/api/profile", requireAuth, async (req: AuthRequest, res) => {
    try {
      const validatedData = updateProfileSchema.parse(req.body);
      
      // Check if username is taken by another user
      if (validatedData.username !== req.user!.username) {
        const existingUser = await storage.getUserByUsername(validatedData.username);
        if (existingUser && existingUser.id !== req.user!.id) {
          return res.status(400).json({ error: "Bu kullanıcı adı zaten kullanılıyor" });
        }
      }
      
      const updatedUser = await storage.updateUser(req.user!.id, validatedData);
      res.json({ ...updatedUser, password: undefined });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Sunucu hatası" });
      }
    }
  });

  // Change email
  app.put("/api/profile/email", requireAuth, async (req: AuthRequest, res) => {
    try {
      const validatedData = changeEmailSchema.parse(req.body);
      
      // Verify current password
      const user = await storage.verifyPassword(req.user!.email, validatedData.password);
      if (!user) {
        return res.status(400).json({ error: "Mevcut şifre yanlış" });
      }
      
      // Check if new email is already taken
      const existingUser = await storage.getUserByEmail(validatedData.newEmail);
      if (existingUser && existingUser.id !== req.user!.id) {
        return res.status(400).json({ error: "Bu e-posta adresi zaten kullanılıyor" });
      }
      
      const updatedUser = await storage.updateUser(req.user!.id, { email: validatedData.newEmail });
      res.json({ ...updatedUser, password: undefined });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        console.error("Change email error:", error);
        res.status(500).json({ error: "Sunucu hatası" });
      }
    }
  });

  // Change password
  app.put("/api/profile/password", requireAuth, async (req: AuthRequest, res) => {
    try {
      const validatedData = changePasswordSchema.parse(req.body);
      
      // Verify current password
      const user = await storage.verifyPassword(req.user!.email, validatedData.currentPassword);
      if (!user) {
        return res.status(400).json({ error: "Mevcut şifre yanlış" });
      }
      
      // Update password (will be hashed in storage)
      await storage.updateUser(req.user!.id, { password: validatedData.newPassword });
      
      // Invalidate all sessions except current one
      const currentToken = req.headers.authorization?.replace('Bearer ', '');
      await storage.deleteUserSessions(req.user!.id);
      
      // Create new session
      const newSession = await storage.createSession(req.user!.id);
      
      res.json({ 
        message: "Şifre başarıyla değiştirildi",
        token: newSession.token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        console.error("Change password error:", error);
        res.status(500).json({ error: "Sunucu hatası" });
      }
    }
  });

  // Get user's own code snippets
  app.get("/api/profile/codes", requireAuth, async (req: AuthRequest, res) => {
    try {
      const snippets = await storage.getUserCodeSnippets(req.user!.id);
      res.json(snippets);
    } catch (error) {
      console.error("Get user codes error:", error);
      res.status(500).json({ error: "Sunucu hatası" });
    }
  });

  // ==================== CODE ROUTES ====================
  
  // Create a new code snippet (can be used by guests or logged in users)
  app.post("/api/code", async (req: AuthRequest, res) => {
    try {
      const validatedData = insertCodeSnippetSchema.parse(req.body);
      
      // Try to get user from token if provided
      let userId: string | undefined;
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        const sessionData = await storage.getSession(token);
        userId = sessionData?.user.id;
      }
      
      const snippet = await storage.createCodeSnippet(validatedData, userId);
      res.json(snippet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      } else {
        console.error("Create code error:", error);
        res.status(500).json({ message: "Sunucu hatası" });
      }
    }
  });

  // Delete a code snippet (only by owner)
  app.delete("/api/code/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCodeSnippet(id, req.user!.id);
      
      if (success) {
        res.json({ message: "Kod başarıyla silindi" });
      } else {
        res.status(404).json({ message: "Kod bulunamadı veya silme yetkiniz yok" });
      }
    } catch (error) {
      console.error("Delete code error:", error);
      res.status(500).json({ message: "Sunucu hatası" });
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
