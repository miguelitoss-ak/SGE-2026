const AlunoModel = require('../models/alunoModel');
const validateEmail = require('../utils/validateEmail'); 

class AlunoService {
  static async getAllAlunos() {
    return await AlunoModel.findAll(); 
  }

  static async createAluno(alunoData) {
    // 1. Regra de Negócio: Validar e-mail [cite: 133, 162]
    if (!validateEmail(alunoData.email)) {
      throw new Error("Formato de email inválido."); 
    }

    // 2. Regra de Negócio: Verificar se o CPF já existe
    const existingAluno = await AlunoModel.findByCpf(alunoData.cpf);
    if (existingAluno) {
      throw new Error("Este CPF já está cadastrado."); 
    }

    return await AlunoModel.create(alunoData); 
  }
}

module.exports = AlunoService; 