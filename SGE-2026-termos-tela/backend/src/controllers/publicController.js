class PublicController {
  static home(req, res) {
    return res.status(200).json({
      message: 'Bem-vindo a API publica do SGE',
    });
  }
}

module.exports = PublicController;
