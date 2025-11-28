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

// Normaliza disponibilidade geográfica em código simples
function normalizarDisponibilidade(raw?: string):
  | "CIDADE"
  | "REGIAO"
  | "ESTADO"
  | "BRASIL"
  | "INTERNACIONAL"
  | undefined {
  if (!raw) return undefined;
  const v = raw.toLowerCase();
  if (v.includes("apenas") && v.includes("cidade")) return "CIDADE";
  if (v.includes("regi") || v.includes("próximas") || v.includes("proximas")) return "REGIAO";
  if (v.includes("estado")) return "ESTADO";
  if (v.includes("brasil")) return "BRASIL";
  if (v.includes("internacional")) return "INTERNACIONAL";
  return undefined;
}

// Normaliza modelo de trabalho
function normalizarModeloTrabalho(raw?: string): "REMOTO" | "PRESENCIAL" | "HIBRIDO" | undefined {
  if (!raw) return undefined;
  const v = raw.toLowerCase();
  if (v.includes("remot")) return "REMOTO";
  if (v.includes("híbr") || v.includes("hibr")) return "HIBRIDO";
  if (v.includes("presenc")) return "PRESENCIAL";
  return undefined;
}

// Checa incompatibilidade hard-stop (retorna true se barra deve ser 0)
function isHardIncompatible(
  candidato: Candidato,
  vaga: Vaga,
  disponibilidade: ReturnType<typeof normalizarDisponibilidade>,
  modelo: ReturnType<typeof normalizarModeloTrabalho>
): boolean {
  if (!modelo) return false;
  if ((modelo === "PRESENCIAL" || modelo === "HIBRIDO") && disponibilidade === "CIDADE") {
    // Se não mesma cidade
    if (
      vaga.cidade && candidato.cidade &&
      vaga.cidade.toLowerCase() !== candidato.cidade.toLowerCase()
    ) {
      return true;
    }
  }
  return false;
}

// Pontuação Localidade + Modelo (15%)
function pontuacaoLocalidadeModelo(
  candidato: Candidato,
  vaga: Vaga,
  disponibilidade: ReturnType<typeof normalizarDisponibilidade>,
  modelo: ReturnType<typeof normalizarModeloTrabalho>
): number {
  if (!modelo) return 0; // se não definido, sem pontuação

  if (modelo === "REMOTO") return 15; // qualquer localização

  const mesmaCidade = vaga.cidade && candidato.cidade && vaga.cidade.toLowerCase() === candidato.cidade.toLowerCase();
  const mesmoEstado = vaga.estado && candidato.estado && vaga.estado.toLowerCase() === candidato.estado.toLowerCase();

  if (modelo === "PRESENCIAL") {
    if (mesmaCidade) return 15;
    if (disponibilidade === "REGIAO") return 12;
    if (mesmoEstado) return 10;
    if (disponibilidade === "ESTADO" || disponibilidade === "BRASIL" || disponibilidade === "INTERNACIONAL") return 10;
    return 0;
  }
  // HÍBRIDO
  if (modelo === "HIBRIDO") {
    if (mesmaCidade) return 15;
    if (disponibilidade === "REGIAO") return 10;
    if (mesmoEstado) return 7;
    if (disponibilidade === "ESTADO") return 7;
    if (disponibilidade === "BRASIL" || disponibilidade === "INTERNACIONAL") return 5;
    return 0;
  }
  return 0;
}

// Disponibilidade geográfica (10%): depende de flags da vaga
function pontuacaoDisponibilidadeGeografica(
  candidato: Candidato,
  vaga: Vaga,
  disponibilidade: ReturnType<typeof normalizarDisponibilidade>
): number {
  let score = 0;
  if (!disponibilidade) return 0;

  // Mudança
  if (vaga.exigeMudanca) {
    const mobilidadeOk =
      disponibilidade === "ESTADO" ||
      disponibilidade === "BRASIL" ||
      disponibilidade === "INTERNACIONAL" ||
      // morar na cidade já é compatível
      (vaga.cidade && candidato.cidade && vaga.cidade.toLowerCase() === candidato.cidade.toLowerCase());
    if (mobilidadeOk) score += 6;
  }
  // Viagens
  if (vaga.exigeViagens) {
    const viagensOk =
      disponibilidade === "REGIAO" ||
      disponibilidade === "ESTADO" ||
      disponibilidade === "BRASIL" ||
      disponibilidade === "INTERNACIONAL";
    if (viagensOk) score += 4;
  }
  return score; // máximo 10
}

// Escolaridade (45%): atende ou supera => 45, caso contrário 0
function pontuacaoEscolaridade(candidato: Candidato, vaga: Vaga): number {
  const vReq = escolaridadeNivel(vaga.escolaridade);
  const vCand = escolaridadeNivel(candidato.escolaridade);
  if (vReq === -1 || vCand === -1) return 0; // dados incompletos
  return vCand >= vReq ? 45 : 0;
}

