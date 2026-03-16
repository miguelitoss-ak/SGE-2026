const db = require('../config/database');

class CursoModel {
  // Lista todos os cursos (id, nome, carga_horaria, email_coordenacao)
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM cursos');
    return rows;
  }

  // Busca um curso por ID para validar se ele existe antes de cadastrar um aluno
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM cursos WHERE id = ?', [id]);
    return rows[0];
  }

  // Cria um novo curso
  static async create(curso) {
    const { nome, carga_horaria, email_coordenacao } = curso;
    const sql = `INSERT INTO cursos (nome, carga_horaria, email_coordenacao) VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [nome, carga_horaria, email_coordenacao]);
    return result.insertId;
  }
}

module.exports = CursoModel;