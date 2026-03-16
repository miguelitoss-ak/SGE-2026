const db = require('../config/database'); // [cite: 126]

class EmpresaModel {
  // Lista todas as empresas
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM empresas'); // [cite: 126]
    return rows;
  }

  // Busca por CNPJ para validação
  static async findByCnpj(cnpj) {
    const [rows] = await db.query('SELECT * FROM empresas WHERE CNPJ_NibocoProd = ?', [cnpj]);
    return rows[0];
  }

  // Cria uma nova empresa conforme seu SQL
  static async create(empresa) {
    const { CNPJ_NibocoProd, nome_social, nome_fantasia, endereco, telefone, email, representante, cargo } = empresa;
    const sql = `INSERT INTO empresas (CNPJ_NibocoProd, nome_social, nome_fantasia, endereco, telefone, email, representante, cargo) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [CNPJ_NibocoProd, nome_social, nome_fantasia, endereco, telefone, email, representante, cargo]);
    return result.insertId; // Retorna o ID criado [cite: 126]
  }
}

module.exports = EmpresaModel;