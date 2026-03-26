const UserService = require('../services/userService');

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
}

module.exports = AuthController;
