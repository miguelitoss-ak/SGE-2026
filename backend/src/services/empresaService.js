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

    const tipoCadastro = String(empresaData.type_cadastro || '').toLowerCase().trim();
    const normalizedCnpj = EmpresaModel.normalizeCnpj(empresaData.CNPJ_NibocoProd);
    const ie = empresaData.inscricao_estadual != null ? String(empresaData.inscricao_estadual).trim() : '';

    const isCnpjCadastro = tipoCadastro === 'cnpj';
    const isIeCadastro = tipoCadastro === 'ie';

    if (isCnpjCadastro && !normalizedCnpj) {
      throw new Error('CNPJ inválido. Envie apenas os 14 dígitos numéricos do CNPJ.');
    }

    if (isIeCadastro && !ie) {
      throw new Error('Inscrição estadual é obrigatória para este tipo de cadastro.');
    }

    if (!isCnpjCadastro && !isIeCadastro && !normalizedCnpj && !ie) {
      throw new Error('Informe CNPJ ou Inscrição Estadual para cadastrar a empresa.');
    }

    empresaData = {
      ...empresaData,
      CNPJ_NibocoProd: isIeCadastro ? null : normalizedCnpj,
      inscricao_estadual: ie || null,
    };

    if (ie) {
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

    if (empresaData.CNPJ_NibocoProd) {
      const existingEmpresa = await EmpresaModel.findByCnpj(empresaData.CNPJ_NibocoProd);
      if (existingEmpresa) {
        throw new Error("Empresa com este CNPJ já cadastrada.");
      }
    }

    if (ie) {
      const existingIE = await EmpresaModel.findByInscricaoEstadual(ie);
      if (existingIE) {
        throw new Error("Empresa com esta inscrição estadual já cadastrada.");
      }
    }

    try {
      return await EmpresaModel.create(empresaData);
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new Error('Empresa com este CNPJ já cadastrada.');
      }
      throw error;
    }
  }
}

module.exports = EmpresaService;
