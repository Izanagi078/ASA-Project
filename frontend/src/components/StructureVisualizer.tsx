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

  // 1. Calculate bounding box and scale
  const bounds = useMemo(() => {
    if (!nodes || nodes.length === 0) return { minX: 0, maxX: 10, minY: 0, maxY: 10, scale: 1, padX: 0, padY: 0, VIEWPORT_SIZE: 1000, cx: 5, cy: 5 };
    
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y);
    });

    const dx = maxX - minX || 1;
    const dy = maxY - minY || 1;
    
    const VIEWPORT_SIZE = 1200;
    // 2.5x padding guarantees arrows and text drawn far outside never get cropped
    const paddingMultiplier = 2.5; 
    
    const maxDim = Math.max(dx, dy) * paddingMultiplier;
    const scale = VIEWPORT_SIZE / maxDim;

    const actualWidthInPixels = dx * scale;
    const actualHeightInPixels = dy * scale;
    
    const padX = (VIEWPORT_SIZE - actualWidthInPixels) / 2;
    const padY = (VIEWPORT_SIZE - actualHeightInPixels) / 2;

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    return { minX, maxX, minY, maxY, scale, padX, padY, VIEWPORT_SIZE, cx, cy };
  }, [nodes]);

  // Math to SVG Coordinate mapping (SVG Y-axis is inverted)
  const mapX = (x: number) => ((x - bounds.minX) * bounds.scale) + bounds.padX;
  const mapY = (y: number) => bounds.VIEWPORT_SIZE - (((y - bounds.minY) * bounds.scale) + bounds.padY);

  const getNode = (id: number) => nodes.find(n => n.id === id);

  // Helper function: Strictly enforce directions and outward placement for Beams
  const getLoadVectors = (mag1: number, mag2: number, n1: Node, n2: Node) => {
    const isHorizontal = Math.abs(n2.y - n1.y) < 0.1;
    const isVertical = Math.abs(n2.x - n1.x) < 0.1;
    
    const maxW = Math.max(Math.abs(mag1), Math.abs(mag2));
    const sign = (mag1 || mag2) > 0 ? 1 : -1;
    
    // 1. Force the strict math direction
    let mathDirX = 0;
    let mathDirY = 0;
    const L = Math.hypot(n2.x - n1.x, n2.y - n1.y) || 1;
    
    if (isHorizontal) {
        mathDirY = sign; // Positive = UP
    } else if (isVertical) {
        mathDirX = sign; // Positive = RIGHT
    } else {
        const normX = -(n2.y - n1.y) / L;
        const normY = (n2.x - n1.x) / L;
        mathDirX = normX * sign;
        mathDirY = normY * sign;
    }
    
    // 2. Convert to SVG directions (Y goes down in SVG)
    const svgDirX = mathDirX;
    const svgDirY = -mathDirY;
    
    // 3. Determine if this direction naturally points away from the structure center
    const beamCx = (n1.x + n2.x) / 2;
    const beamCy = (n1.y + n2.y) / 2;
    let outX = beamCx - bounds.cx;
    let outY = beamCy - bounds.cy;
    
    // Fallback if the beam is perfectly in the center of the structure
    if (Math.abs(outX) < 0.1 && Math.abs(outY) < 0.1) {
        outX = mathDirX; outY = mathDirY;
    }
    
    // Dot product determines if drawing it naturally pushes it INWARD or OUTWARD
    const isOutward = (mathDirX * outX + mathDirY * outY) >= 0;
    
    return { svgDirX, svgDirY, isOutward, maxW };
  };

  const svgContent = (
    <>
      <defs>
        <marker id="arrow_node" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          <polygon points="0 1, 10 5, 0 9" fill="#c084fc" />
        </marker>
        <marker id="arrow_load" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <polygon points="0 1, 8 4, 0 7" fill="#f472b6" />
        </marker>
        <marker id="arrow_load_uvl" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <polygon points="0 1, 8 4, 0 7" fill="#f87171" />
        </marker>
        {/* ADDED filterUnits="userSpaceOnUse" to fix invisible horizontal/vertical beams */}
        <filter id="glow" filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur3" />
          <feMerge>
            <feMergeNode in="blur3"/>
            <feMergeNode in="blur2"/>
            <feMergeNode in="blur1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* MEMBERS & DISTRIBUTED LOADS */}
      {members.map(m => {
        const n1 = getNode(m.node_i);
        const n2 = getNode(m.node_j);
        if (!n1 || !n2) return null;
        
        const x1 = mapX(n1.x);
        const y1 = mapY(n1.y);
        const x2 = mapX(n2.x);
        const y2 = mapY(n2.y);

        return (
          <g key={`m_${m.id}`}>
            {/* Beam Line */}
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" filter="url(#glow)"/>
            <text x={(x1+x2)/2} y={(y1+y2)/2 - 20} fill="#a5f3fc" fontSize="16" fontWeight="bold" textAnchor="middle">[{m.id}]</text>

            {/* UDL Graphic */}
            {m.udl !== 0 && (
              <g>
                {(() => {
                  const { svgDirX, svgDirY, isOutward } = getLoadVectors(m.udl, m.udl, n1, n2);
                  const gap = 15;
                  const length = 60;
                  
                  // Base drawing coordinates based on inside/outside check
                  const tailOff = isOutward ? gap : -(gap + length);
                  const headOff = isOutward ? gap + length : -gap;
                  
                  // Outer bounding line
                  const boundingOffset = isOutward ? headOff : tailOff;
                  const dl_x1 = x1 + svgDirX * boundingOffset;
                  const dl_y1 = y1 + svgDirY * boundingOffset;
                  const dl_x2 = x2 + svgDirX * boundingOffset;
                  const dl_y2 = y2 + svgDirY * boundingOffset;
                  
                  // Text offset pushes it slightly further out past the boundary
                  const textOff = isOutward ? headOff + 25 : tailOff - 25;

                  return (
                    <>
                      <path d={`M ${dl_x1} ${dl_y1} L ${dl_x2} ${dl_y2}`} stroke="#f472b6" strokeWidth="2" strokeDasharray="4,4" />
                      
                      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((t, i) => {
                        const px = x1 + (x2-x1)*t;
                        const py = y1 + (y2-y1)*t;
                        const startX = px + svgDirX * tailOff;
                        const startY = py + svgDirY * tailOff;
                        const endX = px + svgDirX * headOff;
                        const endY = py + svgDirY * headOff;

                        return <line key={`udl_${i}`} x1={startX} y1={startY} x2={endX} y2={endY} stroke="#f472b6" strokeWidth="2" markerEnd="url(#arrow_load)"/>
                      })}
                      
                      <text x={(dl_x1+dl_x2)/2 + svgDirX*15} y={(dl_y1+dl_y2)/2 + svgDirY*15 + 5} fill="#f472b6" fontSize="16" fontWeight="bold" textAnchor="middle">
                        {Math.abs(m.udl)} N/m
                      </text>
                    </>
                  );
                })()}
              </g>
            )}

            {/* Trapezoidal / UVL Graphic */}
            {(m.w1 !== 0 || m.w2 !== 0) && (
              <g>
                {(() => {
                  const { svgDirX, svgDirY, isOutward, maxW } = getLoadVectors(m.w1, m.w2, n1, n2);
                  const gap = 15;
                  
                  const h1 = maxW ? (Math.abs(m.w1) / maxW) * 70 : 0;
                  const h2 = maxW ? (Math.abs(m.w2) / maxW) * 70 : 0;

                  const bound1Off = isOutward ? gap + h1 : -(gap + h1);
                  const bound2Off = isOutward ? gap + h2 : -(gap + h2);

                  const dl_x1 = x1 + svgDirX * bound1Off;
                  const dl_y1 = y1 + svgDirY * bound1Off;
                  const dl_x2 = x2 + svgDirX * bound2Off;
                  const dl_y2 = y2 + svgDirY * bound2Off;

                  return (
                    <>
                      <path d={`M ${dl_x1} ${dl_y1} L ${dl_x2} ${dl_y2}`} stroke="#f87171" strokeWidth="2" />
                      
                      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((t, i) => {
                        const px = x1 + (x2-x1)*t;
                        const py = y1 + (y2-y1)*t;
                        const currentW = Math.abs(m.w1) * (1-t) + Math.abs(m.w2) * t;
                        if (currentW < 0.1) return null;
                        
                        const h = maxW ? (currentW / maxW) * 70 : 0;
                        const tailOff = isOutward ? gap : -(gap + h);
                        const headOff = isOutward ? gap + h : -gap;
                        
                        const startX = px + svgDirX * tailOff;
                        const startY = py + svgDirY * tailOff;
                        const endX = px + svgDirX * headOff;
                        const endY = py + svgDirY * headOff;
                        
                        return <line key={`uvl_${i}`} x1={startX} y1={startY} x2={endX} y2={endY} stroke="#f87171" strokeWidth="2" markerEnd="url(#arrow_load_uvl)"/>
                      })}
                      
                      <text x={(dl_x1+dl_x2)/2 + svgDirX*15} y={(dl_y1+dl_y2)/2 + svgDirY*15 + 5} fill="#f87171" fontSize="16" fontWeight="bold" textAnchor="middle">
                        UVL: {Math.abs(m.w1)} to {Math.abs(m.w2)}
                      </text>
                    </>
                  );
                })()}
              </g>
            )}
          </g>
        )
      })}

      {/* NODES & BOUNDARY CONDITIONS */}
      {nodes.map(n => {
        const nx = mapX(n.x);
        const ny = mapY(n.y);

        const isFixed = n.u === 0 && n.v === 0 && n.theta === 0;
        const isPinned = n.u === 0 && n.v === 0 && n.theta === 1;
        const isRollerX = n.u === 1 && n.v === 0 && n.theta === 1;

        return (
          <g key={`n_${n.id}`}>
            {/* SUPPORTS */}
            {isFixed && (
              <g>
                <line x1={nx-25} y1={ny} x2={nx-25} y2={ny+30} stroke="#d4d4d8" strokeWidth="4" /> 
                <line x1={nx-25} y1={ny+15} x2={nx+25} y2={ny+15} stroke="#d4d4d8" strokeWidth="4" />
                {[-20, -10, 0, 10, 20].map((off, i) => (
                  <line key={i} x1={nx+off} y1={ny+15} x2={nx+off-8} y2={ny+28} stroke="#d4d4d8" strokeWidth="2" />
                ))}
              </g>
            )}
            
            {isPinned && (
              <g>
                <polygon points={`${nx},${ny+6} ${nx-15},${ny+25} ${nx+15},${ny+25}`} fill="#52525b" stroke="#d4d4d8" strokeWidth="2" />
                <line x1={nx-25} y1={ny+25} x2={nx+25} y2={ny+25} stroke="#d4d4d8" strokeWidth="3" />
              </g>
            )}

            {isRollerX && (
              <g>
                <polygon points={`${nx},${ny+6} ${nx-15},${ny+20} ${nx+15},${ny+20}`} fill="#52525b" stroke="#d4d4d8" strokeWidth="2" />
                <circle cx={nx-8} cy={ny+24} r="4" fill="#d4d4d8" />
                <circle cx={nx+8} cy={ny+24} r="4" fill="#d4d4d8" />
                <line x1={nx-25} y1={ny+28} x2={nx+25} y2={ny+28} stroke="#d4d4d8" strokeWidth="3" />
              </g>
            )}

            {/* NODE CIRCLE */}
            <circle cx={nx} cy={ny} r="8" fill="#e879f9" stroke="#fff" strokeWidth="2" />
            <text x={nx+18} y={ny-18} fill="#fff" fontSize="16" fontWeight="bold">N{n.id}</text>

            {/* NODAL POINT LOADS */}
            {n.H !== 0 && (() => {
                const mathDirX = n.H > 0 ? 1 : -1;
                const svgDirX = mathDirX; 
                let outX = n.x - bounds.cx;
                if (Math.abs(outX) < 0.1) outX = mathDirX;
                
                const isOutward = (mathDirX * outX) >= 0;
                const gap = 15;
                const length = 60;
                
                const tailOff = isOutward ? gap : -(gap + length);
                const headOff = isOutward ? gap + length : -gap;
                const textOff = isOutward ? headOff + 25 : tailOff - 25;

                return (
                  <g>
                    <line x1={nx + svgDirX * tailOff} y1={ny} x2={nx + svgDirX * headOff} y2={ny} stroke="#c084fc" strokeWidth="3" markerEnd="url(#arrow_node)"/>
                    <text x={nx + svgDirX * textOff} y={ny-8} fill="#c084fc" fontSize="16" fontWeight="bold" textAnchor="middle">{Math.abs(n.H)} N</text>
                  </g>
                );
            })()}

            {n.V !== 0 && (() => {
                const mathDirY = n.V > 0 ? 1 : -1;
                const svgDirY = -mathDirY; 
                let outY = n.y - bounds.cy;
                if (Math.abs(outY) < 0.1) outY = mathDirY;
                
                const isOutward = (mathDirY * outY) >= 0;
                const gap = 15;
                const length = 60;
                
                const tailOff = isOutward ? gap : -(gap + length);
                const headOff = isOutward ? gap + length : -gap;
                const textOff = isOutward ? headOff + 20 : tailOff - 20;

                return (
                  <g>
                    <line x1={nx} y1={ny + svgDirY * tailOff} x2={nx} y2={ny + svgDirY * headOff} stroke="#c084fc" strokeWidth="3" markerEnd="url(#arrow_node)"/>
                    <text x={nx + 15} y={ny + svgDirY * textOff} fill="#c084fc" fontSize="16" fontWeight="bold" dominantBaseline="middle">{Math.abs(n.V)} N</text>
                  </g>
                );
            })()}
          </g>
        )
      })}
    </>
  );

  return (
    <div className="w-full relative rounded-xl border border-zinc-800 bg-zinc-950 p-4 flex flex-col items-center overflow-hidden">
      {(!nodes || nodes.length === 0) ? (
        <div className="h-[400px] flex items-center justify-center text-zinc-600 font-mono text-sm">
          AWAITING GEOMETRY DATA...
        </div>
      ) : (
        <div className="w-full max-w-4xl flex items-center justify-center p-4">
          <svg viewBox={`0 0 ${bounds.VIEWPORT_SIZE} ${bounds.VIEWPORT_SIZE}`} className="w-full h-auto max-h-[700px]">
            {svgContent}
          </svg>
        </div>
      )}
    </div>
  );
}