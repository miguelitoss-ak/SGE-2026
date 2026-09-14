const prisma = require('../prisma/prismaClient');

class AlunoModel {
  // Busca todos os alunos (SELECT *)
  static async findAll() {
    return prisma.$queryRaw`SELECT * FROM alunos`;
  }

  static async findById(id) {
    const alunoId = Number(id);
    if (!Number.isFinite(alunoId) || alunoId < 1) {
      return null;
    }

    return prisma.aluno.findUnique({
      where: { id: alunoId },
    });
  }

  static async findByEmail(email) {
    if (!email || String(email).trim() === '') {
      return null;
    }

    return prisma.aluno.findFirst({
      where: { email: String(email).trim() },
    });
  }

  static async findByMatricula(matricula) {
    if (matricula === null || matricula === undefined || String(matricula).trim() === '') {
      return null;
    }

    const value = Number(matricula);
    if (!Number.isFinite(value)) {
      return null;
    }

    return prisma.aluno.findUnique({
      where: { matricula: value },
    });
  }

  // Cria um novo aluno usando os campos do seu SQL
  static async create(aluno) {
    const { matricula, nome, cpf, telefone, email, data_nasc, id_curso, id_orientador } = aluno;
    const oid =
      id_orientador === '' || id_orientador === undefined || id_orientador === null
        ? null
        : Number(id_orientador);
    const emailNorm =
      email === undefined || email === null || String(email).trim() === '' ? null : String(email).trim();

    const created = await prisma.aluno.create({
      data: {
        matricula,
        nome,
        cpf,
        telefone,
        email: emailNorm,
        data_nasc,
        id_curso,
        id_orientador: Number.isFinite(oid) ? oid : null,
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
