const express = require('express');
const HorarioController = require('../controllers/horarioController');
const router = express.Router();

router.post('/', HorarioController.create);
router.get('/estagio/:id_estagio', HorarioController.getByEstagio);

module.exports = router;