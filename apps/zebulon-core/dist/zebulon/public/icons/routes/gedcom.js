"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const parse_gedcom_1 = __importDefault(require("parse-gedcom"));
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
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
        // Save to database - convert parsedData to proper JSON format
        const familyTree = await prisma.familyTree.create({
            data: {
                userId: userId,
                filename: filename,
                data: Array.isArray(parsedData) ? parsedData : [parsedData]
            }
        });
        // Clean up uploaded file (optional - keep if you want to store original files)
        fs_1.default.unlinkSync(filePath);
        res.json({
            success: true,
            id: familyTree.id,
            filename: filename,
            uploadedAt: familyTree.uploadedAt,
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
// Get user's family trees
router.get('/trees', async (req, res) => {
    try {
        if (!req.session?.userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const trees = await prisma.familyTree.findMany({
            where: { userId: req.session.userId },
            select: {
                id: true,
                filename: true,
                uploadedAt: true
            },
            orderBy: { uploadedAt: 'desc' }
        });
        res.json(trees);
    }
    catch (error) {
        console.error('Error fetching family trees:', error);
        res.status(500).json({ error: 'Failed to fetch family trees' });
    }
});
// Get specific family tree data
router.get('/tree/:id', async (req, res) => {
    try {
        if (!req.session?.userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const tree = await prisma.familyTree.findFirst({
            where: {
                id: req.params.id,
                userId: req.session.userId
            }
        });
        if (!tree) {
            return res.status(404).json({ error: 'Family tree not found' });
        }
        res.json(tree);
    }
    catch (error) {
        console.error('Error fetching family tree:', error);
        res.status(500).json({ error: 'Failed to fetch family tree' });
    }
});
// Delete family tree
router.delete('/tree/:id', async (req, res) => {
    try {
        if (!req.session?.userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const deleted = await prisma.familyTree.deleteMany({
            where: {
                id: req.params.id,
                userId: req.session.userId
            }
        });
        if (deleted.count === 0) {
            return res.status(404).json({ error: 'Family tree not found' });
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting family tree:', error);
        res.status(500).json({ error: 'Failed to delete family tree' });
    }
});
exports.default = router;
