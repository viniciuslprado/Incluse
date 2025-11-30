import type { Vaga, Candidato } from "../types";

// Ordem hierárquica de escolaridade para comparação
const ESCOLARIDADE_ORDEM = [
  "Fundamental",
  "Médio",
  "Técnico",
  "Superior",
  "Pós",
  "Mestrado",
  "Doutorado",
];

// Normaliza escolaridade para comparação (retorna índice na hierarquia)
function escolaridadeNivel(valor?: string): number {
  if (!valor) return -1;
  const idx = ESCOLARIDADE_ORDEM.findIndex(
    (e) => e.toLowerCase() === valor.toLowerCase()
  );
  return idx === -1 ? -1 : idx;
}



// Acessibilidade (Filtro): retorna true se vaga cobre todas barreiras do candidato
// Aqui recebemos listas já normalizadas de IDs de barreiras cobertas ou função externa que resolva.
function barreirasCobertas(
  candidatoBarreiraIds: number[] | undefined,
  vagaBarreirasCobertasIds: number[] | undefined
): boolean {
  if (!candidatoBarreiraIds || candidatoBarreiraIds.length === 0) return true; // sem barreiras
  if (!vagaBarreirasCobertasIds) return false;
  return candidatoBarreiraIds.every((id) => vagaBarreirasCobertasIds.includes(id));
}
export interface CompatibilidadeResultado {
  total: number; // 0 a 100
  match: number; // 0 a 65
  compatibilidade: number; // 0 a 35
  fatores: {
    acessibilidade: number;
    escolaridade: number;
    area: number;
    localidade: number;
    disponibilidadeGeografica: number;
  };
  pesos: {
    acessibilidade: number;
    escolaridade: number;
    area: number;
    localidade: number;
    disponibilidadeGeografica: number;
  };
  excluida: boolean; // true se eliminada por filtro obrigatório
  motivoExclusao?: string;
}


interface CalculoParams {
  candidato: Candidato;
  vaga: Vaga;
  candidatoAreas?: string[]; // nomes de áreas selecionadas pelo candidato
  candidatoBarreiraIds?: number[]; // barreiras do candidato
  vagaBarreirasCobertasIds?: number[]; // barreiras cobertas pela vaga (resolvido externamente)
  areaSimilaridadeFn?: (candidatoArea: string, vagaArea: string) => boolean | number; // função opcional para similaridade
}


