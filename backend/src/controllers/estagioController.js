const EstagioService = require('../services/estagioService');

class EstagioController {
  static async getAll(req, res) {
    try {
      const estagios = await EstagioService.getAll();
      res.json(estagios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const id = await EstagioService.createEstagio(req.body);
      res.status(201).json({ 
        message: 'Contrato de estágio registrado com sucesso.', 
        id 
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = EstagioController;