// Área / Formação (30%): mesma área => 30, diferente => 0
// Para múltiplas áreas do candidato, basta uma coincidência com a vaga.
function pontuacaoArea(
  candidatoAreas: string[] | undefined,
  vagaArea?: string
): number {
  if (!vagaArea || !candidatoAreas || candidatoAreas.length === 0) return 0;
  const match = candidatoAreas.some(
    (a) => a.toLowerCase() === vagaArea.toLowerCase()
  );
  return match ? 30 : 0;
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
  fatores: {
    escolaridade: number;
    area: number;
    localidadeModelo: number;
    disponibilidadeGeografica: number;
  };
  pesos: {
    escolaridade: number;
    area: number;
    localidadeModelo: number;
    disponibilidadeGeografica: number;
  };
  hardStop: boolean; // incompatibilidade por localidade restrita
  acessibilidadeOk: boolean; // vaga cobre barreiras
}

interface CalculoParams {
  candidato: Candidato;
  vaga: Vaga;
  candidatoAreas?: string[]; // nomes de áreas selecionadas pelo candidato
  candidatoBarreiraIds?: number[]; // barreiras do candidato
  vagaBarreirasCobertasIds?: number[]; // barreiras cobertas pela vaga (resolvido externamente)
}

export function calcularCompatibilidade(params: CalculoParams): CompatibilidadeResultado {
  const { candidato, vaga, candidatoAreas, candidatoBarreiraIds, vagaBarreirasCobertasIds } = params;

  const disponibilidade = normalizarDisponibilidade(candidato.disponibilidadeGeografica);
  const modelo = normalizarModeloTrabalho(vaga.modeloTrabalho);

  const acessibilidadeOk = barreirasCobertas(candidatoBarreiraIds, vagaBarreirasCobertasIds);
  if (!acessibilidadeOk) {
    return {
      total: 0,
      fatores: { escolaridade: 0, area: 0, localidadeModelo: 0, disponibilidadeGeografica: 0 },
      pesos: { escolaridade: 45, area: 30, localidadeModelo: 15, disponibilidadeGeografica: 10 },
      hardStop: false,
      acessibilidadeOk: false,
    };
  }

  const hardStop = isHardIncompatible(candidato, vaga, disponibilidade, modelo);
  if (hardStop) {
    return {
      total: 0,
      fatores: { escolaridade: 0, area: 0, localidadeModelo: 0, disponibilidadeGeografica: 0 },
      pesos: { escolaridade: 45, area: 30, localidadeModelo: 15, disponibilidadeGeografica: 10 },
      hardStop: true,
      acessibilidadeOk: true,
    };
  }

  const escolaridadeScore = pontuacaoEscolaridade(candidato, vaga); // 45 ou 0
  const areaScore = pontuacaoArea(candidatoAreas, vaga.area); // 30 ou 0
  const localidadeScore = pontuacaoLocalidadeModelo(candidato, vaga, disponibilidade, modelo); // 0..15
  const disponibilidadeScore = pontuacaoDisponibilidadeGeografica(candidato, vaga, disponibilidade); // 0..10

  const total = escolaridadeScore + areaScore + localidadeScore + disponibilidadeScore;

  return {
    total,
    fatores: {
      escolaridade: escolaridadeScore,
      area: areaScore,
      localidadeModelo: localidadeScore,
      disponibilidadeGeografica: disponibilidadeScore,
    },
    pesos: { escolaridade: 45, area: 30, localidadeModelo: 15, disponibilidadeGeografica: 10 },
    hardStop,
    acessibilidadeOk,
  };
}

// Exemplo rápido (deve resultar em 89%)
// Vaga: Presencial — São Paulo; Escolaridade mínima Superior; Área Administração; exigeViagens true; exigeMudanca false
// Candidato: Campinas, disponibilidade "Em todo o estado", área Administração, escolaridade Pós
export function exemploCalculo(): CompatibilidadeResultado {
  const candidato: Candidato = {
    id: 1,
    nome: "Teste",
    escolaridade: "Pós",
    cidade: "Campinas",
    estado: "SP",
  } as any;
  const vaga: Vaga = {
    id: 1,
    empresaId: 1,
    descricao: "",
    escolaridade: "Superior",
    cidade: "São Paulo",
    estado: "SP",
    modeloTrabalho: "Presencial",
    area: "Administração",
    exigeViagens: true,
    exigeMudanca: false,
  } as any;
  candidato.disponibilidadeGeografica = "Em todo o estado";
  return calcularCompatibilidade({
    candidato,
    vaga,
    candidatoAreas: ["Administração"],
  });
}
