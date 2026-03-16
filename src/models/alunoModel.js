const db = require('../config/database'); // Importa o pool de conexão [cite: 103, 126]

class AlunoModel {
  // Busca todos os alunos (SELECT *)
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM alunos'); 
    return rows;
  }

  // Cria um novo aluno usando os campos do seu SQL
  static async create(aluno) {
    const { matricula, nome, cpf, telefone, email, data_nasc, id_curso } = aluno;
    const sql = `INSERT INTO alunos (matricula, nome, cpf, telefone, email, data_nasc, id_curso) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [matricula, nome, cpf, telefone, email, data_nasc, id_curso]); 
    return result.insertId;
  }

  static async findByCpf(cpf) {
    const [rows] = await db.query('SELECT * FROM alunos WHERE cpf = ?', [cpf]); 
    return rows[0];
  }
}

module.exports = AlunoModel; 
