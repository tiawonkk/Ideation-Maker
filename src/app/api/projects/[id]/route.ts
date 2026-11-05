import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  deleteAuthorizedProject,
  duplicateAuthorizedProject,
  getAuthorizedProject,
  saveAuthorizedProject,
} from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = await getCurrentUser(req);
  const result = getAuthorizedProject(id, user.id);

  if (result.status !== 200) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ project: result.project });
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser(req);
    const body = await req.json();

    const { triggerLabel, ...updates } = body;
    const result = saveAuthorizedProject(id, user.id, updates, triggerLabel);

    if (result.status !== 200) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ project: result.project });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save project" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = await getCurrentUser(req);
  const body = await req.json().catch(() => ({}));

  if (body.action === "duplicate") {
    const result = duplicateAuthorizedProject(id, user.id);
    if (result.status !== 200) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ project: result.project }, { status: 201 });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = await getCurrentUser(req);
  const result = deleteAuthorizedProject(id, user.id);

  if (result.status !== 200) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ success: true });
}
