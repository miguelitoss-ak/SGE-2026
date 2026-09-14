const EstagioModel = require('../models/estagioModel');
const AlunoModel = require('../models/alunoModel');
const OrientadorModel = require('../models/orientadorModel');

class EstagioService {
  static _isAdminUser(user) {
    const role = String(user?.role || '').toUpperCase();
    return role === 'ADMIN' || role === 'ADMINISTRADOR';
  }

  static _parseBoolean(value) {
    if (value === true || value === 'true' || value === 1 || value === '1') return true;
    if (value === false || value === 'false' || value === 0 || value === '0') return false;
    return Boolean(value);
  }

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

  static async _resolveAlunoId(id_aluno, user = null) {
    if (id_aluno !== undefined && id_aluno !== null && id_aluno !== '') {
      const id = Number(id_aluno);
      if (!Number.isFinite(id) || id < 1) {
        throw new Error('ID do aluno inválido.');
      }

      const aluno = await AlunoModel.findById(id);
      if (!aluno) {
        throw new Error('Aluno não encontrado.');
      }

      return id;
    }

    if (user?.id_aluno !== undefined || user?.alunoId !== undefined || user?.aluno_id !== undefined) {
      const fallbackId = user.id_aluno ?? user.alunoId ?? user.aluno_id;
      const id = Number(fallbackId);
      if (!Number.isFinite(id) || id < 1) {
        throw new Error('ID do aluno inválido.');
      }

      const aluno = await AlunoModel.findById(id);
      if (!aluno) {
        throw new Error('Aluno não encontrado.');
      }

      return id;
    }

    if (user?.email) {
      const alunoPorEmail = await AlunoModel.findByEmail(user.email);
      if (alunoPorEmail) {
        return alunoPorEmail.id;
      }
    }

    if (user?.matricula) {
      const alunoPorMatricula = await AlunoModel.findByMatricula(user.matricula);
      if (alunoPorMatricula) {
        return alunoPorMatricula.id;
      }
    }

    throw new Error('id_aluno é obrigatório para criar o estágio.');
  }

  static async createEstagio(data, user = null) {
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

    if (Number(data.carga_horaria_semanal) > 30) {
      throw new Error("A carga horária semanal não pode exceder 30 horas conforme a lei de estágio.");
    }

    const obrigatorio = this._parseBoolean(data.obrigatorio);
    const isAdmin = this._isAdminUser(user);
    const apoliceFieldsFilled = [data.numero_apolice, data.nome_seguradora, data.valor_apolice].some(
      (value) => value !== undefined && value !== null && String(value).trim() !== ''
    );

    if (obrigatorio && !isAdmin && apoliceFieldsFilled) {
      throw new Error('Somente ADMIN pode preencher os dados de apólice em estágio obrigatório.');
    }

    data.obrigatorio = obrigatorio;

    if (!data.situacao) data.situacao = 'ATIVO';

    data.id_aluno = await this._resolveAlunoId(data.id_aluno, user);
    data.id_orientador = await this._resolveOrientadorId(data.id_orientador);

    return await EstagioModel.create(data);
  }

  static async getAll() {
    return await EstagioModel.findAll();
  }

  static async getMeusEstagios(user) {
    if (!user) {
      throw new Error('Usuário não autenticado.');
    }

    if (this._isAdminUser(user)) {
      return await EstagioModel.findAll();
    }

    let aluno = null;

    if (user.id_aluno !== undefined && user.id_aluno !== null && user.id_aluno !== '') {
      aluno = await AlunoModel.findById(user.id_aluno);
    }

    if (!aluno && user.email) {
      aluno = await AlunoModel.findByEmail(user.email);
    }

    if (!aluno && user.matricula) {
      aluno = await AlunoModel.findByMatricula(user.matricula);
    }

    if (!aluno) {
      throw new Error('Aluno não encontrado.');
    }

    return await EstagioModel.findByAlunoId(aluno.id);
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
