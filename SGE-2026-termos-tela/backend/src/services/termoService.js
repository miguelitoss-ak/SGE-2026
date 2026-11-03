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
  if (value === null || value === undefined || value === '') return 'Não informado';
  const amount = Number(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
    : 'Não informado';
});
h.registerHelper('simNao', value => value === true ? 'Sim' : value === false ? 'Não' : 'Não informado');

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

function textoDocumento(value) {
  const valueText = texto(value).trim();
  return valueText || 'Não informado';
}

function formatarCpf(value) {
  const digits = texto(value).replace(/\D/g, '');
  return digits.length === 11
    ? `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
    : textoDocumento(value);
}

function formatarCnpj(value) {
  const digits = texto(value).replace(/\D/g, '');
  return digits.length === 14
    ? `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
    : textoDocumento(value);
}

function formatarTelefone(value) {
  const digits = texto(value).replace(/\D/g, '');
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return textoDocumento(value);
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
      nome: textoDocumento(aluno.nome),
      matricula: textoDocumento(aluno.matricula),
      curso: textoDocumento(aluno.curso?.nome),
      cpf: formatarCpf(aluno.cpf),
      email: textoDocumento(aluno.email),
      telefone: formatarTelefone(aluno.telefone),
      orientador: textoDocumento(orientador.nome),
    },
    concedente: {
      razaoSocial: textoDocumento(empresa.nome_social || empresa.nome_fantasia),
      nome: textoDocumento(empresa.nome_fantasia),
      cnpj: formatarCnpj(empresa.CNPJ_NibocoProd),
      endereco: textoDocumento(empresa.endereco),
      telefone: formatarTelefone(empresa.telefone),
      email: textoDocumento(empresa.email),
      representante: textoDocumento(empresa.representante),
      cargo: textoDocumento(empresa.cargo),
      supervisor: textoDocumento(supervisor.nome),
      cargoSupervisor: textoDocumento(supervisor.cargo),
      emailSupervisor: textoDocumento(supervisor.email),
      telefoneSupervisor: formatarTelefone(supervisor.telefone),
    },
    estagio: {
      id: estagio.id,
      inicio: estagio.data_inicio,
      termino: estagio.data_fim,
      cargaHorariaTotal: estagio.carga_horaria_total ?? 'Não informado',
      cargaHorariaSemanal: decimal(estagio.carga_horaria_semanal) ?? 'Não informado',
      bolsa: decimal(estagio.bolsa_auxilio),
      alimentacao: estagio.beneficio_alimentacao,
      transporte: estagio.beneficio_transporte,
      moradia: null,
      obrigatorio: estagio.obrigatorio === true,
      area: textoDocumento(estagio.area),
      atividades: [],
      seguro: {
        apolice: textoDocumento(estagio.apolice),
        numero: textoDocumento(estagio.numero_apolice),
        capitalSegurado: textoDocumento(estagio.capital_segurado),
      },
    },
    horarios: mapearHorarios(estagio.dias_semana_estagio),
    clausulas: [],
    localAssinatura: 'Bento Gonçalves/RS',
    dataAssinatura: estagio.dt_registro || estagio.data_inicio,
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
