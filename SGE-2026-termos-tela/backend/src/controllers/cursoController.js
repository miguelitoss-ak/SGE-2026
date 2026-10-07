const CursoService = require('../services/cursoService');

class CursoController {
  static async getAll(req, res) {
    try {
      const cursos = await CursoService.getAllCursos();
      res.json(cursos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const id = await CursoService.createCurso(req.body);
      res.status(201).json({ message: 'Curso criado com sucesso.', id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = CursoController;