const express = require('express');
const SupervisorController = require('../controllers/supervisorController');
const router = express.Router();

router.get('/', SupervisorController.getAll);
router.post('/', SupervisorController.create);

module.exports = router;