const express = require('express');
const EmpresaController = require('../controllers/empresaController');
const router = express.Router(); // [cite: 146]

router.get('/', EmpresaController.getAll); // [cite: 146]
router.post('/', EmpresaController.create); // [cite: 146]

module.exports = router;