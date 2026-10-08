const express = require('express');
const EstagioController = require('../controllers/estagioController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authenticateToken, EstagioController.getAll);
router.get('/meus', authenticateToken, EstagioController.getMeusEstagios);
router.get('/:id', authenticateToken, EstagioController.getById);
router.post('/', authenticateToken, EstagioController.create);
router.put('/:id', authenticateToken, EstagioController.update);

router.patch('/:idEstagio/orientador', authenticateToken, EstagioController.vincularOrientador);

module.exports = router;
