const EmpresaService = require('../services/empresaService');

class EmpresaController {
  // Método para listar todas as empresas [cite: 140]
  static async getAll(req, res) {
    try {
      const empresas = await EmpresaService.getAllEmpresas();
      res.json(empresas);
    } catch (error) {
      res.status(500).json({ error: error.message }); // [cite: 140]
    }
  }

  // Método para cadastrar empresa [cite: 140]
  static async create(req, res) {
    try {
      const id = await EmpresaService.createEmpresa(req.body);
      res.status(201).json({ message: 'Empresa cadastrada com sucesso.', id }); // [cite: 140]
    } catch (error) {
      res.status(400).json({ error: error.message }); // [cite: 140]
    }
  }
}

module.exports = EmpresaController;