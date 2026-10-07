class ProtectedController {
  static dashboard(req, res) {
    return res.status(200).json({
      message: `Bem-vindo ao painel, ${req.user.email}`,
      user: req.user,
    });
  }

  static adminOnly(req, res) {
    return res.status(200).json({
      message: `Bem-vindo a area admin, ${req.user.email}`,
    });
  }
}

module.exports = ProtectedController;
