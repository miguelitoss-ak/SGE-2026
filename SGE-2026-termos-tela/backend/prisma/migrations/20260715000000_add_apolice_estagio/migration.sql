-- AlterTable
ALTER TABLE `estagios`
    ADD COLUMN `obrigatorio` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `numero_apolice` VARCHAR(100) NULL,
    ADD COLUMN `nome_seguradora` VARCHAR(255) NULL,
    ADD COLUMN `valor_apolice` DECIMAL(10, 2) NULL,
    MODIFY COLUMN `carga_horaria_semanal` DECIMAL(10, 2) NULL;
