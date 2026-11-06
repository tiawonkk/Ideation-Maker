"use client";

import React, { useMemo, useState } from "react";
import { GitBranch, Copy, Check, ZoomIn, ZoomOut, Code2 } from "lucide-react";

interface MermaidDiagramProps {
  chart: string;
  title?: string;
  printLight?: boolean;
}

interface ParsedEdge {
  fromId: string;
  fromLabel: string;
  toId: string;
  toLabel: string;
  edgeLabel?: string;
}

function parseMermaidNodesAndEdges(chart: string): {
  nodes: { id: string; label: string }[];
  edges: ParsedEdge[];
} {
  const nodeMap = new Map<string, string>();
  const edges: ParsedEdge[] = [];

  const lines = chart
    .split("\n")
    .map((l) => l.trim())
    .filter(
      (l) =>
        l &&
        !l.startsWith("flowchart") &&
        !l.startsWith("graph") &&
        !l.startsWith("subgraph") &&
        l !== "end"
    );

  const extractNode = (token: string): { id: string; label: string } => {
    const clean = token.trim();
    const match = clean.match(
      /^([A-Za-z0-9_]+)\s*(?:\["?([^"\]]+)"?\]|\{"?([^"\}]+)"?\}|\(\("?([^"\)]+)"?\)\)|\("?([^"\)]+)"?\))?/
    );
    if (match) {
      const id = match[1];
      const label =
        match[2] || match[3] || match[4] || match[5] || nodeMap.get(id) || id;
      nodeMap.set(id, label);
      return { id, label };
    }
    return { id: clean, label: clean };
  };

  for (const line of lines) {
    if (line.includes("-->")) {
      const labeledMatch = line.match(
        /^(.+?)\s*--\s*"?([^"-]+)"?\s*-->\s*(.+)$/
      );
      if (labeledMatch) {
        const from = extractNode(labeledMatch[1]);
        const edgeLabel = labeledMatch[2].trim();
        const to = extractNode(labeledMatch[3]);
        edges.push({
          fromId: from.id,
          fromLabel: from.label,
          toId: to.id,
          toLabel: to.label,
          edgeLabel,
        });
        continue;
      }

      const parts = line.split("-->");
      for (let i = 0; i < parts.length - 1; i++) {
        const from = extractNode(parts[i]);
        const to = extractNode(parts[i + 1]);
        edges.push({
          fromId: from.id,
          fromLabel: from.label,
          toId: to.id,
          toLabel: to.label,
        });
      }
    } else {
      extractNode(line);
    }
  }

  const nodes = Array.from(nodeMap.entries()).map(([id, label]) => ({
    id,
    label,
  }));

  return { nodes, edges };
}

export function MermaidDiagram({
  chart,
  title = "Architecture & Flow Diagram",
  printLight = false,
}: MermaidDiagramProps) {
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [zoom, setZoom] = useState<number>(100);

  const parsed = useMemo(() => parseMermaidNodesAndEdges(chart || ""), [chart]);

  if (!chart) return null;

  return (
    <div
      className={`mermaid-diagram-box rounded-2xl p-5 ${
        printLight
          ? "border border-slate-300 bg-slate-50 text-slate-900"
          : "glass-panel"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-extrabold uppercase tracking-wider">
            {title}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 no-print">
          {/* Zoom Controls */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-black/30 px-1.5 py-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(75, z - 15))}
              className="p-1 hover:text-indigo-500"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-1.5 font-mono font-semibold">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(130, z + 15))}
              className="p-1 hover:text-indigo-500"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowRaw(!showRaw)}
            className="btn-glass-secondary px-2.5 py-1 text-[11px]"
          >
            <Code2 className="h-3.5 w-3.5 text-indigo-500" />
            <span>{showRaw ? "Hide Mermaid Code" : "Mermaid Code"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(chart);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="btn-glass-secondary px-2.5 py-1 text-[11px]"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Architecture Flowchart */}
      <div
        className="mt-4 overflow-x-auto transition-all"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: "top left",
        }}
      >
        {parsed.edges.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {parsed.edges.map((edge, idx) => (
              <div
                key={idx}
                className={`flex flex-col justify-between rounded-xl p-3.5 text-xs ${
                  printLight
                    ? "border border-slate-300 bg-white text-slate-800"
                    : "glass-card"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-indigo-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                    {edge.fromId}
                  </span>
                  <span className="font-semibold">{edge.fromLabel}</span>
                </div>

                <div className="my-2 flex items-center gap-2 pl-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  <span>↓</span>
                  {edge.edgeLabel && (
                    <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-700 dark:text-amber-300 border border-amber-500/25">
                      {edge.edgeLabel}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-violet-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-violet-600 dark:text-violet-300 border border-violet-500/20">
                    {edge.toId}
                  </span>
                  <span className="font-semibold">{edge.toLabel}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <pre className="overflow-x-auto rounded-xl bg-slate-900/90 p-3 font-mono text-xs text-indigo-200">
            {chart}
          </pre>
        )}
      </div>

      {showRaw && (
        <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-300 dark:border-white/10 bg-slate-900 p-3.5 font-mono text-xs text-indigo-200 no-print">
          {chart}
        </pre>
      )}
    </div>
  );
}
