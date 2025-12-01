
import bcrypt from 'bcryptjs';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Áreas (completas)
const areas = [
  "Administração",
  "Agronomia",
  "Alimentação",
  "Arte",
  "Artes Visuais",
  "Assistência Social",
  "Atendimento",
  "Auditoria",
  "Aviação",
  "Bancos",
  "Beleza",
  "Bem-estar",
  "Biologia",
  "Biomedicina",
  "Biotecnologia",
  "Cinema",
  "Ciência",
  "Ciência da Computação",
  "Ciências Biológicas",
  "Ciências Contábeis",
  "Ciências Econômicas",
  "Comercial",
  "Comércio",
  "Comunicação",
  "Comunicação Social",
  "Compras",
  "Compliance",
  "Construção Civil",
  "Construção e Incorporação",
  "Consultoria",
  "Contabilidade",
  "Criação",
  "Design",
  "Direito",
  "Diplomacia",
  "E-commerce",
  "Economia",
  "Educação",
  "Educação Física",
  "Energias",
  "Engenharia",
  "Engenharia Civil",
  "Engenharia de Produção",
  "Engenharia Elétrica",
  "Engenharia Mecânica",
  "Enfermagem",
  "Entertenimento",
  "Entregas Urbanas",
  "Esportes",
  "Estatística",
  "Estilo",
  "Eventos",
  "Farmácia",
  "Farmacêutica",
  "Filosofia",
  "Física",
  "Fisioterapia",
  "Fiscal",
  "Fitness",
  "Fotografia",
  "Gás",
  "Gastronomia",
  "Games",
  "Gamificação",
  "Geografia",
  "Governamental",
  "História",
  "Hotelaria",
  "Imobiliário",
  "Indústria",
  "Investimentos",
  "ISO",
  "Jornalismo",
  "Jurídico",
  "Laboratórios",
  "Limpeza",
  "Logística",
  "Manutenção",
  "Manutenção Industrial",
  "Manufatura",
  "Marketing",
  "Matemática",
  "Meio Ambiente",
  "Medicina",
  "Medicina Veterinária",
  "Mineração",
  "Moda",
  "Museus e Patrimônio",
  "Negócios",
  "Nutrição",
  "Odontologia",
  "ONGs",
  "Pedagogia",
  "Pesquisa",
  "Planejamento",
  "PMO",
  "Portuário",
  "Produção Audiovisual",
  "Produção Cultural",
  "Propaganda",
  "Projetos Sociais",
  "Psicologia",
  "Publicidade",
  "Qualidade",
  "Química",
  "Recursos Humanos",
  "Relações Internacionais",
  "Relações Públicas",
  "SAC",
  "Saúde",
  "Saneamento",
  "Segurança Patrimonial",
  "Seguros",
  "Serviços Gerais",
  "Setor Público",
  "Siderurgia",
  "Sociologia",
  "Suporte",
  "Suprimentos",
  "Tecnologia da Informação",
  "Telecomunicações",
  "Terceiro Setor",
  "Transportes",
  "Transporte Aéreo",
  "Transporte Ferroviário",
  "Transporte Marítimo",
  "Turismo",
  "Urbanismo",
  "Varejo",
  "Veterinária",
  "Vendas",
  "Vigilância"
];

async function upsertAreas() {
  console.log('🌱 Iniciando seed de áreas de formação/profissionais...');
  console.log(`Total de áreas únicas: ${areas.length}`);

  for (const nome of areas) {
    await prisma.areaFormacao.upsert({ where: { nome }, update: {}, create: { nome } });
  }

  console.log('✅ Áreas inseridas com sucesso!');
}

// --- Funções de upsert reutilizáveis ---
async function upsertBarreira(descricao: string) {
  return prisma.barreira.upsert({ where: { descricao }, update: {}, create: { descricao } });
}
async function upsertAcessibilidade(descricao: string) {
  return prisma.acessibilidade.upsert({ where: { descricao }, update: {}, create: { descricao } });
}
async function upsertSubtipo(nome: string, tipoId: number) {
  return prisma.subtipoDeficiencia.upsert({ where: { tipoId_nome: { tipoId, nome } }, update: {}, create: { nome, tipoId } });
}

