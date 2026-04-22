const AlunoModel = require('../models/alunoModel');
const OrientadorModel = require('../models/orientadorModel');
const validateEmail = require('../utils/validateEmail'); 

class AlunoService {
  static async getAllAlunos() {
    return await AlunoModel.findAll(); 
  }

  static async createAluno(alunoData) {
    const emailStr = alunoData.email != null ? String(alunoData.email).trim() : '';
    if (emailStr !== '' && !validateEmail(emailStr)) {
      throw new Error("Formato de email inválido."); 
    }

    if (alunoData.id_orientador != null && alunoData.id_orientador !== '') {
      const orientador = await OrientadorModel.findById(Number(alunoData.id_orientador));
      if (!orientador) {
        throw new Error('Orientador informado não encontrado.');
      }
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