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
    const empresaId = Number(id_empresa);
    if (!Number.isSafeInteger(empresaId) || empresaId < 1) {
      throw new Error('Selecione uma empresa válida para o supervisor.');
    }
    const created = await prisma.supervisor.create({
      data: {
        nome: String(nome || '').trim(),
        cpf: String(cpf || '').replace(/\D/g, ''),
        cargo: String(cargo || '').trim() || null,
        telefone: String(telefone || '').replace(/\D/g, '') || null,
        email: String(email || '').trim() || null,
        id_empresa: empresaId,
      },
    });
    return created.id;
  }
}

module.exports = SupervisorModel;
