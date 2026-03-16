const express = require('express');
const EstagioController = require('../controllers/estagioController');
const router = express.Router();

router.get('/', EstagioController.getAll);
router.post('/', EstagioController.create);

module.exports = router;