import 'dotenv/config';
import prisma from '../src/prismaClient';

async function main() {
  const candidatoId = 8;
  const vagaId = 1;

  console.log('=== Diagnóstico de match ===');
  console.log(`Candidato: ${candidatoId} | Vaga: ${vagaId}\n`);

  const candidato = await prisma.candidato.findUnique({
    where: { id: candidatoId },
    include: {
      subtipos: { include: { subtipo: true } },
      barras: { include: { barreira: true, subtipo: true } }
    }
  });

  console.log('Candidato (resumo):', {
    id: candidato?.id,
    nome: candidato?.nome,
    escolaridade: candidato?.escolaridade,
    subtipos: candidato?.subtipos?.map((s: any) => ({ subtipoId: s.subtipoId, nome: s.subtipo?.nome })) || []
  });

  console.log('\nBarreiras do candidato (detalhe):');
  const barras = (candidato?.barras || []).map((b: any) => ({ subtipoId: b.subtipoId, barreiraId: b.barreiraId, descricao: b.barreira?.descricao }));
  console.log(barras);

  const vaga = await prisma.vaga.findUnique({
    where: { id: vagaId },
    include: {
      subtiposAceitos: { include: { subtipo: true } },
      acessibilidades: { include: { acessibilidade: true } },
      requisitos: true,
    }
  });

  console.log('\nVaga (resumo):', {
    id: vaga?.id,
    titulo: vaga?.titulo,
    escolaridade: vaga?.escolaridade || vaga?.requisitos?.formacao,
    subtiposAceitos: vaga?.subtiposAceitos?.map((s: any) => ({ subtipoId: s.subtipoId, nome: s.subtipo?.nome })) || [],
    acessibilidades: vaga?.acessibilidades?.map((a: any) => ({ id: a.acessibilidadeId, descricao: a.acessibilidade?.descricao })) || []
  });

  // Barreiras IDs
  const barreiraIds = Array.from(new Set(barras.map((b: any) => b.barreiraId))).filter(Boolean);
  console.log('\nBarreira IDs do candidato:', barreiraIds);

  if (barreiraIds.length) {
    const mapaBA = await prisma.barreiraAcessibilidade.findMany({ where: { barreiraId: { in: barreiraIds } }, include: { acessibilidade: true } });
    const grouped: Record<number, any[]> = {};
    for (const m of mapaBA) {
      if (!m.barreiraId) continue;
      const bid = Number(m.barreiraId);
      if (!grouped[bid]) grouped[bid] = [];
      grouped[bid].push({ acessibilidadeId: m.acessibilidadeId, descricao: m.acessibilidade?.descricao });
    }
    console.log('\nMapeamento barreira -> acessibilidades (para as barreiras do candidato):');
    console.log(grouped);
  } else {
    console.log('\nCandidato não tem barreiras registradas.');
  }

  // Acessibilidades da vaga em formato ID set
  const vagaAcessIds = new Set((vaga?.acessibilidades || []).map((a: any) => a.acessibilidadeId));
  console.log('\nAcessibilidades da vaga (IDs):', Array.from(vagaAcessIds));

  // Mostra por subtipo se existe compatibilidade encontrada pela lógica (simulação)
  const candidatoSubtipos = (candidato?.subtipos || []).map((s: any) => s.subtipoId);
  const vagaSubtipos = (vaga?.subtiposAceitos || []).map((s: any) => s.subtipoId);
  console.log('\nSubtipos candidato:', candidatoSubtipos, ' | subtipos vaga:', vagaSubtipos);

  // Para cada subtipo do candidato, checar se vaga aceita e se acessibilidade cobre barreiras
  for (const subtipoId of candidatoSubtipos) {
    const barrasDoSub = barras.filter((b: any) => b.subtipoId === subtipoId).map((b: any) => b.barreiraId);
    console.log(`\nSubtipo ${subtipoId} - barreiras:`, barrasDoSub);
    if (vagaSubtipos.length > 0 && !vagaSubtipos.includes(subtipoId)) {
      console.log(`  Vaga não aceita este subtipo (${subtipoId}).`);
      continue;
    }
    if (barrasDoSub.length === 0) {
      console.log('  Candidato não informou barreiras para este subtipo — considera compatível.');
      continue;
    }
    // Para cada barreira, ver acessibilidades possíveis e se vaga possui alguma
    for (const barId of barrasDoSub) {
      const acessForBar = await prisma.barreiraAcessibilidade.findMany({ where: { barreiraId: barId }, include: { acessibilidade: true } });
      const acessIds = acessForBar.map((x: any) => x.acessibilidadeId);
      const intersection = acessIds.filter((id: number) => vagaAcessIds.has(id));
      console.log(`  Barreiras ${barId} -> acessibilidades possíveis:`, acessIds, ' | interseção com vaga:', intersection);
    }
  }

  // Além disso, verificar caso candidato não tenha subtipos — se vaga exige, então não é compatível
  if ((candidatoSubtipos.length === 0) && (vagaSubtipos.length > 0)) {
    console.log('\nCandidato não tem subtipos e vaga exige subtipos — não compatível.');
  }

  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Erro no diagnóstico:', err);
  prisma.$disconnect().finally(() => process.exit(1));
});
