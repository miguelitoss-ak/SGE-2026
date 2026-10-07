-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'ALUNO',
    `matricula` VARCHAR(191) NULL,
    `nome` VARCHAR(191) NULL,
    `cpf` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NULL,
    `data_nasc` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cursos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `carga_horaria` INTEGER NOT NULL,
    `email_coordenacao` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_empresa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuario_empresa_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `CNPJ_NibocoProd` CHAR(14) NOT NULL,
    `nome_social` VARCHAR(191) NOT NULL,
    `nome_fantasia` VARCHAR(191) NULL,
    `endereco` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `representante` VARCHAR(191) NULL,
    `cargo` VARCHAR(191) NULL,
    `inscricao_estadual` VARCHAR(8) NULL,
    `id_usuario_empresa` INTEGER NULL,

    UNIQUE INDEX `empresas_CNPJ_NibocoProd_key`(`CNPJ_NibocoProd`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orientadores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentos_modelo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `termo_de_compromisso` VARCHAR(191) NULL,
    `plano_de_estagio` VARCHAR(191) NULL,
    `ficha_de_avaliacao_empresa` VARCHAR(191) NULL,
    `ficha_de_avaliacao_aluno` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alunos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricula` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `data_nasc` DATE NULL,
    `id_curso` INTEGER NOT NULL,
    `id_orientador` INTEGER NULL,

    UNIQUE INDEX `alunos_matricula_key`(`matricula`),
    UNIQUE INDEX `alunos_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supervisores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `cargo` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `id_empresa` INTEGER NOT NULL,

    UNIQUE INDEX `supervisores_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentos_estagio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `termo_de_compromisso` VARCHAR(191) NULL,
    `ficha_de_avaliacao_empresa` VARCHAR(191) NULL,
    `ficha_de_avaliacao_aluno` VARCHAR(191) NULL,
    `id_documentos_modelo` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estagios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dt_registro` DATE NOT NULL,
    `beneficio_alimentacao` BOOLEAN NULL,
    `beneficio_transporte` BOOLEAN NULL,
    `beneficio_impresso` BOOLEAN NULL,
    `bolsa_auxilio` DECIMAL(10, 2) NULL,
    `data_inicio` DATE NOT NULL,
    `data_fim` DATE NULL,
    `dt_rescisao` DATE NULL,
    `dt_renovacao` DATE NULL,
    `carga_horaria_total` INTEGER NULL,
    `carga_horaria_semanal` INTEGER NULL,
    `situacao` VARCHAR(191) NOT NULL,
    `id_aluno` INTEGER NOT NULL,
    `id_empresa` INTEGER NOT NULL,
    `id_supervisor` INTEGER NULL,
    `id_orientador` INTEGER NOT NULL,
    `id_documento` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dia_semana_estagio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `horario_inicio` TIME NOT NULL,
    `horario_saida` TIME NOT NULL,
    `id_estagio` INTEGER NOT NULL,
    `dia_semana` ENUM('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `empresas` ADD CONSTRAINT `empresas_id_usuario_empresa_fkey` FOREIGN KEY (`id_usuario_empresa`) REFERENCES `usuario_empresa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alunos` ADD CONSTRAINT `alunos_id_curso_fkey` FOREIGN KEY (`id_curso`) REFERENCES `cursos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alunos` ADD CONSTRAINT `alunos_id_orientador_fkey` FOREIGN KEY (`id_orientador`) REFERENCES `orientadores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supervisores` ADD CONSTRAINT `supervisores_id_empresa_fkey` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos_estagio` ADD CONSTRAINT `documentos_estagio_id_documentos_modelo_fkey` FOREIGN KEY (`id_documentos_modelo`) REFERENCES `documentos_modelo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estagios` ADD CONSTRAINT `estagios_id_aluno_fkey` FOREIGN KEY (`id_aluno`) REFERENCES `alunos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estagios` ADD CONSTRAINT `estagios_id_empresa_fkey` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estagios` ADD CONSTRAINT `estagios_id_supervisor_fkey` FOREIGN KEY (`id_supervisor`) REFERENCES `supervisores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estagios` ADD CONSTRAINT `estagios_id_orientador_fkey` FOREIGN KEY (`id_orientador`) REFERENCES `orientadores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estagios` ADD CONSTRAINT `estagios_id_documento_fkey` FOREIGN KEY (`id_documento`) REFERENCES `documentos_estagio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dia_semana_estagio` ADD CONSTRAINT `dia_semana_estagio_id_estagio_fkey` FOREIGN KEY (`id_estagio`) REFERENCES `estagios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
