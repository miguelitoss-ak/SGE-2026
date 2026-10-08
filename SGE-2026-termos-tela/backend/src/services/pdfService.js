class PdfService {
  static async gerarPDF(html) {
    const { default: puppeteer } = await import('puppeteer');
    const browser = await puppeteer.launch({
      headless: true,
      ...(process.env.PUPPETEER_EXECUTABLE_PATH ? { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH } : {}),
    });
    try {
      const page = await browser.newPage();
      await page.setJavaScriptEnabled(false);
      await page.setContent(html, { waitUntil: 'load', timeout: 30000 });
      const bytes = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '15mm', bottom: '17mm', left: '16mm', right: '16mm' },
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: '<div style="width:100%;font:9px Calibri,Arial,sans-serif;text-align:center;color:#111">Instituto Federal de Educação, Ciência e Tecnologia do Rio Grande do Sul – Campus Bento Gonçalves<br>Canal WhatsApp 54.3455-3232 – [estagios@bento.ifrs.edu.br] · Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>',
      });
      return Buffer.from(bytes);
    } finally {
      await browser.close();
    }
  }
}

module.exports = PdfService;
