// Script de limpeza e padronização de tipos, subtipos e barreiras
// Rode com: npx ts-node scripts/clean-deficiencias.ts

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {

  // 1. Remover tipos duplicados (mesmo nome padronizado)
  const tipos = await prisma.tipoDeficiencia.findMany();
  const nomePadronizado = (nome: string) => nome.trim().replace(/\s*\/\s*/g, '/').replace(/\s+/g, ' ');
  const tiposPorNome: Record<string, typeof tipos[0][]> = {};
  for (const tipo of tipos) {
    const nome = nomePadronizado(tipo.nome);
    if (!tiposPorNome[nome]) tiposPorNome[nome] = [];
    tiposPorNome[nome].push(tipo);
  }
  for (const nome in tiposPorNome) {
    const lista = tiposPorNome[nome];
    if (lista.length > 1) {
      // Mantém o primeiro, remove os outros
      const principal = lista[0];
      for (let i = 1; i < lista.length; i++) {
        const duplicado = lista[i];
        await prisma.subtipoDeficiencia.updateMany({ where: { tipoId: duplicado.id }, data: { tipoId: principal.id } });
        await prisma.tipoDeficiencia.delete({ where: { id: duplicado.id } });
        console.log(`Removido tipo duplicado: ${duplicado.nome}`);
      }
    }
  }

  // 2. Padronizar nomes de tipos (remover espaços duplicados, barras, etc)
  const tiposAtualizados = await prisma.tipoDeficiencia.findMany();
  for (const tipo of tiposAtualizados) {
    let nome = nomePadronizado(tipo.nome);
    if (nome !== tipo.nome) {
      await prisma.tipoDeficiencia.update({ where: { id: tipo.id }, data: { nome } });
      console.log(`Tipo ${tipo.nome} => ${nome}`);
    }
  }

  // 3. Remover subtipos duplicados por tipo
  const tiposFinais = await prisma.tipoDeficiencia.findMany({ include: { subtipos: true } });
  for (const tipo of tiposFinais) {
    const subtiposUnicos = new Set<string>();
    for (const subtipo of tipo.subtipos) {
      const nome = subtipo.nome.trim();
      if (subtiposUnicos.has(nome)) {
        // Reatribuir barreiras para o subtipo principal
        const principal = await prisma.subtipoDeficiencia.findFirst({ where: { nome, tipoId: tipo.id } });
        if (principal) {
          await prisma.subtipoBarreira.updateMany({ where: { subtipoId: subtipo.id }, data: { subtipoId: principal.id } });
          await prisma.subtipoDeficiencia.delete({ where: { id: subtipo.id } });
          console.log(`Removido subtipo duplicado: ${nome} (${tipo.nome})`);
        }
      } else {
        subtiposUnicos.add(nome);
      }
    }
  }

  // 4. Padronizar nomes de barreiras (remover espaços duplicados)
  const barreiras = await prisma.barreira.findMany();
  for (const b of barreiras) {
    let descricao = b.descricao.trim().replace(/\s+/g, ' ');
    if (descricao !== b.descricao) {
      await prisma.barreira.update({ where: { id: b.id }, data: { descricao } });
      console.log(`Barreira ${b.descricao} => ${descricao}`);
    }
  }

  console.log('Limpeza e padronização concluída!');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
