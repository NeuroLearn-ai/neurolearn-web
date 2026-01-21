"use client";

import { useRef, useState, useEffect } from "react";
import { Save, Loader2, Highlighter, Square, MousePointer2, Eraser, Undo, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// --- Types ---
type Tool = "pen" | "highlighter" | "box" | "eraser" | "mouse";

interface DrawingElement {
  type: "stroke" | "box";
  points: number[][]; 
  color: string;
  width: number;
  isRevealed?: boolean;
}

interface DrawingCanvasProps {
  pageId: number;
  initialData: any;
  width: number;
  height: number;
  bgUrl: string;
}

export default function DrawingCanvas({ pageId, initialData, width, height, bgUrl }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { authFetch } = useAuth();
  
  // --- State ---
  const [elements, setElements] = useState<DrawingElement[]>(initialData?.elements || []);
  const [isSaving, setIsSaving] = useState(false);
  
  // Interaction State
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<number[][]>([]);
  
  // Tool Settings
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#ef4444");
  const [strokeWidth, setStrokeWidth] = useState(2);

  // --- 1. Rendering Logic ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const drawElement = (el: DrawingElement) => {
      ctx.beginPath();
      ctx.lineWidth = el.width;
      ctx.strokeStyle = el.color;
      ctx.fillStyle = el.color;

      if (el.type === "stroke") {
        ctx.globalAlpha = el.width > 10 ? 0.4 : 1.0; 
        if (el.points.length > 0) {
          ctx.moveTo(el.points[0][0], el.points[0][1]);
          for (let i = 1; i < el.points.length; i++) {
            ctx.lineTo(el.points[i][0], el.points[i][1]);
          }
          ctx.stroke();
        }
      } 
      else if (el.type === "box") {
        const [start, end] = el.points;
        const x = Math.min(start[0], end[0]);
        const y = Math.min(start[1], end[1]);
        const w = Math.abs(end[0] - start[0]);
        const h = Math.abs(end[1] - start[1]);

        if (el.isRevealed) {
            ctx.globalAlpha = 0.2;
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, w, h);
        } else {
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = "black";
            ctx.fillRect(x, y, w, h);
        }
      }
      ctx.globalAlpha = 1.0;
    };

    // Draw Saved Elements
    elements.forEach(drawElement);

    // Draw Current Action
    if (isDrawing && currentPoints.length > 0) {
      if (tool === "box") {
         const start = currentPoints[0];
         const end = currentPoints[currentPoints.length - 1];
         ctx.globalAlpha = 0.5;
         ctx.fillStyle = "black";
         const w = end[0] - start[0];
         const h = end[1] - start[1];
         ctx.fillRect(start[0], start[1], w, h);
         ctx.globalAlpha = 1.0;
      } else if (tool === "pen" || tool === "highlighter") {
         drawElement({
             type: "stroke",
             points: currentPoints,
             color: color,
             width: strokeWidth
         });
      }
    }

  }, [elements, currentPoints, isDrawing, width, height, tool, color, strokeWidth]);

  // --- 2. Logic Helpers ---

  // Check if a point hits an element
  const checkCollision = (x: number, y: number, elementsList: DrawingElement[]): number => {
    // Reverse iterate to delete top-most items first
    for (let i = elementsList.length - 1; i >= 0; i--) {
        const el = elementsList[i];
        
        if (el.type === "box") {
            const [start, end] = el.points;
            const minX = Math.min(start[0], end[0]);
            const maxX = Math.max(start[0], end[0]);
            const minY = Math.min(start[1], end[1]);
            const maxY = Math.max(start[1], end[1]);
            // Add padding for easier clicking
            if (x >= minX - 5 && x <= maxX + 5 && y >= minY - 5 && y <= maxY + 5) {
                return i;
            }
        } 
        else if (el.type === "stroke") {
            // Check distance to any point in the stroke
            // Threshold depends on stroke width (easier to hit thick highlighter)
            const threshold = Math.max(10, el.width / 2); 
            for (const point of el.points) {
                const dist = Math.hypot(point[0] - x, point[1] - y);
                if (dist < threshold) return i;
            }
        }
    }
    return -1;
  };

  // --- 3. Event Handlers ---

  const getCoords = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    return [(e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY];
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const [x, y] = getCoords(e);
    setIsDrawing(true);

    if (tool === "eraser") {
        // Erase on click
        const index = checkCollision(x, y, elements);
        if (index !== -1) {
            const newEls = [...elements];
            newEls.splice(index, 1);
            setElements(newEls);
        }
        return;
    }

    if (tool === "pen" || tool === "highlighter" || tool === "mouse") {
        const index = checkCollision(x, y, elements);
        if (index !== -1 && elements[index].type === "box") {
             // Toggle Box Visibility
            const newEls = [...elements];
            newEls[index].isRevealed = !newEls[index].isRevealed;
            setElements(newEls);
            setIsDrawing(false); // Don't draw if we clicked a box
            return;
        }
    }

    if (tool === "mouse") {
        setIsDrawing(false);
        return;
    }

    setCurrentPoints([[x, y]]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const [x, y] = getCoords(e);

    if (tool === "eraser") {
        // Eraser Drag Logic: Delete anything we touch
        const index = checkCollision(x, y, elements);
        if (index !== -1) {
            const newEls = [...elements];
            newEls.splice(index, 1);
            setElements(newEls);
        }
    } else {
        // Draw Logic
        setCurrentPoints((prev) => [...prev, [x, y]]);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (tool === "eraser") return; // Nothing to save for eraser here, handled in move

    // Save the new element
    if (currentPoints.length > 0) {
        if (tool === "box") {
            const start = currentPoints[0];
            const end = currentPoints[currentPoints.length - 1];
            if (Math.abs(start[0] - end[0]) > 5) {
                setElements(prev => [...prev, {
                    type: "box",
                    points: [start, end],
                    color: "black",
                    width: 0,
                    isRevealed: false
                }]);
            }
        } else if (tool === "pen" || tool === "highlighter") {
            setElements(prev => [...prev, {
                type: "stroke",
                points: currentPoints,
                color: color,
                width: strokeWidth
            }]);
        }
    }
    setCurrentPoints([]);
  };

  // --- 4. Persistence ---
  const saveCanvas = async () => {
    setIsSaving(true);
    try {
      const payload = { overlay_data: { elements } };
      const res = await authFetch(`/notes/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      alert("Saved!");
    } catch (e) {
      alert("Error saving");
    } finally {
      setIsSaving(false);
    }
  };

  const clearAll = () => {
    if(confirm("Clear all drawings?")) setElements([]);
  }

  const undo = () => setElements(prev => prev.slice(0, -1));

  // --- 5. Tool Helpers ---
  const selectPen = (c: string) => { setTool("pen"); setColor(c); setStrokeWidth(2); };
  const selectHighlighter = (c: string) => { setTool("highlighter"); setColor(c); setStrokeWidth(20); };

  return (
    <div className="relative w-full h-full border rounded-lg overflow-hidden group select-none">
      
      {/* --- TOOLBAR --- */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white shadow-lg border rounded-full px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        
        {/* Colors */}
        <div className="flex gap-1 border-r pr-2 mr-2">
            <button onClick={() => selectPen("#ef4444")} className={`w-6 h-6 rounded-full bg-red-500 ring-2 ${color === "#ef4444" && tool === "pen" ? 'ring-blue-500' : 'ring-transparent'}`} />
            <button onClick={() => selectPen("#3b82f6")} className={`w-6 h-6 rounded-full bg-blue-500 ring-2 ${color === "#3b82f6" && tool === "pen" ? 'ring-blue-500' : 'ring-transparent'}`} />
            <button onClick={() => selectPen("#22c55e")} className={`w-6 h-6 rounded-full bg-green-500 ring-2 ${color === "#22c55e" && tool === "pen" ? 'ring-blue-500' : 'ring-transparent'}`} />
            <button onClick={() => selectPen("#000000")} className={`w-6 h-6 rounded-full bg-black ring-2 ${color === "#000000" && tool === "pen" ? 'ring-blue-500' : 'ring-transparent'}`} />
        </div>

        {/* Tools */}
        <button onClick={() => selectHighlighter("#fef08a")} className={`p-2 rounded hover:bg-gray-100 ${tool === "highlighter" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`} title="Highlighter">
            <Highlighter size={20} className="text-yellow-500" />
        </button>

        <button onClick={() => setTool("box")} className={`p-2 rounded hover:bg-gray-100 ${tool === "box" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`} title="Study Box">
            <Square size={20} fill={tool === "box" ? "currentColor" : "none"} />
        </button>

        {/* 👇 ERASER ADDED HERE */}
        <button onClick={() => setTool("eraser")} className={`p-2 rounded hover:bg-gray-100 ${tool === "eraser" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`} title="Eraser">
            <Eraser size={20} />
        </button>

        <button onClick={() => setTool("mouse")} className={`p-2 rounded hover:bg-gray-100 ${tool === "mouse" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`} title="Interact Mode">
            <MousePointer2 size={20} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button onClick={undo} className="p-2 rounded hover:bg-gray-100 text-gray-600" title="Undo">
            <Undo size={20} />
        </button>
        
        <button onClick={clearAll} className="p-2 rounded hover:bg-red-50 text-red-600" title="Clear All">
            <Trash2 size={20} />
        </button>

        <button onClick={saveCanvas} className="p-2 rounded hover:bg-green-50 text-green-600" title="Save">
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
        </button>
      </div>

      {/* --- Background --- */}
      {bgUrl ? (
        <img src={bgUrl} alt="Page" className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0" />
      ) : (
        <div className="absolute inset-0 w-full h-full z-0 bg-white" />
      )}

      {/* --- Canvas --- */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`absolute inset-0 z-10 touch-none ${tool === "mouse" ? "cursor-default" : "cursor-crosshair"}`}
      />
    </div>
  );
}