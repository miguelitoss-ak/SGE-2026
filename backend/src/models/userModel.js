const prisma = require('../prisma/prismaClient');

class UserModel {
  static async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async create(user) {
    const { matricula, nome, cpf, telefone, email, data_nasc, senha, id_curso, role = 'ALUNO' } = user;

    return prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          senha,
          role,
          matricula,
          nome,
          cpf,
          telefone,
          data_nasc,
        },
        select: {
          id: true,
          matricula: true,
          nome: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      if (role !== 'ADMIN') {
        await tx.aluno.create({
          data: {
            matricula: parseInt(matricula),
            nome,
            cpf,
            telefone,
            email,
            data_nasc,
            id_curso: parseInt(id_curso),
          },
        });
      }

      return newUser;
    });
  }
}

module.exports = UserModel;