import express from 'express';
import multer from 'multer';
import { uploadMedia } from '../controllers/upload';

const router = express.Router();
const upload = multer({ dest: '/tmp/' });

router.post('/', upload.single('file'), uploadMedia);

export default router;
