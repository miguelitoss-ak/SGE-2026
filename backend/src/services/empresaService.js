const EmpresaModel = require('../models/empresaModel');
const UsuarioEmpresaModel = require('../models/usuarioEmpresaModel');
const validateEmail = require('../utils/validateEmail');

class EmpresaService {
  static async getAllEmpresas() {
    return await EmpresaModel.findAll();
  }

  static async createEmpresa(empresaData) {
    if (empresaData.email && !validateEmail(empresaData.email)) {
      throw new Error("Formato de email da empresa inválido.");
    }

    if (empresaData.inscricao_estadual != null && String(empresaData.inscricao_estadual).trim() !== '') {
      const ie = String(empresaData.inscricao_estadual).trim();
      if (ie.length < 6 || ie.length > 8) {
        throw new Error('Inscrição estadual deve ter entre 6 e 8 caracteres.');
      }
    }

    if (empresaData.id_usuario_empresa != null && empresaData.id_usuario_empresa !== '') {
      const uid = Number(empresaData.id_usuario_empresa);
      if (!Number.isFinite(uid)) {
        throw new Error('Identificador do usuário empresa inválido.');
      }
      const usuario = await UsuarioEmpresaModel.findById(uid);
      if (!usuario) {
        throw new Error('Usuário empresa não encontrado.');
      }
    }

    // Regra de Negócio: Validar se o CNPJ já existe
    const existingEmpresa = await EmpresaModel.findByCnpj(empresaData.CNPJ_NibocoProd);
    if (existingEmpresa) {
      throw new Error("Empresa com este CNPJ já cadastrada.");
    }

    return await EmpresaModel.create(empresaData);
  }
}

module.exports = EmpresaService;