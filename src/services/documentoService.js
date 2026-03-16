const DocumentoModel = require('../models/documentoModel');

class DocumentoService {
  static async saveModelo(data) {
    // Regra: Pelo menos o Termo de Compromisso deve ser definido no modelo
    if (!data.termo_de_compromisso) {
      throw new Error("O link do modelo de termo de compromisso é obrigatório.");
    }
    return await DocumentoModel.createModelo(data);
  }

  static async saveDocumentoEstagio(data) {
    // Lógica para vincular os documentos enviados ao processo de estágio
    return await DocumentoModel.createDocumentoEstagio(data);
  }
}

module.exports = DocumentoService;