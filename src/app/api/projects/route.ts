import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  createBlankProject,
  getUserProjects,
  readDb,
  writeDb,
} from "@/lib/db";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  const projects = getUserProjects(user.id);
  return NextResponse.json({ projects, user });
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    const body = await req.json().catch(() => ({}));

    const newProject = createBlankProject(user.id, user.name, {
      title: body.title,
      competitionName: body.competitionName,
      theme: body.theme,
      domain: body.domain,
      targetTech: body.targetTech,
      description: body.description,
    });

    const db = readDb();
    db.projects.unshift(newProject);
    writeDb(db);

    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create project" },
      { status: 500 }
    );
  }
}
