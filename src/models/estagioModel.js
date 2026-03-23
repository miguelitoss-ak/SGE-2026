const prisma = require('../prisma/prismaClient');
const { Prisma } = require('@prisma/client');

class EstagioModel {
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
      situacao, id_aluno, id_empresa, id_supervisor, id_orientador, id_documento
    } = data;

    const toNullableBool = (v) => {
      if (v === null || v === undefined) return null;
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

    const created = await prisma.estagio.create({
      data: {
        dt_registro,
        beneficio_alimentacao: toNullableBool(beneficio_alimentacao),
        beneficio_transporte: toNullableBool(beneficio_transporte),
        beneficio_impresso: toNullableBool(beneficio_impresso),
        bolsa_auxilio:
          bolsa_auxilio === null || bolsa_auxilio === undefined
            ? null
            : new Prisma.Decimal(bolsa_auxilio),
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
      },
    });

    return created.id;
  }
}

module.exports = EstagioModel;