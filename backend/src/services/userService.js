const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const validateEmail = require('../utils/validateEmail');

class UserService {
  static async registerUser(user) {
    const { matricula, nome, cpf, telefone, email, data_nasc, senha, id_curso } = user;

    if (!email || !senha || !matricula || !nome || !id_curso) {
      throw new Error('Campos obrigatórios estão faltando (Matrícula, Nome, Email e Senha)');
    }

    if (!validateEmail(email)) {
      throw new Error('O e-mail fornecido é inválido.');
    }

    if (cpf && !validarCPF(cpf)) {
      throw new Error('O CPF fornecido é inválido.');
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('Usuario ja existe');
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const createdUser = await UserModel.create({
      matricula,
      nome,
      cpf,
      telefone,
      email,
      data_nasc: data_nasc ? new Date(data_nasc) : null,
      senha: hashedPassword,
      id_curso,
      role: 'ALUNO',
    });

    return {
      message: 'Usuario registrado com sucesso',
      user: createdUser,
    };
  }

  static async registerAdmin({ nome, telefone }) {
    if (!nome || !telefone) {
      throw new Error('Nome e telefone sao obrigatorios');
    }

    let email = generateEmailFromName(nome);
    let counter = 1;

    while (await UserModel.findByEmail(email)) {
      email = generateEmailFromName(nome, counter);
      counter += 1;
    }

    const senha = generateSecurePassword();
    const hashedPassword = await bcrypt.hash(senha, 10);

    const createdUser = await UserModel.create({
      nome,
      telefone,
      email,
      senha: hashedPassword,
      role: 'ADMIN',
    });

    return {
      message: 'Administrador criado com sucesso',
      email,
      senha,
      user: createdUser,
    };
  }

  static async loginUser({ email, senha }) {
    if (!email || !senha) {
      throw new Error('Email e senha sao obrigatorios');
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Usuario nao encontrado');
    }

    const passwordIsValid = await bcrypt.compare(senha, user.senha);
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
        nome: user.nome,
        matricula: user.matricula,
      },
    };
  }
}

function generateEmailFromName(nome, index = 0) {
  const normalized = nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  const parts = normalized.split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return `admin@ifrs.edu.br`;
  }

  const first = parts[0];
  const last = parts.length > 1 ? parts[parts.length - 1] : first;
  const suffix = index > 0 ? `${index}` : '';

  return `${first}.${last}${suffix}@ifrs.edu.br`;
}

function generateSecurePassword() {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  let password = '';

  for (let i = 0; i < length; i += 1) {
    password += charset.charAt(crypto.randomInt(0, charset.length));
  }

  return password;
}

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.substring(10, 11));
}

module.exports = UserService;