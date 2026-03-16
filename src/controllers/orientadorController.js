const OrientadorService = require('../services/orientadorService');

class OrientadorController {
  static async getAll(req, res) {
    try {
      const data = await OrientadorService.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const id = await OrientadorService.createOrientador(req.body);
      res.status(201).json({ message: 'Orientador cadastrado com sucesso.', id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = OrientadorController;