async function seedDeficiencia() {
  console.log('🌱 Inserindo tipos, subtipos, barreiras e acessibilidades...');

  // --- BARREIRAS E ACESSIBILIDADES AUDITIVA ---
  const barreirasAuditiva = await Promise.all([
    upsertBarreira("Falta de intérprete de Libras"),
    upsertBarreira("Falta de legendas em vídeos"),
    upsertBarreira("Avisos apenas sonoros (alarme, chamada, sinal)"),
    upsertBarreira("Falta de comunicação visual"),
    upsertBarreira("Máscaras que escondem boca (prejudicam leitura labial)"),
    upsertBarreira("Ambientes muito barulhentos (dificultam AASI/IC)"),
  ]);

  const acessAuditiva = await Promise.all([
    upsertAcessibilidade("Intérprete de Libras"),
    upsertAcessibilidade("Legendas automáticas/humanas"),
    upsertAcessibilidade("Avisos luminosos (alarme visual)"),
    upsertAcessibilidade("Painéis informativos"),
    upsertAcessibilidade("Máscara transparente em atendimentos"),
    upsertAcessibilidade("Treinamento da equipe para comunicação acessível"),
    upsertAcessibilidade("Chamadas por display eletrônico"),
    upsertAcessibilidade("Ambientes com menor ruído"),
    upsertAcessibilidade("Microfone direcional (para reuniões)"),
    upsertAcessibilidade("Sistemas FM / Bluetooth"),
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
  const motora = await prisma.tipoDeficiencia.upsert({ where: { nome: "Deficiência Física/Motora" }, update: {}, create: { nome: "Deficiência Física/Motora" } });
  const auditiva = await prisma.tipoDeficiencia.upsert({ where: { nome: "Deficiência Auditiva" }, update: {}, create: { nome: "Deficiência Auditiva" } });
  const visual = await prisma.tipoDeficiencia.upsert({ where: { nome: "Deficiência Visual" }, update: {}, create: { nome: "Deficiência Visual" } });
  const intelectual = await prisma.tipoDeficiencia.upsert({ where: { nome: "Deficiência Intelectual" }, update: {}, create: { nome: "Deficiência Intelectual" } });
  const psicossocial = await prisma.tipoDeficiencia.upsert({ where: { nome: "Deficiência Psicossocial" }, update: {}, create: { nome: "Deficiência Psicossocial" } });
  const tea = await prisma.tipoDeficiencia.upsert({ where: { nome: "Transtorno do Espectro Autista (TEA)" }, update: {}, create: { nome: "Transtorno do Espectro Autista (TEA)" } });

  // SUBTIPOS – Deficiência Física/Motora (completa do original)
  const subtiposMotora = await Promise.all([
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
  const dislexiaSubtipo = await upsertSubtipo("Dislexia", intelectual.id);

  const barreirasDislexia = await Promise.all([
    upsertBarreira("Textos longos"),
    upsertBarreira("Leitura rápida exigida"),
    upsertBarreira("Instruções complexas"),
  ]);

  const acessDislexia = await Promise.all([
    upsertAcessibilidade("Texto simplificado"),
    upsertAcessibilidade("Fontes legíveis"),
    upsertAcessibilidade("WCAG (layout limpo)"),
  ]);

  await prisma.subtipoBarreira.createMany({
    data: barreirasDislexia.map(bar => ({ subtipoId: dislexiaSubtipo.id, barreiraId: bar.id })),
    skipDuplicates: true,
  });
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasDislexia.flatMap(bar => acessDislexia.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id })) ),
    skipDuplicates: true,
  });

  // Barreiras gerais
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

  // Índices para vinculação (conforme original)
  const idxCadeiraRodas = [11,12,13,16,17,23,24,25];
  const idxMuletas = [0,1,2,3,4,5,6,7,8,9,10,14,15,16,17,18,19,20,21,22,25];
  const idxAmputSup = [4,5,7];
  const idxNeuromotoras = [16,17,18,19,20,21,22,23,24,25,26];

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

  // Vincular barreiras específicas a subtipos (conforme índices)
  await prisma.subtipoBarreira.createMany({
    data: idxCadeiraRodas.flatMap(i => {
      const s = subtiposMotora[i];
      return s ? barreirasCadeiraRodas.map(bar => ({ subtipoId: s.id, barreiraId: bar.id })) : [];
    }),
    skipDuplicates: true,
  });
  await prisma.subtipoBarreira.createMany({
    data: idxMuletas.flatMap(i => {
      const s = subtiposMotora[i];
      return s ? barreirasMuletas.map(bar => ({ subtipoId: s.id, barreiraId: bar.id })) : [];
    }),
    skipDuplicates: true,
  });
  await prisma.subtipoBarreira.createMany({
    data: idxAmputSup.flatMap(i => {
      const s = subtiposMotora[i];
      return s ? barreirasAmputSup.map(bar => ({ subtipoId: s.id, barreiraId: bar.id })) : [];
    }),
    skipDuplicates: true,
  });
  await prisma.subtipoBarreira.createMany({
    data: idxNeuromotoras.flatMap(i => {
      const s = subtiposMotora[i];
      return s ? barreirasNeuromotoras.map(bar => ({ subtipoId: s.id, barreiraId: bar.id })) : [];
    }),
    skipDuplicates: true,
  });

  // --- ACESSIBILIDADES DEFICIÊNCIA FÍSICA/MOTORA ---
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
  const acessMuletas = await Promise.all([
    upsertAcessibilidade("Piso antiderrapante"),
    upsertAcessibilidade("Tapete fixo com fita antiderrapante"),
    upsertAcessibilidade("Corrimão bilateral"),
    upsertAcessibilidade("Assentos de apoio ao longo do trajeto"),
    upsertAcessibilidade("Rampa suave (máx. 8,33%)"),
    upsertAcessibilidade("Portas leves ou automáticas"),
    upsertAcessibilidade("Áreas de descanso acessíveis"),
  ]);
  const acessAmputSup = await Promise.all([
    upsertAcessibilidade("Maçaneta tipo alavanca"),
    upsertAcessibilidade("Torneiras automáticas"),
    upsertAcessibilidade("Botões grandes / touch / pedal"),
    upsertAcessibilidade("Sistemas com acessibilidade digital (voz, atalho, ampliação)"),
    upsertAcessibilidade("Equipamentos que não exigem força de pinça"),
    upsertAcessibilidade("Automatização de portas"),
  ]);
  const acessNeuromotoras = await Promise.all([
    upsertAcessibilidade("Corrimão duplo"),
    upsertAcessibilidade("Assentos em rotas longas"),
    upsertAcessibilidade("Estações reguláveis"),
    upsertAcessibilidade("Ambientes com espaço para movimentação lenta"),
    upsertAcessibilidade("Portas com fechamento suave"),
    upsertAcessibilidade("Sistemas para evitar quedas (apoios laterais)"),
  ]);

  // Vincular barreiras ↔ acessibilidades
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasGerais.flatMap(bar => acessMotoraGerais.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id })) ),
    skipDuplicates: true,
  });
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasCadeiraRodas.flatMap(bar => acessCadeiraRodas.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id })) ),
    skipDuplicates: true,
  });
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasMuletas.flatMap(bar => acessMuletas.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id })) ),
    skipDuplicates: true,
  });
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasAmputSup.flatMap(bar => acessAmputSup.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id })) ),
    skipDuplicates: true,
  });
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasNeuromotoras.flatMap(bar => acessNeuromotoras.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id })) ),
    skipDuplicates: true,
  });

  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasAuditiva.flatMap(bar => acessAuditiva.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id })) ),
    skipDuplicates: true,
  });
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasVisual.flatMap(bar => acessVisual.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id })) ),
    skipDuplicates: true,
  });
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasIntelectual.flatMap(bar => acessIntelectual.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id })) ),
    skipDuplicates: true,
  });
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasPsicossocial.flatMap(bar => acessPsicossocial.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id })) ),
    skipDuplicates: true,
  });
  await prisma.barreiraAcessibilidade.createMany({
    data: barreirasTEA.flatMap(bar => acessTEA.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id })) ),
    skipDuplicates: true,
  });

  // Garantir que TODOS os subtipo tenham pelo menos uma barreira vinculada
  // (Alguns grupos já tiveram vinculações específicas; aqui asseguramos os restantes)
  await prisma.subtipoBarreira.createMany({
    data: subtiposAuditiva.flatMap(s => barreirasAuditiva.map(b => ({ subtipoId: s.id, barreiraId: b.id }))),
    skipDuplicates: true,
  });
  await prisma.subtipoBarreira.createMany({
    data: subtiposVisual.flatMap(s => barreirasVisual.map(b => ({ subtipoId: s.id, barreiraId: b.id }))),
    skipDuplicates: true,
  });
  await prisma.subtipoBarreira.createMany({
    data: subtiposIntelectual.flatMap(s => barreirasIntelectual.map(b => ({ subtipoId: s.id, barreiraId: b.id }))).concat(
      // já vinculamos Dislexia anteriormente, mas concat não faz duplicatas devido a skipDuplicates
      []
    ),
    skipDuplicates: true,
  });
  await prisma.subtipoBarreira.createMany({
    data: subtiposPsicossocial.flatMap(s => barreirasPsicossocial.map(b => ({ subtipoId: s.id, barreiraId: b.id }))),
    skipDuplicates: true,
  });
  await prisma.subtipoBarreira.createMany({
    data: subtiposTEA.flatMap(s => barreirasTEA.map(b => ({ subtipoId: s.id, barreiraId: b.id }))),
    skipDuplicates: true,
  });

  console.log('✅ Tipos, subtipos, barreiras e acessibilidades inseridos e vinculados.');
}

