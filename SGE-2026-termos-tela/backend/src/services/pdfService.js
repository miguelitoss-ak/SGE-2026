class PdfService {
  static async gerarPDF(html) {
    // Importação dinâmica mantém compatibilidade com o projeto CommonJS
    // e carrega o Puppeteer somente quando a rota PDF é utilizada.
    const { default: puppeteer } = await import('puppeteer');
    const browser = await puppeteer.launch({
      headless: true,
      ...(process.env.PUPPETEER_EXECUTABLE_PATH
        ? { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH }
        : {})
    });
    try {
      const page = await browser.newPage();
      // O template contém CSS local e não precisa executar scripts ou acessar a rede.
      await page.setJavaScriptEnabled(false);
      await page.setOfflineMode(true);
      await page.setContent(html, { waitUntil: 'load', timeout: 30000 });
      // Sem a opção path, o PDF é gerado em memória, sem salvar um documento no servidor.
      const bytes = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '18mm', bottom: '20mm', left: '15mm', right: '15mm' },
        displayHeaderFooter: true,
        headerTemplate: '<div style="font-size:8px;width:100%;text-align:center">TERMO DE COMPROMISSO DE ESTÁGIO • EXEMPLO</div>',
        footerTemplate: '<div style="font-size:8px;width:100%;text-align:center">Documento de demonstração · Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>'
      });
      // Buffer garante que Express envie os bytes como arquivo, não como JSON.
      return Buffer.from(bytes);
    } finally {
      // Evita deixar o navegador aberto mesmo se a renderização falhar.
      await browser.close();
    }
  }
}

module.exports = PdfService;
