const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioEmpresaModel = require('../models/usuarioEmpresaModel');

class UsuarioEmpresaService {
  static async register({ nome, email, password, telefone }) {
    if (!nome || !email || !password) {
      throw new Error('Nome, email e senha sao obrigatorios');
    }

    const existing = await UsuarioEmpresaModel.findByEmail(email);
    if (existing) {
      throw new Error('Usuario empresa ja existe');
    }

    const senha = await bcrypt.hash(password, 10);
    const user = await UsuarioEmpresaModel.create({
      nome,
      email,
      senha,
      telefone: telefone || null,
    });

    return {
      message: 'Usuario empresa registrado com sucesso',
      user,
    };
  }

  static async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Email e senha sao obrigatorios');
    }

    const user = await UsuarioEmpresaModel.findByEmail(email);
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
      { id: user.id, email: user.email, role: 'empresa' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        role: 'empresa',
      },
    };
  }
}

module.exports = UsuarioEmpresaService;
