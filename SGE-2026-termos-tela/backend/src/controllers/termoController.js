const TermoService = require('../services/termoService');
const PdfService = require('../services/pdfService');

class TermoController {
  static async previewHTML(req, res, next) {
    try {
      const dados = await TermoService.buscarEstagio(req.params.id, req.user);
      if (!dados) return res.status(404).json({ error: 'Estágio não encontrado.' });
      const html = await TermoService.gerarHTML(dados);
      // O navegador exibe o corpo HTML; nenhum arquivo preenchido é gravado.
      return res.set('Cache-Control', 'no-store').type('html').send(html);
    } catch (error) {
      if (/permissão/.test(error.message)) return res.status(403).json({ error: error.message });
      // Usa o middleware de erros que já existe no projeto.
      return next(error);
    }
  }

  static async gerarPDF(req, res, next) {
    try {
      const dados = await TermoService.buscarEstagio(req.params.id, req.user);
      if (!dados) return res.status(404).json({ error: 'Estágio não encontrado.' });
      const html = await TermoService.gerarHTML(dados);
      const pdf = await PdfService.gerarPDF(html);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="termo-estagio-${dados.id}.pdf"`,
        'Cache-Control': 'no-store'
      });
      return res.send(pdf);
    } catch (error) {
      if (/permissão/.test(error.message)) return res.status(403).json({ error: error.message });
      return next(error);
    }
  }
}

module.exports = TermoController;
