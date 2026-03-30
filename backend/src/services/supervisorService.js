const SupervisorModel = require('../models/supervisorModel');
const EmpresaModel = require('../models/empresaModel');

class SupervisorService {
  static async createSupervisor(data) {
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

module.exports = SupervisorService;