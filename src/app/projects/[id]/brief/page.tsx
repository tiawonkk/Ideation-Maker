"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/components/layout/AppProvider";
import { FinalBriefSections, Project } from "@/types/project";
import { BriefDocumentRenderer } from "@/components/brief/BriefDocumentRenderer";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function FinalBriefPage() {
  const params = useParams<{ id: string }>();
  const { showToast, aiConfig, setWorkspaceHeader } = useApp();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${params.id}`);
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Unable to load project brief");
      } else {
        setProject(data.project);
      }
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProject();
    return () => {
      setWorkspaceHeader(null);
    };
  }, [fetchProject, setWorkspaceHeader]);

  const saveProjectUpdates = useCallback(
    async (
      updates: Partial<Project>,
      triggerLabel?: string,
      silent = false
    ): Promise<Project | null> => {
      if (!project) return null;
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updates,
          triggerLabel,
        }),
      });
      const data = await res.json();
      if (res.ok && data.project) {
        setProject(data.project);
        if (!silent) showToast("Brief saved!", "success");
        return data.project;
      }
      return null;
    },
    [project, showToast]
  );

  useEffect(() => {
    if (!project) return;
    const timeStr = new Date(project.lastEditedAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setWorkspaceHeader({
      projectId: project.id,
      projectTitle: project.title,
      saving: isGenerating,
      lastSavedAt: timeStr,
      overallScore: project.judgeScore?.overallScore ?? 0,
      onUpdateTitle: (newTitle: string) => {
        saveProjectUpdates(
          { ...project, title: newTitle },
          "Project Renamed"
        );
      },
      onQuickExportPdf: () => {
        window.print();
      },
    });
  }, [project, isGenerating, setWorkspaceHeader, saveProjectUpdates]);

  const handleRegenerate = async (sectionKey?: keyof FinalBriefSections) => {
    if (!project) return;
    setIsGenerating(true);
    try {
      await saveProjectUpdates(project, "Pre-compile save", true);
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          stepNumber: 10,
          aiConfig,
          customPayload: sectionKey
            ? { regenerateSectionKey: sectionKey }
            : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.project) {
        setProject(data.project);
        showToast(
          sectionKey
            ? `Regenerated section (${sectionKey})`
            : "Compiled complete Final Brief",
          "success"
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-8">
        <div className="h-96 animate-pulse rounded-2xl glass-panel" />
      </div>
    );
  }

  if (authError || !project) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="glass-panel rounded-3xl p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-500">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-xl font-bold">Brief Access Restricted</h1>
          <p className="mt-2 text-sm text-slate-500">{authError}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/dashboard" className="btn-apple-primary text-xs">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center justify-between no-print">
        <Link
          href={`/projects/${project.id}`}
          className="btn-glass-secondary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to 3-Column Project Workspace</span>
        </Link>
      </div>

      <BriefDocumentRenderer
        project={project}
        setProject={setProject}
        onSave={saveProjectUpdates}
        onRegenerateSection={handleRegenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
}
