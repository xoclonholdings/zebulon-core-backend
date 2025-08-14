// Stub for gedcom.js
const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'GEDCOM route stub' }));
module.exports = router;
