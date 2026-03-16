const CursoModel = require('../models/cursoModel');

class CursoService {
  static async getAllCursos() {
    return await CursoModel.findAll();
  }

  static async createCurso(cursoData) {
    // Regra de Negócio: Carga horária não pode ser zero ou negativa
    if (cursoData.carga_horaria <= 0) {
      throw new Error("A carga horária deve ser maior que zero.");
    }

    return await CursoModel.create(cursoData);
  }
}

module.exports = CursoService;