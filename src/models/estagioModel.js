const db = require('../config/database');

class EstagioModel {
  static async findAll() {
    // Busca estágios trazendo o nome do aluno e da empresa (JOIN opcional, mas recomendado)
    const sql = `
      SELECT e.*, a.nome as aluno_nome, emp.nome_social as empresa_nome 
      FROM estagios e
      JOIN alunos a ON e.id_aluno = a.id
      JOIN empresas emp ON e.id_empresa = emp.id
    `;
    const [rows] = await db.query(sql);
    return rows;
  }

  static async create(data) {
    const {
      dt_registro, beneficio_alimentacao, beneficio_transporte, beneficio_impresso,
      bolsa_auxilio, data_inicio, data_fim, carga_horaria_total, carga_horaria_semanal,
      situacao, id_aluno, id_empresa, id_supervisor, id_orientador, id_documento
    } = data;

    const sql = `INSERT INTO estagios 
      (dt_registro, beneficio_alimentacao, beneficio_transporte, beneficio_impresso,
      bolsa_auxilio, data_inicio, data_fim, carga_horaria_total, carga_horaria_semanal,
      situacao, id_aluno, id_empresa, id_supervisor, id_orientador, id_documento)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.query(sql, [
      dt_registro, beneficio_alimentacao, beneficio_transporte, beneficio_impresso,
      bolsa_auxilio, data_inicio, data_fim, carga_horaria_total, carga_horaria_semanal,
      situacao, id_aluno, id_empresa, id_supervisor, id_orientador, id_documento
    ]);
    
    return result.insertId;
  }
}

module.exports = EstagioModel;