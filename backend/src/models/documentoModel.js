const prisma = require('../prisma/prismaClient');

class DocumentoModel {
  // --- Métodos para Modelos ---
  static async createModelo(data) {
    const { termo_de_compromisso, plano_de_estagio, ficha_de_avaliacao_empresa, ficha_de_avaliacao_aluno } = data;
    const created = await prisma.documentosModelo.create({
      data: {
        termo_de_compromisso,
        plano_de_estagio,
        ficha_de_avaliacao_empresa,
        ficha_de_avaliacao_aluno,
      },
    });
    return created.id;
  }

  // --- Métodos para Documentos do Estágio ---
  static async createDocumentoEstagio(data) {
    const { termo_de_compromisso, plano_de_estagio, ficha_de_avaliacao_empresa, ficha_de_avaliacao_aluno, id_documentos_modelo } = data;
    const created = await prisma.documentosEstagio.create({
      data: {
        termo_de_compromisso,
        plano_de_estagio,
        ficha_de_avaliacao_empresa,
        ficha_de_avaliacao_aluno,
        id_documentos_modelo,
      },
    });
    return created.id;
  }

  static async findById(id) {
    const rows = await prisma.$queryRaw`
      SELECT * FROM documentos_estagio WHERE id = ${id} LIMIT 1
    `;
    return rows[0];
  }
}

module.exports = DocumentoModel;