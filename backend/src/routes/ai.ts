import express from 'express';
import { generateDesign } from '../controllers/ai';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.post('/generate', protect, generateDesign);

export default router;
