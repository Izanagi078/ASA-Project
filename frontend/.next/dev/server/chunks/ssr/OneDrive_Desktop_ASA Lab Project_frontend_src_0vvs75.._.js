module.exports = [
"[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StructureVisualizer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function StructureVisualizer({ nodes, members }) {
    // 1. Calculate bounding box and scale
    const bounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!nodes || nodes.length === 0) return {
            minX: 0,
            maxX: 10,
            minY: 0,
            maxY: 10,
            scale: 1,
            padX: 0,
            padY: 0,
            VIEWPORT_SIZE: 1000,
            cx: 5,
            cy: 5
        };
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        nodes.forEach((n)=>{
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
        return {
            minX,
            maxX,
            minY,
            maxY,
            scale,
            padX,
            padY,
            VIEWPORT_SIZE,
            cx,
            cy
        };
    }, [
        nodes
    ]);
    // Math to SVG Coordinate mapping (SVG Y-axis is inverted)
    const mapX = (x)=>(x - bounds.minX) * bounds.scale + bounds.padX;
    const mapY = (y)=>bounds.VIEWPORT_SIZE - ((y - bounds.minY) * bounds.scale + bounds.padY);
    const getNode = (id)=>nodes.find((n)=>n.id === id);
    // Helper function: Strictly enforce directions and outward placement for Beams
    const getLoadVectors = (mag1, mag2, n1, n2)=>{
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
            outX = mathDirX;
            outY = mathDirY;
        }
        // Dot product determines if drawing it naturally pushes it INWARD or OUTWARD
        const isOutward = mathDirX * outX + mathDirY * outY >= 0;
        return {
            svgDirX,
            svgDirY,
            isOutward,
            maxW
        };
    };
    const svgContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("marker", {
                        id: "arrow_node",
                        markerWidth: "10",
                        markerHeight: "10",
                        refX: "9",
                        refY: "5",
                        orient: "auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                            points: "0 1, 10 5, 0 9",
                            fill: "#c084fc"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                            lineNumber: 109,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("marker", {
                        id: "arrow_load",
                        markerWidth: "8",
                        markerHeight: "8",
                        refX: "7",
                        refY: "4",
                        orient: "auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                            points: "0 1, 8 4, 0 7",
                            fill: "#f472b6"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                            lineNumber: 112,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("marker", {
                        id: "arrow_load_uvl",
                        markerWidth: "8",
                        markerHeight: "8",
                        refX: "7",
                        refY: "4",
                        orient: "auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                            points: "0 1, 8 4, 0 7",
                            fill: "#f87171"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                            lineNumber: 115,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                        id: "glow",
                        filterUnits: "userSpaceOnUse",
                        x: "-50%",
                        y: "-50%",
                        width: "200%",
                        height: "200%",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feGaussianBlur", {
                                in: "SourceGraphic",
                                stdDeviation: "4",
                                result: "blur1"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feGaussianBlur", {
                                in: "SourceGraphic",
                                stdDeviation: "10",
                                result: "blur2"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                lineNumber: 120,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feGaussianBlur", {
                                in: "SourceGraphic",
                                stdDeviation: "20",
                                result: "blur3"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                lineNumber: 121,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feMerge", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feMergeNode", {
                                        in: "blur3"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                        lineNumber: 123,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feMergeNode", {
                                        in: "blur2"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                        lineNumber: 124,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feMergeNode", {
                                        in: "blur1"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                        lineNumber: 125,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feMergeNode", {
                                        in: "SourceGraphic"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                        lineNumber: 126,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                lineNumber: 122,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this),
            members.map((m)=>{
                const n1 = getNode(m.node_i);
                const n2 = getNode(m.node_j);
                if (!n1 || !n2) return null;
                const x1 = mapX(n1.x);
                const y1 = mapY(n1.y);
                const x2 = mapX(n2.x);
                const y2 = mapY(n2.y);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: x1,
                            y1: y1,
                            x2: x2,
                            y2: y2,
                            stroke: "#22d3ee",
                            strokeWidth: "6",
                            strokeLinecap: "round",
                            filter: "url(#glow)"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                            lineNumber: 145,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: (x1 + x2) / 2,
                            y: (y1 + y2) / 2 - 20,
                            fill: "#a5f3fc",
                            fontSize: "16",
                            fontWeight: "bold",
                            textAnchor: "middle",
                            children: [
                                "[",
                                m.id,
                                "]"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                            lineNumber: 146,
                            columnNumber: 13
                        }, this),
                        m.udl !== 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            children: (()=>{
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
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: `M ${dl_x1} ${dl_y1} L ${dl_x2} ${dl_y2}`,
                                            stroke: "#f472b6",
                                            strokeWidth: "2",
                                            strokeDasharray: "4,4"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                            lineNumber: 172,
                                            columnNumber: 23
                                        }, this),
                                        [
                                            0,
                                            0.2,
                                            0.4,
                                            0.6,
                                            0.8,
                                            1
                                        ].map((t, i)=>{
                                            const px = x1 + (x2 - x1) * t;
                                            const py = y1 + (y2 - y1) * t;
                                            const startX = px + svgDirX * tailOff;
                                            const startY = py + svgDirY * tailOff;
                                            const endX = px + svgDirX * headOff;
                                            const endY = py + svgDirY * headOff;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: startX,
                                                y1: startY,
                                                x2: endX,
                                                y2: endY,
                                                stroke: "#f472b6",
                                                strokeWidth: "2",
                                                markerEnd: "url(#arrow_load)"
                                            }, `udl_${i}`, false, {
                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                                lineNumber: 182,
                                                columnNumber: 32
                                            }, this);
                                        }),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                            x: (dl_x1 + dl_x2) / 2 + svgDirX * 15,
                                            y: (dl_y1 + dl_y2) / 2 + svgDirY * 15 + 5,
                                            fill: "#f472b6",
                                            fontSize: "16",
                                            fontWeight: "bold",
                                            textAnchor: "middle",
                                            children: [
                                                Math.abs(m.udl),
                                                " N/m"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                            lineNumber: 185,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true);
                            })()
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                            lineNumber: 150,
                            columnNumber: 15
                        }, this),
                        (m.w1 !== 0 || m.w2 !== 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            children: (()=>{
                                const { svgDirX, svgDirY, isOutward, maxW } = getLoadVectors(m.w1, m.w2, n1, n2);
                                const gap = 15;
                                const h1 = maxW ? Math.abs(m.w1) / maxW * 70 : 0;
                                const h2 = maxW ? Math.abs(m.w2) / maxW * 70 : 0;
                                const bound1Off = isOutward ? gap + h1 : -(gap + h1);
                                const bound2Off = isOutward ? gap + h2 : -(gap + h2);
                                const dl_x1 = x1 + svgDirX * bound1Off;
                                const dl_y1 = y1 + svgDirY * bound1Off;
                                const dl_x2 = x2 + svgDirX * bound2Off;
                                const dl_y2 = y2 + svgDirY * bound2Off;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: `M ${dl_x1} ${dl_y1} L ${dl_x2} ${dl_y2}`,
                                            stroke: "#f87171",
                                            strokeWidth: "2"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                            lineNumber: 214,
                                            columnNumber: 23
                                        }, this),
                                        [
                                            0,
                                            0.2,
                                            0.4,
                                            0.6,
                                            0.8,
                                            1
                                        ].map((t, i)=>{
                                            const px = x1 + (x2 - x1) * t;
                                            const py = y1 + (y2 - y1) * t;
                                            const currentW = Math.abs(m.w1) * (1 - t) + Math.abs(m.w2) * t;
                                            if (currentW < 0.1) return null;
                                            const h = maxW ? currentW / maxW * 70 : 0;
                                            const tailOff = isOutward ? gap : -(gap + h);
                                            const headOff = isOutward ? gap + h : -gap;
                                            const startX = px + svgDirX * tailOff;
                                            const startY = py + svgDirY * tailOff;
                                            const endX = px + svgDirX * headOff;
                                            const endY = py + svgDirY * headOff;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: startX,
                                                y1: startY,
                                                x2: endX,
                                                y2: endY,
                                                stroke: "#f87171",
                                                strokeWidth: "2",
                                                markerEnd: "url(#arrow_load_uvl)"
                                            }, `uvl_${i}`, false, {
                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                                lineNumber: 231,
                                                columnNumber: 32
                                            }, this);
                                        }),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                            x: (dl_x1 + dl_x2) / 2 + svgDirX * 15,
                                            y: (dl_y1 + dl_y2) / 2 + svgDirY * 15 + 5,
                                            fill: "#f87171",
                                            fontSize: "16",
                                            fontWeight: "bold",
                                            textAnchor: "middle",
                                            children: [
                                                "UVL: ",
                                                Math.abs(m.w1),
                                                " to ",
                                                Math.abs(m.w2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                            lineNumber: 234,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true);
                            })()
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                            lineNumber: 196,
                            columnNumber: 15
                        }, this)
                    ]
                }, `m_${m.id}`, true, {
                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                    lineNumber: 143,
                    columnNumber: 11
                }, this);
            }),
            nodes.map((n)=>{
                const nx = mapX(n.x);
                const ny = mapY(n.y);
                const isFixed = n.u === 0 && n.v === 0 && n.theta === 0;
                const isPinned = n.u === 0 && n.v === 0 && n.theta === 1;
                const isRollerX = n.u === 1 && n.v === 0 && n.theta === 1;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    children: [
                        isFixed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: nx - 25,
                                    y1: ny,
                                    x2: nx - 25,
                                    y2: ny + 30,
                                    stroke: "#d4d4d8",
                                    strokeWidth: "4"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                    lineNumber: 260,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: nx - 25,
                                    y1: ny + 15,
                                    x2: nx + 25,
                                    y2: ny + 15,
                                    stroke: "#d4d4d8",
                                    strokeWidth: "4"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                    lineNumber: 261,
                                    columnNumber: 17
                                }, this),
                                [
                                    -20,
                                    -10,
                                    0,
                                    10,
                                    20
                                ].map((off, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: nx + off,
                                        y1: ny + 15,
                                        x2: nx + off - 8,
                                        y2: ny + 28,
                                        stroke: "#d4d4d8",
                                        strokeWidth: "2"
                                    }, i, false, {
                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                        lineNumber: 263,
                                        columnNumber: 19
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                            lineNumber: 259,
                            columnNumber: 15
                        }, this),
                        isPinned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                    points: `${nx},${ny + 6} ${nx - 15},${ny + 25} ${nx + 15},${ny + 25}`,
                                    fill: "#52525b",
                                    stroke: "#d4d4d8",
                                    strokeWidth: "2"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                    lineNumber: 270,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: nx - 25,
                                    y1: ny + 25,
                                    x2: nx + 25,
                                    y2: ny + 25,
                                    stroke: "#d4d4d8",
                                    strokeWidth: "3"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                    lineNumber: 271,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                            lineNumber: 269,
                            columnNumber: 15
                        }, this),
                        isRollerX && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                    points: `${nx},${ny + 6} ${nx - 15},${ny + 20} ${nx + 15},${ny + 20}`,
                                    fill: "#52525b",
                                    stroke: "#d4d4d8",
                                    strokeWidth: "2"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                    lineNumber: 277,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: nx - 8,
                                    cy: ny + 24,
                                    r: "4",
                                    fill: "#d4d4d8"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                    lineNumber: 278,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: nx + 8,
                                    cy: ny + 24,
                                    r: "4",
                                    fill: "#d4d4d8"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                    lineNumber: 279,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: nx - 25,
                                    y1: ny + 28,
                                    x2: nx + 25,
                                    y2: ny + 28,
                                    stroke: "#d4d4d8",
                                    strokeWidth: "3"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                    lineNumber: 280,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                            lineNumber: 276,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: nx,
                            cy: ny,
                            r: "8",
                            fill: "#e879f9",
                            stroke: "#fff",
                            strokeWidth: "2"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                            lineNumber: 285,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: nx + 18,
                            y: ny - 18,
                            fill: "#fff",
                            fontSize: "16",
                            fontWeight: "bold",
                            children: [
                                "N",
                                n.id
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                            lineNumber: 286,
                            columnNumber: 13
                        }, this),
                        n.H !== 0 && (()=>{
                            const mathDirX = n.H > 0 ? 1 : -1;
                            const svgDirX = mathDirX;
                            let outX = n.x - bounds.cx;
                            if (Math.abs(outX) < 0.1) outX = mathDirX;
                            const isOutward = mathDirX * outX >= 0;
                            const gap = 15;
                            const length = 60;
                            const tailOff = isOutward ? gap : -(gap + length);
                            const headOff = isOutward ? gap + length : -gap;
                            const textOff = isOutward ? headOff + 25 : tailOff - 25;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: nx + svgDirX * tailOff,
                                        y1: ny,
                                        x2: nx + svgDirX * headOff,
                                        y2: ny,
                                        stroke: "#c084fc",
                                        strokeWidth: "3",
                                        markerEnd: "url(#arrow_node)"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                        lineNumber: 305,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: nx + svgDirX * textOff,
                                        y: ny - 8,
                                        fill: "#c084fc",
                                        fontSize: "16",
                                        fontWeight: "bold",
                                        textAnchor: "middle",
                                        children: [
                                            Math.abs(n.H),
                                            " N"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                        lineNumber: 306,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                lineNumber: 304,
                                columnNumber: 19
                            }, this);
                        })(),
                        n.V !== 0 && (()=>{
                            const mathDirY = n.V > 0 ? 1 : -1;
                            const svgDirY = -mathDirY;
                            let outY = n.y - bounds.cy;
                            if (Math.abs(outY) < 0.1) outY = mathDirY;
                            const isOutward = mathDirY * outY >= 0;
                            const gap = 15;
                            const length = 60;
                            const tailOff = isOutward ? gap : -(gap + length);
                            const headOff = isOutward ? gap + length : -gap;
                            const textOff = isOutward ? headOff + 20 : tailOff - 20;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: nx,
                                        y1: ny + svgDirY * tailOff,
                                        x2: nx,
                                        y2: ny + svgDirY * headOff,
                                        stroke: "#c084fc",
                                        strokeWidth: "3",
                                        markerEnd: "url(#arrow_node)"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                        lineNumber: 327,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: nx + 15,
                                        y: ny + svgDirY * textOff,
                                        fill: "#c084fc",
                                        fontSize: "16",
                                        fontWeight: "bold",
                                        dominantBaseline: "middle",
                                        children: [
                                            Math.abs(n.V),
                                            " N"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                        lineNumber: 328,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                                lineNumber: 326,
                                columnNumber: 19
                            }, this);
                        })()
                    ]
                }, `n_${n.id}`, true, {
                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                    lineNumber: 256,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full relative rounded-xl border border-zinc-800 bg-zinc-950 p-4 flex flex-col items-center overflow-hidden",
        children: !nodes || nodes.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-[400px] flex items-center justify-center text-zinc-600 font-mono text-sm",
            children: "AWAITING GEOMETRY DATA..."
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
            lineNumber: 341,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-4xl flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                viewBox: `0 0 ${bounds.VIEWPORT_SIZE} ${bounds.VIEWPORT_SIZE}`,
                className: "w-full h-auto max-h-[700px]",
                children: svgContent
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
                lineNumber: 346,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
            lineNumber: 345,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx",
        lineNumber: 339,
        columnNumber: 5
    }, this);
}
}),
"[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/node_modules/framer-motion/dist/es/value/use-transform.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/node_modules/framer-motion/dist/es/value/use-motion-value.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/node_modules/lucide-react/dist/esm/icons/upload.js [app-ssr] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/node_modules/lucide-react/dist/esm/icons/database.js [app-ssr] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$commit$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GitCommit$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/node_modules/lucide-react/dist/esm/icons/git-commit-horizontal.js [app-ssr] (ecmascript) <export default as GitCommit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/node_modules/lucide-react/dist/esm/icons/layers.js [app-ssr] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$no$2d$axes$2d$column$2d$increasing$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/node_modules/lucide-react/dist/esm/icons/chart-no-axes-column-increasing.js [app-ssr] (ecmascript) <export default as BarChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$src$2f$components$2f$StructureVisualizer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/components/StructureVisualizer.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
// Magical Glitter Trail Component
const GlitterTrail = ()=>{
    const [particles, setParticles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let id = 0;
        const colors = [
            "bg-cyan-300",
            "bg-purple-400",
            "bg-fuchsia-400",
            "bg-blue-300"
        ];
        // Throttle particle creation slightly to avoid hundreds of DOM nodes spanning instantly
        let lastTime = 0;
        const handleMouseMove = (e)=>{
            const now = Date.now();
            if (now - lastTime < 15) return; // spawn roughly every 15ms at most
            lastTime = now;
            // Random jitter for the glitter effect
            const jitterX = (Math.random() - 0.5) * 20;
            const jitterY = (Math.random() - 0.5) * 20;
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const newParticle = {
                id: id++,
                x: e.clientX + jitterX,
                y: e.clientY + jitterY,
                color: randomColor
            };
            setParticles((prev)=>[
                    ...prev.slice(-30),
                    newParticle
                ]); // keep max 30 for performance
            // Auto-remove glitters
            setTimeout(()=>{
                setParticles((prev)=>prev.filter((p)=>p.id !== newParticle.id));
            }, 700);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return ()=>window.removeEventListener("mousemove", handleMouseMove);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pointer-events-none fixed inset-0 z-50 overflow-hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            children: particles.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 1,
                        scale: Math.random() * 1.5 + 0.5,
                        x: p.x,
                        y: p.y,
                        rotate: 0
                    },
                    animate: {
                        opacity: 0,
                        scale: 0,
                        x: p.x,
                        y: p.y + 40,
                        rotate: 180
                    },
                    exit: {
                        opacity: 0
                    },
                    transition: {
                        duration: 0.7,
                        ease: "easeOut"
                    },
                    className: `absolute w-1.5 h-1.5 ${p.color} rounded-sm shadow-[0_0_15px_currentColor]`,
                    style: {
                        left: 0,
                        top: 0
                    }
                }, p.id, false, {
                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                    lineNumber: 54,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)))
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
            lineNumber: 52,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
