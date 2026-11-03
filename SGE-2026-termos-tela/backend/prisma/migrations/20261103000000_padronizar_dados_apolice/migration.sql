-- Padroniza os campos exibidos no Termo de Compromisso.
-- Os valores existentes são preservados: nome_seguradora passa a ser Apólice
-- e valor_apolice passa a ser Capital Segurado.
ALTER TABLE `estagios`
    CHANGE COLUMN `nome_seguradora` `apolice` VARCHAR(30) NULL,
    MODIFY COLUMN `numero_apolice` VARCHAR(30) NULL,
    CHANGE COLUMN `valor_apolice` `capital_segurado` VARCHAR(30) NULL;
