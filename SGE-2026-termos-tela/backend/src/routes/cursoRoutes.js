const express = require('express');
const CursoController = require('../controllers/cursoController');
const router = express.Router();

router.get('/', CursoController.getAll);
router.post('/', CursoController.create);

module.exports = router;