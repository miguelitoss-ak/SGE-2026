const prisma = require('../prisma/prismaClient');

class EmpresaModel {
  // Lista todas as empresas
  static async findAll() {
    return prisma.$queryRaw`SELECT * FROM empresas`;
  }

  // Busca por CNPJ para validação
  static async findByCnpj(cnpj) {
    const rows = await prisma.$queryRaw`
      SELECT * FROM empresas WHERE CNPJ_NibocoProd = ${cnpj} LIMIT 1
    `;
    return rows[0];
  }

  // Busca por ID (útil para validação de supervisores/estágios)
  static async findById(id) {
    const rows = await prisma.$queryRaw`
      SELECT * FROM empresas WHERE id = ${id} LIMIT 1
    `;
    return rows[0];
  }

  // Cria uma nova empresa conforme seu SQL
  static async create(empresa) {
    const {
      CNPJ_NibocoProd,
      nome_social,
      nome_fantasia,
      endereco,
      telefone,
      email,
      representante,
      cargo,
      inscricao_estadual,
      id_usuario_empresa,
    } = empresa;
    const uid =
      id_usuario_empresa === '' || id_usuario_empresa === undefined || id_usuario_empresa === null
        ? null
        : Number(id_usuario_empresa);
    const created = await prisma.empresa.create({
      data: {
        CNPJ_NibocoProd,
        nome_social,
        nome_fantasia,
        endereco,
        telefone,
        email,
        representante,
        cargo,
        inscricao_estadual: inscricao_estadual != null ? String(inscricao_estadual).trim() || null : null,
        id_usuario_empresa: Number.isFinite(uid) ? uid : null,
      },
    });
    return created.id;
  }
}

module.exports = EmpresaModel;