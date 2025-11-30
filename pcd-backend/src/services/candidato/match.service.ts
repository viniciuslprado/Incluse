// Função para normalizar escolaridade para o formato do ranking
function normalizarEscolaridade(valor: string): string {
  if (!valor) return '';
  const mapa: Record<string, string> = {
    'ensino fundamental incompleto': 'fundamental_incompleto',
    'ensino fundamental completo': 'fundamental',
    'ensino médio incompleto': 'medio',
    'ensino medio incompleto': 'medio',
    'ensino médio completo': 'medio',
    'ensino medio completo': 'medio',
    'ensino técnico': 'tecnico',
    'ensino superior incompleto': 'superior',
    'ensino superior completo': 'superior',
    'pós-graduação': 'pos',
    'pos-graduação': 'pos',
    'mestrado': 'mestrado',
    'doutorado': 'doutorado',
    // Adicione outros formatos conforme necessário
  };
  const valorNorm = valor.trim().toLowerCase();
  return mapa[valorNorm] || valorNorm.replace(/\s/g, '_');
}
// Serviço de match de vagas para candidato
import { CandidatosRepo } from "../../repositories/candidato/candidatos.repo";
import { VagasRepo } from "../../repositories/common/vagas.repo";

const escolaridadeRanking: Record<string, number> = {
  "fundamental_incompleto": 0,
  "fundamental": 1,
  "medio": 2,
  "tecnico": 3,
  "superior": 4,
  "pos": 5,
  "mestrado": 6,
  "doutorado": 7
};

function mapearBarreiraParaAcessibilidade(barreira: string) {
  const mapa: Record<string, string> = {
    "auditiva": "libras",
    "visual": "audiodescricao",
    "motora": "acesso_fisico",
    "intelectual": "linguagem_simples",
    "psicossocial": "ambiente_estruturado"
  };
  return mapa[barreira];
}

function matchVaga(candidato: any, vaga: any): boolean {
  // DEBUG: log escolaridade do candidato e da vaga (bruto e normalizado)
  let escolaridadeVagaBruta = vaga.escolaridadeMinima || vaga.escolaridade || (vaga.requisitos && vaga.requisitos.formacao) || '';
  let escolaridadeCandidatoBruta = candidato.escolaridade;
  const escolaridadeCandidatoNorm = normalizarEscolaridade(escolaridadeCandidatoBruta);
  const escolaridadeVagaNorm = normalizarEscolaridade(escolaridadeVagaBruta);
  console.log('[MATCH DEBUG] Escolaridade Candidato:', escolaridadeCandidatoBruta, '| Normalizada:', escolaridadeCandidatoNorm);
  console.log('[MATCH DEBUG] Escolaridade Vaga:', escolaridadeVagaBruta, '| Normalizada:', escolaridadeVagaNorm);

  // 1. Verificar se há pelo menos um subtipo compatível
  // Vaga pode ter subtipos em subtiposAceitos ou subtipoIds
  let vagaSubtipos: number[] = [];
  if (Array.isArray(vaga.subtiposAceitos) && vaga.subtiposAceitos.length > 0) {
    vagaSubtipos = vaga.subtiposAceitos.map((s: any) => s.subtipo?.id || s.subtipoId || s.id).filter(Boolean);
  } else if (Array.isArray(vaga.subtipoIds)) {
    vagaSubtipos = vaga.subtipoIds;
  }
  let candidatoSubtipos: number[] = [];
  if (Array.isArray(candidato.subtipos)) {
    candidatoSubtipos = candidato.subtipos.map((s: any) => s.subtipo?.id || s.subtipoId || s.id).filter(Boolean);
  }
  // Se a vaga exige subtipos e o candidato não tem nenhum compatível, não faz match
  if (vagaSubtipos.length > 0 && candidatoSubtipos.length > 0) {
    const temSubtipoCompativel = candidatoSubtipos.some((id) => vagaSubtipos.includes(id));
    if (!temSubtipoCompativel) return false;
  } else if (vagaSubtipos.length > 0 && candidatoSubtipos.length === 0) {
    // Vaga exige subtipo, candidato não tem nenhum
    return false;
  }

  // 2. Verificar acessibilidades
  if (!Array.isArray(vaga.acessibilidades)) return false;
  for (const barreira of candidato.barreiras || []) {
    const acessibilidadeNecessaria = mapearBarreiraParaAcessibilidade(barreira);
    if (!acessibilidadeNecessaria || !vaga.acessibilidades.includes(acessibilidadeNecessaria)) {
      return false;
    }
  }

  // 3. Verificar escolaridade mínima (normalizando)
  const candidatoRank = escolaridadeRanking[escolaridadeCandidatoNorm];
  const vagaRank = escolaridadeRanking[escolaridadeVagaNorm];
  // DEBUG: log ranks
  console.log('[MATCH DEBUG] Ranks:', { candidatoRank, vagaRank, escolaridadeCandidatoNorm, escolaridadeVagaNorm });
  // Se a vaga não tem escolaridade definida, NÃO recomenda
  if (vagaRank === undefined) return false;
  if (candidatoRank === undefined) return false;
  if (candidatoRank < vagaRank) return false;
  return true;
}

export const MatchService = {
  async matchVagasForCandidato(candidatoId: number) {
    // Buscar candidato
    const candidato = await CandidatosRepo.findById(candidatoId);
    if (!candidato) throw new Error("Candidato não encontrado");
    // Usar barreiras já presentes no objeto candidato
    const barreiras = Array.isArray(candidato.barreiras) ? candidato.barreiras : [];
    // Buscar todas as vagas ativas
    const vagas = await VagasRepo.findAllAtivas();
    // Para cada vaga, buscar acessibilidades (array de string)
    const vagasComAcess = await Promise.all(
      vagas.map(async (vaga: any) => {
        let acessibilidades = await VagasRepo.listarAcessibilidades(vaga.id);
        if (!Array.isArray(acessibilidades)) acessibilidades = [];
        return { ...vaga, acessibilidades };
      })
    );
    // Montar objeto candidato
    const candidatoObj = {
      id: candidato.id,
      escolaridade: candidato.escolaridade,
      barreiras: barreiras.map((b: any) => b.tipo || b),
      subtipos: Array.isArray(candidato.subtipos) ? candidato.subtipos : []
    };
    // Filtrar vagas compatíveis
    const vagasRecomendadas = vagasComAcess.filter((vaga: any) =>
      matchVaga(candidatoObj, vaga)
    );
    // Retornar apenas vagas que passaram no match
    return vagasRecomendadas;
  }
};
