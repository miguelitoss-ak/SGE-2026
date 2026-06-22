const UserService = require('../services/userService');

class AdminController {
  static async registerAdmin(req, res) {
    try {
      const result = await UserService.registerAdmin(req.body);
      return res.status(201).json(result);
    } catch (error) {
      const statusCode = error.message === 'Nome e telefone sao obrigatorios' ? 400 : 400;
      return res.status(statusCode).json({ error: error.message });
    }
  }
}

module.exports = AdminController;
