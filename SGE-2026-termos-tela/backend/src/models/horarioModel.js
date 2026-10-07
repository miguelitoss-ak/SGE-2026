const prisma = require('../prisma/prismaClient');

class HorarioModel {
  // Lista todos os horários de um estágio específico
  static async findByEstagio(id_estagio) {
    return prisma.$queryRaw`
      SELECT * FROM dia_semana_estagio
      WHERE id_estagio = ${id_estagio}
      ORDER BY id
    `;
  }

  // Registra um dia da semana para o estágio
  static async create(data) {
    const { horario_inicio, horario_saida, id_estagio, dia_semana } = data;
    const dia_semana_upper = typeof dia_semana === 'string' ? dia_semana.toUpperCase() : dia_semana;
    const id = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        INSERT INTO dia_semana_estagio (horario_inicio, horario_saida, id_estagio, dia_semana)
        VALUES (${horario_inicio}, ${horario_saida}, ${id_estagio}, ${dia_semana_upper})
      `;

      const rows = await tx.$queryRaw`
        SELECT LAST_INSERT_ID() AS id
      `;

      return rows[0].id;
    });

    return id;
  }
}

module.exports = HorarioModel;