const express = require('express');
const TermoController = require('../controllers/termoController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/estagios/:id/html', authenticateToken, TermoController.previewHTML);
router.get('/estagios/:id/pdf', authenticateToken, TermoController.gerarPDF);

module.exports = router;
