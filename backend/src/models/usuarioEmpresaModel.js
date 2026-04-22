const prisma = require('../prisma/prismaClient');

class UsuarioEmpresaModel {
  static async findById(id) {
    return prisma.usuarioEmpresa.findUnique({
      where: { id },
    });
  }

  static async findByEmail(email) {
    return prisma.usuarioEmpresa.findUnique({
      where: { email },
    });
  }

  static async create({ nome, email, senha, telefone }) {
    return prisma.usuarioEmpresa.create({
      data: {
        nome,
        email,
        senha,
        telefone,
      },
      select: {
        id: true,
        email: true,
        nome: true,
        createdAt: true,
      },
    });
  }
}

module.exports = UsuarioEmpresaModel;
