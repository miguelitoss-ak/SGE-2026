const mysql = require('mysql2/promise');
require('dotenv').config(); // Carrega as variáveis do arquivo .env

// Criamos um pool de conexões (mais eficiente que uma conexão única)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sge',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Teste de conexão imediato
pool.getConnection()
  .then(conn => {
    console.log('✅ Conectado ao banco de dados SGE com sucesso!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Erro ao conectar no banco:', err.message);
  });

module.exports = pool;