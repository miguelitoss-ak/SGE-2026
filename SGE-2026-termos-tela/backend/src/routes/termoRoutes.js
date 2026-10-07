const express = require('express');
const TermoController = require('../controllers/termoController');
const router = express.Router();

// Rotas de demonstração com dados fictícios: não consultam o banco.
// Ao integrar dados reais, adicionar JWT e a verificação de acesso ao estágio.
router.get('/estagios/:id/html', TermoController.previewHTML);
router.get('/estagios/:id/pdf', TermoController.gerarPDF);

module.exports = router;
