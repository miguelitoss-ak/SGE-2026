const prisma = require('../prisma/prismaClient');

class SupervisorModel {
  static async findAll() {
    return prisma.$queryRaw`SELECT * FROM supervisores`;
  }

  static async findByCpf(cpf) {
    const rows = await prisma.$queryRaw`
      SELECT * FROM supervisores WHERE cpf = ${cpf} LIMIT 1
    `;
    return rows[0];
  }

  static async create(supervisor) {
    const { nome, cpf, cargo, telefone, email, id_empresa } = supervisor;
    const created = await prisma.supervisor.create({
      data: {
        nome,
        cpf,
        cargo,
        telefone,
        email,
        id_empresa,
      },
    });
    return created.id;
  }
}

module.exports = SupervisorModel;