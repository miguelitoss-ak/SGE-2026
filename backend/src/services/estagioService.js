const EstagioModel = require('../models/estagioModel');

class EstagioService {
  static async createEstagio(data) {
    // 1. Regra de Negócio: Validar datas
    const inicio = new Date(data.data_inicio);
    const fim = new Date(data.data_fim);

    if (fim <= inicio) {
      throw new Error("A data de término deve ser posterior à data de início.");
    }

    // 2. Regra de Negócio: Validar se a carga horária semanal não ultrapassa o limite (ex: 30h)
    if (data.carga_horaria_semanal > 30) {
      throw new Error("A carga horária semanal não pode exceder 30 horas conforme a lei de estágio.");
    }

    // 3. Situacao padrão se não enviada
    if (!data.situacao) data.situacao = 'ATIVO';

    return await EstagioModel.create(data);
  }

  static async getAll() {
    return await EstagioModel.findAll();
  }
}

module.exports = EstagioService;