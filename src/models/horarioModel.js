const db = require('../config/database');

class HorarioModel {
  // Lista todos os horários de um estágio específico
  static async findByEstagio(id_estagio) {
    const [rows] = await db.query(
      'SELECT * FROM dia_semana_estagio WHERE id_estagio = ? ORDER BY id', 
      [id_estagio]
    );
    return rows;
  }

  // Registra um dia da semana para o estágio
  static async create(data) {
    const { horario_inicio, horario_saida, id_estagio, dia_semana } = data;
    const sql = `INSERT INTO dia_semana_estagio (horario_inicio, horario_saida, id_estagio, dia_semana) 
                 VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(sql, [horario_inicio, horario_saida, id_estagio, dia_semana]);
    return result.insertId;
  }
}

module.exports = HorarioModel;