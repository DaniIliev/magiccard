import { Request, Response } from 'express';

// @desc    Generate card design via AI (Mock)
// @route   POST /api/ai/generate
// @access  Private
export const generateDesign = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;
    
    setTimeout(() => {
      res.json({
        elements: [
          {
            type: 'text',
            content: `A magical card just for you!\n${prompt.substring(0, 30)}...`,
            x: 50,
            y: 200,
            style: { fontSize: '32px', color: '#4f46e5', fontWeight: 'bold' }
          },
          {
            type: 'sticker',
            content: '✨',
            x: 200,
            y: 50,
            style: { fontSize: '80px' }
          },
          {
            type: 'sticker',
            content: '❤️',
            x: 50,
            y: 50,
            style: { fontSize: '60px' }
          }
        ],
        background: 'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)',
        globalEffect: 'sparkles'
      });
    }, 1500); 
    
  } catch (error) {
    res.status(500).json({ message: 'AI Generation failed' });
  }
};
