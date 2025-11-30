// Arquivo de seed para testar matches entre candidatos e vagas
// Basta importar e rodar com ts-node para ver os resultados
import { calcularCompatibilidade } from '../lib/compatibilidade.ts';

const candidatos = [
  {
    id: 2,
    nome: 'Maria da Silva',
    escolaridade: 'Ensino Superior Completo',
    curso: 'Administração',
    cidade: 'Campinas',
    estado: 'SP',
    aceitaMudanca: true,
    aceitaViajar: true,
    areasFormacao: ['Administração'],
    subtipos: [
      {
        subtipoId: 1,
        subtipo: { id: 1, nome: 'Física', tipoId: 1 },
        barreiras: [
          { barreiraId: 1, barreira: { id: 1, descricao: 'Acesso físico' } },
          { barreiraId: 2, barreira: { id: 2, descricao: 'Comunicação' } }
        ]
      }
    ]
  },
  {
    id: 3,
    nome: 'João Souza',
    escolaridade: 'Ensino Médio Completo',
    curso: 'Logística',
    cidade: 'São Paulo',
    estado: 'SP',
    aceitaMudanca: false,
    aceitaViajar: false,
    areasFormacao: ['Logística'],
    subtipos: [
      {
        subtipoId: 2,
        subtipo: { id: 2, nome: 'Auditiva', tipoId: 2 },
        barreiras: [
          { barreiraId: 3, barreira: { id: 3, descricao: 'Comunicação' } }
        ]
      }
    ]
  }
];

const vagas = [
  {
    id: 10,
    empresaId: 1,
    titulo: 'Analista Administrativo',
    descricao: 'Atuar com rotinas administrativas.',
    escolaridade: 'Ensino Superior Completo',
    cidade: 'São Paulo',
    estado: 'SP',
    area: 'Administração',
    acessibilidades: [
      { acessibilidadeId: 1, acessibilidade: { id: 1, descricao: 'Acesso físico' } },
      { acessibilidadeId: 2, acessibilidade: { id: 2, descricao: 'Comunicação' } }
    ]
  },
  {
    id: 11,
    empresaId: 2,
    titulo: 'Auxiliar de Logística',
    descricao: 'Trabalho em estoque e separação de mercadorias.',
    escolaridade: 'Ensino Médio Completo',
    cidade: 'Campinas',
    estado: 'SP',
    area: 'Logística',
    acessibilidades: [
      { acessibilidadeId: 3, acessibilidade: { id: 3, descricao: 'Comunicação' } }
    ]
  },
  {
    id: 12,
    empresaId: 3,
    titulo: 'Recepcionista',
    descricao: 'Atendimento ao público.',
    escolaridade: 'Ensino Médio Completo',
    cidade: 'Campinas',
    estado: 'SP',
    area: 'Atendimento',
    acessibilidades: []
  }
];

for (const candidato of candidatos) {
  console.log(`\nCandidato: ${candidato.nome}`);
  for (const vaga of vagas) {
    const candidatoAreas = candidato.areasFormacao;
    const candidatoBarreiraIds = candidato.subtipos.flatMap(st => st.barreiras?.map(b => b.barreiraId) || []);
    const vagaBarreirasCobertasIds = vaga.acessibilidades.map(a => a.acessibilidadeId);
    const resultado = calcularCompatibilidade({
      candidato: candidato as any,
      vaga: vaga as any,
      candidatoAreas,
      candidatoBarreiraIds,
      vagaBarreirasCobertasIds,
    });
    console.log(`  Vaga: ${vaga.titulo} | Match: ${resultado.total} | Excluida: ${resultado.excluida} | Motivo: ${resultado.motivoExclusao || 'OK'}`);
  }
}
