const OrientadorModel = require('../models/orientadorModel');
const validateEmail = require('../utils/validateEmail');

class OrientadorService {
  static async getAll() {
    return await OrientadorModel.findAll();
  }

  static async createOrientador(data) {
    // Regra de Negócio: Validar e-mail se fornecido
    if (data.email && !validateEmail(data.email)) {
      throw new Error("O e-mail do orientador é inválido.");
    }

    // Regra de Negócio: Nome é obrigatório
    if (!data.nome) {
      throw new Error("O nome do orientador é obrigatório.");
    }

    return await OrientadorModel.create(data);
  }
}

module.exports = OrientadorService;