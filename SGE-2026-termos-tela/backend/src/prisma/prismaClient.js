const { PrismaClient } = require('@prisma/client');

// Evita recriar o PrismaClient em ambientes com hot-reload (ex: nodemon)
const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma instanceof PrismaClient
    ? globalForPrisma.prisma
    : new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;

