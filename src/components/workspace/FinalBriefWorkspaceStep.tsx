"use client";

import React from "react";
import { FinalBriefSections, Project } from "@/types/project";
import { BriefDocumentRenderer } from "@/components/brief/BriefDocumentRenderer";

interface FinalBriefWorkspaceStepProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  onSave: (
    updates: Partial<Project>,
    triggerLabel?: string,
    silent?: boolean
  ) => Promise<Project | null>;
  onGenerate: (
    stepNumber: number,
    customPayload?: Record<string, unknown>
  ) => Promise<void>;
  generatingStep: number | null;
}

export function FinalBriefWorkspaceStep({
  project,
  setProject,
  onSave,
  onGenerate,
  generatingStep,
}: FinalBriefWorkspaceStepProps) {
  return (
    <BriefDocumentRenderer
      project={project}
      setProject={setProject}
      onSave={onSave}
      onRegenerateSection={(sectionKey?: keyof FinalBriefSections) =>
        onGenerate(10, sectionKey ? { regenerateSectionKey: sectionKey } : {})
      }
      isGenerating={generatingStep === 10}
    />
  );
}

