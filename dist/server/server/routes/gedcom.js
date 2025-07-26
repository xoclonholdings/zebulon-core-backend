"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer_1 = require("multer");
var parse_gedcom_1 = require("parse-gedcom");
var client_1 = require("@prisma/client");
var path_1 = require("path");
var fs_1 = require("fs");
var prisma = new client_1.PrismaClient();
var router = express_1.default.Router();
// Configure multer for file uploads
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        var uploadDir = 'uploads/gedcom';
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
var upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: function (req, file, cb) {
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
router.post('/upload', upload.single('gedcom'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, filePath, filename, gedcomContent, parsedData, familyTree, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                if (!req.file) {
                    return [2 /*return*/, res.status(400).json({ error: 'No file uploaded' })];
                }
                if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return [2 /*return*/, res.status(401).json({ error: 'User not authenticated' })];
                }
                userId = req.session.userId;
                filePath = req.file.path;
                filename = req.file.originalname;
                gedcomContent = fs_1.default.readFileSync(filePath, 'utf8');
                parsedData = void 0;
                try {
                    parsedData = parse_gedcom_1.default.parse(gedcomContent);
                }
                catch (parseError) {
                    console.error('GEDCOM parsing error:', parseError);
                    // Clean up uploaded file
                    fs_1.default.unlinkSync(filePath);
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid GEDCOM format',
                            details: (parseError === null || parseError === void 0 ? void 0 : parseError.message) || 'Unknown parsing error'
                        })];
                }
                return [4 /*yield*/, prisma.familyTree.create({
                        data: {
                            userId: userId,
                            filename: filename,
                            data: Array.isArray(parsedData) ? parsedData : [parsedData]
                        }
                    })];
            case 1:
                familyTree = _c.sent();
                // Clean up uploaded file (optional - keep if you want to store original files)
                fs_1.default.unlinkSync(filePath);
                res.json({
                    success: true,
                    id: familyTree.id,
                    filename: filename,
                    uploadedAt: familyTree.uploadedAt,
                    summary: {
                        individuals: Array.isArray(parsedData) ? parsedData.filter(function (item) { return item.tag === 'INDI'; }).length : 0,
                        families: Array.isArray(parsedData) ? parsedData.filter(function (item) { return item.tag === 'FAM'; }).length : 0,
                        sources: Array.isArray(parsedData) ? parsedData.filter(function (item) { return item.tag === 'SOUR'; }).length : 0
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                console.error('GEDCOM upload error:', error_1);
                // Clean up uploaded file on error
                if (((_b = req.file) === null || _b === void 0 ? void 0 : _b.path) && fs_1.default.existsSync(req.file.path)) {
                    fs_1.default.unlinkSync(req.file.path);
                }
                res.status(500).json({
                    error: 'Failed to process GEDCOM file',
                    details: (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'Unknown error'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get user's family trees
router.get('/trees', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var trees, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return [2 /*return*/, res.status(401).json({ error: 'User not authenticated' })];
                }
                return [4 /*yield*/, prisma.familyTree.findMany({
                        where: { userId: req.session.userId },
                        select: {
                            id: true,
                            filename: true,
                            uploadedAt: true
                        },
                        orderBy: { uploadedAt: 'desc' }
                    })];
            case 1:
                trees = _b.sent();
                res.json(trees);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('Error fetching family trees:', error_2);
                res.status(500).json({ error: 'Failed to fetch family trees' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get specific family tree data
router.get('/tree/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tree, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return [2 /*return*/, res.status(401).json({ error: 'User not authenticated' })];
                }
                return [4 /*yield*/, prisma.familyTree.findFirst({
                        where: {
                            id: req.params.id,
                            userId: req.session.userId
                        }
                    })];
            case 1:
                tree = _b.sent();
                if (!tree) {
                    return [2 /*return*/, res.status(404).json({ error: 'Family tree not found' })];
                }
                res.json(tree);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error('Error fetching family tree:', error_3);
                res.status(500).json({ error: 'Failed to fetch family tree' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Delete family tree
router.delete('/tree/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deleted, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return [2 /*return*/, res.status(401).json({ error: 'User not authenticated' })];
                }
                return [4 /*yield*/, prisma.familyTree.deleteMany({
                        where: {
                            id: req.params.id,
                            userId: req.session.userId
                        }
                    })];
            case 1:
                deleted = _b.sent();
                if (deleted.count === 0) {
                    return [2 /*return*/, res.status(404).json({ error: 'Family tree not found' })];
                }
                res.json({ success: true });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                console.error('Error deleting family tree:', error_4);
                res.status(500).json({ error: 'Failed to delete family tree' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
