import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'magiccard',
      resource_type: 'auto',
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error });
  }
};
