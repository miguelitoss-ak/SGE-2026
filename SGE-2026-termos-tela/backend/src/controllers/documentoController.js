const DocumentoService = require('../services/documentoService');

class DocumentoController {
  static async createModelo(req, res) {
    try {
      const id = await DocumentoService.saveModelo(req.body);
      res.status(201).json({ message: 'Modelo de documentos criado.', id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async createDocumentoEstagio(req, res) {
    try {
      const id = await DocumentoService.saveDocumentoEstagio(req.body);
      res.status(201).json({ message: 'Documentos do estágio registados.', id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = DocumentoController;