const db = require('../config/database');

class DocumentoModel {
  // --- Métodos para Modelos ---
  static async createModelo(data) {
    const { termo_de_compromisso, plano_de_estagio, ficha_de_avaliacao_empresa, ficha_de_avaliacao_aluno } = data;
    const sql = `INSERT INTO documentos_modelo (termo_de_compromisso, plano_de_estagio, ficha_de_avaliacao_empresa, ficha_de_avaliacao_aluno) 
                 VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(sql, [termo_de_compromisso, plano_de_estagio, ficha_de_avaliacao_empresa, ficha_de_avaliacao_aluno]);
    return result.insertId;
  }

  // --- Métodos para Documentos do Estágio ---
  static async createDocumentoEstagio(data) {
    const { termo_de_compromisso, plano_de_estagio, ficha_de_avaliacao_empresa, ficha_de_avaliacao_aluno, id_documentos_modelo } = data;
    const sql = `INSERT INTO documentos_estagio (termo_de_compromisso, plano_de_estagio, ficha_de_avaliacao_empresa, ficha_de_avaliacao_aluno, id_documentos_modelo) 
                 VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [termo_de_compromisso, plano_de_estagio, ficha_de_avaliacao_empresa, ficha_de_avaliacao_aluno, id_documentos_modelo]);
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM documentos_estagio WHERE id = ?', [id]);
    return rows[0];
  }
}

module.exports = DocumentoModel;