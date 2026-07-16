const prisma = require('../prisma/prismaClient');
const { Prisma } = require('@prisma/client');

class EstagioModel {
  static parseDateOnly(value) {
    if (value === null || value === undefined || value === '') return null;
    if (value instanceof Date) return value;

    const raw = String(value).trim();
    if (!raw) return null;

    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const date = new Date(`${raw}T00:00:00.000Z`);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  static async findById(id) {
    return prisma.estagio.findUnique({
      where: { id: Number(id) },
    });
  }

  static async findAll() {
    // Busca estágios trazendo o nome do aluno e da empresa (JOIN opcional, mas recomendado)
    return prisma.$queryRaw`
      SELECT e.*, a.nome as aluno_nome, emp.nome_social as empresa_nome 
      FROM estagios e
      JOIN alunos a ON e.id_aluno = a.id
      JOIN empresas emp ON e.id_empresa = emp.id
    `;
  }

  static async create(data) {
    const {
      dt_registro, beneficio_alimentacao, beneficio_transporte, beneficio_impresso,
      bolsa_auxilio, data_inicio, data_fim, carga_horaria_total, carga_horaria_semanal,
      situacao, id_aluno, id_empresa, id_supervisor, id_orientador, id_documento,
      obrigatorio, numero_apolice, nome_seguradora, valor_apolice
    } = data;

    const toNullableBool = (v) => {
      if (v === null || v === undefined || v === '') return null;
      if (v === true) return true;
      if (v === false) return false;
      if (v === 1 || v === '1') return true;
      if (v === 0 || v === '0') return false;
      if (typeof v === 'string') {
        const s = v.trim().toLowerCase();
        if (['true', 't', 'yes', 'y', 'sim'].includes(s)) return true;
        if (['false', 'f', 'no', 'n', 'nao', 'não'].includes(s)) return false;
      }
      return Boolean(v);
    };

    const toNullableInt = (v) => {
      if (v === null || v === undefined || v === '') return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const toRequiredInt = (v, fieldName) => {
      const n = toNullableInt(v);
      if (n === null || !Number.isFinite(n) || n < 1) {
        throw new Error(`${fieldName} inválido.`);
      }
      return n;
    };

    const idAlunoNum = toRequiredInt(id_aluno, 'id_aluno');
    const idEmpresaNum = toRequiredInt(id_empresa, 'id_empresa');
    const idSupervisorNum = toNullableInt(id_supervisor);
    const idOrientadorNum = toRequiredInt(id_orientador, 'id_orientador');
    const idDocumentoNum = toNullableInt(id_documento);
    const cargaHorariaTotalNum = toNullableInt(carga_horaria_total);
    const dtRegistro = this.parseDateOnly(dt_registro) || new Date();
    const dataInicio = this.parseDateOnly(data_inicio);
    const dataFim = this.parseDateOnly(data_fim);

    if (!dataInicio) {
      throw new Error('Data de início inválida.');
    }
    if (data_fim && !dataFim) {
      throw new Error('Data de término inválida.');
    }

    const created = await prisma.estagio.create({
      data: {
        dt_registro: dtRegistro,
        beneficio_alimentacao: toNullableBool(beneficio_alimentacao),
        beneficio_transporte: toNullableBool(beneficio_transporte),
        beneficio_impresso: toNullableBool(beneficio_impresso),
        bolsa_auxilio:
          bolsa_auxilio === null || bolsa_auxilio === undefined || bolsa_auxilio === ''
            ? null
            : new Prisma.Decimal(bolsa_auxilio),
        data_inicio: dataInicio,
        data_fim: dataFim,
        carga_horaria_total: cargaHorariaTotalNum,
        carga_horaria_semanal:
          carga_horaria_semanal === null || carga_horaria_semanal === undefined || carga_horaria_semanal === ''
            ? null
            : new Prisma.Decimal(carga_horaria_semanal),
        situacao,
        obrigatorio: obrigatorio === true || obrigatorio === 'true' || obrigatorio === 1 || obrigatorio === '1',
        id_aluno: idAlunoNum,
        id_empresa: idEmpresaNum,
        id_supervisor: idSupervisorNum,
        id_orientador: idOrientadorNum,
        id_documento: idDocumentoNum,
        numero_apolice: numero_apolice || null,
        nome_seguradora: nome_seguradora || null,
        valor_apolice:
          valor_apolice === null || valor_apolice === undefined || valor_apolice === ''
            ? null
            : new Prisma.Decimal(valor_apolice),
      },
    });

    return created.id;
  }

  static async updateOrientador(id, id_orientador) {
    return await prisma.estagio.update({
      where: { 
        id: Number(id) 
      },
      data: {
        id_orientador: Number(id_orientador),
      },
      include: {
        // Isso retorna os dados do orientador para que o frontend saiba quem foi selecionado
        orientador: true 
      }
    });
  }
}

module.exports = EstagioModel;
