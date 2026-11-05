import { NextResponse } from "next/server";
import {
  authenticateUser,
  getCurrentUser,
  registerUser,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { readDb } from "@/lib/db";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  const db = readDb();
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      preferredLang: user.preferredLang,
    },
    availableDemoUsers: db.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
    })),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, password, name, userId } = body;

    if (action === "switch" && userId) {
      const db = readDb();
      const target = db.users.find((u) => u.id === userId);
      if (!target) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }
      const res = NextResponse.json({ user: target });
      res.cookies.set(SESSION_COOKIE_NAME, target.id, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      return res;
    }

    if (action === "register") {
      if (!email || !name) {
        return NextResponse.json(
          { error: "Name and email are required." },
          { status: 400 }
        );
      }
      const newUser = registerUser(name, email, password || "demo1234");
      const res = NextResponse.json({ user: newUser });
      res.cookies.set(SESSION_COOKIE_NAME, newUser.id, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      return res;
    }

    // Default: login
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    const user = authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password. Try valerio@ideationmaker.ai / demo1234" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ user });
    res.cookies.set(SESSION_COOKIE_NAME, user.id, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Authentication error" },
      { status: 500 }
    );
  }
}