async function seedCandidatosVagas() {
  console.log('🌱 Inserindo empresas, candidatos, áreas e vagas de exemplo...');

  // Empresas para as vagas
  const empresa1 = await prisma.empresa.upsert({ where: { id: 5 }, update: {}, create: { id: 5, nome: 'Empresa 1', email: 'empresa1@email.com' } });
  const empresa2 = await prisma.empresa.upsert({ where: { id: 6 }, update: {}, create: { id: 6, nome: 'Empresa 2', email: 'empresa2@email.com' } });
  const empresa3 = await prisma.empresa.upsert({ where: { id: 7 }, update: {}, create: { id: 7, nome: 'Empresa 3', email: 'empresa3@email.com' } });

  // Áreas de formação
  const areaAdministracao = await prisma.areaFormacao.upsert({ where: { nome: 'Administração' }, update: {}, create: { nome: 'Administração' } });
  const areaLogistica = await prisma.areaFormacao.upsert({ where: { nome: 'Logística' }, update: {}, create: { nome: 'Logística' } });
  const areaAtendimento = await prisma.areaFormacao.upsert({ where: { nome: 'Atendimento' }, update: {}, create: { nome: 'Atendimento' } });

  // Candidatos
  await prisma.candidato.upsert({ where: { id: 1 }, update: {}, create: {
    id: 1,
    nome: 'Fernando Moises',
    email: 'fernando@email.com',
    senhaHash: await bcrypt.hash('123456', 10),
    escolaridade: 'Ensino Superior Completo',
    curso: 'Administração',
    cidade: 'São Paulo',
    estado: 'SP',
    aceitaMudanca: true,
    aceitaViajar: true,
  }});
  await prisma.candidato.upsert({ where: { id: 2 }, update: {}, create: {
    id: 2,
    nome: 'Maria da Silva',
    email: 'maria@email.com',
    senhaHash: await bcrypt.hash('123456', 10),
    escolaridade: 'Ensino Superior Completo',
    curso: 'Administração',
    cidade: 'Campinas',
    estado: 'SP',
    aceitaMudanca: true,
    aceitaViajar: true,
  }});
  await prisma.candidato.upsert({ where: { id: 3 }, update: {}, create: {
    id: 3,
    nome: 'João Souza',
    email: 'joao@email.com',
    senhaHash: await bcrypt.hash('123456', 10),
    escolaridade: 'Ensino Médio Completo',
    curso: 'Logística',
    cidade: 'São Paulo',
    estado: 'SP',
    aceitaMudanca: false,
    aceitaViajar: false,
  }});

  // Associar candidatos às áreas de formação
  await prisma.candidatoAreaFormacao.upsert({ where: { candidatoId_areaId: { candidatoId: 2, areaId: areaAdministracao.id } }, update: {}, create: { candidatoId: 2, areaId: areaAdministracao.id } });
  await prisma.candidatoAreaFormacao.upsert({ where: { candidatoId_areaId: { candidatoId: 3, areaId: areaLogistica.id } }, update: {}, create: { candidatoId: 3, areaId: areaLogistica.id } });

  // Vagas
  await prisma.vaga.upsert({ where: { id: 10 }, update: {}, create: { id: 10, empresaId: empresa1.id, titulo: 'Analista Administrativo', escolaridade: 'Ensino Superior Completo', cidade: 'São Paulo', estado: 'SP', areaId: areaAdministracao.id } });
  await prisma.vaga.upsert({ where: { id: 11 }, update: {}, create: { id: 11, empresaId: empresa2.id, titulo: 'Auxiliar de Logística', escolaridade: 'Ensino Médio Completo', cidade: 'Campinas', estado: 'SP', areaId: areaLogistica.id } });
  await prisma.vaga.upsert({ where: { id: 12 }, update: {}, create: { id: 12, empresaId: empresa3.id, titulo: 'Recepcionista', escolaridade: 'Ensino Médio Completo', cidade: 'Campinas', estado: 'SP', areaId: areaAtendimento.id } });

  console.log('✅ Empresas, candidatos e vagas criados.');
}

async function main() {
  // Seed do admin (opcional)
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'Administrador';
  if (adminEmail && adminPassword) {
    const senhaHash = await bcrypt.hash(adminPassword, 10);
    await prisma.administrador.upsert({ where: { email: adminEmail }, update: { senhaHash, nome: adminName, isActive: true }, create: { email: adminEmail, senhaHash, nome: adminName, isActive: true } });
    console.log('👑 Administrador inserido/atualizado:', adminEmail);
  } else {
    console.warn('⚠️ Variáveis ADMIN_EMAIL e ADMIN_PASSWORD não definidas no .env. Admin não criado.');
  }

  await upsertAreas();
  await seedDeficiencia();
  await seedCandidatosVagas();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());