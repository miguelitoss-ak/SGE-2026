const UserService = require('../services/userService');
const UsuarioEmpresaService = require('../services/usuarioEmpresaService');

class AuthController {
  static async register(req, res) {
    try {
      const result = await UserService.registerUser(req.body);
      return res.status(201).json(result);
    } catch (error) {
      const statusCode = error.message === 'Usuario ja existe' ? 409 : 400;
      return res.status(statusCode).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const result = await UserService.loginUser(req.body);
      return res.status(200).json(result);
    } catch (error) {
      const statusCode =
        error.message === 'Usuario nao encontrado' || error.message === 'Senha invalida'
          ? 401
          : 400;
      return res.status(statusCode).json({ error: error.message });
    }
  }

  static async me(req, res) {
    try { return res.status(200).json({ user: req.user }) }
    catch (error) { return res.status(500).json({ error: 'Erro ao buscar dados do perfil' }) }
  }

  static async registerEmpresaUser(req, res) {
    try {
      const result = await UsuarioEmpresaService.register(req.body);
      return res.status(201).json(result);
    } catch (error) {
      const statusCode = error.message === 'Usuario empresa ja existe' ? 409 : 400;
      return res.status(statusCode).json({ error: error.message });
    }
  }

  static async loginEmpresaUser(req, res) {
    try {
      const result = await UsuarioEmpresaService.login(req.body);
      return res.status(200).json(result);
    } catch (error) {
      const statusCode =
        error.message === 'Usuario nao encontrado' || error.message === 'Senha invalida'
          ? 401
          : 400;
      return res.status(statusCode).json({ error: error.message });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'E-mail e obrigatorio' });
      }

      return res.status(200).json({
        message: 'Se o e-mail estiver cadastrado, voce recebera as instrucoes de recuperacao.',
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao processar a recuperacao de senha' });
    }
  }
}

module.exports = AuthController;
