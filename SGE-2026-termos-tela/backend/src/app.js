const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const errorMiddleware = require('./middlewares/errorMiddleware');

// Importação das rotas do Banco SGE
const alunoRoutes = require('./routes/alunoRoutes');
const empresaRoutes = require('./routes/empresaRoutes');
const supervisorRoutes = require('./routes/supervisorRoutes');
const cursoRoutes = require('./routes/cursoRoutes'); // Nova rota
const estagioRoutes = require('./routes/estagioRoutes');
const orientadorRoutes = require('./routes/orientadorRoutes');
const documentoRoutes = require('./routes/documentoRoutes');
const horarioRoutes = require('./routes/horarioRoutes');
// Rotas independentes para gerar termos com dados fictícios.
const termoRoutes = require('./routes/termoRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'templates')));

app.get('/', (req, res) => {
  return res.redirect('/login.html');
});

const pageRedirects = {
  '/login': '/login.html',
  '/cadastro': '/cadastro.html',
  '/forgot-password': '/forgot-password.html',
  '/home': '/home.html',
  '/addEstagio': '/addEstagio.html',
  '/addEmpresa': '/addEmpresa.html',
  '/addOrientador': '/addOrientador.html',
  '/addSupervisor': '/addSupervisor.html',
  '/editEstagio': '/editEstagio.html',
};

Object.entries(pageRedirects).forEach(([from, to]) => {
  app.get(from, (req, res) => res.redirect(to));
});

// Rotas da API SGE
app.use('/alunos', alunoRoutes);
app.use('/empresas', empresaRoutes);
app.use('/cursos', cursoRoutes); // Adicionado cursos
app.use('/supervisores', supervisorRoutes);
app.use('/estagios', estagioRoutes);
app.use('/orientadores', orientadorRoutes);
app.use('/documentos', documentoRoutes);
app.use('/horarios', horarioRoutes);
app.use('/termos', termoRoutes);

//rotas responsáveis pela autenticação (login, cadastro, etc.)
const authRoutes = require('./routes/authRoutes');

// Importa as rotas públicas, que não requerem autenticação
const publicRoutes = require('./routes/publicRoutes');

// Importa as rotas protegidas, que só podem ser acessadas com um token JWT 
const protectedRoutes = require('./routes/protectedRoutes');

// Define o prefixo '/auth' para as rotas de autenticação
app.use('/auth', authRoutes);

// Define o prefixo '/public' para rotas acessíveis sem autenticação
app.use('/public', publicRoutes);

// Define o prefixo '/protected' para rotas que exigem autenticação com JWT
app.use('/protected', protectedRoutes);

app.use(errorMiddleware);

module.exports = app;
