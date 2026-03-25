import { create } from 'zustand';

export type ElementType = 'text' | 'image' | 'sticker';

export interface CanvasElement {
  id: string;
  type: ElementType;
  content: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  zIndex: number;
  style?: Record<string, string | number>;
}

interface EditorState {
  elements: CanvasElement[];
  selectedElementId: string | null;
  background: string;
  audioUrl: string | null;
  globalEffect: string | null;
  
  addElement: (element: Omit<CanvasElement, 'id' | 'zIndex'>) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  setBackground: (bg: string) => void;
  setAudio: (url: string | null) => void;
  setGlobalEffect: (effect: string | null) => void;
  loadCard: (cardData: any) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  elements: [],
  selectedElementId: null,
  background: '#ffffff',
  audioUrl: null,
  globalEffect: null,

  addElement: (element) => set((state) => {
    const id = Math.random().toString(36).substr(2, 9);
    const zIndex = state.elements.length;
    return {
      elements: [...state.elements, { ...element, id, zIndex }],
      selectedElementId: id,
    };
  }),

  updateElement: (id, updates) => set((state) => ({
    elements: state.elements.map((el) => 
      el.id === id ? { ...el, ...updates } : el
    )
  })),

  removeElement: (id) => set((state) => ({
    elements: state.elements.filter((el) => el.id !== id),
    selectedElementId: state.selectedElementId === id ? null : state.selectedElementId
  })),

  selectElement: (id) => set({ selectedElementId: id }),

  bringToFront: (id) => set((state) => {
    const maxZ = Math.max(...state.elements.map(el => el.zIndex));
    return {
      elements: state.elements.map(el => 
        el.id === id ? { ...el, zIndex: maxZ + 1 } : el
      )
    };
  }),

  sendToBack: (id) => set((state) => {
    const minZ = Math.min(...state.elements.map(el => el.zIndex));
    return {
      elements: state.elements.map(el => 
        el.id === id ? { ...el, zIndex: minZ - 1 } : el
      )
    };
  }),

  setBackground: (bg) => set({ background: bg }),
  setAudio: (url) => set({ audioUrl: url }),
  setGlobalEffect: (effect) => set({ globalEffect: effect }),

  loadCard: (cardData) => set({
    elements: (cardData.elements || []).map((el: any, index: number) => ({
      ...el,
      id: el.id || Math.random().toString(36).substr(2, 9) + index
    })),
    background: cardData.background || '#ffffff',
    audioUrl: cardData.audioUrl || null,
    globalEffect: cardData.globalEffect || null,
    selectedElementId: null,
  }),
}));
