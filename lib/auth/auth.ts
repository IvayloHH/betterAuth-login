import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from '@/lib/db/client';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    rateLimit: {
      window: 60,
      max: 10,
    },
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array,
});
