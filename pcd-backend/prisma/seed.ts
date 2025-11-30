
import bcrypt from 'bcryptjs';
import { PrismaClient } from "@prisma/client";
import { seedDeficiencia } from "./seed-def";
const prisma = new PrismaClient();

async function main() {
    // Seed do admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Administrador';
    if (adminEmail && adminPassword) {
      const senhaHash = await bcrypt.hash(adminPassword, 10);
      await prisma.administrador.upsert({
        where: { email: adminEmail },
        update: { senhaHash, nome: adminName, isActive: true },
        create: { email: adminEmail, senhaHash, nome: adminName, isActive: true },
      });
      console.log('👑 Administrador inserido/atualizado:', adminEmail);
    } else {
      console.warn('⚠️ Variáveis ADMIN_EMAIL e ADMIN_PASSWORD não definidas no .env. Admin não criado.');
    }

  // Executa seed de deficiência
  await seedDeficiencia();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());