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

    // Validação matemática do CPF
    if (alunoData.cpf && !validarCPF(alunoData.cpf)) {
      throw new Error("O CPF informado é inválido.");
    }

    // 2. Regra de Negócio: Verificar se o CPF já existe
    const existingAluno = await AlunoModel.findByCpf(alunoData.cpf);
    if (existingAluno) {
      throw new Error("Este CPF já está cadastrado."); 
    }

    return await AlunoModel.create(alunoData); 
  }
}

// Função auxiliar de validação de CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.substring(10, 11));
}

module.exports = AlunoService; 