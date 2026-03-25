import { Request, Response } from 'express';
import { Card } from '../models/Card';
import { AuthRequest } from '../middlewares/auth';
import jwt from 'jsonwebtoken';

// @desc    Get all cards for user
// @route   GET /api/cards
// @access  Private
export const getCards = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cards = await Card.find({ userId: req.user.id });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new card
// @route   POST /api/cards
// @access  Private
export const createCard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, elements, background, audioUrl, globalEffect } = req.body;
    const card = new Card({
      userId: req.user.id,
      title: title || 'Untitled Card',
      elements: elements || [],
      background: background || '#ffffff',
      audioUrl: audioUrl || null,
      globalEffect: globalEffect || null
    });
    const createdCard = await card.save();
    res.status(201).json(createdCard);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get card by ID
// @route   GET /api/cards/:id
// @access  Public (if published) or Private (if draft)
export const getCardById = async (req: Request, res: Response): Promise<void> => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      res.status(404).json({ message: 'Card not found' });
      return;
    }
    
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        userId = decoded.id;
      } catch (e) {
        // invalid token, treat as unauthenticated
      }
    }
    
    // Check if user is owner or card is published
    if (card.userId.toString() !== userId && !card.isPublished) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update card
// @route   PUT /api/cards/:id
// @access  Private
export const updateCard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const card = await Card.findById(req.params.id);
    
    if (!card) {
      res.status(404).json({ message: 'Card not found' });
      return;
    }
    
    if (card.userId.toString() !== req.user.id) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete card
// @route   DELETE /api/cards/:id
// @access  Private
export const deleteCard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const card = await Card.findById(req.params.id);
    
    if (!card) {
      res.status(404).json({ message: 'Card not found' });
      return;
    }
    
    if (card.userId.toString() !== req.user.id) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    
    await card.deleteOne();
    res.json({ message: 'Card removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
