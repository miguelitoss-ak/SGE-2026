require('dotenv').config();

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin.estagios@ifrs.edu.br';
  const adminSenha = 'admin123';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  const hashedPassword = await bcrypt.hash(adminSenha, 10);

  if (existingAdmin) {
    const updatedAdmin = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        senha: hashedPassword,
        role: 'ADMIN',
        nome: 'Administrador Seção Estágios',
        telefone: '(00) 00000-0000',
      },
    });

    console.log('Administrador padrão atualizado:', updatedAdmin.email);
    return;
  }

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      senha: hashedPassword,
      role: 'ADMIN',
      nome: 'Administrador Seção Estágios',
      telefone: '(00) 00000-0000',
    },
  });

  console.log('Administrador padrão criado:', admin.email);
}

main()
  .catch((error) => {
    console.error('Erro ao criar administrador padrão:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
