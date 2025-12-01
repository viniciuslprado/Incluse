const config = {
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: 'tsx ./prisma/seed.ts',
  },
} as const;

export default config;