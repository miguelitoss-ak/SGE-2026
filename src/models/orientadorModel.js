const db = require('../config/database');

class OrientadorModel {
  // Lista todos os orientadores
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM orientadores');
    return rows;
  }

  // Busca por ID (útil para validar antes de criar um estágio)
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM orientadores WHERE id = ?', [id]);
    return rows[0];
  }

  // Cria um novo orientador
  static async create(data) {
    const { nome, email, telefone } = data;
    const sql = `INSERT INTO orientadores (nome, email, telefone) VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [nome, email, telefone]);
    return result.insertId;
  }
}

module.exports = OrientadorModel;