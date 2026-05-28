const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel'); // Verifique se seu model aceita os novos campos
const validateEmail = require('../utils/validateEmail');

class UserService {
  static async registerUser(user) {
    // 1. Desestruturando todos os campos reais que vêm do seu formulário HTML
    const { matricula, nome, cpf, telefone, email, data_nasc, senha, id_curso } = user;

    // Validação básica de obrigatoriedade
    if (!email || !senha || !matricula || !nome || !id_curso) {
      throw new Error('Campos obrigatórios estão faltando (Matrícula, Nome, Email e Senha)');
    }

    // Validação de formato de e-mail
    if (!validateEmail(email)) {
      throw new Error('O e-mail fornecido é inválido.');
    }

    // Validação matemática do CPF
    if (cpf && !validarCPF(cpf)) {
      throw new Error('O CPF fornecido é inválido.');
    }

    // 2. Verifica se o e-mail ou a matrícula já existem no sistema
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('Usuario ja existe');
    }

    // 3. Criptografa a senha (usando 'senha' para manter o padrão em português do banco)
    const hashedPassword = await bcrypt.hash(senha, 10);

    // 4. Passa o objeto completo para o seu Model/Prisma salvar
    const createdUser = await UserModel.create({
      matricula,
      nome,
      cpf,
      telefone,
      email,
      data_nasc: data_nasc ? new Date(data_nasc) : null, // Converte a string do HTML para DateTime do Prisma
      senha: hashedPassword,
      id_curso,
      role: 'ALUNO', // Força o papel como ALUNO por padrão neste cadastro
    });

    return {
      message: 'Usuario registrado com sucesso',
      user: createdUser,
    };
  }

  static async loginUser({ email, senha }) { // Ajustado de 'password' para 'senha'
    if (!email || !senha) {
      throw new Error('Email e senha sao obrigatorios');
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Usuario nao encontrado');
    }

    // Compara a senha digitada com a criptografada (garantindo que o campo no banco seja 'senha')
    const passwordIsValid = await bcrypt.compare(senha, user.senha);
    if (!passwordIsValid) {
      throw new Error('Senha invalida');
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET nao configurado');
    }

    // Gera o token guardando o id, email e o papel do usuário (ALUNO)
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
        nome: user.nome, // Adicionado para dar as boas-vindas no frontend
        matricula: user.matricula
      },
    };
  }
}

// Função auxiliar de validação de CPF
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