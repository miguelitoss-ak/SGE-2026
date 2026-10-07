const express = require('express');
const OrientadorController = require('../controllers/orientadorController');
const router = express.Router();

router.get('/', OrientadorController.getAll);
router.post('/', OrientadorController.create);

module.exports = router;