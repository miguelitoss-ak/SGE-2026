const express = require('express');
const DocumentoController = require('../controllers/documentoController');
const router = express.Router();

router.post('/modelos', DocumentoController.createModelo);
router.post('/estagio', DocumentoController.createDocumentoEstagio);

module.exports = router;