const HorarioService = require('../services/horarioService');

class HorarioController {
  static async create(req, res) {
    try {
      const id = await HorarioService.addHorario(req.body);
      res.status(201).json({ message: 'Horário registrado com sucesso.', id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getByEstagio(req, res) {
    try {
      const { id_estagio } = req.params;
      const horarios = await HorarioService.getByEstagio(id_estagio);
      res.json(horarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = HorarioController;