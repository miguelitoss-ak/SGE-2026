const prisma = require('../prisma/prismaClient');

class CursoModel {
  // Lista todos os cursos (id, nome, carga_horaria, email_coordenacao)
  static async findAll() {
    return prisma.$queryRaw`SELECT * FROM cursos`;
  }

  // Busca um curso por ID para validar se ele existe antes de cadastrar um aluno
  static async findById(id) {
    const rows = await prisma.$queryRaw`
      SELECT * FROM cursos WHERE id = ${id} LIMIT 1
    `;
    return rows[0];
  }

  // Cria um novo curso
  static async create(curso) {
    const { nome, carga_horaria, email_coordenacao } = curso;
    const created = await prisma.curso.create({
      data: {
        nome,
        carga_horaria,
        email_coordenacao,
      },
    });
    return created.id;
  }
}

module.exports = CursoModel;