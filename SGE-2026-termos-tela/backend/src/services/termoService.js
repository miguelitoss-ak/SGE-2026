const fs = require('node:fs/promises');
const path = require('node:path');
const Handlebars = require('handlebars');
const prisma = require('../prisma/prismaClient');

// Instância própria: os helpers deste documento não afetam outros templates.
const h = Handlebars.create();
h.registerHelper('data', value => {
  if (value === null || value === undefined || value === '') return '';
  const raw = value instanceof Date ? value.toISOString().slice(0, 10) : String(value);
  const [ano, mes, dia] = raw.slice(0, 10).split('-');
  if (!ano || !mes || !dia) return '';
  return `${dia}/${mes}/${ano}`;
});
h.registerHelper('moeda', value => {
  if (value === null || value === undefined || value === '') return '';
  const amount = Number(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
    : '';
});
h.registerHelper('simNao', value => value === true ? 'Sim' : value === false ? 'Não' : '');

// Os caminhos partem deste arquivo, independentemente da pasta do terminal.
const caminhoClausulas = path.join(__dirname, '../data/clausulas.json');
const caminhoTemplate = path.join(__dirname, '../templates/termo.hbs');
const caminhoBrasao = path.join(__dirname, '../assets/brasao-mec.jpg');
const diasSemana = [
  ['SEGUNDA', 'Segunda'],
  ['TERCA', 'Terça'],
  ['QUARTA', 'Quarta'],
  ['QUINTA', 'Quinta'],
  ['SEXTA', 'Sexta'],
  ['SABADO', 'Sábado'],
  ['DOMINGO', 'Domingo'],
];

function texto(value) {
  return value === null || value === undefined ? '' : String(value);
}

function hora(value) {
  if (value === null || value === undefined || value === '') return '';
  if (value instanceof Date) {
    return `${String(value.getUTCHours()).padStart(2, '0')}:${String(value.getUTCMinutes()).padStart(2, '0')}`;
  }
  const match = String(value).match(/(?:T|\s)?(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : '';
}

function mapearHorarios(registros = []) {
  const porDia = new Map(diasSemana.map(([key, label]) => [key, {
    dia: label,
    manhaEntrada: '',
    manhaSaida: '',
    tardeEntrada: '',
    tardeSaida: '',
    noiteEntrada: '',
    noiteSaida: '',
  }]));

  for (const registro of registros) {
    const linha = porDia.get(registro.dia_semana);
    if (!linha) continue;
    const turno = registro.turno || 'MANHA';
    if (!['MANHA', 'TARDE_NOITE'].includes(turno)) continue;
    const entrada = hora(registro.horario_inicio);
    const saida = hora(registro.horario_saida);
    const periodo = turno === 'MANHA' ? 'manha' : entrada >= '18:00' ? 'noite' : 'tarde';
    linha[`${periodo}Entrada`] = entrada;
    linha[`${periodo}Saida`] = saida;
  }

  return Array.from(porDia.values());
}

function mapearParaTemplate(estagio) {
  const aluno = estagio.aluno || {};
  const empresa = estagio.empresa || {};
  const supervisor = estagio.supervisor || {};
  const orientador = estagio.orientador || {};
  const decimal = (value) => {
    if (value === null || value === undefined || value === '') return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  };

  return {
    instituicao: {
      nome: 'INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DO RIO GRANDE DO SUL',
      campus: 'CAMPUS BENTO GONÇALVES',
      cnpj: '10.637.926/0002-27',
      endereco: 'Av. Osvaldo Aranha, 540 – Juventude da Enologia Bento Gonçalves, RS – 95700-2026',
      telefone: '54.3455.3200',
      email: 'comunicacao@bento.ifrs.edu.br',
      representante: 'Rodrigo Otávio Câmara Monteiro',
      cargo: 'Diretor-geral',
      coordenadora: 'Érica Primaz',
      cargoCoordenadora: 'Coord. da Seção de Estágios',
      emailEstagios: 'estagios@bento.ifrs.edu.br',
    },
    estudante: {
      nome: texto(aluno.nome),
      curso: texto(aluno.curso?.nome),
      cpf: texto(aluno.cpf),
      email: texto(aluno.email),
      telefone: texto(aluno.telefone),
      orientador: texto(orientador.nome),
    },
    concedente: {
      razaoSocial: texto(empresa.nome_social || empresa.nome_fantasia),
      nome: texto(empresa.nome_fantasia),
      cnpj: texto(empresa.CNPJ_NibocoProd),
      endereco: texto(empresa.endereco),
      cidadeEstado: '',
      telefone: texto(empresa.telefone),
      email: texto(empresa.email),
      representante: texto(empresa.representante),
      cpf: '',
      cargo: texto(empresa.cargo),
      supervisor: texto(supervisor.nome),
      cargoSupervisor: texto(supervisor.cargo),
      formacaoSupervisor: '',
      emailSupervisor: texto(supervisor.email),
      telefoneSupervisor: texto(supervisor.telefone),
    },
    estagio: {
      id: estagio.id,
      inicio: estagio.data_inicio,
      termino: estagio.data_fim,
      cargaHorariaTotal: estagio.carga_horaria_total,
      cargaHorariaSemanal: decimal(estagio.carga_horaria_semanal),
      bolsa: decimal(estagio.bolsa_auxilio),
      alimentacao: estagio.beneficio_alimentacao,
      transporte: estagio.beneficio_transporte,
      moradia: null,
      obrigatorio: estagio.obrigatorio === true,
      area: texto(estagio.area),
      atividades: [],
      seguro: {
        seguradora: texto(estagio.nome_seguradora),
        apolice: texto(estagio.numero_apolice),
        contrato: '',
        capital: decimal(estagio.valor_apolice),
      },
    },
    horarios: mapearHorarios(estagio.dias_semana_estagio),
    clausulas: [],
    localAssinatura: '',
    dataAssinatura: null,
  };
}

class TermoService {
  static async buscarEstagio(id, user) {
    const estagioId = Number(id);
    if (!Number.isSafeInteger(estagioId) || estagioId < 1) return null;

    const estagio = await prisma.estagio.findUnique({
      where: { id: estagioId },
      include: {
        aluno: { include: { curso: true } },
        empresa: true,
        supervisor: true,
        orientador: true,
        dias_semana_estagio: true,
      },
    });
    if (!estagio) return null;

    const role = String(user?.role || '').toUpperCase();
    if (role === 'ADMIN' || role === 'ADMINISTRADOR') return estagio;
    if (!user) throw new Error('Usuário não autenticado.');
    let aluno = user.email
      ? await prisma.aluno.findFirst({ where: { email: user.email }, select: { id: true } })
      : null;
    if (!aluno && user.matricula) {
      aluno = await prisma.aluno.findUnique({ where: { matricula: Number(user.matricula) }, select: { id: true } });
    }
    if (!aluno || aluno.id !== estagio.id_aluno) {
      throw new Error('Você não tem permissão para acessar este estágio.');
    }
    return estagio;
  }

  static async gerarHTML(dados) {
    const [htmlTemplate, textoClausulas, brasao] = await Promise.all([
      fs.readFile(caminhoTemplate, 'utf8'),
      fs.readFile(caminhoClausulas, 'utf8'),
      fs.readFile(caminhoBrasao),
    ]);
    const template = h.compile(htmlTemplate);
    const clausulas = JSON.parse(textoClausulas);
    // {{campo}} aplica escape HTML. O resultado é uma string, sem arquivo de saída.
    return template({
      ...mapearParaTemplate(dados),
      clausulas,
      brasaoDataUri: `data:image/jpeg;base64,${brasao.toString('base64')}`,
    });
  }
}

module.exports = TermoService;
