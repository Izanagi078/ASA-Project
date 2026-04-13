"use client";

import React, { useMemo } from 'react';

type Node = {
  id: number; x: number; y: number; u: number; v: number; theta: number; H: number; V: number; M: number;
};

type Member = {
  id: number; node_i: number; node_j: number; udl: number; point_load: number; w1: number; w2: number;
};

interface VisualizerProps {
  nodes: Node[];
  members: Member[];
}

export default function StructureVisualizer({ nodes, members }: VisualizerProps) {

  // Compute bounds
  const { minX, maxX, minY, maxY } = useMemo(() => {
    if (!nodes || nodes.length === 0) return { minX: 0, maxX: 10, minY: 0, maxY: 10 };
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y);
    });
    // Add massive physical padding to prevent newly enlarged arrows/text from clipping
    const maxDim = Math.max(maxX - minX, maxY - minY);
    const pad = maxDim * 0.5 || 5;
    return { minX: minX - pad, maxX: maxX + pad, minY: minY - pad, maxY: maxY + pad };
  }, [nodes]);

  const widthX = maxX - minX;
  const heightY = maxY - minY;

  // ViewBox coords mapping tools: Make sure horizontal and vertical scaling are identical
  const V_WIDTH = 1200;
  const V_HEIGHT = 1200 * (heightY / widthX);

  const mapX = (x: number) => ((x - minX) / widthX) * V_WIDTH;
  const mapY = (y: number) => V_HEIGHT - ((y - minY) / heightY) * V_HEIGHT;

  const getNode = (id: number) => nodes.find(n => n.id === id);

  const svgContent = (
    <>
      <defs>
        <marker id="arrowhead" markerWidth="16" markerHeight="12" refX="14" refY="6" orient="auto">
          <polygon points="0 0, 16 6, 0 12" fill="#c084fc" />
        </marker>
        <marker id="loadhead" markerWidth="12" markerHeight="9" refX="10" refY="4.5" orient="auto">
          <polygon points="0 0, 12 4.5, 0 9" fill="#f472b6" />
        </marker>
        <marker id="loadhead_uvl" markerWidth="12" markerHeight="9" refX="10" refY="4.5" orient="auto">
          <polygon points="0 0, 12 4.5, 0 9" fill="#f87171" />
        </marker>
        
        {/* Firmer Glowing filter */}
        <filter id="glow" filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="blur"/> {/* Double blur for extra glow */}
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Members */}
          {members.map(m => {
            const n1 = getNode(m.node_i);
            const n2 = getNode(m.node_j);
            if (!n1 || !n2) return null;
            
            const x1 = mapX(n1.x);
            const y1 = mapY(n1.y);
            const x2 = mapX(n2.x);
            const y2 = mapY(n2.y);

            // Calculate Normal Vector for Transverse Load Plotting
            const L = Math.hypot(x2 - x1, y2 - y1) || 1;
            const normX = -(y2 - y1) / L;
            const normY = (x2 - x1) / L;

            return (
              <g key={`m_${m.id}`}>
                {/* Visual Beam - FIRMER THICKNESS */}
                <line 
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke="#22d3ee" strokeWidth="16" strokeLinecap="round"
                  filter="url(#glow)" className="opacity-90"
                />

                {/* Text Label */}
                <text x={(x1+x2)/2} y={(y1+y2)/2 - 25} fill="#a5f3fc" fontSize="24" fontWeight="bold" textAnchor="middle" className="font-mono shadow-sm">
                  [{m.id}]
                </text>

                {/* If there's a UDL */}
                {m.udl !== 0 && (
                  <g>
                    {(() => {
                      const sign = m.udl < 0 ? 1 : -1;
                      const ox = -normX * sign;
                      const oy = -normY * sign;
                      
                      const dl_x1 = x1 + ox * 150;
                      const dl_y1 = y1 + oy * 150;
                      const dl_x2 = x2 + ox * 150;
                      const dl_y2 = y2 + oy * 150;
                      
                      const textOffY = oy === 0 ? 10 : oy * 35; // manual centering tweaks
                      return (
                        <>
                          <path d={`M ${dl_x1} ${dl_y1} L ${dl_x2} ${dl_y2}`} stroke="#f472b6" strokeWidth="4" strokeDasharray="8,8" />
                          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((t, i) => {
                            const px = x1 + (x2-x1)*t;
                            const py = y1 + (y2-y1)*t;
                            const tailX = px + ox * 150;
                            const tailY = py + oy * 150;
                            const headX = px + ox * 15;
                            const headY = py + oy * 15;
                            return <line key={`udl_${i}`} x1={tailX} y1={tailY} x2={headX} y2={headY} stroke="#f472b6" strokeWidth="6" markerEnd="url(#loadhead)"/>
                          })}
                          <text x={(dl_x1+dl_x2)/2 + ox*25} y={(dl_y1+dl_y2)/2 + textOffY} fill="#f472b6" fontSize="40" fontWeight="900" textAnchor="middle" stroke="#000" strokeWidth="8" style={{ paintOrder: 'stroke fill' }}>{Math.abs(m.udl)} N/m</text>
                        </>
                      );
                    })()}
                  </g>
                )}

                {/* If there's a UVL (Triangular) */}
                {(m.w1 !== 0 || m.w2 !== 0) && (
                  <g>
                    {(() => {
                      const maxW = Math.max(Math.abs(m.w1), Math.abs(m.w2));
                      // Flip the UVL sign orientation so it points inwards (Left) for negative loads, 
                      // aligning with the specific visual expectation of the user's reference image
                      const sign = (m.w1 < 0 || m.w2 < 0) ? -1 : 1;
                      const ox = -normX * sign;
                      const oy = -normY * sign;

                      const h1 = maxW ? (Math.abs(m.w1) / maxW) * 150 : 0;
                      const h2 = maxW ? (Math.abs(m.w2) / maxW) * 150 : 0;

                      const dl_x1 = x1 + ox * Math.max(15, h1);
                      const dl_y1 = y1 + oy * Math.max(15, h1);
                      const dl_x2 = x2 + ox * Math.max(15, h2);
                      const dl_y2 = y2 + oy * Math.max(15, h2);
                      
                      const textOffY = oy === 0 ? 10 : oy * 35; 

                      return (
                        <>
                          <path d={`M ${dl_x1} ${dl_y1} L ${dl_x2} ${dl_y2}`} stroke="#f87171" strokeWidth="4" strokeDasharray="8,8" />
                          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((t, i) => {
                            const px = x1 + (x2-x1)*t;
                            const py = y1 + (y2-y1)*t;
                            const currentW = Math.abs(m.w1) * (1-t) + Math.abs(m.w2) * t;
                            if (currentW < 0.1) return null; // zero load points
                            const h = maxW ? (currentW / maxW) * 150 : 0;
                            const tailX = px + ox * Math.max(25, h);
                            const tailY = py + oy * Math.max(25, h);
                            const headX = px + ox * 15;
                            const headY = py + oy * 15;
                            return <line key={`uvl_${i}`} x1={tailX} y1={tailY} x2={headX} y2={headY} stroke="#f87171" strokeWidth="6" markerEnd="url(#loadhead_uvl)"/>
                          })}
                          <text x={(dl_x1+dl_x2)/2 + ox*30} y={(dl_y1+dl_y2)/2 + textOffY} fill="#f87171" fontSize="32" fontWeight="900" textAnchor="middle" stroke="#000" strokeWidth="6" style={{ paintOrder: 'stroke fill' }}>UVL: {Math.abs(m.w1)} to {Math.abs(m.w2)}</text>
                        </>
                      );
                    })()}
                  </g>
                )}
          </g>
        )
      })}

      {/* Nodes and BCs */}
      {nodes.map(n => {
        const nx = mapX(n.x);
        const ny = mapY(n.y);

        // Supports
        const isFixed = n.u === 0 && n.v === 0 && n.theta === 0;
        const isPinned = n.u === 0 && n.v === 0 && n.theta === 1;

        return (
          <g key={`n_${n.id}`}>
            {isFixed && (
              <g>
                <line x1={nx-30} y1={ny+16} x2={nx+30} y2={ny+16} stroke="#d4d4d8" strokeWidth="6" />
                <line x1={nx-25} y1={ny+16} x2={nx-35} y2={ny+36} stroke="#d4d4d8" strokeWidth="3" />
                <line x1={nx-5}  y1={ny+16} x2={nx-15} y2={ny+36} stroke="#d4d4d8" strokeWidth="3" />
                <line x1={nx+15} y1={ny+16} x2={nx+5}  y2={ny+36} stroke="#d4d4d8" strokeWidth="3" />
                <line x1={nx+35} y1={ny+16} x2={nx+25} y2={ny+36} stroke="#d4d4d8" strokeWidth="3" />
              </g>
            )}
            {isPinned && (
              <g>
                <polygon points={`${nx},${ny} ${nx-25},${ny+30} ${nx+25},${ny+30}`} fill="none" stroke="#d4d4d8" strokeWidth="5" />
              </g>
            )}

            {/* Node point FIRMER */}
            <circle cx={nx} cy={ny} r="14" fill="#e879f9" stroke="#fff" strokeWidth="4" filter="url(#glow)"/>
            <text x={nx+25} y={ny-25} fill="#fff" fontSize="24" fontWeight="extrabold">({n.id})</text>

            {/* Point Loads */}
            {n.H !== 0 && (
              <g>
                <line x1={nx - (n.H > 0 ? 250 : -250)} y1={ny} x2={nx - (n.H > 0 ? 35 : -35)} y2={ny} stroke="#c084fc" strokeWidth="8" markerEnd="url(#arrowhead)"/>
                <text x={nx - (n.H > 0 ? 270 : -270)} y={ny-10} fill="#c084fc" fontSize="40" fontWeight="900" stroke="#000" strokeWidth="8" style={{ paintOrder: 'stroke fill' }}>{n.H} N</text>
              </g>
            )}
          </g>
        )
      })}
    </>
  );

  return (
    <div className="w-full relative rounded-3xl border border-white/20 bg-black/60 shadow-[inset_0_5px_30px_rgba(0,0,0,0.8)] p-6 flex flex-col items-center group overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 rounded-3xl pointer-events-none"></div>

      {(!nodes || nodes.length === 0) ? (
        <div className="h-[400px] flex items-center justify-center text-zinc-500 font-mono tracking-widest text-sm">
          AWAITING GEOMETRY DATA...
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox={`0 0 ${V_WIDTH} ${V_HEIGHT}`} preserveAspectRatio="xMidYMid meet" className="w-full h-auto max-h-[600px] drop-shadow-[0_0_25px_rgba(34,211,238,0.3)]">
            {svgContent}
          </svg>
        </div>
      )}
      
      {nodes?.length > 0 && (
        <div className="absolute top-6 left-6 bg-black/60 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm pointer-events-none">
          <p className="text-cyan-300 text-xs font-mono font-bold tracking-widest">STRUCTURE CANVAS</p>
        </div>
      )}
    </div>
  );
}
