const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

class UserService {
  static async registerUser(user) {
    const { email, password, role } = user;

    if (!email || !password) {
      throw new Error('Email e senha sao obrigatorios');
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('Usuario ja existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await UserModel.create({
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    return {
      message: 'Usuario registrado com sucesso',
      user: createdUser,
    };
  }

  static async loginUser({ email, password }) {
    if (!email || !password) {
      throw new Error('Email e senha sao obrigatorios');
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Usuario nao encontrado');
    }

    const passwordIsValid = await bcrypt.compare(password, user.senha);
    if (!passwordIsValid) {
      throw new Error('Senha invalida');
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET nao configurado');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}

module.exports = UserService;