function Home() {
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("upload");
    const [manualSubTab, setManualSubTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("nodes");
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAnalyzing, setIsAnalyzing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleExportPDF = ()=>{
        if (!results) {
            alert("No data to export. Please run analysis first.");
            return;
        }
        // Simple native print call
        window.print();
    };
    const handleFileUpload = async (e)=>{
        if (!e.target.files?.[0]) return;
        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        try {
            const res = await fetch("http://localhost:8000/api/analyze/upload", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.status === "success") {
                setResults(data.results);
                setActiveTab("results");
            } else {
                alert(data.error || "Analysis failed");
            }
        } catch (err) {
            alert("Error connecting to Engine API");
        } finally{
            setIsAnalyzing(false);
        }
    };
    // 3D Parallax Tilt Effect for the main container
    const cardX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMotionValue"])(0);
    const cardY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMotionValue"])(0);
    const rotateX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransform"])(cardY, [
        -300,
        300
    ], [
        5,
        -5
    ]); // Invert Y for correct tilt
    const rotateY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransform"])(cardX, [
        -400,
        400
    ], [
        -5,
        5
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
        const handleMouseMove = (e)=>{
            // Calculate relative position to screen center for 3D tilt
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            cardX.set(e.clientX - centerX);
            cardY.set(e.clientY - centerY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return ()=>window.removeEventListener("mousemove", handleMouseMove);
    }, [
        cardX,
        cardY
    ]);
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col min-h-screen relative overflow-hidden bg-[#030014] perspective-[2000px]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GlitterTrail, {}, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[120px] pointer-events-none z-0"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none z-0"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/[0.05] bg-black/40 backdrop-blur-xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-2 bg-gradient-to-br from-[#c084fc] to-[#7e22ce] rounded-xl text-white shadow-[0_0_25px_rgba(168,85,247,0.6)]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                    size: 24
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                    lineNumber: 142,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                lineNumber: 141,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-xl font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]",
                                        children: "CIL3060"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                        lineNumber: 145,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] text-purple-300 font-bold tracking-widest uppercase opacity-80",
                                        children: "Structural Engine"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                        lineNumber: 146,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "hidden md:flex items-center gap-1 bg-white/[0.05] p-1.5 rounded-full border border-white/[0.1] shadow-inner backdrop-blur-md",
                        children: [
                            "upload",
                            "manual",
                            "results"
                        ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab(tab),
                                className: `px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === tab ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-400/50" : "text-zinc-400 hover:text-white hover:bg-white/10"}`,
                                children: tab.charAt(0).toUpperCase() + tab.slice(1)
                            }, tab, false, {
                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 container mx-auto px-4 py-16 flex flex-col items-center relative z-10 preserve-3d",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 30
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.8,
                            ease: "easeOut"
                        },
                        className: "max-w-4xl text-center mb-16",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-900/40 border border-purple-400/40 text-xs font-black text-purple-100 mb-8 shadow-[0_0_25px_rgba(168,85,247,0.5)] backdrop-blur-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "relative flex h-2.5 w-2.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                lineNumber: 177,
                                                columnNumber: 16
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,1)]"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                lineNumber: 178,
                                                columnNumber: 16
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                        lineNumber: 176,
                                        columnNumber: 14
                                    }, this),
                                    "Direct Stiffness Method Core"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                lineNumber: 175,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]",
                                children: [
                                    "Elastic Structural ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                        className: "hidden md:block"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                        lineNumber: 183,
                                        columnNumber: 32
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-fuchsia-300 to-cyan-300 drop-shadow-[0_0_40px_rgba(192,132,252,0.6)]",
                                        children: "Analysis Engine"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                        lineNumber: 184,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                lineNumber: 182,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed font-medium",
                                children: "The ultimate generic solver for plane frames. Define your geometry via elegant forms or direct file upload to compute intricate displacements and forces."
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                lineNumber: 186,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        mode: "wait",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                scale: 0.95,
                                y: 20
                            },
                            animate: {
                                opacity: 1,
                                scale: 1,
                                y: 0
                            },
                            exit: {
                                opacity: 0,
                                scale: 0.95,
                                y: -20
                            },
                            transition: {
                                duration: 0.5,
                                ease: [
                                    0.23,
                                    1,
                                    0.32,
                                    1
                                ]
                            },
                            // The magic 3D parallax effect
                            style: {
                                rotateX,
                                rotateY,
                                transformStyle: "preserve-3d"
                            },
                            className: "w-full max-w-5xl bg-black/40 backdrop-blur-[40px] rounded-[2.5rem] p-6 md:p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-300/50 to-transparent pointer-events-none"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                    lineNumber: 204,
                                    columnNumber: 13
                                }, this),
                                activeTab === "upload" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative z-10 flex flex-col items-center justify-center py-24 border-2 border-dashed border-purple-500/30 rounded-3xl bg-black/30 hover:bg-purple-900/20 hover:border-purple-400/60 transition-all duration-500 cursor-pointer shadow-inner",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-24 h-24 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all duration-500",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                size: 40,
                                                className: "text-purple-300 drop-shadow-[0_0_10px_rgba(216,180,254,0.8)]"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                lineNumber: 210,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                            lineNumber: 209,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-3xl font-bold mb-3 text-white tracking-tight drop-shadow-md",
                                            children: "Upload Geometry Data"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                            lineNumber: 212,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-zinc-300 mb-10 text-center max-w-md text-lg font-medium",
                                            children: [
                                                "Drag and drop your ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-purple-300 font-bold",
                                                    children: ".txt"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 38
                                                }, this),
                                                " or ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-purple-300 font-bold",
                                                    children: ".xlsx"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 97
                                                }, this),
                                                " files containing nodal and member geometry."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                            lineNumber: 213,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col sm:flex-row gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/10 text-white border border-white/20 font-bold hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                            size: 20,
                                                            className: "text-purple-300"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                            lineNumber: 218,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Browse .TXT"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                    lineNumber: 217,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>fileInputRef.current?.click(),
                                                    className: "flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600/30 to-fuchsia-600/30 text-purple-100 border border-purple-400/40 font-bold hover:from-purple-500/40 hover:to-fuchsia-500/40 hover:shadow-[0_0_30px_rgba(192,132,252,0.5)] transition-all",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                                                            size: 20,
                                                            className: "text-fuchsia-300"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                            lineNumber: 222,
                                                            columnNumber: 21
                                                        }, this),
                                                        isAnalyzing ? "Analyzing..." : "Browse .XLSX"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                    lineNumber: 221,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "file",
                                                    accept: ".xlsx",
                                                    className: "hidden",
                                                    ref: fileInputRef,
                                                    onChange: handleFileUpload
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                    lineNumber: 225,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                            lineNumber: 216,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                    lineNumber: 208,
                                    columnNumber: 15
                                }, this),
                                activeTab === "manual" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative z-10",
                                    style: {
                                        transform: "translateZ(30px)"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-white/10 pb-6 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-2xl font-bold text-white mb-1 shadow-sm tracking-tight",
                                                            children: "Geometry Definition"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                            lineNumber: 235,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-zinc-300 font-medium",
                                                            children: "Configure nodal coordinates and member connectivity manually."
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                            lineNumber: 236,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                    lineNumber: 234,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex bg-black/60 p-1.5 rounded-xl border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setManualSubTab("nodes"),
                                                            className: `px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${manualSubTab === "nodes" ? "bg-purple-500/30 text-white border border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "text-zinc-400 hover:text-white"}`,
                                                            children: "Nodal Data"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                            lineNumber: 239,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setManualSubTab("members"),
                                                            className: `px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${manualSubTab === "members" ? "bg-fuchsia-500/30 text-white border border-fuchsia-400/40 shadow-[0_0_15px_rgba(217,70,239,0.4)]" : "text-zinc-400 hover:text-white"}`,
                                                            children: "Member Data"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                            lineNumber: 245,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                    lineNumber: 238,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                            lineNumber: 233,
                                            columnNumber: 17
                                        }, this),
                                        manualSubTab === "nodes" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                            initial: {
                                                opacity: 0,
                                                y: 10
                                            },
                                            animate: {
                                                opacity: 1,
                                                y: 0
                                            },
                                            transition: {
                                                duration: 0.4
                                            },
                                            className: "space-y-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 md:grid-cols-4 gap-5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-black/40 border border-white/10 p-5 rounded-2xl border-l-[4px] border-l-purple-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-purple-500/50 hover:shadow-[0_10px_40px_rgba(168,85,247,0.2)] transition-all backdrop-blur-md",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-sm font-black text-white mb-4 flex items-center gap-2 drop-shadow-md",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$commit$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GitCommit$3e$__["GitCommit"], {
                                                                        size: 18,
                                                                        className: "text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                        lineNumber: 258,
                                                                        columnNumber: 116
                                                                    }, this),
                                                                    " Node ID 1"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                lineNumber: 258,
                                                                columnNumber: 26
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-3 relative z-20",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        placeholder: "X Coord",
                                                                        className: "w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400/70 focus:bg-purple-900/20 transition-all font-mono shadow-inner"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                        lineNumber: 260,
                                                                        columnNumber: 28
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        placeholder: "Y Coord",
                                                                        className: "w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400/70 focus:bg-purple-900/20 transition-all font-mono shadow-inner"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                        lineNumber: 261,
                                                                        columnNumber: 28
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        className: "w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-purple-400/70 focus:bg-purple-900/20 transition-all font-medium shadow-inner",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                className: "bg-zinc-900",
                                                                                children: "Fixed"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                lineNumber: 263,
                                                                                columnNumber: 30
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                className: "bg-zinc-900",
                                                                                children: "Pinned"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                lineNumber: 264,
                                                                                columnNumber: 30
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                className: "bg-zinc-900",
                                                                                children: "Roller"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                lineNumber: 265,
                                                                                columnNumber: 30
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                className: "bg-zinc-900",
                                                                                children: "Free"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                lineNumber: 266,
                                                                                columnNumber: 30
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                        lineNumber: 262,
                                                                        columnNumber: 28
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        placeholder: "Force (Fx, Fy, Mz)",
                                                                        className: "w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400/70 focus:bg-purple-900/20 transition-all font-mono shadow-inner"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                        lineNumber: 268,
                                                                        columnNumber: 28
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                lineNumber: 259,
                                                                columnNumber: 26
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                        lineNumber: 257,
                                                        columnNumber: 24
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-zinc-400 hover:text-purple-200 hover:border-purple-400/60 transition-all cursor-pointer min-h-[280px] bg-black/20 hover:bg-purple-900/20 hover:shadow-[inset_0_0_30px_rgba(168,85,247,0.2)]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "p-4 rounded-full bg-white/5 mb-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                    size: 28,
                                                                    className: "drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                    lineNumber: 275,
                                                                    columnNumber: 28
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                lineNumber: 274,
                                                                columnNumber: 26
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-extrabold text-sm tracking-widest uppercase",
                                                                children: "Add Node"
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                lineNumber: 277,
                                                                columnNumber: 26
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                        lineNumber: 273,
                                                        columnNumber: 24
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                lineNumber: 256,
                                                columnNumber: 22
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                            lineNumber: 255,
                                            columnNumber: 20
                                        }, this),
                                        manualSubTab === "members" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                            initial: {
                                                opacity: 0,
                                                y: 10
                                            },
                                            animate: {
                                                opacity: 1,
                                                y: 0
                                            },
                                            transition: {
                                                duration: 0.4
                                            },
                                            className: "space-y-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 md:grid-cols-3 gap-5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-black/40 border border-white/10 p-5 rounded-2xl border-l-[4px] border-l-fuchsia-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-fuchsia-500/50 hover:shadow-[0_10px_40px_rgba(217,70,239,0.2)] transition-all backdrop-blur-md",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-sm font-black text-white mb-4 flex items-center gap-2 drop-shadow-md",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                                                        size: 18,
                                                                        className: "text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                        lineNumber: 287,
                                                                        columnNumber: 116
                                                                    }, this),
                                                                    " Member ID 1"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                lineNumber: 287,
                                                                columnNumber: 26
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "text",
                                                                                placeholder: "Start Node",
                                                                                className: "flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-fuchsia-400/70 focus:bg-fuchsia-900/20 transition-all font-mono shadow-inner"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                lineNumber: 290,
                                                                                columnNumber: 30
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                                size: 16,
                                                                                className: "text-zinc-500"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                lineNumber: 291,
                                                                                columnNumber: 30
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "text",
                                                                                placeholder: "End Node",
                                                                                className: "flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-fuchsia-400/70 focus:bg-fuchsia-900/20 transition-all font-mono shadow-inner"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                lineNumber: 292,
                                                                                columnNumber: 30
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                        lineNumber: 289,
                                                                        columnNumber: 28
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "text",
                                                                                placeholder: "Area (A)",
                                                                                className: "w-1/2 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-fuchsia-400/70 focus:bg-fuchsia-900/20 transition-all font-mono shadow-inner"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                lineNumber: 295,
                                                                                columnNumber: 30
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "text",
                                                                                placeholder: "Inertia (I)",
                                                                                className: "w-1/2 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-fuchsia-400/70 focus:bg-fuchsia-900/20 transition-all font-mono shadow-inner"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                lineNumber: 296,
                                                                                columnNumber: 30
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                        lineNumber: 294,
                                                                        columnNumber: 28
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        placeholder: "Elasticity (E)",
                                                                        className: "w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-fuchsia-400/70 focus:bg-fuchsia-900/20 transition-all font-mono shadow-inner"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                        lineNumber: 298,
                                                                        columnNumber: 28
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        className: "w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-fuchsia-400/70 focus:bg-fuchsia-900/20 transition-all font-medium shadow-inner",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                className: "bg-zinc-900",
                                                                                children: "No Load"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                lineNumber: 300,
                                                                                columnNumber: 30
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                className: "bg-zinc-900",
                                                                                children: "Point Load"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                lineNumber: 301,
                                                                                columnNumber: 30
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                className: "bg-zinc-900",
                                                                                children: "UDL"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                lineNumber: 302,
                                                                                columnNumber: 30
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                className: "bg-zinc-900",
                                                                                children: "UVL"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                lineNumber: 303,
                                                                                columnNumber: 30
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                        lineNumber: 299,
                                                                        columnNumber: 28
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                lineNumber: 288,
                                                                columnNumber: 26
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                        lineNumber: 286,
                                                        columnNumber: 24
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-zinc-400 hover:text-fuchsia-200 hover:border-fuchsia-400/60 transition-all cursor-pointer min-h-[320px] bg-black/20 hover:bg-fuchsia-900/20 hover:shadow-[inset_0_0_30px_rgba(217,70,239,0.2)]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "p-4 rounded-full bg-white/5 mb-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                    size: 28,
                                                                    className: "drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                    lineNumber: 310,
                                                                    columnNumber: 28
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                lineNumber: 309,
                                                                columnNumber: 26
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-extrabold text-sm tracking-widest uppercase",
                                                                children: "Add Member"
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                lineNumber: 312,
                                                                columnNumber: 26
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                        lineNumber: 308,
                                                        columnNumber: 24
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                lineNumber: 285,
                                                columnNumber: 22
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                            lineNumber: 284,
                                            columnNumber: 20
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8 flex justify-end",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "px-10 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 bg-size-200 hover:bg-pos-100 text-white font-extrabold shadow-[0_5px_25px_rgba(192,132,252,0.6)] hover:shadow-[0_5px_35px_rgba(192,132,252,0.8)] transition-all transform hover:-translate-y-1",
                                                children: "Execute Analysis Mode"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                lineNumber: 319,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                            lineNumber: 318,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                    lineNumber: 232,
                                    columnNumber: 15
                                }, this),
                                activeTab === "results" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    id: "section-to-print",
                                    className: "relative z-10 w-full",
                                    style: {
                                        transform: "translateZ(30px)"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-white/10 pb-6 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-2xl font-bold text-white mb-1 flex items-center gap-3 tracking-tight",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$no$2d$axes$2d$column$2d$increasing$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart$3e$__["BarChart"], {
                                                                    size: 32,
                                                                    className: "text-cyan-400 p-1.5 bg-cyan-500/20 rounded border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                    lineNumber: 332,
                                                                    columnNumber: 11
                                                                }, this),
                                                                "Structural Analysis Report"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                            lineNumber: 331,
                                                            columnNumber: 9
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-zinc-300 font-medium",
                                                            children: "Numerical output for Plane Frame (Direct Stiffness Method)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                            lineNumber: 335,
                                                            columnNumber: 9
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                    lineNumber: 330,
                                                    columnNumber: 7
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleExportPDF,
                                                    className: "no-print px-6 py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-100 text-sm font-bold hover:bg-cyan-500/40 transition-all flex items-center gap-2 shadow-lg backdrop-blur-md",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                            size: 18
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                            lineNumber: 343,
                                                            columnNumber: 9
                                                        }, this),
                                                        " Export Numerical Report (PDF)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                    lineNumber: 339,
                                                    columnNumber: 7
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                            lineNumber: 329,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-black/50 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "text-cyan-300 font-black mb-5 uppercase tracking-widest text-[11px] flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "w-2 h-2 rounded-full bg-cyan-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                    lineNumber: 352,
                                                                    columnNumber: 11
                                                                }, this),
                                                                " Nodal Displacements"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                            lineNumber: 351,
                                                            columnNumber: 9
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar",
                                                            children: results?.displacements ? Object.keys(results.displacements).map((nodeId)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between items-start text-xs py-2 border-b border-white/[0.05]",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-zinc-300 font-bold",
                                                                            children: [
                                                                                "Node ",
                                                                                nodeId
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                            lineNumber: 357,
                                                                            columnNumber: 15
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-col items-end gap-1 font-mono text-cyan-100",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    children: [
                                                                                        "dx: ",
                                                                                        results.displacements[nodeId].dx.toExponential(3)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                    lineNumber: 359,
                                                                                    columnNumber: 17
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    children: [
                                                                                        "dy: ",
                                                                                        results.displacements[nodeId].dy.toExponential(3)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                    lineNumber: 360,
                                                                                    columnNumber: 17
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    children: [
                                                                                        "θz: ",
                                                                                        results.displacements[nodeId].theta.toExponential(3)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                    lineNumber: 361,
                                                                                    columnNumber: 17
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                            lineNumber: 358,
                                                                            columnNumber: 15
                                                                        }, this)
                                                                    ]
                                                                }, nodeId, true, {
                                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                    lineNumber: 356,
                                                                    columnNumber: 13
                                                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-zinc-500 italic",
                                                                children: "No results found"
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                lineNumber: 364,
                                                                columnNumber: 16
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                            lineNumber: 354,
                                                            columnNumber: 9
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                    lineNumber: 350,
                                                    columnNumber: 7
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-black/50 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "text-purple-300 font-black mb-5 uppercase tracking-widest text-[11px] flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "w-2 h-2 rounded-full bg-purple-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                    lineNumber: 371,
                                                                    columnNumber: 11
                                                                }, this),
                                                                " Reactions"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                            lineNumber: 370,
                                                            columnNumber: 9
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar",
                                                            children: results?.reactions ? Object.keys(results.reactions).map((nodeId)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between items-start text-xs py-2 border-b border-white/[0.05]",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-zinc-300 font-bold",
                                                                            children: [
                                                                                "Node ",
                                                                                nodeId
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                            lineNumber: 376,
                                                                            columnNumber: 15
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-col items-end gap-1 font-mono",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-emerald-400",
                                                                                    children: [
                                                                                        "Rx: ",
                                                                                        results.reactions[nodeId].Fx.toFixed(2),
                                                                                        " kN"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                    lineNumber: 378,
                                                                                    columnNumber: 17
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-rose-400",
                                                                                    children: [
                                                                                        "Ry: ",
                                                                                        results.reactions[nodeId].Fy.toFixed(2),
                                                                                        " kN"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                    lineNumber: 379,
                                                                                    columnNumber: 17
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-purple-300",
                                                                                    children: [
                                                                                        "Mz: ",
                                                                                        results.reactions[nodeId].Mz.toFixed(2),
                                                                                        " kNm"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                    lineNumber: 380,
                                                                                    columnNumber: 17
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                            lineNumber: 377,
                                                                            columnNumber: 15
                                                                        }, this)
                                                                    ]
                                                                }, nodeId, true, {
                                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                    lineNumber: 375,
                                                                    columnNumber: 13
                                                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-zinc-500 italic",
                                                                children: "No results found"
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                lineNumber: 383,
                                                                columnNumber: 16
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                            lineNumber: 373,
                                                            columnNumber: 9
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                    lineNumber: 369,
                                                    columnNumber: 7
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-black/50 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "text-fuchsia-300 font-black mb-5 uppercase tracking-widest text-[11px] flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "w-2 h-2 rounded-full bg-fuchsia-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                    lineNumber: 390,
                                                                    columnNumber: 11
                                                                }, this),
                                                                " Member End Forces"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                            lineNumber: 389,
                                                            columnNumber: 9
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar",
                                                            children: results?.member_forces ? Object.keys(results.member_forces).map((mId)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col gap-2 text-[10px] py-3 border-b border-white/[0.05]",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-zinc-300 font-bold text-xs",
                                                                            children: [
                                                                                "Member ",
                                                                                mId
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                            lineNumber: 395,
                                                                            columnNumber: 15
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "grid grid-cols-2 gap-2 text-white/80 font-mono",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "bg-white/5 p-1 rounded",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: [
                                                                                                "N1: ",
                                                                                                results.member_forces[mId].Axial_1.toFixed(1)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                            lineNumber: 398,
                                                                                            columnNumber: 19
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: [
                                                                                                "V1: ",
                                                                                                results.member_forces[mId].Shear_1.toFixed(1)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                            lineNumber: 399,
                                                                                            columnNumber: 19
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-yellow-200",
                                                                                            children: [
                                                                                                "M1: ",
                                                                                                results.member_forces[mId].Moment_1.toFixed(1)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                            lineNumber: 400,
                                                                                            columnNumber: 19
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                    lineNumber: 397,
                                                                                    columnNumber: 17
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "bg-white/5 p-1 rounded text-right",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: [
                                                                                                "N2: ",
                                                                                                results.member_forces[mId].Axial_2.toFixed(1)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                            lineNumber: 403,
                                                                                            columnNumber: 19
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: [
                                                                                                "V2: ",
                                                                                                results.member_forces[mId].Shear_2.toFixed(1)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                            lineNumber: 404,
                                                                                            columnNumber: 19
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-yellow-200",
                                                                                            children: [
                                                                                                "M2: ",
                                                                                                results.member_forces[mId].Moment_2.toFixed(1)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                            lineNumber: 405,
                                                                                            columnNumber: 19
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                                    lineNumber: 402,
                                                                                    columnNumber: 17
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                            lineNumber: 396,
                                                                            columnNumber: 15
                                                                        }, this)
                                                                    ]
                                                                }, mId, true, {
                                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                    lineNumber: 394,
                                                                    columnNumber: 13
                                                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-zinc-500 italic",
                                                                children: "No results found"
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                                lineNumber: 409,
                                                                columnNumber: 16
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                            lineNumber: 392,
                                                            columnNumber: 9
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                    lineNumber: 388,
                                                    columnNumber: 7
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                            lineNumber: 348,
                                            columnNumber: 5
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8 w-full border border-white/10 rounded-[2rem] overflow-hidden bg-black/40 visualizer-container",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-4 border-b border-white/10 bg-white/5 no-print",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[10px] uppercase tracking-widest font-black text-zinc-400",
                                                        children: "Structural Geometry Visualization"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                        lineNumber: 417,
                                                        columnNumber: 9
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                    lineNumber: 416,
                                                    columnNumber: 7
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$ASA__Lab__Project$2f$frontend$2f$src$2f$components$2f$StructureVisualizer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    nodes: results?.nodes || [],
                                                    members: results?.members || []
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                                    lineNumber: 419,
                                                    columnNumber: 7
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                            lineNumber: 415,
                                            columnNumber: 5
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                                    lineNumber: 328,
                                    columnNumber: 3
                                }, this)
                            ]
                        }, activeTab, true, {
                            fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                            lineNumber: 193,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/ASA Lab Project/frontend/src/app/page.tsx",
        lineNumber: 131,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=OneDrive_Desktop_ASA%20Lab%20Project_frontend_src_0vvs75.._.js.map