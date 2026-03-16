const db = require('../config/database');

class SupervisorModel {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM supervisores');
    return rows;
  }

  static async findByCpf(cpf) {
    const [rows] = await db.query('SELECT * FROM supervisores WHERE cpf = ?', [cpf]);
    return rows[0];
  }

  static async create(supervisor) {
    const { nome, cpf, cargo, telefone, email, id_empresa } = supervisor;
    const sql = `INSERT INTO supervisores (nome, cpf, cargo, telefone, email, id_empresa) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [nome, cpf, cargo, telefone, email, id_empresa]);
    return result.insertId;
  }
}

module.exports = SupervisorModel;