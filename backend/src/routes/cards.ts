import express from 'express';
import { getCards, createCard, getCardById, updateCard, deleteCard } from '../controllers/cards';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.route('/')
  .get( getCards)
  .post(protect, createCard);

router.route('/:id')
  .get(getCardById) // Public or Private resolved in controller
  .put(protect, updateCard)
  .delete(protect, deleteCard);

export default router;
