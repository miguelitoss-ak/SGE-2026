const SupervisorService = require('../services/supervisorService');

class SupervisorController {
  static async getAll(req, res) {
    try {
      const data = await SupervisorService.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const id = await SupervisorService.createSupervisor(req.body);
      res.status(201).json({ message: 'Supervisor cadastrado com sucesso.', id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = SupervisorController;