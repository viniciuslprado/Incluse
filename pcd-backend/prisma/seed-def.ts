
import { PrismaClient } from "@prisma/client";



export async function seedDeficiencia() {
  const prisma = new PrismaClient();

  // Função utilitária para upsert de barreiras
  async function upsertBarreira(descricao) {
    return prisma.barreira.upsert({
      where: { descricao },
      update: {},
      create: { descricao }
    });
  }

  // Função utilitária para upsert de acessibilidade
  async function upsertAcessibilidade(descricao) {
    return prisma.acessibilidade.upsert({
      where: { descricao },
      update: {},
      create: { descricao }
    });
  }

  // --- BARREIRAS E ACESSIBILIDADES AUDITIVA ---
  const barreirasAuditiva = await Promise.all([
    upsertBarreira("Falta de intérprete de Libras"),
    upsertBarreira("Falta de legendas em vídeos"),
    upsertBarreira("Avisos apenas sonoros (alarme, chamada, sinal)"),
    upsertBarreira("Falta de comunicação visual"),
    upsertBarreira("Máscaras que escondem boca (prejudicam leitura labial)"),
    upsertBarreira("Ambientes muito barulhentos (dificultam AASI/IC)"),
    // Barreiras Gerais de Comunicação (1–13) já estão cobertas em barreirasGerais
  ]);

  const acessAuditiva = await Promise.all([
    upsertAcessibilidade("Intérprete de Libras"),
    upsertAcessibilidade("Legendas automáticas/humanas"),
    upsertAcessibilidade("Avisos luminosos (alarme visual)"),
    upsertAcessibilidade("Painéis informativos"),
    upsertAcessibilidade("Máscara transparente em atendimentos"),
    upsertAcessibilidade("Treinamento da equipe para comunicação acessível"),
    upsertAcessibilidade("Chamadas por display eletrônico"),
    upsertAcessibilidade("Ambientes com menor ruído"), // Específica para AASI/IC
    upsertAcessibilidade("Microfone direcional (para reuniões)"), // Específica para AASI/IC
    upsertAcessibilidade("Sistemas FM / Bluetooth"), // Específica para AASI/IC
  ]);

  // --- BARREIRAS E ACESSIBILIDADES VISUAL ---
  const barreirasVisual = await Promise.all([
    upsertBarreira("Falta de sinalização tátil"),
    upsertBarreira("Falta de contraste visual"),
    upsertBarreira("Escadas sem piso tátil"),
    upsertBarreira("Objetos suspensos ou obstáculos inesperados"),
    upsertBarreira("Sites/aplicações sem acessibilidade digital"),
    upsertBarreira("Documentos apenas impressos"),
    upsertBarreira("Ambientes pouco iluminados"),
    upsertBarreira("Mudanças frequentes no layout (desorientação)"),
  ]);

  const acessVisual = await Promise.all([
    upsertAcessibilidade("Piso tátil direcional e de alerta"),
    upsertAcessibilidade("Corrimão bilateral com indicação Braille"),
    upsertAcessibilidade("Alto contraste nas sinalizações"),
    upsertAcessibilidade("Mapas táteis"),
    upsertAcessibilidade("Etiquetas táteis/Braille"),
    upsertAcessibilidade("Cão-guia permitido"),
    upsertAcessibilidade("Layout previsível sem obstáculos"),
    // Digitais
    upsertAcessibilidade("Acessibilidade WCAG"),
    upsertAcessibilidade("Leitor de tela"),
    upsertAcessibilidade("Navegação por teclado"),
    upsertAcessibilidade("Conteúdo com descrição textual"),
    upsertAcessibilidade("Formularios acessíveis"),
    upsertAcessibilidade("Opção de zoom e contraste"),
  ]);

  // --- BARREIRAS E ACESSIBILIDADES INTELECTUAL ---
  const barreirasIntelectual = await Promise.all([
    upsertBarreira("Instruções complexas sem apoio visual"),
    upsertBarreira("Treinamentos rápidos demais"),
    upsertBarreira("Rotinas sem previsibilidade"),
    upsertBarreira("Ambientes com muitas distrações"),
    upsertBarreira("Excesso de etapas sem acompanhamento"),
    upsertBarreira("Comunicação abstrata ou ambígua"),
  ]);

  const acessIntelectual = await Promise.all([
    upsertAcessibilidade("Instruções passo a passo"),
    upsertAcessibilidade("Apoio visual (ícones, placas, fluxos)"),
    upsertAcessibilidade("Treinamento prático com demonstração"),
    upsertAcessibilidade("Rotina organizada e previsível"),
    upsertAcessibilidade("Checklists simples"),
    upsertAcessibilidade("Mapa de tarefas"),
    upsertAcessibilidade("Acompanhamento inicial (job coach temporário)"),
  ]);

  // --- BARREIRAS E ACESSIBILIDADES PSICOSSOCIAL ---
  const barreirasPsicossocial = await Promise.all([
    upsertBarreira("Ambientes muito estressantes"),
    upsertBarreira("Pressão excessiva e comunicação agressiva"),
    upsertBarreira("Falta de previsibilidade"),
    upsertBarreira("Jornadas muito extensas"),
    upsertBarreira("Falta de pausas programadas"),
    upsertBarreira("Exposição a gatilhos sensoriais (ruído, luz intensa)"),
  ]);

  const acessPsicossocial = await Promise.all([
    upsertAcessibilidade("Ambiente com estímulos reduzidos"),
    upsertAcessibilidade("Pausas programadas"),
    upsertAcessibilidade("Rotina estável"),
    upsertAcessibilidade("Comunicação empática"),
    upsertAcessibilidade("Política anti-assédio"),
    upsertAcessibilidade("Treinamentos claros"),
    upsertAcessibilidade("Feedback estruturado e previsível"),
  ]);

  // --- BARREIRAS E ACESSIBILIDADES TEA ---
  const barreirasTEA = await Promise.all([
    upsertBarreira("Ruído excessivo"),
    upsertBarreira("Iluminação forte/fluorescente"),
    upsertBarreira("Mudanças de rotina sem aviso"),
    upsertBarreira("Comunicação ambígua"),
    upsertBarreira("Regras implícitas de convivência"),
    upsertBarreira("Demandas multitarefa"),
    upsertBarreira("Ambientes caóticos"),
  ]);

  const acessTEA = await Promise.all([
    upsertAcessibilidade("Espaço silencioso"),
    upsertAcessibilidade("Iluminação suave"),
    upsertAcessibilidade("Comunicação objetiva"),
    upsertAcessibilidade("Previsibilidade e rotina clara"),
    upsertAcessibilidade("Treinamentos estruturados"),
    upsertAcessibilidade("Feedback direto"),
    upsertAcessibilidade("Instruções escritas"),
    upsertAcessibilidade("Flexibilidade sensorial"),
  ]);

  // Tipos
  const motora = await prisma.tipoDeficiencia.upsert({
    where: { nome: "Deficiência Física/Motora" },
    update: {},
    create: { nome: "Deficiência Física/Motora" }
  });
  const auditiva = await prisma.tipoDeficiencia.upsert({
    where: { nome: "Deficiência Auditiva" },
    update: {},
    create: { nome: "Deficiência Auditiva" }
  });
  const visual = await prisma.tipoDeficiencia.upsert({
    where: { nome: "Deficiência Visual" },
    update: {},
    create: { nome: "Deficiência Visual" }
  });
  const intelectual = await prisma.tipoDeficiencia.upsert({
    where: { nome: "Deficiência Intelectual" },
    update: {},
    create: { nome: "Deficiência Intelectual" }
  });
  const psicossocial = await prisma.tipoDeficiencia.upsert({
    where: { nome: "Deficiência Psicossocial" },
    update: {},
    create: { nome: "Deficiência Psicossocial" }
  });
  const tea = await prisma.tipoDeficiencia.upsert({
    where: { nome: "Transtorno do Espectro Autista (TEA)" },
    update: {},
    create: { nome: "Transtorno do Espectro Autista (TEA)" }
  });

  // Função utilitária para upsert de subtipos
  async function upsertSubtipo(nome, tipoId) {
    return prisma.subtipoDeficiencia.upsert({
      where: { tipoId_nome: { tipoId, nome } },
      update: {},
      create: { nome, tipoId }
    });
  }

  // SUBTIPOS – Deficiência Física/Motora
  const subtiposMotora = await Promise.all([
    // A) Amputações / Ausência de membros
    upsertSubtipo("Amputação Transfemoral (Acima do Joelho – AK)", motora.id),
    upsertSubtipo("Amputação Transtibial (Abaixo do Joelho – BK)", motora.id),
    upsertSubtipo("Amputação Parcial do Pé", motora.id),
    upsertSubtipo("Amputação Hemipelvectomia", motora.id),
    upsertSubtipo("Amputação de Membro Superior – Transumeral", motora.id),
    upsertSubtipo("Amputação de Membro Superior – Transradial", motora.id),
    upsertSubtipo("Ausência Congênita de Membro Inferior", motora.id),
    upsertSubtipo("Ausência Congênita de Membro Superior", motora.id),
    upsertSubtipo("Amputação unilateral — com uso de muletas", motora.id),
    upsertSubtipo("Amputação unilateral — sem muletas", motora.id),
    upsertSubtipo("Amputação bilateral — uso de prótese", motora.id),
    upsertSubtipo("Amputação bilateral — uso de cadeira de rodas", motora.id),
    // B) Mobilidade Reduzida / Ortopédica
    upsertSubtipo("Usuário de cadeira de rodas manual", motora.id),
    upsertSubtipo("Usuário de cadeira de rodas motorizada", motora.id),
    upsertSubtipo("Usuário de andador", motora.id),
    upsertSubtipo("Usuário de muletas permanentes", motora.id),
    upsertSubtipo("Hemiparesia (paralisia parcial de um lado)", motora.id),
    upsertSubtipo("Paraparesia (fraqueza parcial em ambas as pernas)", motora.id),
    upsertSubtipo("Tetraparesia leve", motora.id),
    upsertSubtipo("Má formação ortopédica com limitação de mobilidade", motora.id),
    upsertSubtipo("Artrose ou lesão grave com redução permanente", motora.id),
    upsertSubtipo("Escoliose grave / deformidade que limita mobilidade", motora.id),
    upsertSubtipo("Osteogênese Imperfeita (leve/moderada — capaz de trabalhar)", motora.id),
    // C) Deficiências Neuromotoras
    upsertSubtipo("Paralisia Cerebral leve ou moderada (não cognitiva)", motora.id),
    upsertSubtipo("Lesão Medular parcial (nível funcional)", motora.id),
    upsertSubtipo("Espinha Bífida com mobilidade preservada parcial", motora.id),
    upsertSubtipo("Distrofias musculares leves/moderadas (com autonomia laboral)", motora.id),
  ]);

  // SUBTIPOS – Deficiência Auditiva
  const subtiposAuditiva = await Promise.all([
    upsertSubtipo("Surdez Neurossensorial Leve", auditiva.id),
    upsertSubtipo("Surdez Neurossensorial Moderada", auditiva.id),
    upsertSubtipo("Surdez Neurossensorial Severa", auditiva.id),
    upsertSubtipo("Surdez Profunda", auditiva.id),
    upsertSubtipo("Surdez Condutiva Leve", auditiva.id),
    upsertSubtipo("Surdez Condutiva Moderada", auditiva.id),
    upsertSubtipo("Surdez Condutiva Severa", auditiva.id),
    upsertSubtipo("Perda Auditiva Unilateral Leve", auditiva.id),
    upsertSubtipo("Perda Auditiva Unilateral Severa", auditiva.id),
    upsertSubtipo("Usuário de Aparelho Auditivo (AASI)", auditiva.id),
    upsertSubtipo("Usuário de Implante Coclear", auditiva.id),
    upsertSubtipo("Pessoa que se comunica prioritariamente por Libras", auditiva.id),
    upsertSubtipo("Pessoa bilíngue (Libras + Português)", auditiva.id),
  ]);

  // SUBTIPOS – Deficiência Visual
  const subtiposVisual = await Promise.all([
    upsertSubtipo("Cegueira Total", visual.id),
    upsertSubtipo("Baixa Visão Leve", visual.id),
    upsertSubtipo("Baixa Visão Moderada", visual.id),
    upsertSubtipo("Baixa Visão Severa", visual.id),
    upsertSubtipo("Visão Tubular", visual.id),
    upsertSubtipo("Visão Central Preservada com Periférica Reduzida", visual.id),
    upsertSubtipo("Visão Periférica Preservada com Central Reduzida", visual.id),
    upsertSubtipo("Pessoa usuária de Bengala", visual.id),
    upsertSubtipo("Pessoa usuária de Cão-guia", visual.id),
    upsertSubtipo("Pessoa com fotossensibilidade grave", visual.id),
    upsertSubtipo("Deficiência visual progressiva (ex.: glaucoma avançado)", visual.id),
  ]);

  // SUBTIPOS – Deficiência Intelectual
  const subtiposIntelectual = await Promise.all([
    upsertSubtipo("Deficiência Intelectual Leve", intelectual.id),
    upsertSubtipo("Deficiência Intelectual Moderada", intelectual.id),
    upsertSubtipo("Deficiência Intelectual com boa autonomia social", intelectual.id),
    upsertSubtipo("Deficiência Intelectual com limitação cognitiva leve", intelectual.id),
    upsertSubtipo("Transtorno Global do Desenvolvimento com prejuízo cognitivo leve", intelectual.id),
    upsertSubtipo("Condições genéticas associadas (ex.: Síndrome de Down – leve/moderada)", intelectual.id),
  ]);

  // SUBTIPOS – Deficiência Psicossocial
  const subtiposPsicossocial = await Promise.all([
    upsertSubtipo("Transtorno Bipolar estabilizado", psicossocial.id),
    upsertSubtipo("Esquizofrenia estabilizada", psicossocial.id),
    upsertSubtipo("Transtorno Esquizoafetivo", psicossocial.id),
    upsertSubtipo("Transtorno Depressivo Maior recorrente", psicossocial.id),
    upsertSubtipo("Transtorno de Ansiedade Generalizada severa", psicossocial.id),
    upsertSubtipo("TOC severo estabilizado", psicossocial.id),
    upsertSubtipo("Transtorno de Personalidade com prejuízo funcional leve e controlado", psicossocial.id),
  ]);

  // SUBTIPOS – TEA
  const subtiposTEA = await Promise.all([
    upsertSubtipo("TEA Nível 1 de suporte (leve)", tea.id),
    upsertSubtipo("TEA Nível 2 moderado", tea.id),
    upsertSubtipo("Autistas com comunicação verbal funcional", tea.id),
    upsertSubtipo("Autistas com sensibilidade sensorial acentuada", tea.id),
    upsertSubtipo("Autistas com dificuldade de interação social", tea.id),
    upsertSubtipo("Autistas com hiperfoco e habilidade analítica", tea.id),
    upsertSubtipo("Autistas com rotinas rígidas", tea.id),
  ]);

  // --- DEFICIÊNCIAS COGNITIVAS ESPECÍFICAS (ex: Dislexia) ---
  // Adiciona subtipo Dislexia em Intelectual (ou crie tipo separado se desejar)
  // Aqui, vamos adicionar como subtipo de Intelectual para manter compatibilidade
  const dislexiaSubtipo = await upsertSubtipo("Dislexia", intelectual.id);

  // Barreiras Dislexia
  const barreirasDislexia = await Promise.all([
    upsertBarreira("Textos longos"),
    upsertBarreira("Leitura rápida exigida"),
    upsertBarreira("Instruções complexas"),
  ]);

  // Acessibilidades Dislexia
  const acessDislexia = await Promise.all([
    upsertAcessibilidade("Texto simplificado"),
    upsertAcessibilidade("Fontes legíveis"),
    upsertAcessibilidade("WCAG (layout limpo)"),
  ]);

  // Vincular barreiras e acessibilidades para Dislexia
  await prisma.subtipoBarreira.createMany({
    data: barreirasDislexia.map(bar => ({ subtipoId: dislexiaSubtipo.id, barreiraId: bar.id })),
    skipDuplicates: true,
  });
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasDislexia.flatMap(bar => acessDislexia.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id }))),
    skipDuplicates: true,
  });
  // Função utilitária para upsert de barreiras
  async function upsertBarreira(descricao) {
    return prisma.barreira.upsert({
      where: { descricao },
      update: {},
      create: { descricao }
    });
  }

  // Função utilitária para upsert de acessibilidade
  async function upsertAcessibilidade(descricao) {
    return prisma.acessibilidade.upsert({
      where: { descricao },
      update: {},
      create: { descricao }
    });
  }

  // Substituir as transações de barreiras e acessibilidades por upserts
  // Exemplo para barreiras gerais:

  const barreirasGerais = await Promise.all([
    upsertBarreira("Escadas sem alternativa acessível"),
    upsertBarreira("Falta de rampas"),
    upsertBarreira("Porta estreita"),
    upsertBarreira("Piso irregular"),
    upsertBarreira("Falta de elevador acessível"),
    upsertBarreira("Desníveis no piso"),
    upsertBarreira("Banheiro sem barras"),
    upsertBarreira("Falta de espaço de circulação"),
    upsertBarreira("Mobiliário bloqueando passagem"),
    upsertBarreira("Abertura de porta pesada"),
    upsertBarreira("Altura inadequada de interruptores"),
    upsertBarreira("Falta de estacionamento PCD"),
    upsertBarreira("Rotas longas sem descanso"),
  ]);


  // --- VÍNCULOS DEFICIÊNCIA FÍSICA/MOTORA ---
  // Índices dos subtipos conforme lista enviada (1-based):
  // 1–12: Amputações/Ausência de membros
  // 13–23: Mobilidade reduzida/ortopédica
  // 24–27: Neuromotoras
  // 5,6,8: Amputações superiores
  // 12,13,14,17,18,24,25,26: Cadeira de rodas
  // 1–11,15,16,17–23,26: Muletas/andador/prótese
  // 17–27: Neuromotoras

  // Barreiras gerais (aplicam para todos)
  await prisma.subtipoBarreira.createMany({
    data: subtiposMotora.flatMap(sub => barreirasGerais.map(bar => ({ subtipoId: sub.id, barreiraId: bar.id }))),
    skipDuplicates: true,
  });

  // Barreiras específicas para grupos
  // IDs dos subtipos (0-based):
  const idxCadeiraRodas = [11,12,13,16,17,23,24,25]; // 12,13,14,17,18,24,25,26
  const idxMuletas = [0,1,2,3,4,5,6,7,8,9,10,14,15,16,17,18,19,20,21,22,25]; // 1–11,15,16,17–23,26
  const idxAmputSup = [4,5,7]; // 5,6,8
  const idxNeuromotoras = [16,17,18,19,20,21,22,23,24,25,26]; // 17–27

  // Barreiras específicas (crie se não existirem)
  const barreirasCadeiraRodas = await Promise.all([
    upsertBarreira("Rampas com inclinação inadequada"),
    upsertBarreira("Elevador com botões inacessíveis"),
    upsertBarreira("Mesas sem espaço para encaixar cadeira"),
    upsertBarreira("Falta de espaço de giro (1,50m)"),
    upsertBarreira("Banheiro com espaço frontal insuficiente"),
    upsertBarreira("Falta de plataforma elevatória"),
    upsertBarreira("Balcões muito altos"),
  ]);
  const barreirasMuletas = await Promise.all([
    upsertBarreira("Piso escorregadio"),
    upsertBarreira("Tapetes soltos"),
    upsertBarreira("Percurso longo sem pontos de descanso"),
    upsertBarreira("Rampas muito inclinadas (difícil com muletas)"),
    upsertBarreira("Portas pesadas"),
    upsertBarreira("Desníveis pequenos (2–3 cm) que atrapalham próteses"),
    upsertBarreira("Falta de corrimão"),
    upsertBarreira("Cadeiras não ergonômicas"),
  ]);
  const barreirasAmputSup = await Promise.all([
    upsertBarreira("Maçanetas redondas"),
    upsertBarreira("Portas sem alavanca"),
    upsertBarreira("Botões pequenos/difíceis"),
    upsertBarreira("Equipamentos que exigem força de pinça"),
    upsertBarreira("Torneiras manuais"),
    upsertBarreira("Sistemas que exigem digitação extensiva sem adaptação"),
  ]);
  const barreirasNeuromotoras = await Promise.all([
    upsertBarreira("Falta de corrimão duplo"),
    upsertBarreira("Falta de assentos de apoio nas rotas"),
    upsertBarreira("Trajetos longos sem pausas"),
    upsertBarreira("Portas rápidas que fecham sozinhas"),
    upsertBarreira("Estações de trabalho sem ergonomia ajustável"),
  ]);

  // Vincular barreiras específicas
  await prisma.subtipoBarreira.createMany({
    data: idxCadeiraRodas.flatMap(i => barreirasCadeiraRodas.map(bar => ({ subtipoId: subtiposMotora[i].id, barreiraId: bar.id }))),
    skipDuplicates: true,
  });
  await prisma.subtipoBarreira.createMany({
    data: idxMuletas.flatMap(i => barreirasMuletas.map(bar => ({ subtipoId: subtiposMotora[i].id, barreiraId: bar.id }))),
    skipDuplicates: true,
  });
  await prisma.subtipoBarreira.createMany({
    data: idxAmputSup.flatMap(i => barreirasAmputSup.map(bar => ({ subtipoId: subtiposMotora[i].id, barreiraId: bar.id }))),
    skipDuplicates: true,
  });
  await prisma.subtipoBarreira.createMany({
    data: idxNeuromotoras.flatMap(i => barreirasNeuromotoras.map(bar => ({ subtipoId: subtiposMotora[i].id, barreiraId: bar.id }))),
    skipDuplicates: true,
  });

  // --- ACESSIBILIDADES DEFICIÊNCIA FÍSICA/MOTORA ---
  // Gerais
  const acessMotoraGerais = await Promise.all([
    upsertAcessibilidade("Rampas com inclinação correta (NBR 9050)"),
    upsertAcessibilidade("Portas com +80 cm e maçaneta de alavanca"),
    upsertAcessibilidade("Estacionamento PCD sinalizado"),
    upsertAcessibilidade("Banheiro com barras verticais e horizontais"),
    upsertAcessibilidade("Layout com no mínimo 90 cm de circulação"),
    upsertAcessibilidade("Espaço organizado sem obstáculos"),
    upsertAcessibilidade("Sinalização visual clara"),
    upsertAcessibilidade("Rotas acessíveis definidas"),
  ]);
  // Cadeira de rodas
  const acessCadeiraRodas = await Promise.all([
    upsertAcessibilidade("Porta com 90 cm"),
    upsertAcessibilidade("Mesa com altura 73–85 cm"),
    upsertAcessibilidade("Espaço de giro (1,50m)"),
    upsertAcessibilidade("Elevador com botões a 1,10m"),
    upsertAcessibilidade("Plataforma elevatória"),
    upsertAcessibilidade("Rampa com corrimão duplo"),
    upsertAcessibilidade("Banheiro com 1,20m de aproximação frontal"),
    upsertAcessibilidade("Estação de trabalho regulável"),
  ]);
  // Muletas/andador/prótese
  const acessMuletas = await Promise.all([
    upsertAcessibilidade("Piso antiderrapante"),
    upsertAcessibilidade("Tapete fixo com fita antiderrapante"),
    upsertAcessibilidade("Corrimão bilateral"),
    upsertAcessibilidade("Assentos de apoio ao longo do trajeto"),
    upsertAcessibilidade("Rampa suave (máx. 8,33%)"),
    upsertAcessibilidade("Portas leves ou automáticas"),
    upsertAcessibilidade("Áreas de descanso acessíveis"),
  ]);
  // Amputações superiores
  const acessAmputSup = await Promise.all([
    upsertAcessibilidade("Maçaneta tipo alavanca"),
    upsertAcessibilidade("Torneiras automáticas"),
    upsertAcessibilidade("Botões grandes / touch / pedal"),
    upsertAcessibilidade("Sistemas com acessibilidade digital (voz, atalho, ampliação)"),
    upsertAcessibilidade("Equipamentos que não exigem força de pinça"),
    upsertAcessibilidade("Automatização de portas"),
  ]);
  // Neuromotoras
  const acessNeuromotoras = await Promise.all([
    upsertAcessibilidade("Corrimão duplo"),
    upsertAcessibilidade("Assentos em rotas longas"),
    upsertAcessibilidade("Estações reguláveis"),
    upsertAcessibilidade("Ambientes com espaço para movimentação lenta"),
    upsertAcessibilidade("Portas com fechamento suave"),
    upsertAcessibilidade("Sistemas para evitar quedas (apoios laterais)"),
  ]);

  // Vincular barreiras gerais às acessibilidades gerais
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasGerais.flatMap(bar => acessMotoraGerais.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id }))),
    skipDuplicates: true,
  });
  // Vincular barreiras específicas aos grupos de acessibilidade
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasCadeiraRodas.flatMap(bar => acessCadeiraRodas.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id }))),
    skipDuplicates: true,
  });
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasMuletas.flatMap(bar => acessMuletas.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id }))),
    skipDuplicates: true,
  });
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasAmputSup.flatMap(bar => acessAmputSup.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id }))),
    skipDuplicates: true,
  });
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasNeuromotoras.flatMap(bar => acessNeuromotoras.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id }))),
    skipDuplicates: true,
  });

  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasAuditiva.flatMap(bar => acessAuditiva.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id }))),
    skipDuplicates: true,
  });
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasVisual.flatMap(bar => acessVisual.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id }))),
    skipDuplicates: true,
  });
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasIntelectual.flatMap(bar => acessIntelectual.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id }))),
    skipDuplicates: true,
  });
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasPsicossocial.flatMap(bar => acessPsicossocial.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id }))),
    skipDuplicates: true,
  });
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasTEA.flatMap(bar => acessTEA.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id }))),
    skipDuplicates: true,
  });


  // Retorne objetos úteis se necessário
  return {
    // Adicione aqui se quiser retornar tipos, subtipos, etc.
  };
}
