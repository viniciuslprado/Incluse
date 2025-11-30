
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function seedDeficiencia() {
	// Tipos
	const motora = await prisma.tipoDeficiencia.create({ data: { nome: "Deficiência Física/Motora" } });
	const auditiva = await prisma.tipoDeficiencia.create({ data: { nome: "Deficiência Auditiva" } });
	const visual = await prisma.tipoDeficiencia.create({ data: { nome: "Deficiência Visual" } });
	const intelectual = await prisma.tipoDeficiencia.create({ data: { nome: "Deficiência Intelectual" } });
	const psicossocial = await prisma.tipoDeficiencia.create({ data: { nome: "Deficiência Psicossocial" } });
	const tea = await prisma.tipoDeficiencia.create({ data: { nome: "Transtorno do Espectro Autista (TEA)" } });

	// SUBTIPOS – Deficiência Física/Motora (Lista Final)
	const subtiposMotora = await prisma.$transaction([
			// SUBTIPOS – Deficiência Auditiva
			const subtiposAuditiva = await prisma.$transaction([
				prisma.subtipoDeficiencia.create({ data: { nome: "Surdez Neurossensorial Leve", tipoId: auditiva.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Surdez Neurossensorial Moderada", tipoId: auditiva.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Surdez Neurossensorial Severa", tipoId: auditiva.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Surdez Profunda", tipoId: auditiva.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Surdez Condutiva Leve", tipoId: auditiva.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Surdez Condutiva Moderada", tipoId: auditiva.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Surdez Condutiva Severa", tipoId: auditiva.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Perda Auditiva Unilateral Leve", tipoId: auditiva.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Perda Auditiva Unilateral Severa", tipoId: auditiva.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Usuário de Aparelho Auditivo (AASI)", tipoId: auditiva.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Usuário de Implante Coclear", tipoId: auditiva.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Pessoa que se comunica prioritariamente por Libras", tipoId: auditiva.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Pessoa bilíngue (Libras + Português)", tipoId: auditiva.id } }),
			]);

			// SUBTIPOS – Deficiência Visual
			const subtiposVisual = await prisma.$transaction([
				prisma.subtipoDeficiencia.create({ data: { nome: "Cegueira Total", tipoId: visual.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Baixa Visão Leve", tipoId: visual.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Baixa Visão Moderada", tipoId: visual.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Baixa Visão Severa", tipoId: visual.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Visão Tubular", tipoId: visual.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Visão Central Preservada com Periférica Reduzida", tipoId: visual.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Visão Periférica Preservada com Central Reduzida", tipoId: visual.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Pessoa usuária de Bengala", tipoId: visual.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Pessoa usuária de Cão-guia", tipoId: visual.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Pessoa com fotossensibilidade grave", tipoId: visual.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Deficiência visual progressiva (ex.: glaucoma avançado)", tipoId: visual.id } }),
			]);

			// SUBTIPOS – Deficiência Intelectual
			const subtiposIntelectual = await prisma.$transaction([
				prisma.subtipoDeficiencia.create({ data: { nome: "Deficiência Intelectual Leve", tipoId: intelectual.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Deficiência Intelectual Moderada", tipoId: intelectual.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Deficiência Intelectual com boa autonomia social", tipoId: intelectual.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Deficiência Intelectual com limitação cognitiva leve", tipoId: intelectual.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Transtorno Global do Desenvolvimento com prejuízo cognitivo leve", tipoId: intelectual.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Condições genéticas associadas (ex.: Síndrome de Down – leve/moderada)", tipoId: intelectual.id } }),
			]);

			// SUBTIPOS – Deficiência Psicossocial
			const subtiposPsicossocial = await prisma.$transaction([
				prisma.subtipoDeficiencia.create({ data: { nome: "Transtorno Bipolar estabilizado", tipoId: psicossocial.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Esquizofrenia estabilizada", tipoId: psicossocial.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Transtorno Esquizoafetivo", tipoId: psicossocial.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Transtorno Depressivo Maior recorrente", tipoId: psicossocial.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Transtorno de Ansiedade Generalizada severa", tipoId: psicossocial.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "TOC severo estabilizado", tipoId: psicossocial.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Transtorno de Personalidade com prejuízo funcional leve e controlado", tipoId: psicossocial.id } }),
			]);

			// SUBTIPOS – TEA
			const subtiposTEA = await prisma.$transaction([
				prisma.subtipoDeficiencia.create({ data: { nome: "TEA Nível 1 de suporte (leve)", tipoId: tea.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "TEA Nível 2 moderado", tipoId: tea.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Autistas com comunicação verbal funcional", tipoId: tea.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Autistas com sensibilidade sensorial acentuada", tipoId: tea.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Autistas com dificuldade de interação social", tipoId: tea.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Autistas com hiperfoco e habilidade analítica", tipoId: tea.id } }),
				prisma.subtipoDeficiencia.create({ data: { nome: "Autistas com rotinas rígidas", tipoId: tea.id } }),
			]);

			// BARREIRAS E ACESSIBILIDADES para cada tipo (exemplo: auditiva)
			// Barreiras Auditiva
			const barreirasAuditiva = await prisma.$transaction([
				prisma.barreira.create({ data: { descricao: "Falta de intérprete de Libras" } }),
				prisma.barreira.create({ data: { descricao: "Falta de legendas em vídeos" } }),
				prisma.barreira.create({ data: { descricao: "Avisos apenas sonoros (alarme, chamada, sinal)" } }),
				prisma.barreira.create({ data: { descricao: "Falta de comunicação visual" } }),
				prisma.barreira.create({ data: { descricao: "Máscaras que escondem boca (prejudicam leitura labial)" } }),
				prisma.barreira.create({ data: { descricao: "Ambientes muito barulhentos (dificultam AASI/IC)" } }),
			]);
			// Barreiras Visual
			const barreirasVisual = await prisma.$transaction([
				prisma.barreira.create({ data: { descricao: "Falta de sinalização tátil" } }),
				prisma.barreira.create({ data: { descricao: "Falta de contraste visual" } }),
				prisma.barreira.create({ data: { descricao: "Escadas sem piso tátil" } }),
				prisma.barreira.create({ data: { descricao: "Objetos suspensos ou obstáculos inesperados" } }),
				prisma.barreira.create({ data: { descricao: "Sites/aplicações sem acessibilidade digital" } }),
				prisma.barreira.create({ data: { descricao: "Documentos apenas impressos" } }),
				prisma.barreira.create({ data: { descricao: "Ambientes pouco iluminados" } }),
				prisma.barreira.create({ data: { descricao: "Mudanças frequentes no layout (desorientação)" } }),
			]);
			// Barreiras Intelectual
			const barreirasIntelectual = await prisma.$transaction([
				prisma.barreira.create({ data: { descricao: "Instruções complexas sem apoio visual" } }),
				prisma.barreira.create({ data: { descricao: "Treinamentos rápidos demais" } }),
				prisma.barreira.create({ data: { descricao: "Rotinas sem previsibilidade" } }),
				prisma.barreira.create({ data: { descricao: "Ambientes com muitas distrações" } }),
				prisma.barreira.create({ data: { descricao: "Excesso de etapas sem acompanhamento" } }),
				prisma.barreira.create({ data: { descricao: "Comunicação abstrata ou ambígua" } }),
			]);
			// Barreiras Psicossocial
			const barreirasPsicossocial = await prisma.$transaction([
				prisma.barreira.create({ data: { descricao: "Ambientes muito estressantes" } }),
				prisma.barreira.create({ data: { descricao: "Pressão excessiva e comunicação agressiva" } }),
				prisma.barreira.create({ data: { descricao: "Falta de previsibilidade" } }),
				prisma.barreira.create({ data: { descricao: "Jornadas muito extensas" } }),
				prisma.barreira.create({ data: { descricao: "Falta de pausas programadas" } }),
				prisma.barreira.create({ data: { descricao: "Exposição a gatilhos sensoriais (ruído, luz intensa)" } }),
			]);
			// Barreiras TEA
			const barreirasTEA = await prisma.$transaction([
				prisma.barreira.create({ data: { descricao: "Ruído excessivo" } }),
				prisma.barreira.create({ data: { descricao: "Iluminação forte/fluorescente" } }),
				prisma.barreira.create({ data: { descricao: "Mudanças de rotina sem aviso" } }),
				prisma.barreira.create({ data: { descricao: "Comunicação ambígua" } }),
				prisma.barreira.create({ data: { descricao: "Regras implícitas de convivência" } }),
				prisma.barreira.create({ data: { descricao: "Demandas multitarefa" } }),
				prisma.barreira.create({ data: { descricao: "Ambientes caóticos" } }),
			]);

			// ACESSIBILIDADES Auditiva
			const acessAuditiva = await prisma.$transaction([
				prisma.acessibilidade.create({ data: { descricao: "Intérprete de Libras" } }),
				prisma.acessibilidade.create({ data: { descricao: "Legendas automáticas/humanas" } }),
				prisma.acessibilidade.create({ data: { descricao: "Avisos luminosos (alarme visual)" } }),
				prisma.acessibilidade.create({ data: { descricao: "Painéis informativos" } }),
				prisma.acessibilidade.create({ data: { descricao: "Máscara transparente em atendimentos" } }),
				prisma.acessibilidade.create({ data: { descricao: "Treinamento da equipe para comunicação acessível" } }),
				prisma.acessibilidade.create({ data: { descricao: "Chamadas por display eletrônico" } }),
				prisma.acessibilidade.create({ data: { descricao: "Ambientes com menor ruído" } }),
				prisma.acessibilidade.create({ data: { descricao: "Microfone direcional (para reuniões)" } }),
				prisma.acessibilidade.create({ data: { descricao: "Sistemas FM / Bluetooth" } }),
			]);
			// ACESSIBILIDADES Visual
			const acessVisual = await prisma.$transaction([
				prisma.acessibilidade.create({ data: { descricao: "Piso tátil direcional e de alerta" } }),
				prisma.acessibilidade.create({ data: { descricao: "Corrimão bilateral com indicação Braille" } }),
				prisma.acessibilidade.create({ data: { descricao: "Alto contraste nas sinalizações" } }),
				prisma.acessibilidade.create({ data: { descricao: "Mapas táteis" } }),
				prisma.acessibilidade.create({ data: { descricao: "Etiquetas táteis/Braille" } }),
				prisma.acessibilidade.create({ data: { descricao: "Cão-guia permitido" } }),
				prisma.acessibilidade.create({ data: { descricao: "Layout previsível sem obstáculos" } }),
				prisma.acessibilidade.create({ data: { descricao: "Acessibilidade WCAG" } }),
				prisma.acessibilidade.create({ data: { descricao: "Leitor de tela" } }),
				prisma.acessibilidade.create({ data: { descricao: "Navegação por teclado" } }),
				prisma.acessibilidade.create({ data: { descricao: "Conteúdo com descrição textual" } }),
				prisma.acessibilidade.create({ data: { descricao: "Formularios acessíveis" } }),
				prisma.acessibilidade.create({ data: { descricao: "Opção de zoom e contraste" } }),
			]);
			// ACESSIBILIDADES Intelectual
			const acessIntelectual = await prisma.$transaction([
				prisma.acessibilidade.create({ data: { descricao: "Instruções passo a passo" } }),
				prisma.acessibilidade.create({ data: { descricao: "Apoio visual (ícones, placas, fluxos)" } }),
				prisma.acessibilidade.create({ data: { descricao: "Treinamento prático com demonstração" } }),
				prisma.acessibilidade.create({ data: { descricao: "Rotina organizada e previsível" } }),
				prisma.acessibilidade.create({ data: { descricao: "Checklists simples" } }),
				prisma.acessibilidade.create({ data: { descricao: "Mapa de tarefas" } }),
				prisma.acessibilidade.create({ data: { descricao: "Acompanhamento inicial (job coach temporário)" } }),
			]);
			// ACESSIBILIDADES Psicossocial
			const acessPsicossocial = await prisma.$transaction([
				prisma.acessibilidade.create({ data: { descricao: "Ambiente com estímulos reduzidos" } }),
				prisma.acessibilidade.create({ data: { descricao: "Pausas programadas" } }),
				prisma.acessibilidade.create({ data: { descricao: "Rotina estável" } }),
				prisma.acessibilidade.create({ data: { descricao: "Comunicação empática" } }),
				prisma.acessibilidade.create({ data: { descricao: "Política anti-assédio" } }),
				prisma.acessibilidade.create({ data: { descricao: "Treinamentos claros" } }),
				prisma.acessibilidade.create({ data: { descricao: "Feedback estruturado e previsível" } }),
			]);
			// ACESSIBILIDADES TEA
			const acessTEA = await prisma.$transaction([
				prisma.acessibilidade.create({ data: { descricao: "Espaço silencioso" } }),
				prisma.acessibilidade.create({ data: { descricao: "Iluminação suave" } }),
				prisma.acessibilidade.create({ data: { descricao: "Comunicação objetiva" } }),
				prisma.acessibilidade.create({ data: { descricao: "Previsibilidade e rotina clara" } }),
				prisma.acessibilidade.create({ data: { descricao: "Treinamentos estruturados" } }),
				prisma.acessibilidade.create({ data: { descricao: "Feedback direto" } }),
				prisma.acessibilidade.create({ data: { descricao: "Instruções escritas" } }),
				prisma.acessibilidade.create({ data: { descricao: "Flexibilidade sensorial" } }),
			]);

			// VÍNCULOS (exemplo: todas as barreiras gerais para todos os subtipos daquele tipo)
			await prisma.subtipoBarreira.createMany({
				data: subtiposAuditiva.flatMap(sub => barreirasAuditiva.map(bar => ({ subtipoId: sub.id, barreiraId: bar.id }))),
				skipDuplicates: true,
			});
			await prisma.subtipoBarreira.createMany({
				data: subtiposVisual.flatMap(sub => barreirasVisual.map(bar => ({ subtipoId: sub.id, barreiraId: bar.id }))),
				skipDuplicates: true,
			});
			await prisma.subtipoBarreira.createMany({
				data: subtiposIntelectual.flatMap(sub => barreirasIntelectual.map(bar => ({ subtipoId: sub.id, barreiraId: bar.id }))),
				skipDuplicates: true,
			});
			await prisma.subtipoBarreira.createMany({
				data: subtiposPsicossocial.flatMap(sub => barreirasPsicossocial.map(bar => ({ subtipoId: sub.id, barreiraId: bar.id }))),
				skipDuplicates: true,
			});
			await prisma.subtipoBarreira.createMany({
				data: subtiposTEA.flatMap(sub => barreirasTEA.map(bar => ({ subtipoId: sub.id, barreiraId: bar.id }))),
				skipDuplicates: true,
			});

			// VÍNCULOS barreira-acessibilidade (exemplo: todas as acessibilidades gerais para todas as barreiras gerais daquele tipo)
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
		// A) Amputações / Ausência de membros
		prisma.subtipoDeficiencia.create({ data: { nome: "Amputação Transfemoral (Acima do Joelho – AK)", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Amputação Transtibial (Abaixo do Joelho – BK)", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Amputação Parcial do Pé", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Amputação Hemipelvectomia", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Amputação de Membro Superior – Transumeral", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Amputação de Membro Superior – Transradial", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Ausência Congênita de Membro Inferior", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Ausência Congênita de Membro Superior", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Amputação unilateral — com uso de muletas", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Amputação unilateral — sem muletas", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Amputação bilateral — uso de prótese", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Amputação bilateral — uso de cadeira de rodas", tipoId: motora.id } }),
		// B) Mobilidade Reduzida / Ortopédica
		prisma.subtipoDeficiencia.create({ data: { nome: "Usuário de cadeira de rodas manual", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Usuário de cadeira de rodas motorizada", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Usuário de andador", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Usuário de muletas permanentes", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Hemiparesia (paralisia parcial de um lado)", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Paraparesia (fraqueza parcial em ambas as pernas)", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Tetraparesia leve", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Má formação ortopédica com limitação de mobilidade", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Artrose ou lesão grave com redução permanente", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Escoliose grave / deformidade que limita mobilidade", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Osteogênese Imperfeita (leve/moderada — capaz de trabalhar)", tipoId: motora.id } }),
		// C) Deficiências Neuromotoras
		prisma.subtipoDeficiencia.create({ data: { nome: "Paralisia Cerebral leve ou moderada (não cognitiva)", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Lesão Medular parcial (nível funcional)", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Espinha Bífida com mobilidade preservada parcial", tipoId: motora.id } }),
		prisma.subtipoDeficiencia.create({ data: { nome: "Distrofias musculares leves/moderadas (com autonomia laboral)", tipoId: motora.id } }),
	]);

	// BARREIRAS GERAIS (aplicação: todos os subtipos)
	const barreirasGerais = await prisma.$transaction([
		prisma.barreira.create({ data: { descricao: "Escadas sem alternativa acessível" } }),
		prisma.barreira.create({ data: { descricao: "Falta de rampas" } }),
		prisma.barreira.create({ data: { descricao: "Porta estreita" } }),
		prisma.barreira.create({ data: { descricao: "Piso irregular" } }),
		prisma.barreira.create({ data: { descricao: "Falta de elevador acessível" } }),
		prisma.barreira.create({ data: { descricao: "Desníveis no piso" } }),
		prisma.barreira.create({ data: { descricao: "Banheiro sem barras" } }),
		prisma.barreira.create({ data: { descricao: "Falta de espaço de circulação" } }),
		prisma.barreira.create({ data: { descricao: "Mobiliário bloqueando passagem" } }),
		prisma.barreira.create({ data: { descricao: "Abertura de porta pesada" } }),
		prisma.barreira.create({ data: { descricao: "Altura inadequada de interruptores" } }),
		prisma.barreira.create({ data: { descricao: "Falta de estacionamento PCD" } }),
		prisma.barreira.create({ data: { descricao: "Rotas longas sem descanso" } }),
	]);

	// BARREIRAS ESPECÍFICAS
	const barreirasCadeiraRodas = await prisma.$transaction([
		prisma.barreira.create({ data: { descricao: "Rampas com inclinação inadequada" } }),
		prisma.barreira.create({ data: { descricao: "Elevador com botões inacessíveis" } }),
		prisma.barreira.create({ data: { descricao: "Mesas sem espaço para encaixar cadeira" } }),
		prisma.barreira.create({ data: { descricao: "Falta de espaço de giro (1,50m)" } }),
		prisma.barreira.create({ data: { descricao: "Banheiro com espaço frontal insuficiente" } }),
		prisma.barreira.create({ data: { descricao: "Falta de plataforma elevatória" } }),
		prisma.barreira.create({ data: { descricao: "Balcões muito altos" } }),
	]);
	const barreirasMuletasAndadorProtese = await prisma.$transaction([
		prisma.barreira.create({ data: { descricao: "Piso escorregadio" } }),
		prisma.barreira.create({ data: { descricao: "Tapetes soltos" } }),
		prisma.barreira.create({ data: { descricao: "Percurso longo sem pontos de descanso" } }),
		prisma.barreira.create({ data: { descricao: "Rampas muito inclinadas (difícil com muletas)" } }),
		prisma.barreira.create({ data: { descricao: "Portas pesadas" } }),
		prisma.barreira.create({ data: { descricao: "Desníveis pequenos (2–3 cm) que atrapalham próteses" } }),
		prisma.barreira.create({ data: { descricao: "Falta de corrimão" } }),
		prisma.barreira.create({ data: { descricao: "Cadeiras não ergonômicas" } }),
	]);
	const barreirasAmputacaoSup = await prisma.$transaction([
		prisma.barreira.create({ data: { descricao: "Maçanetas redondas" } }),
		prisma.barreira.create({ data: { descricao: "Portas sem alavanca" } }),
		prisma.barreira.create({ data: { descricao: "Botões pequenos/difíceis" } }),
		prisma.barreira.create({ data: { descricao: "Equipamentos que exigem força de pinça" } }),
		prisma.barreira.create({ data: { descricao: "Torneiras manuais" } }),
		prisma.barreira.create({ data: { descricao: "Sistemas que exigem digitação extensiva sem adaptação" } }),
	]);
	const barreirasNeuromotoras = await prisma.$transaction([
		prisma.barreira.create({ data: { descricao: "Falta de corrimão duplo" } }),
		prisma.barreira.create({ data: { descricao: "Falta de assentos de apoio nas rotas" } }),
		prisma.barreira.create({ data: { descricao: "Trajetos longos sem pausas" } }),
		prisma.barreira.create({ data: { descricao: "Portas rápidas que fecham sozinhas" } }),
		prisma.barreira.create({ data: { descricao: "Estações de trabalho sem ergonomia ajustável" } }),
	]);

	// ACESSIBILIDADES GERAIS
	const acessGeral = await prisma.$transaction([
		prisma.acessibilidade.create({ data: { descricao: "Rampas com inclinação correta (NBR 9050)" } }),
		prisma.acessibilidade.create({ data: { descricao: "+80cm portas com maçaneta de alavanca" } }),
		prisma.acessibilidade.create({ data: { descricao: "Estacionamento PCD sinalizado" } }),
		prisma.acessibilidade.create({ data: { descricao: "Banheiro com barras verticais e horizontais" } }),
		prisma.acessibilidade.create({ data: { descricao: "Layout com no mínimo 90cm de circulação" } }),
		prisma.acessibilidade.create({ data: { descricao: "Espaço organizado sem obstáculos" } }),
		prisma.acessibilidade.create({ data: { descricao: "Sinalização visual clara" } }),
		prisma.acessibilidade.create({ data: { descricao: "Rotas acessíveis definidas" } }),
	]);
	// ACESSIBILIDADES CADEIRA DE RODAS
	const acessCadeiraRodas = await prisma.$transaction([
		prisma.acessibilidade.create({ data: { descricao: "Porta com 90cm" } }),
		prisma.acessibilidade.create({ data: { descricao: "Mesa com altura 73–85cm" } }),
		prisma.acessibilidade.create({ data: { descricao: "Espaço de giro (1,50m)" } }),
		prisma.acessibilidade.create({ data: { descricao: "Elevador com botões a 1,10m" } }),
		prisma.acessibilidade.create({ data: { descricao: "Plataforma elevatória" } }),
		prisma.acessibilidade.create({ data: { descricao: "Rampa com corrimão duplo" } }),
		prisma.acessibilidade.create({ data: { descricao: "Banheiro com 1,20m de aproximação frontal" } }),
		prisma.acessibilidade.create({ data: { descricao: "Estação de trabalho regulável" } }),
	]);
	// ACESSIBILIDADES MULETA/ANDADOR/PRÓTESE
	const acessMuletaAndadorProtese = await prisma.$transaction([
		prisma.acessibilidade.create({ data: { descricao: "Piso antiderrapante" } }),
		prisma.acessibilidade.create({ data: { descricao: "Tapete fixo com fita antiderrapante" } }),
		prisma.acessibilidade.create({ data: { descricao: "Corrimão bilateral" } }),
		prisma.acessibilidade.create({ data: { descricao: "Assentos de apoio ao longo do trajeto" } }),
		prisma.acessibilidade.create({ data: { descricao: "Rampa suave (máx. 8,33%)" } }),
		prisma.acessibilidade.create({ data: { descricao: "Portas leves ou automáticas" } }),
		prisma.acessibilidade.create({ data: { descricao: "Áreas de descanso acessíveis" } }),
	]);
	// ACESSIBILIDADES AMPUTAÇÃO SUPERIOR
	const acessAmputacaoSup = await prisma.$transaction([
		prisma.acessibilidade.create({ data: { descricao: "Maçaneta tipo alavanca" } }),
		prisma.acessibilidade.create({ data: { descricao: "Torneiras automáticas" } }),
		prisma.acessibilidade.create({ data: { descricao: "Botões grandes / touch / pedal" } }),
		prisma.acessibilidade.create({ data: { descricao: "Sistemas com acessibilidade digital (voz, atalho, ampliação)" } }),
		prisma.acessibilidade.create({ data: { descricao: "Equipamentos que não exigem força de pinça" } }),
		prisma.acessibilidade.create({ data: { descricao: "Automatização de portas" } }),
	]);
	// ACESSIBILIDADES NEUROMOTORAS
	const acessNeuromotoras = await prisma.$transaction([
		prisma.acessibilidade.create({ data: { descricao: "Corrimão duplo" } }),
		prisma.acessibilidade.create({ data: { descricao: "Assentos em rotas longas" } }),
		prisma.acessibilidade.create({ data: { descricao: "Estações reguláveis" } }),
		prisma.acessibilidade.create({ data: { descricao: "Ambientes com espaço para movimentação lenta" } }),
		prisma.acessibilidade.create({ data: { descricao: "Portas com fechamento suave" } }),
		prisma.acessibilidade.create({ data: { descricao: "Sistemas para evitar quedas (apoios laterais)" } }),
	]);

	// Aqui você pode criar os vínculos subtipo-barreira e barreira-acessibilidade conforme a lógica desejada
	// Exemplo: vincular todas as barreiras gerais a todos os subtipos
	const allSubtipos = subtiposMotora;
	const allBarreirasGerais = barreirasGerais;
	await prisma.subtipoBarreira.createMany({
		data: allSubtipos.flatMap(sub => allBarreirasGerais.map(bar => ({ subtipoId: sub.id, barreiraId: bar.id }))),
		skipDuplicates: true,
	});

	// Exemplo: vincular barreiras específicas a grupos de subtipos (ajuste conforme sua lógica)
	// ...

	// Exemplo: vincular todas as acessibilidades gerais a todas as barreiras gerais
	await prisma.barreiraAcessibilidade.createMany({
		data: allBarreirasGerais.flatMap(bar => acessGeral.map(acess => ({ barreiraId: bar.id, acessibilidadeId: acess.id }))),
		skipDuplicates: true,
	});

	// ...vincule barreiras/acessibilidades específicas conforme sua lógica

	return {
		tipos: { motora, auditiva, visual, intelectual, psicossocial, tea },
		subtipos: {
			motora: subtiposMotora,
			auditiva: subtiposAuditiva,
			visual: subtiposVisual,
			intelectual: subtiposIntelectual,
			psicossocial: subtiposPsicossocial,
			tea: subtiposTEA,
		},
		barreiras: [
			...barreirasGerais,
			...barreirasCadeiraRodas,
			...barreirasMuletasAndadorProtese,
			...barreirasAmputacaoSup,
			...barreirasNeuromotoras,
			...barreirasAuditiva,
			...barreirasVisual,
			...barreirasIntelectual,
			...barreirasPsicossocial,
			...barreirasTEA,
		],
		acessibilidades: [
			...acessGeral,
			...acessCadeiraRodas,
			...acessMuletaAndadorProtese,
			...acessAmputacaoSup,
			...acessNeuromotoras,
			...acessAuditiva,
			...acessVisual,
			...acessIntelectual,
			...acessPsicossocial,
			...acessTEA,
		],
	};
}
}
