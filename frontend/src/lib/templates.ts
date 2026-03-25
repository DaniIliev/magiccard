import { CanvasElement } from "@/store/editorStore";

export interface TemplateData {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  cardData: {
    title: string;
    background: string;
    globalEffect: string | null;
    elements: Partial<CanvasElement>[];
  }
}

export const TEMPLATES: TemplateData[] = [
  {
    id: "blank",
    name: "Blank Canvas",
    description: "Start completely from scratch",
    color: "from-slate-50 to-slate-100 text-slate-700 border border-slate-200",
    icon: "✨",
    cardData: {
      title: "Untitled Card",
      background: "#ffffff",
      globalEffect: null,
      elements: []
    }
  },
  {
    id: "birthday-neon",
    name: "Neon Party",
    description: "Vibrant glowing birthday theme",
    color: "from-fuchsia-600 via-purple-700 to-indigo-800 text-white",
    icon: "🎉",
    cardData: {
      title: "Neon Birthday",
      background: "linear-gradient(135deg, #16002c 0%, #3a0647 100%)",
      globalEffect: "confetti",
      elements: [
        {
          type: "sticker",
          content: "✨",
          x: 20,
          y: 30,
          zIndex: 0,
          style: { fontSize: "60px", opacity: 0.8 }
        },
        {
          type: "sticker",
          content: "🎈",
          x: 260,
          y: 60,
          zIndex: 1,
          style: { fontSize: "100px", transform: "rotate(15deg)" }
        },
        {
          type: "text",
          content: "IT'S TIME TO",
          x: 40,
          y: 180,
          zIndex: 2,
          style: { fontSize: "18px", color: "#f472b6", fontWeight: "800", letterSpacing: "4px" }
        },
        {
          type: "text",
          content: "PARTY!",
          x: 35,
          y: 200,
          zIndex: 3,
          style: { fontSize: "72px", color: "#ffffff", fontWeight: "900", textShadow: "0 0 20px #c026d3" }
        },
        {
          type: "text",
          content: "Happy Birthday, \nAwesome Human!",
          x: 45,
          y: 300,
          zIndex: 4,
          style: { fontSize: "24px", color: "#e9d5ff", fontWeight: "500", lineHeight: "1.4" }
        },
        {
          type: "image",
          content: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?q=80&w=400&fit=crop",
          x: 60,
          y: 420,
          width: 250,
          height: 150,
          zIndex: 5,
          style: { borderRadius: "16px", border: "4px solid #f472b6" }
        }
      ]
    }
  },
  {
    id: "romantic",
    name: "Romantic Love Letter",
    description: "Elegant, soft pinks and flowers",
    color: "from-rose-300 to-pink-500 text-white",
    icon: "💌",
    cardData: {
      title: "For You...",
      background: "linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)",
      globalEffect: "snow",
      elements: [
        {
          type: "image",
          content: "https://images.unsplash.com/photo-1518199266791-5375a83164ba?q=80&w=400&fit=crop",
          x: 0,
          y: 0,
          width: 400,
          height: 600,
          zIndex: 0,
          style: { opacity: 0.3 }
        },
        {
          type: "text",
          content: "You are the\nmagic in my life.",
          x: 40,
          y: 140,
          zIndex: 1,
          style: { fontSize: "38px", color: "#881337", fontWeight: "bold", fontFamily: "serif", lineHeight: "1.2" }
        },
        {
          type: "sticker",
          content: "💍",
          x: 150,
          y: 60,
          zIndex: 2,
          style: { fontSize: "60px" }
        },
        {
          type: "text",
          content: "Happy Anniversary to my one and only.",
          x: 45,
          y: 250,
          zIndex: 3,
          style: { fontSize: "20px", color: "#be123c", fontWeight: "500", fontStyle: "italic" }
        },
        {
          type: "image",
          content: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?q=80&w=300&fit=crop",
          x: 40,
          y: 350,
          width: 300,
          height: 200,
          zIndex: 4,
          style: { borderRadius: "24px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", border: "6px solid white" }
        }
      ]
    }
  },
  {
    id: "new-year",
    name: "Luxury Celebration",
    description: "Classic gold and deep blue luxury",
    color: "from-slate-800 to-slate-900 text-amber-400 border border-amber-600/30",
    icon: "🥂",
    cardData: {
      title: "Celebration Time!",
      background: "linear-gradient(to top, #09203f 0%, #537895 100%)",
      globalEffect: "fireworks",
      elements: [
        {
          type: "sticker",
          content: "🍾",
          x: 130,
          y: 60,
          zIndex: 0,
          style: { fontSize: "120px", transform: "rotate(-10deg)" }
        },
        {
          type: "text",
          content: "CHEERS TO",
          x: 50,
          y: 220,
          zIndex: 1,
          style: { fontSize: "20px", color: "#fef08a", fontWeight: "600", letterSpacing: "6px" }
        },
        {
          type: "text",
          content: "WONDERFUL\nMEMORIES",
          x: 45,
          y: 250,
          zIndex: 2,
          style: { fontSize: "42px", color: "#ffffff", fontWeight: "900", lineHeight: "1.1", textShadow: "0 4px 10px rgba(0,0,0,0.5)" }
        },
        {
          type: "sticker",
          content: "✨",
          x: 60,
          y: 400,
          zIndex: 3,
          style: { fontSize: "50px" }
        },
        {
          type: "sticker",
          content: "🥂",
          x: 240,
          y: 380,
          zIndex: 4,
          style: { fontSize: "80px" }
        }
      ]
    }
  }
];
