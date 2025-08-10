import * as express from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';
import parseGedcom from 'parse-gedcom';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Extend Express Request type to include userId in session
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/gedcom';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/octet-stream' || 
        file.originalname.toLowerCase().endsWith('.ged') ||
        file.originalname.toLowerCase().endsWith('.gedcom')) {
      cb(null, true);
    } else {
      cb(new Error('Only GEDCOM (.ged) files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload and parse GEDCOM file
router.post('/upload', upload.single('gedcom'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!req.session?.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.session.userId;
    const filePath = req.file.path;
    const filename = req.file.originalname;

    // Read and parse GEDCOM file
    const gedcomContent = fs.readFileSync(filePath, 'utf8');
    
    let parsedData: any;
    try {
      parsedData = parseGedcom.parse(gedcomContent);
    } catch (parseError: any) {
      console.error('GEDCOM parsing error:', parseError);
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        error: 'Invalid GEDCOM format',
        details: parseError?.message || 'Unknown parsing error'
      });
    }

    // No database model for familyTree; just return parsed summary
    fs.unlinkSync(filePath);
    res.json({
      success: true,
      filename: filename,
      summary: {
        individuals: Array.isArray(parsedData) ? parsedData.filter((item: any) => item.tag === 'INDI').length : 0,
        families: Array.isArray(parsedData) ? parsedData.filter((item: any) => item.tag === 'FAM').length : 0,
        sources: Array.isArray(parsedData) ? parsedData.filter((item: any) => item.tag === 'SOUR').length : 0
      }
    });

  } catch (error: any) {
    console.error('GEDCOM upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Failed to process GEDCOM file',
      details: error?.message || 'Unknown error'
    });
  }
});

// No familyTree model: /trees endpoint disabled

// No familyTree model: /tree/:id endpoint disabled

// No familyTree model: delete /tree/:id endpoint disabled

export default router;