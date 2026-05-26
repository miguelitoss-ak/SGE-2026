const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel'); // Verifique se seu model aceita os novos campos

class UserService {
  static async registerUser(user) {
    // 1. Desestruturando todos os campos reais que vêm do seu formulário HTML
    const { matricula, nome, cpf, telefone, email, data_nasc, senha } = user;

    // Validação básica de obrigatoriedade
    if (!email || !senha || !matricula || !nome) {
      throw new Error('Campos obrigatórios estão faltando (Matrícula, Nome, Email e Senha)');
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

module.exports = UserService;