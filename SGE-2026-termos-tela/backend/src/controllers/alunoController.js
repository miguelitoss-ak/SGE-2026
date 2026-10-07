const AlunoService = require('../services/alunoService'); 

class AlunoController {
  static async getAll(req, res) {
    try {
      const alunos = await AlunoService.getAllAlunos(); 
      res.json(alunos); 
    } catch (error) {
      res.status(500).json({ error: error.message }); 
    }
  }

  static async create(req, res) {
    try {
      const id = await AlunoService.createAluno(req.body); 
      res.status(201).json({ message: 'Aluno registrado com sucesso.', id }); 
    } catch (error) {
      res.status(400).json({ error: error.message }); 
    }
  }
}

module.exports = AlunoController; 