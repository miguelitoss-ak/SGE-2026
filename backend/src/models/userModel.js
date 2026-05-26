const prisma = require('../prisma/prismaClient');

class UserModel {
  static async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async create(user) {
    // 1. Recebe todos os campos enviados pelo seu UserService
    const { matricula, nome, cpf, telefone, email, data_nasc, senha, role = 'ALUNO' } = user;

    return prisma.user.create({
      data: {
        email,
        senha, // Já vem criptografada do UserService
        role,
        matricula,
        nome,
        cpf,
        telefone,
        data_nasc, // Já convertido para objeto Date pelo UserService
      },
      // 2. Define o que o Prisma deve retornar após salvar (omitindo a senha por segurança)
      select: {
        id: true,
        matricula: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }
}

module.exports = UserModel;