"use client";

import { motion } from "framer-motion";
import { CanvasElement, useEditorStore } from "@/store/editorStore";
import { X, ArrowUp, ArrowDown } from "lucide-react";

interface Props {
  element: CanvasElement;
  canvasRef: React.RefObject<HTMLDivElement>;
}

export default function DraggableElement({ element, canvasRef }: Props) {
  const { selectedElementId, selectElement, removeElement, bringToFront, sendToBack, updateElement } = useEditorStore();
  const isSelected = selectedElementId === element.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  const handleDragEnd = (_event: any, info: any) => {
    updateElement(element.id, {
      x: element.x + info.offset.x,
      y: element.y + info.offset.y,
    });
  };

  return (
    <motion.div
      drag
      dragConstraints={canvasRef}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      initial={{ x: element.x, y: element.y }}
      animate={{ x: element.x, y: element.y }}
      style={{ 
        position: 'absolute', 
        zIndex: element.zIndex,
        ...element.style 
      }}
      onClick={handleClick}
      className={`cursor-grab active:cursor-grabbing ${isSelected ? 'ring-2 ring-indigo-500 rounded-md ring-offset-2' : ''}`}
    >
      {isSelected && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-full px-2 py-1 flex items-center gap-1 z-50">
          <button onClick={() => removeElement(element.id)} className="p-1 hover:bg-red-50 text-red-500 rounded-full"><X size={14} /></button>
          <div className="w-px h-3 bg-slate-200" />
          <button onClick={() => bringToFront(element.id)} className="p-1 hover:bg-slate-100 text-slate-600 rounded-full"><ArrowUp size={14} /></button>
          <button onClick={() => sendToBack(element.id)} className="p-1 hover:bg-slate-100 text-slate-600 rounded-full"><ArrowDown size={14} /></button>
        </div>
      )}

      {element.type === 'text' && (
        <div className="whitespace-pre-wrap select-none" style={{ 
          fontSize: element.style?.fontSize as string | number, 
          color: element.style?.color as string, 
          fontWeight: element.style?.fontWeight as any 
        }}>
          {element.content}
        </div>
      )}
      {element.type === 'image' && (
        <img src={element.content} alt="canvas upload" className="pointer-events-none select-none" style={{ width: element.width, height: element.height, objectFit: 'cover' as any }} />
      )}
      {element.type === 'sticker' && (
        <div className="text-6xl select-none" style={{ fontSize: element.style?.fontSize as string | number }}>
          {element.content}
        </div>
      )}
    </motion.div>
  );
}
