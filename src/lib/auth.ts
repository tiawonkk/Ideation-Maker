import { cookies } from "next/headers";
import { readDb, writeDb } from "@/lib/db";
import { User } from "@/types/project";

export const SESSION_COOKIE_NAME = "ideation_maker_session_uid";

export async function getCurrentUser(req?: Request): Promise<User> {
  const db = readDb();

  // Check optional x-user-id header for API / automated testing
  if (req) {
    const headerUserId = req.headers.get("x-user-id");
    if (headerUserId) {
      const found = db.users.find((u) => u.id === headerUserId);
      if (found) return found;
    }
  }

  try {
    const cookieStore = await cookies();
    const uid = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (uid) {
      const user = db.users.find((u) => u.id === uid);
      if (user) return user;
    }
  } catch {
    // Fallback when called outside request context
  }

  return db.users[0];
}

export function authenticateUser(email: string, password?: string): User | null {
  const db = readDb();
  const normalized = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email.toLowerCase() === normalized);
  if (!user) return null;
  if (password && user.passwordHash !== password) {
    return null;
  }
  return user;
}

export function registerUser(name: string, email: string, passwordHash = "demo1234"): User {
  const db = readDb();
  const normalized = email.trim().toLowerCase();
  const existing = db.users.find((u) => u.email.toLowerCase() === normalized);
  if (existing) {
    return existing;
  }

  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: name.trim() || "Hackathon Innovator",
    email: normalized,
    passwordHash,
    role: "HACKATHON_PARTICIPANT",
    preferredLang: "en",
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

