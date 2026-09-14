const EmpresaService = require('../services/empresaService');

class EmpresaController {

  static async getAll(req, res) {
    try {
      const empresas = await EmpresaService.getAllEmpresas();
      res.json(empresas);
    } catch (error) {
      res.status(500).json({ error: error.message }); 
    }
  }

  static async create(req, res) {
    try {
      const id = await EmpresaService.createEmpresa(req.body);
      res.status(201).json({ message: 'Empresa cadastrada com sucesso.', id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = EmpresaController;