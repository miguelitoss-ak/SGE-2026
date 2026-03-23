const prisma = require('../prisma/prismaClient');

class AlunoModel {
  // Busca todos os alunos (SELECT *)
  static async findAll() {
    return prisma.$queryRaw`SELECT * FROM alunos`;
  }

  // Cria um novo aluno usando os campos do seu SQL
  static async create(aluno) {
    const { matricula, nome, cpf, telefone, email, data_nasc, id_curso } = aluno;
    const created = await prisma.aluno.create({
      data: {
        matricula,
        nome,
        cpf,
        telefone,
        email,
        data_nasc,
        id_curso,
      },
    });
    return created.id;
  }

  static async findByCpf(cpf) {
    const rows = await prisma.$queryRaw`
      SELECT * FROM alunos WHERE cpf = ${cpf} LIMIT 1
    `;
    return rows[0];
  }
}

module.exports = AlunoModel; 
