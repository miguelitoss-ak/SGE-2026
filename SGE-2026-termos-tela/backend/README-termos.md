# Prévia HTML e PDF do termo — etapa com dados fictícios

Esta funcionalidade usa apenas `src/data/estagio-exemplo.json` e não consulta nem altera o banco. O único ID de exemplo é 1. As novas rotas são públicas nesta etapa e não exigem token. Antes de trocar a origem por dados reais, integre a autenticação JWT e a autorização por estágio.

## Instalação e execução

Use Node.js 22 ou superior. Abra o terminal na pasta `backend`:

```sh
npm install
npm start
```

Mantenha sua configuração `.env` do projeto original. Por conter configurações privadas, esse arquivo não está incluído neste ZIP. A inicialização completa do SGE continua dependendo das configurações e dependências já existentes do projeto.

O Puppeteer precisa de Chrome. Se o navegador não for baixado na instalação:

```sh
npx puppeteer browsers install chrome
```

Se usar o Chrome instalado, configure `PUPPETEER_EXECUTABLE_PATH` no ambiente com o caminho completo do executável. A prévia HTML não precisa executar o Chrome.

## Rotas

| Método | URL | Resposta |
| --- | --- | --- |
| GET | http://localhost:3000/termos/estagios/1/html | HTML preenchido |
| GET | http://localhost:3000/termos/estagios/1/pdf | PDF para download |

Abra a primeira URL no navegador para conferir o termo. A segunda inicia o download. No REST Client, abra `src/testsHTTP/termos_api_test.rest` e clique em Send Request. Salve o corpo da resposta se quiser guardar o HTML ou PDF no seu computador.

O HTML e o PDF são gerados em memória e enviados diretamente na resposta HTTP. As rotas não gravam documentos no servidor. Cada chamada ao PDF preenche novamente o template; não é necessário chamar a prévia antes.

O frontend pode usar um link para o PDF ou `fetch()` com `response.blob()`. Para o HTML, pode abrir a URL ou usar um iframe. A página `templates/termos.html` utiliza fetch() para exibir o HTML em um iframe e baixar o PDF. Há um link no painel inicial para acessar a demonstração.

## Arquivos novos

- `src/routes/termoRoutes.js`: duas rotas independentes.
- `src/controllers/termoController.js`: respostas HTML/PDF e encaminhamento dos erros.
- `src/services/termoService.js`: leitura dos dados fictícios e preenchimento do Handlebars.
- `src/services/pdfService.js`: conversão em PDF usando Puppeteer.
- `src/data/estagio-exemplo.json`: dados fictícios editáveis.
- `src/data/clausulas.json`: texto das cláusulas.
- `src/templates/termo.hbs`: layout e marcadores dos dados.
- `src/testsHTTP/termos_api_test.rest`: requisições para REST Client.

## Alterações nos arquivos atuais

Somente `src/app.js` (importação e registro das rotas), `package.json` e `package-lock.json` (dependências). Os arquivos de estágio, autenticação e banco não foram editados. Nesta versão com tela, `templates/home.html` recebeu apenas um link para a demonstração.

Não foi criado um model porque ainda não há consulta ao banco. O serviço está preparado para substituir futuramente a leitura do JSON por uma consulta.

## Modelo e verificações

O termo é uma adaptação didática do PDF fornecido, com dados fictícios. Não é uma reprodução visual exata; o texto não foi atualizado ou validado para emissão institucional. O número de páginas depende do conteúdo. Os campos de assinatura são espaços visuais, sem assinatura digital.

Foram verificados o template e o contrato HTTP das novas rotas, com um gerador PDF substituto. A renderização real do PDF e a execução completa do SGE com o banco não foram validadas neste ambiente. O download do Chrome permaneceu indisponível.

## Tela de demonstração

Após iniciar o servidor, acesse http://localhost:3000/termos.html ou utilize o novo link no painel inicial. Clique em **Visualizar termo** para carregar o HTML dentro da página e em **Baixar PDF** para receber o arquivo. Não é necessário carregar a prévia antes de baixar o PDF.

A tela mantém as cores e os cartões do SGE e usa CSS local. Os botões ficam desabilitados durante as chamadas; erros aparecem na própria página. O documento de demonstração continua público e usa apenas o ID fictício 1.
