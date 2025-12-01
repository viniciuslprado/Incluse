import 'dotenv/config';
import prisma from '../src/prismaClient';

async function main() {
  const candidatoId = 8;
  const vagaId = 1;

  console.log('=== Check Candidaturas ===');
  console.log(`Candidato: ${candidatoId} | Vaga: ${vagaId}`);

  const todasDoCandidato = await prisma.candidatura.findMany({ where: { candidatoId } });
  console.log('\nCandidaturas do candidato (todas):', todasDoCandidato.map(c => ({ id: c.id, vagaId: c.vagaId, status: c.status, isActive: c.isActive })));

  const candidatasVaga = await prisma.candidatura.findMany({ where: { vagaId } });
  console.log('\nCandidaturas da vaga (todas):', candidatasVaga.map(c => ({ id: c.id, candidatoId: c.candidatoId, status: c.status, isActive: c.isActive })));

  const specific = await prisma.candidatura.findFirst({ where: { vagaId, candidatoId } });
  console.log('\nCandidatura específica (vaga+candidato):', specific);

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect().finally(() => process.exit(1)); });
