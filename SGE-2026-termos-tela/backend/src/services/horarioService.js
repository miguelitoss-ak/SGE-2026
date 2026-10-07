const HorarioModel = require('../models/horarioModel');

class HorarioService {
  static async addHorario(data) {
    const diasPermitidos = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'];

    // Regra de Negócio: Validar ENUM
    if (!diasPermitidos.includes(data.dia_semana.toUpperCase())) {
      throw new Error("Dia da semana inválido. Use SEGUNDA, TERCA, QUARTA, etc.");
    }

    // Regra de Negócio: Validar coerência de horários
    if (data.horario_saida <= data.horario_inicio) {
      throw new Error("O horário de saída deve ser posterior ao horário de início.");
    }

    return await HorarioModel.create(data);
  }

  static async getByEstagio(id_estagio) {
    return await HorarioModel.findByEstagio(id_estagio);
  }
}

module.exports = HorarioService;