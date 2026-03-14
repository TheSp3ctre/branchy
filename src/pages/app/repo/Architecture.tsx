import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useBranchyStore } from '@/store/branchyStore';
import { ModuleDrawer } from '@/components/ModuleDrawer';
import { getModuleColor } from '@/lib/branchy-utils';
import type { Module } from '@/types';
import { ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';

export default function ArchitecturePage() {
  const { repoId } = useParams();
  const repo = useBranchyStore((s) => (repoId ? s.repos[repoId] : null));
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [zoom, setZoom] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);

  if (!repo) return <div className="p-6 font-mono text-b-text-ghost">// repositório não encontrado</div>;

  const modules = repo.modules;
  const { cols, nodeWidth, nodeHeight, gapX, gapY, getNodePos, edges, svgHeight, svgWidth } = useMemo(() => {
    const cols = Math.min(4, modules.length);
    const nodeWidth = 160;
    const nodeHeight = 40;
    const gapX = 60;
    const gapY = 80;

    const getNodePos = (index: number) => ({
      x: 80 + (index % cols) * (nodeWidth + gapX),
      y: 60 + Math.floor(index / cols) * (nodeHeight + gapY),
    });

    const edges: { from: number; to: number }[] = [];
    modules.forEach((mod, i) => {
      mod.dependsOn.forEach((depId) => {
        const j = modules.findIndex((m) => m.id === depId);
        if (j >= 0) edges.push({ from: i, to: j });
      });
    });

    const svgHeight = Math.ceil(modules.length / cols) * (nodeHeight + gapY) + 80;
    const svgWidth = cols * (nodeWidth + gapX) + 80;

    return { cols, nodeWidth, nodeHeight, gapX, gapY, getNodePos, edges, svgHeight, svgWidth };
  }, [modules]);

  const legendItems = [
    { label: 'Core', type: 'core' },
    { label: 'Service', type: 'service' },
    { label: 'Util', type: 'util' },
    { label: 'Flagged', type: 'flagged' },
    { label: 'Component', type: 'component' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-52px)]">
      {/* Toolbar */}
      <div className="h-[44px] bg-b-surface border-b-[0.5px] border-b-border flex items-center px-4 gap-2 shrink-0">
        <span className="font-mono text-[11px] text-b-text-ghost uppercase tracking-[0.1em]">ARCHITECTURE MAP</span>
        <div className="flex-1" />
        <button onClick={() => setZoom((z) => Math.min(2, z + 0.1))} className="p-1.5 text-b-text-muted hover:text-b-text transition-colors duration-150">
          <ZoomIn size={16} />
        </button>
        <button onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))} className="p-1.5 text-b-text-muted hover:text-b-text transition-colors duration-150">
          <ZoomOut size={16} />
        </button>
        <button onClick={() => setZoom(1)} className="p-1.5 text-b-text-muted hover:text-b-text transition-colors duration-150">
          <RotateCcw size={16} />
        </button>
        <button className="flex items-center gap-1.5 font-mono text-[12px] text-b-text-secondary border-[0.5px] border-b-border-subtle rounded-btn px-2 py-1 hover:bg-b-card transition-colors duration-150 ml-2">
          <Download size={14} />
          Exportar PNG
        </button>
      </div>

      {/* Graph area */}
      <div className="flex-1 bg-b-base overflow-auto">
        <svg
          ref={svgRef}
          width={svgWidth * zoom}
          height={svgHeight * zoom}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="select-none"
        >
          {/* Edges */}
          {edges.map((e, i) => {
            const from = getNodePos(e.from);
            const to = getNodePos(e.to);
            return (
              <line
                key={i}
                x1={from.x + nodeWidth / 2}
                y1={from.y + nodeHeight}
                x2={to.x + nodeWidth / 2}
                y2={to.y}
                stroke="#30363D"
                strokeWidth={1}
              />
            );
          })}
          {/* Nodes */}
          {modules.map((mod, i) => {
            const pos = getNodePos(i);
            const colorMap: Record<string, { fill: string; stroke: string; text: string }> = {
              core: { fill: '#0C2032', stroke: '#1F3A5F', text: '#58A6FF' },
              service: { fill: '#0D2318', stroke: '#1A4228', text: '#3FB950' },
              util: { fill: '#161B22', stroke: '#30363D', text: '#8B949E' },
              flagged: { fill: '#1F1A0E', stroke: '#3D3012', text: '#E3B341' },
              component: { fill: '#2D1B69', stroke: '#4C1D95', text: '#8B5CF6' },
            };
            const c = colorMap[mod.type] || colorMap.util;
            return (
              <g key={mod.id} onClick={() => setSelectedModule(mod)} className="cursor-pointer">
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx={6}
                  fill={c.fill}
                  stroke={c.stroke}
                  strokeWidth={0.5}
                />
                <text
                  x={pos.x + nodeWidth / 2}
                  y={pos.y + nodeHeight / 2 + 4}
                  textAnchor="middle"
                  fill={c.text}
                  fontSize={11}
                  fontFamily="JetBrains Mono"
                >
                  {mod.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="border-t-[0.5px] border-b-border py-2 px-4 flex gap-4 shrink-0 bg-b-base">
        {legendItems.map((item) => {
          const colors = getModuleColor(item.type);
          return (
            <div key={item.type} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${colors.bg} border-[0.5px] ${colors.border}`} />
              <span className="font-body text-[12px] text-b-text-muted">{item.label}</span>
            </div>
          );
        })}
      </div>

      <ModuleDrawer module={selectedModule} onClose={() => setSelectedModule(null)} allModules={modules} />
    </div>
  );
}
