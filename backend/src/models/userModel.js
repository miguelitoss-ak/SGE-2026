const prisma = require('../prisma/prismaClient');

class UserModel {
  static async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async create(user) {
    const { email, password, role = 'user' } = user;

    return prisma.user.create({
      data: {
        email,
        senha: password,
        role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }
}

module.exports = UserModel;
