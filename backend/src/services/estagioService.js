const EstagioModel = require('../models/estagioModel');
const OrientadorModel = require('../models/orientadorModel');

class EstagioService {
  static async _resolveOrientadorId(id_orientador) {
    if (id_orientador === undefined || id_orientador === null || id_orientador === '') {
      throw new Error('Todo estágio deve ter um orientador (id_orientador é obrigatório).');
    }
    const id = Number(id_orientador);
    if (!Number.isFinite(id) || id < 1) {
      throw new Error('ID do orientador inválido.');
    }
    const orientador = await OrientadorModel.findById(id);
    if (!orientador) {
      throw new Error('Orientador não encontrado.');
    }
    return id;
  }

  static async createEstagio(data) {
    const inicio = new Date(data.data_inicio);
    if (Number.isNaN(inicio.getTime())) {
      throw new Error('Data de início inválida.');
    }
    if (data.data_fim) {
      const fim = new Date(data.data_fim);
      if (Number.isNaN(fim.getTime())) {
        throw new Error('Data de término inválida.');
      }
      if (fim <= inicio) {
        throw new Error("A data de término deve ser posterior à data de início.");
      }
    }

    if (data.carga_horaria_semanal > 30) {
      throw new Error("A carga horária semanal não pode exceder 30 horas conforme a lei de estágio.");
    }

    if (!data.situacao) data.situacao = 'ATIVO';

    data.id_orientador = await this._resolveOrientadorId(data.id_orientador);

    return await EstagioModel.create(data);
  }

  static async getAll() {
    return await EstagioModel.findAll();
  }

  static async vincularOrientador(idEstagio, id_orientador) {
    if (idEstagio === undefined || idEstagio === null || idEstagio === '') {
      throw new Error('O ID do estágio é obrigatório.');
    }
    const idEst = Number(idEstagio);
    if (!Number.isFinite(idEst) || idEst < 1) {
      throw new Error('ID do estágio inválido.');
    }

    const idOrient = await this._resolveOrientadorId(id_orientador);

    const estagioExistente = await EstagioModel.findById(idEst);
    if (!estagioExistente) {
      throw new Error('Estágio não encontrado.');
    }

    return await EstagioModel.updateOrientador(idEst, idOrient);
  }

}

module.exports = EstagioService;