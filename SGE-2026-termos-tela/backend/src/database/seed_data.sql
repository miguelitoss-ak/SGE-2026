USE sge;

-- 1. Limpar dados existentes (Ordem reversa para evitar erro de FK)
-- Desativa a checagem de chaves apenas para a limpeza rápida, se necessário
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE dia_semana_estagio;
TRUNCATE TABLE estagios;
TRUNCATE TABLE supervisores;
TRUNCATE TABLE empresas;
TRUNCATE TABLE usuario_empresa;
TRUNCATE TABLE alunos;
TRUNCATE TABLE orientadores;
TRUNCATE TABLE documentos_estagio;
TRUNCATE TABLE documentos_modelo;
TRUNCATE TABLE cursos;
SET FOREIGN_KEY_CHECKS = 1;

-- 2. Inserir Cursos
INSERT INTO cursos (nome, carga_horaria, email_coordenacao) VALUES 
('Análise e Desenvolvimento de Sistemas', 2000, 'ads@instituicao.com'),
('Engenharia de Software', 3200, 'eng@instituicao.com');

-- 3. Usuários empresa (cadastro no portal da empresa)
INSERT INTO usuario_empresa (nome, email, senha, telefone) VALUES 
('Patricia RH', 'patricia@techinova.com', '$2b$10$QRXBUHS8pciqCtrBbouqPe6DSfsqYfZngEd8rufuLY3Hq.bjxr5xm', '11900001111'),
('Roberto Contato', 'roberto@agilesys.com', '$2b$10$QRXBUHS8pciqCtrBbouqPe6DSfsqYfZngEd8rufuLY3Hq.bjxr5xm', '11900002222');

-- 4. Inserir Empresas
INSERT INTO empresas (CNPJ_NibocoProd, nome_social, nome_fantasia, endereco, telefone, email, inscricao_estadual, id_usuario_empresa) VALUES 
('12345678000190', 'Tecnologia Inovadora S.A.', 'Tech Inova', 'Rua Digital, 101', '11999998888', 'rh@techinova.com', '12345678', 1),
('98765432000180', 'Sistemas Ágeis LTDA', 'Agile Sys', 'Av. do Código, 500', '1144445555', 'contato@agilesys.com', '876543', 2);

-- 5. Inserir Orientadores (antes dos alunos por FK id_orientador)
INSERT INTO orientadores (nome, email, telefone) VALUES 
('Prof. Ricardo Rocha', 'ricardo@instituicao.com', '1122223333'),
('Profa. Helena Souza', 'helena@instituicao.com', '1133334444');

-- 6. Inserir Alunos (Referenciam IDs de cursos e opcionalmente orientador)
INSERT INTO alunos (matricula, nome, cpf, telefone, email, data_nasc, id_curso, id_orientador) VALUES 
(20240001, 'João da Silva', '123.456.789-00', '11988887777', 'joao@email.com', '2000-05-15', 1, 1),
(20240002, 'Maria Oliveira', '987.654.321-11', '11977776666', 'maria@email.com', '2001-08-20', 2, 2);

-- 7. Inserir Supervisores (Referenciam IDs de empresas)
INSERT INTO supervisores (nome, cpf, cargo, email, id_empresa) VALUES 
('Carlos Gerente', '111.222.333-44', 'Gerente de TI', 'carlos@techinova.com', 1),
('Ana Líder', '555.666.777-88', 'Tech Lead', 'ana@agilesys.com', 2);

-- 8. Inserir Modelos de Documentos
INSERT INTO documentos_modelo (termo_de_compromisso, plano_de_estagio) VALUES 
('modelo_termo_v1.pdf', 'modelo_plano_v1.pdf');

-- 9. Inserir Documentos de Estágio (vinculados ao modelo; plano permanece só em documentos_modelo)
INSERT INTO documentos_estagio (termo_de_compromisso, id_documentos_modelo) VALUES 
('aluno_joao_termo.pdf', 1);

-- 10. Inserir Estágio (O nó que une tudo)
INSERT INTO estagios (
    dt_registro, beneficio_alimentacao, beneficio_transporte, bolsa_auxilio, 
    data_inicio, data_fim, situacao, id_aluno, id_empresa, id_supervisor, 
    id_orientador, id_documento
) VALUES 
('2026-03-01', 1, 1, 1500.00, '2026-03-10', '2027-03-10', 'ATIVO', 1, 1, 1, 1, 1);

-- 11. Inserir Horários (Referenciam ID do estágio)
INSERT INTO dia_semana_estagio (horario_inicio, horario_saida, id_estagio, dia_semana) VALUES 
('08:00:00', '12:00:00', 1, 'SEGUNDA'),
('08:00:00', '12:00:00', 1, 'TERCA'),
('08:00:00', '12:00:00', 1, 'QUARTA');