const express = require('express');
const EstagioController = require('../controllers/estagioController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', EstagioController.getAll);
router.post('/', authenticateToken, EstagioController.create);

router.patch('/:idEstagio/orientador', EstagioController.vincularOrientador);

module.exports = router;
