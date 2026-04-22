CREATE DATABASE IF NOT EXISTS sge
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE sge;

CREATE TABLE cursos (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  nome              VARCHAR(255) NOT NULL,
  carga_horaria     INT NOT NULL,
  email_coordenacao VARCHAR(255)
);

CREATE TABLE orientadores (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nome      VARCHAR(255) NOT NULL,
  email     VARCHAR(255),
  telefone  VARCHAR(20)
);

CREATE TABLE alunos (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  matricula      INT NOT NULL UNIQUE,
  nome           VARCHAR(255) NOT NULL,
  cpf            VARCHAR(14) NOT NULL UNIQUE,
  telefone       VARCHAR(20),
  email          VARCHAR(255),
  data_nasc      DATE,
  id_curso       INT NOT NULL,
  id_orientador  INT,
  CONSTRAINT fk_alunos_cursos
    FOREIGN KEY (id_curso) REFERENCES cursos(id),
  CONSTRAINT fk_alunos_orientadores
    FOREIGN KEY (id_orientador) REFERENCES orientadores(id)
);

CREATE TABLE usuario_empresa (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  senha      VARCHAR(255) NOT NULL,
  telefone   VARCHAR(20),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE empresas (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  CNPJ_NibocoProd      CHAR(14) NOT NULL UNIQUE,
  nome_social          VARCHAR(255) NOT NULL,
  nome_fantasia        VARCHAR(255),
  endereco             VARCHAR(255),
  telefone             VARCHAR(20),
  email                VARCHAR(255),
  representante        VARCHAR(255),
  cargo                VARCHAR(255),
  inscricao_estadual   VARCHAR(8),
  id_usuario_empresa   INT,
  CONSTRAINT fk_empresas_usuario_empresa
    FOREIGN KEY (id_usuario_empresa) REFERENCES usuario_empresa(id)
);

CREATE TABLE supervisores (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(255) NOT NULL,
  cpf         VARCHAR(14) NOT NULL UNIQUE,
  cargo       VARCHAR(255),
  telefone    VARCHAR(20),
  email       VARCHAR(255), 
  id_empresa  INT NOT NULL,
  CONSTRAINT fk_supervisores_empresas
    FOREIGN KEY (id_empresa) REFERENCES empresas(id)
);

CREATE TABLE documentos_modelo (
  id                          INT AUTO_INCREMENT PRIMARY KEY,
  termo_de_compromisso        VARCHAR(255),
  plano_de_estagio            VARCHAR(255),
  ficha_de_avaliacao_empresa  VARCHAR(255),
  ficha_de_avaliacao_aluno    VARCHAR(255)
);

CREATE TABLE documentos_estagio (
  id                          INT AUTO_INCREMENT PRIMARY KEY,
  termo_de_compromisso        VARCHAR(255),
  ficha_de_avaliacao_empresa  VARCHAR(255),
  ficha_de_avaliacao_aluno    VARCHAR(255),
  id_documentos_modelo        INT,
  CONSTRAINT fk_documentos_estagio_modelo
    FOREIGN KEY (id_documentos_modelo) REFERENCES documentos_modelo(id)
);

CREATE TABLE estagios (
  id                     INT AUTO_INCREMENT PRIMARY KEY,
  dt_registro            DATE NOT NULL,
  beneficio_alimentacao  BOOLEAN,
  beneficio_transporte   BOOLEAN,
  beneficio_impresso     BOOLEAN,
  bolsa_auxilio          DECIMAL(10,2),
  data_inicio            DATE NOT NULL,
  data_fim               DATE,
  dt_rescisao            DATE,
  dt_renovacao           DATE,
  carga_horaria_total    INT,
  carga_horaria_semanal  INT,
  situacao               VARCHAR(50) NOT NULL,
  id_aluno               INT NOT NULL,
  id_empresa             INT NOT NULL,
  id_supervisor          INT,
  id_orientador          INT,
  id_documento           INT,
  CONSTRAINT fk_estagios_alunos
    FOREIGN KEY (id_aluno) REFERENCES alunos(id),
  CONSTRAINT fk_estagios_empresas
    FOREIGN KEY (id_empresa) REFERENCES empresas(id),
  CONSTRAINT fk_estagios_supervisores
    FOREIGN KEY (id_supervisor) REFERENCES supervisores(id),
  CONSTRAINT fk_estagios_orientadores
    FOREIGN KEY (id_orientador) REFERENCES orientadores(id),
  CONSTRAINT fk_estagios_documentos
    FOREIGN KEY (id_documento) REFERENCES documentos_estagio(id)
);

CREATE TABLE dia_semana_estagio (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  horario_inicio TIME NOT NULL,
  horario_saida  TIME NOT NULL,
  id_estagio     INT NOT NULL,
  dia_semana     ENUM('SEGUNDA','TERCA','QUARTA','QUINTA','SEXTA','SABADO','DOMINGO') NOT NULL,
  CONSTRAINT fk_dia_semana_estagio_estagios
    FOREIGN KEY (id_estagio) REFERENCES estagios(id)
);
