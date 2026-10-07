const prisma = require('../prisma/prismaClient');

class OrientadorModel {
  // Lista todos os orientadores
  static async findAll() {
    return prisma.$queryRaw`SELECT * FROM orientadores`;
  }

  // Busca por ID (útil para validar antes de criar um estágio)
  static async findById(id) {
    const rows = await prisma.$queryRaw`
      SELECT * FROM orientadores WHERE id = ${id} LIMIT 1
    `;
    return rows[0];
  }

  // Cria um novo orientador
  static async create(data) {
    const { nome, email, telefone } = data;
    const created = await prisma.orientador.create({
      data: { nome, email, telefone },
    });
    return created.id;
  }
}

module.exports = OrientadorModel;