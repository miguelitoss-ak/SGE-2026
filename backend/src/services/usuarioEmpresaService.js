const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioEmpresaModel = require('../models/usuarioEmpresaModel');
const validateEmail = require('../utils/validateEmail');

class UsuarioEmpresaService {
  static async register({ nome, email, password, senha, telefone }) {
    const rawSenha = password || senha;

    if (!nome || !email || !rawSenha) {
      throw new Error('Nome, email e senha sao obrigatorios');
    }

    // Validação de formato de e-mail
    if (!validateEmail(email)) {
      throw new Error('O e-mail fornecido é inválido.');
    }

    const existing = await UsuarioEmpresaModel.findByEmail(email);
    if (existing) {
      throw new Error('Usuario empresa ja existe');
    }

    const senhaHash = await bcrypt.hash(rawSenha, 10);
    const user = await UsuarioEmpresaModel.create({
      nome,
      email,
      senha: senhaHash,
      telefone: telefone || null,
    });

    return {
      message: 'Usuario empresa registrado com sucesso',
      user,
    };
  }

  static async login({ email, password, senha }) {
    const rawSenha = password || senha;

    if (!email || !rawSenha) {
      throw new Error('Email e senha sao obrigatorios');
    }

    const user = await UsuarioEmpresaModel.findByEmail(email);
    if (!user) {
      throw new Error('Usuario nao encontrado');
    }

    const passwordIsValid = await bcrypt.compare(rawSenha, user.senha);
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
