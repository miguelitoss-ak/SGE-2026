-- Script de criação do banco de dados de estágios (SGE)
-- Ajuste o nome do banco, tipos e restrições conforme o SGBD que estiver usando.

CREATE DATABASE IF NOT EXISTS sge
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE sge;

-- =========================================================
-- TABELAS BÁSICAS
-- =========================================================

CREATE TABLE cursos (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  nome            VARCHAR(255) NOT NULL,
  carga_horaria   INT NOT NULL,
  email_coordenacao VARCHAR(255)
);

CREATE TABLE alunos (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  matricula    INT NOT NULL UNIQUE,
  nome         VARCHAR(255) NOT NULL,
  cpf          CHAR(11) NOT NULL UNIQUE,
  telefone     VARCHAR(20),
  email        VARCHAR(255),
  data_nasc    DATE,
  id_curso     INT NOT NULL,
  CONSTRAINT fk_alunos_cursos
    FOREIGN KEY (id_curso) REFERENCES cursos(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
);

CREATE TABLE empresas (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  cnpj                 CHAR(14) NOT NULL UNIQUE,
  razao_social         VARCHAR(255) NOT NULL,
  nome_fantasia        VARCHAR(255),
  endereco             VARCHAR(255),
  telefone             VARCHAR(20),
  email                VARCHAR(255),
  representante        VARCHAR(255),
  cargo_representante  VARCHAR(255)
);

CREATE TABLE supervisores (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nome          VARCHAR(255) NOT NULL,
  cpf           CHAR(11) NOT NULL UNIQUE,
  cargo         VARCHAR(255),
  telefone      VARCHAR(20),
  email         VARCHAR(255),
  id_empresa    INT NOT NULL,
  CONSTRAINT fk_supervisores_empresas
    FOREIGN KEY (id_empresa) REFERENCES empresas(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
);

CREATE TABLE orientadores (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(255) NOT NULL,
  email       VARCHAR(255),
  telefone    VARCHAR(20),
  id_curso    INT,
  CONSTRAINT fk_orientadores_cursos
    FOREIGN KEY (id_curso) REFERENCES cursos(id)
      ON UPDATE CASCADE
      ON DELETE SET NULL
);

-- =========================================================
-- ESTÁGIOS
-- =========================================================

CREATE TABLE estagios (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  data_inicio     DATE NOT NULL,
  data_fim        DATE,
  carga_horaria   INT NOT NULL,
  bolsa_auxilio   DECIMAL(10,2),
  situacao        VARCHAR(50) NOT NULL, -- ex.: Ativo, Concluido, Cancelado
  id_aluno        INT NOT NULL,
  id_empresa      INT NOT NULL,
  id_supervisor   INT,
  id_orientador   INT,
  CONSTRAINT fk_estagios_alunos
    FOREIGN KEY (id_aluno) REFERENCES alunos(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  CONSTRAINT fk_estagios_empresas
    FOREIGN KEY (id_empresa) REFERENCES empresas(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  CONSTRAINT fk_estagios_supervisores
    FOREIGN KEY (id_supervisor) REFERENCES supervisores(id)
      ON UPDATE CASCADE
      ON DELETE SET NULL,
  CONSTRAINT fk_estagios_orientadores
    FOREIGN KEY (id_orientador) REFERENCES orientadores(id)
      ON UPDATE CASCADE
      ON DELETE SET NULL
);

-- Caso queira uma relação N:N entre alunos e estágios
-- (por exemplo, histórico de estágios de um aluno),
-- use a tabela abaixo em vez de ligar direto em estagios.id_aluno.

-- CREATE TABLE rel_aluno_estagio (
--   id        INT AUTO_INCREMENT PRIMARY KEY,
--   id_aluno  INT NOT NULL,
--   id_estagio INT NOT NULL,
--   CONSTRAINT fk_rel_aluno_estagio_alunos
--     FOREIGN KEY (id_aluno) REFERENCES alunos(id),
--   CONSTRAINT fk_rel_aluno_estagio_estagios
--     FOREIGN KEY (id_estagio) REFERENCES estagios(id)
-- );

-- =========================================================
-- DOCUMENTOS E CONTROLE
-- =========================================================

CREATE TABLE documentos_aluno (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  id_aluno     INT NOT NULL,
  tipo         VARCHAR(100) NOT NULL, -- ex.: RG, CPF, Comprovante de Matricula
  caminho_arquivo VARCHAR(255),
  data_envio   DATE,
  CONSTRAINT fk_documentos_aluno_alunos
    FOREIGN KEY (id_aluno) REFERENCES alunos(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);

CREATE TABLE documentos_estagio (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  id_estagio     INT NOT NULL,
  tipo           VARCHAR(100) NOT NULL, -- ex.: Termo de Compromisso, Relatorio Parcial, etc.
  caminho_arquivo VARCHAR(255),
  data_envio     DATE,
  CONSTRAINT fk_documentos_estagio_estagios
    FOREIGN KEY (id_estagio) REFERENCES estagios(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);

CREATE TABLE observacoes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  id_estagio  INT NOT NULL,
  data_registro DATE NOT NULL,
  descricao   TEXT NOT NULL,
  autor       VARCHAR(255), -- quem registrou (coordenador, orientador, etc.)
  CONSTRAINT fk_observacoes_estagios
    FOREIGN KEY (id_estagio) REFERENCES estagios(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);

CREATE TABLE acompanhamentos (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  id_estagio   INT NOT NULL,
  data_visita  DATE NOT NULL,
  parecer      TEXT,
  CONSTRAINT fk_acompanhamentos_estagios
    FOREIGN KEY (id_estagio) REFERENCES estagios(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);

