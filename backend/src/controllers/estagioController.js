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

  static async getMeusEstagios(req, res) {
    try {
      const estagios = await EstagioService.getMeusEstagios(req.user);
      return res.status(200).json(estagios);
    } catch (error) {
      if (error.message === 'Aluno não encontrado.') {
        return res.status(404).json({ error: error.message });
      }

      if (error.message === 'Usuário não autenticado.') {
        return res.status(401).json({ error: error.message });
      }

      return res.status(400).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const id = await EstagioService.createEstagio(req.body, req.user);
      res.status(201).json({ 
        message: 'Contrato de estágio registrado com sucesso.', 
        id 
      });
    } catch (error) {
      if (error?.code === 'P2003') {
        return res.status(400).json({
          error: 'Falha de integridade referencial ao criar o estágio. Verifique os IDs informados.',
        });
      }

      if (error.message === 'Aluno não encontrado.') {
        return res.status(404).json({ error: error.message });
      }

      if (
        error.message === 'id_aluno é obrigatório para criar o estágio.' ||
        error.message === 'ID do aluno inválido.' ||
        error.message === 'id_orientador inválido.' ||
        error.message === 'Orientador não encontrado.' ||
        error.message === 'Data de início inválida.' ||
        error.message === 'Data de término inválida.'
      ) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(400).json({ error: error.message });
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
