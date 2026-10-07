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

  static async findDetailsById(id) {
    return prisma.estagio.findUnique({
      where: { id: Number(id) },
      include: {
        aluno: { include: { curso: true } },
        empresa: true,
        supervisor: true,
        orientador: true,
        dias_semana_estagio: true,
      },
    });
  }

  static async findAll() {
    return prisma.estagio.findMany({
      orderBy: { id: 'desc' },
      include: {
        aluno: true,
        empresa: true,
        supervisor: true,
        orientador: true,
        documento: true,
      },
    });
  }

  static async findByAlunoId(idAluno) {
    const alunoId = Number(idAluno);
    if (!Number.isFinite(alunoId) || alunoId < 1) {
      return [];
    }

    return prisma.estagio.findMany({
      where: { id_aluno: alunoId },
      orderBy: { dt_registro: 'desc' },
      include: {
        aluno: true,
        empresa: true,
        supervisor: true,
        orientador: true,
        documento: true,
      },
    });
  }

  static async create(data) {
    const {
      dt_registro,
      beneficio_alimentacao,
      beneficio_transporte,
      beneficio_impresso,
      bolsa_auxilio,
      data_inicio,
      data_fim,
      carga_horaria_total,
      carga_horaria_semanal,
      situacao,
      id_aluno,
      id_empresa,
      id_supervisor,
      id_orientador,
      id_documento,
      obrigatorio,
      numero_apolice,
      nome_seguradora,
      valor_apolice,
      area,
      horarios,
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
    const diasValidos = new Set([
      'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO',
    ]);
    const horariosSalvos = (Array.isArray(horarios) ? horarios : [])
      .map((horario) => {
        if (!horario || !horario.horario_inicio || !horario.horario_saida) {
          throw new Error('Cada horário do estágio deve informar entrada e saída.');
        }
        const diaSemana = String(horario.dia_semana || '').toUpperCase();
        const turno = String(horario.turno || '').toUpperCase();
        const horarioInicio = String(horario.horario_inicio);
        const horarioSaida = String(horario.horario_saida);
        const converterHora = (hora) => {
          if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
            throw new Error('Horário do estágio inválido.');
          }
          return new Date(`1970-01-01T${hora}:00.000Z`);
        };

        if (!diasValidos.has(diaSemana) || !['MANHA', 'TARDE_NOITE'].includes(turno)) {
          throw new Error('Dia ou turno do estágio inválido.');
        }

        return {
          dia_semana: diaSemana,
          turno,
          horario_inicio: converterHora(horarioInicio),
          horario_saida: converterHora(horarioSaida),
        };
      });

    if (!dataInicio) {
      throw new Error('Data de início inválida.');
    }

    if (data_fim && !dataFim) {
      throw new Error('Data de término inválida.');
    }

    const alunoExistente = await prisma.aluno.findUnique({
      where: { id: idAlunoNum },
      select: { id: true },
    });

    if (!alunoExistente) {
      throw new Error('Aluno não encontrado.');
    }

    try {
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
          area: area === null || area === undefined || String(area).trim() === ''
            ? null
            : String(area).trim(),
          dias_semana_estagio: horariosSalvos.length
            ? { create: horariosSalvos }
            : undefined,
        },
      });

      return created.id;
    } catch (error) {
      if (error?.code === 'P2003') {
        throw new Error('Falha de integridade referencial ao criar o estágio. Verifique os IDs informados.');
      }
      throw error;
    }
  }

  static async updateOrientador(id, id_orientador) {
    return await prisma.estagio.update({
      where: {
        id: Number(id),
      },
      data: {
        id_orientador: Number(id_orientador),
      },
      include: {
        orientador: true,
      },
    });
  }

  static async updateDetails(id, data) {
    const diasValidos = new Set([
      'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO',
    ]);
    const horarios = (Array.isArray(data.horarios) ? data.horarios : []).map((horario) => {
      const diaSemana = String(horario?.dia_semana || '').toUpperCase();
      const turno = String(horario?.turno || '').toUpperCase();
      const converterHora = (valor) => {
        const match = String(valor || '').match(/^([01]\d|2[0-3]):([0-5]\d)$/);
        if (!match) throw new Error('Horário do estágio inválido.');
        return {
          date: new Date(`1970-01-01T${match[1]}:${match[2]}:00.000Z`),
          minutes: Number(match[1]) * 60 + Number(match[2]),
        };
      };

      if (!diasValidos.has(diaSemana) || !['MANHA', 'TARDE_NOITE'].includes(turno)) {
        throw new Error('Dia ou turno do estágio inválido.');
      }
      const inicio = converterHora(horario.horario_inicio);
      const fim = converterHora(horario.horario_saida);
      if (fim.minutes <= inicio.minutes) throw new Error('A saída deve ser posterior à entrada.');
      if (fim.minutes > 22 * 60) throw new Error('O horário de saída não pode passar das 22:00.');
      return {
        dia_semana: diaSemana,
        turno,
        horario_inicio: inicio.date,
        horario_saida: fim.date,
      };
    });

    const dateStart = this.parseDateOnly(data.data_inicio);
    const dateEnd = this.parseDateOnly(data.data_fim);
    if (!dateStart) throw new Error('Data de início inválida.');
    if (data.data_fim && !dateEnd) throw new Error('Data de término inválida.');
    if (dateEnd && dateEnd <= dateStart) {
      throw new Error('A data de término deve ser posterior à data de início.');
    }

    const parseNumber = (value, field, { nullable = false, integer = false } = {}) => {
      if (value === null || value === undefined || value === '') {
        if (nullable) return null;
        throw new Error(`${field} é obrigatório.`);
      }
      const number = Number(value);
      if (!Number.isFinite(number) || (integer && !Number.isInteger(number))) {
        throw new Error(`${field} inválido.`);
      }
      return number;
    };
    const idEmpresa = parseNumber(data.id_empresa, 'Empresa', { integer: true });
    const idOrientador = parseNumber(data.id_orientador, 'Orientador', { integer: true });
    const idSupervisor = parseNumber(data.id_supervisor, 'Supervisor', { nullable: true, integer: true });
    const cargaTotal = parseNumber(data.carga_horaria_total, 'Carga horária total', { integer: true });
    const cargaSemanal = parseNumber(data.carga_horaria_semanal, 'Carga horária semanal', { nullable: true });
    const decimal = (value, field) => {
      if (value === null || value === undefined || value === '') return null;
      const number = Number(value);
      if (!Number.isFinite(number) || number < 0) throw new Error(`${field} inválido.`);
      return new Prisma.Decimal(number);
    };
    const boolean = (value) => value === true || value === 'true' || value === 1 || value === '1';

    return prisma.$transaction(async (transaction) => {
      await transaction.estagio.update({
        where: { id: Number(id) },
        data: {
          id_empresa: idEmpresa,
          id_supervisor: idSupervisor,
          id_orientador: idOrientador,
          data_inicio: dateStart,
          data_fim: dateEnd,
          carga_horaria_total: cargaTotal,
          carga_horaria_semanal: decimal(cargaSemanal, 'Carga horária semanal'),
          situacao: String(data.situacao || 'ATIVO'),
          obrigatorio: boolean(data.obrigatorio),
          area: String(data.area || '').trim() || null,
          bolsa_auxilio: decimal(data.bolsa_auxilio, 'Bolsa auxílio'),
          beneficio_alimentacao: boolean(data.beneficio_alimentacao),
          beneficio_transporte: boolean(data.beneficio_transporte),
          numero_apolice: String(data.numero_apolice || '').trim() || null,
          nome_seguradora: String(data.nome_seguradora || '').trim() || null,
          valor_apolice: decimal(data.valor_apolice, 'Valor da apólice'),
        },
      });

      await transaction.diaSemanaEstagio.deleteMany({
        where: { id_estagio: Number(id) },
      });
      if (horarios.length) {
        await transaction.diaSemanaEstagio.createMany({
          data: horarios.map((horario) => ({ ...horario, id_estagio: Number(id) })),
        });
      }

      return transaction.estagio.findUnique({
        where: { id: Number(id) },
        include: {
          aluno: { include: { curso: true } },
          empresa: true,
          supervisor: true,
          orientador: true,
          dias_semana_estagio: true,
        },
      });
    });
  }
}

module.exports = EstagioModel;