export function calcularCompatibilidade(params: CalculoParams): CompatibilidadeResultado {
  const {
    candidato,
    vaga,
    candidatoAreas,
    candidatoBarreiraIds,
    vagaBarreirasCobertasIds,
    areaSimilaridadeFn,
  } = params;

  // Pesos
  const PESOS = {
    acessibilidade: 35,
    escolaridade: 30,
    area: 20,
    localidade: 10,
    disponibilidadeGeografica: 5,
  };

  // --- ETAPA 1: MATCH (eliminatório, 65%) ---
  // 1. Acessibilidade (obrigatório)
  const acessibilidadeOk = barreirasCobertas(candidatoBarreiraIds, vagaBarreirasCobertasIds);
  let fatores = {
    acessibilidade: 0,
    escolaridade: 0,
    area: 0,
    localidade: 0,
    disponibilidadeGeografica: 0,
  };
  let excluida = false;
  let motivoExclusao = undefined;
  if (!acessibilidadeOk) {
    excluida = true;
    motivoExclusao = "Vaga não cobre todas as barreiras de acessibilidade do candidato.";
    return {
      total: 0,
      match: 0,
      compatibilidade: 0,
      fatores,
      pesos: PESOS,
      excluida,
      motivoExclusao,
    };
  }
  fatores.acessibilidade = PESOS.acessibilidade;

  // 2. Escolaridade mínima (obrigatório)
  const vReq = escolaridadeNivel(vaga.escolaridade);
  const vCand = escolaridadeNivel(candidato.escolaridade);
  if (vReq === -1 || vCand === -1 || vCand < vReq) {
    excluida = true;
    motivoExclusao = "Escolaridade do candidato inferior à exigida pela vaga.";
    return {
      total: 0,
      match: fatores.acessibilidade,
      compatibilidade: 0,
      fatores,
      pesos: PESOS,
      excluida,
      motivoExclusao,
    };
  }
  fatores.escolaridade = PESOS.escolaridade;

  // --- ETAPA 2: COMPATIBILIDADE (ajusta nota, 35%) ---
  // A) Área / formação (20%)
  let areaScore = 0;
  if (vaga.area && candidatoAreas && candidatoAreas.length > 0) {
    // Idêntica: 20%, Similar: 10-15%, Não relacionada: 0%
    let melhor = 0;
    for (const areaCand of candidatoAreas) {
      if (areaCand.toLowerCase() === vaga.area.toLowerCase()) {
        melhor = PESOS.area;
        break;
      } else if (areaSimilaridadeFn) {
        // Função customizada de similaridade
        const sim = areaSimilaridadeFn(areaCand, vaga.area);
        if (typeof sim === 'number') {
          melhor = Math.max(melhor, Math.min(PESOS.area, Math.max(0, sim)));
        } else if (sim) {
          melhor = Math.max(melhor, 15); // similaridade booleana
        }
      }
    }
    if (melhor === 0 && candidatoAreas.some(a => a && vaga.area && a[0] === vaga.area[0])) {
      melhor = 10; // fallback: inicial igual = 10%
    }
    areaScore = melhor;
  }
  fatores.area = areaScore;

  // B) Localidade (10%)
  let localidadeScore = 0;
  const aceitaMudanca = !!candidato.aceitaMudanca;
  const mesmaCidade = vaga.cidade && candidato.cidade && vaga.cidade.toLowerCase() === candidato.cidade.toLowerCase();
  const mesmoEstado = vaga.estado && candidato.estado && vaga.estado.toLowerCase() === candidato.estado.toLowerCase();
  if (aceitaMudanca) {
    localidadeScore = PESOS.localidade;
  } else if (mesmaCidade) {
    localidadeScore = PESOS.localidade;
  } else if (mesmoEstado) {
    localidadeScore = 7;
  } else if (vaga.estado && candidato.estado && vaga.estado !== candidato.estado) {
    localidadeScore = 5;
  } else {
    localidadeScore = 0;
  }
  fatores.localidade = localidadeScore;

  // C) Disponibilidade geográfica (5%)
  let dispScore = 0;
  if (aceitaMudanca) dispScore += 2.5;
  if (candidato.aceitaViajar) dispScore += 2.5;
  fatores.disponibilidadeGeografica = dispScore;

  // Soma dos blocos
  const match = fatores.acessibilidade + fatores.escolaridade;
  const compatibilidade = fatores.area + fatores.localidade + fatores.disponibilidadeGeografica;
  const total = match + compatibilidade;

  return {
    total,
    match,
    compatibilidade,
    fatores,
    pesos: PESOS,
    excluida: false,
  };
}


// Exemplo rápido (deve resultar em 65+35=100%)
// Vaga: São Paulo, exige Superior, área Administração
// Candidato: Campinas, aceita mudança, área Administração, escolaridade Pós
export function exemploCalculo(): CompatibilidadeResultado {
  const candidato: Candidato = {
    id: 1,
    nome: "Teste",
    escolaridade: "Pós",
    cidade: "Campinas",
    estado: "SP",
    aceitaMudanca: true,
    aceitaViagens: true,
  } as any;
  const vaga: Vaga = {
    id: 1,
    empresaId: 1,
    descricao: "",
    escolaridade: "Superior",
    cidade: "São Paulo",
    estado: "SP",
    area: "Administração",
  } as any;
  return calcularCompatibilidade({
    candidato,
    vaga,
    candidatoAreas: ["Administração"],
  });
}
