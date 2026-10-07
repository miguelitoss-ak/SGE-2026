const express = require('express');
const AlunoController = require('../controllers/alunoController');
const router = express.Router(); 

router.get('/', AlunoController.getAll); 
router.post('/', AlunoController.create); 

module.exports = router; 