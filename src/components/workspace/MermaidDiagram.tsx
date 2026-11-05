"use client";

import React, { useMemo } from "react";
import { GitBranch, Copy, Check } from "lucide-react";

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
    const match = clean.match(/^([A-Za-z0-9_]+)\s*(?:\["?([^"\]]+)"?\]|\{"?([^"\}]+)"?\}|\(\("?([^"\)]+)"?\)\)|\("?([^"\)]+)"?\))?/);
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
    // Handle chained arrows like A --> B --> C
    if (line.includes("-->")) {
      // Check for labeled arrow: E -- "Yes" --> F
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
  const [copied, setCopied] = React.useState(false);
  const [showRaw, setShowRaw] = React.useState(false);

  const parsed = useMemo(() => parseMermaidNodesAndEdges(chart || ""), [chart]);

  if (!chart) return null;

  return (
    <div
      className={`mermaid-diagram-box rounded-xl border p-4 ${
        printLight
          ? "border-slate-300 bg-slate-50 text-slate-900"
          : "border-white/10 bg-[#090a0f] text-slate-100"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-current/10 pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-indigo-500" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {title} (Mermaid.js Compatible)
          </span>
        </div>
        <div className="flex items-center gap-2 no-print">
          <button
            type="button"
            onClick={() => setShowRaw(!showRaw)}
            className="rounded border border-white/15 px-2.5 py-1 text-[11px] font-medium hover:bg-white/10"
          >
            {showRaw ? "Visual Flow View" : "View Mermaid Source"}
          </button>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(chart);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="inline-flex items-center gap-1 rounded border border-white/15 px-2.5 py-1 text-[11px] font-medium hover:bg-white/10"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy Mermaid</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Deterministic Visual Architecture Flowchart (Zero broken diagrams in PDF or Browser) */}
      <div className="mt-4">
        {parsed.edges.length > 0 ? (
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {parsed.edges.map((edge, idx) => (
              <div
                key={idx}
                className={`flex flex-col justify-between rounded-lg border p-3 text-xs ${
                  printLight
                    ? "border-slate-300 bg-white text-slate-800"
                    : "border-indigo-500/25 bg-[#11131c] text-slate-200"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-indigo-400">
                    {edge.fromId}
                  </span>
                  <span className="font-semibold">{edge.fromLabel}</span>
                </div>

                <div className="my-1.5 flex items-center gap-1.5 pl-2 text-[10px] font-medium text-indigo-400">
                  <span>↓</span>
                  {edge.edgeLabel && (
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-400">
                      {edge.edgeLabel}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="rounded bg-violet-500/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-violet-400">
                    {edge.toId}
                  </span>
                  <span className="font-semibold">{edge.toLabel}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <pre className="overflow-x-auto rounded-lg bg-black/30 p-3 font-mono text-xs">
            {chart}
          </pre>
        )}

        {showRaw && (
          <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/50 p-3 font-mono text-xs text-indigo-200 no-print">
            {chart}
          </pre>
        )}
      </div>
    </div>
  );
}
