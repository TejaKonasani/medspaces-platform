import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line vars-on-top
  var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient = global.prisma ?? new PrismaClient({ log: ['error'] });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
