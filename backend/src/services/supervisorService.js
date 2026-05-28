const SupervisorModel = require('../models/supervisorModel');
const EmpresaModel = require('../models/empresaModel');
const validateEmail = require('../utils/validateEmail');

class SupervisorService {
  static async createSupervisor(data) {
    // Regra de Negócio: Validar e-mail se fornecido
    if (data.email && !validateEmail(data.email)) {
      throw new Error("O e-mail do supervisor é inválido.");
    }

    // Validação matemática do CPF
    if (data.cpf && !validarCPF(data.cpf)) {
      throw new Error("O CPF informado para o supervisor é inválido.");
    }

    // 1. Validar se o CPF já está cadastrado
    const exists = await SupervisorModel.findByCpf(data.cpf);
    if (exists) throw new Error("CPF de supervisor já cadastrado.");

    // 2. Validar se a empresa existe (Integridade Referencial)
    const empresa = await EmpresaModel.findById(data.id_empresa);
    if (!empresa) throw new Error("A empresa informada não existe.");

    return await SupervisorModel.create(data);
  }

  static async getAll() {
    return await SupervisorModel.findAll();
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

module.exports = SupervisorService;