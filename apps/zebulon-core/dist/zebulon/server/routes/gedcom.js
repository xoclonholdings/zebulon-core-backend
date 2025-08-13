"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const multer_1 = __importDefault(require("multer"));
const parse_gedcom_1 = __importDefault(require("parse-gedcom"));
const client_1 = __importDefault(require("@prisma/client"));
const { PrismaClient } = client_1.default;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma = new PrismaClient();
const router = express.Router();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/gedcom';
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/octet-stream' ||
            file.originalname.toLowerCase().endsWith('.ged') ||
            file.originalname.toLowerCase().endsWith('.gedcom')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only GEDCOM (.ged) files are allowed'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});
// Upload and parse GEDCOM file
router.post('/upload', upload.single('gedcom'), async (req, res) => {
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
        const gedcomContent = fs_1.default.readFileSync(filePath, 'utf8');
        let parsedData;
        try {
            parsedData = parse_gedcom_1.default.parse(gedcomContent);
        }
        catch (parseError) {
            console.error('GEDCOM parsing error:', parseError);
            // Clean up uploaded file
            fs_1.default.unlinkSync(filePath);
            return res.status(400).json({
                error: 'Invalid GEDCOM format',
                details: parseError?.message || 'Unknown parsing error'
            });
        }
        // No database model for familyTree; just return parsed summary
        fs_1.default.unlinkSync(filePath);
        res.json({
            success: true,
            filename: filename,
            summary: {
                individuals: Array.isArray(parsedData) ? parsedData.filter((item) => item.tag === 'INDI').length : 0,
                families: Array.isArray(parsedData) ? parsedData.filter((item) => item.tag === 'FAM').length : 0,
                sources: Array.isArray(parsedData) ? parsedData.filter((item) => item.tag === 'SOUR').length : 0
            }
        });
    }
    catch (error) {
        console.error('GEDCOM upload error:', error);
        // Clean up uploaded file on error
        if (req.file?.path && fs_1.default.existsSync(req.file.path)) {
            fs_1.default.unlinkSync(req.file.path);
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
exports.default = router;
