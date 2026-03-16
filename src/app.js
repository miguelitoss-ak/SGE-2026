const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

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

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rotas da API SGE
app.use('/alunos', alunoRoutes);
app.use('/empresas', empresaRoutes);
app.use('/cursos', cursoRoutes); // Adicionado cursos
app.use('/supervisores', supervisorRoutes);
app.use('/estagios', estagioRoutes);
app.use('/orientadores', orientadorRoutes);
app.use('/documentos', documentoRoutes);
app.use('/horarios', horarioRoutes);

// Tratamento de erros
app.use(errorMiddleware);

module.exports = app;