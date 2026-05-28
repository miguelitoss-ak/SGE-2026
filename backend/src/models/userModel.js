const prisma = require('../prisma/prismaClient');

class UserModel {
  static async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async create(user) {
    // 1. Recebe todos os campos enviados pelo seu UserService
    const { matricula, nome, cpf, telefone, email, data_nasc, senha, id_curso, role = 'ALUNO' } = user;

    // Usamos uma transação para garantir que ambos os registros sejam criados ou nenhum
    return prisma.$transaction(async (tx) => {
      // Cria o registro na tabela User (para login)
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

      // Cria automaticamente o registro na tabela Aluno (para o negócio/estágios)
      await tx.aluno.create({
        data: {
          matricula: parseInt(matricula), // Converte para Int conforme o schema da tabela alunos
          nome,
          cpf,
          telefone,
          email,
          data_nasc,
          id_curso: parseInt(id_curso), // Agora usa o ID selecionado no formulário
        }
      });

      return newUser;
    });
  }
}

module.exports = UserModel;