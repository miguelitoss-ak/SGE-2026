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

  static async vincularOrientador(req, res) {
    try {
      const { idEstagio } = req.params; // ID que virá na rota (ex: /estagios/5/orientador)
      const { id_orientador } = req.body; // ID do orientador selecionado

      // Chamamos o service que você já preparou
      const estagioAtualizado = await EstagioService.vincularOrientador(idEstagio, id_orientador);

      res.status(200).json({
        message: 'Orientador vinculado com sucesso!',
        data: estagioAtualizado
      });
    } catch (error) {
      // Se o erro for "não encontrado", poderíamos usar 404, 
      // mas o 400 (Bad Request) já atende bem erros de validação
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = EstagioController;