const EmpresaModel = require('../models/empresaModel');
const validateEmail = require('../utils/validateEmail'); // [cite: 133]

class EmpresaService {
  static async getAllEmpresas() {
    return await EmpresaModel.findAll();
  }

  static async createEmpresa(empresaData) {
    // Validação de e-mail (utilitário reutilizável) [cite: 133]
    if (empresaData.email && !validateEmail(empresaData.email)) {
      throw new Error("Formato de email da empresa inválido."); // [cite: 133]
    }

    // Regra de Negócio: Validar se o CNPJ já existe
    const existingEmpresa = await EmpresaModel.findByCnpj(empresaData.CNPJ_NibocoProd);
    if (existingEmpresa) {
      throw new Error("Empresa com este CNPJ já cadastrada.");
    }

    return await EmpresaModel.create(empresaData);
  }
}

module.exports = EmpresaService;