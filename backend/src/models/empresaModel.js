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
    const { CNPJ_NibocoProd, nome_social, nome_fantasia, endereco, telefone, email, representante, cargo } = empresa;
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
      },
    });
    return created.id;
  }
}

module.exports = EmpresaModel;