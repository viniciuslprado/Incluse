import { calcularCompatibilidade } from '../lib/compatibilidade.ts';

// Exemplo completo de candidato
const candidato = {
  id: 1,
  nome: 'Maria da Silva',
  email: 'maria@email.com',
  telefone: '11999999999',
  escolaridade: 'Ensino Superior Completo',
  curso: 'Administração',
  situacao: 'concluido',
  cidade: 'Campinas',
  estado: 'SP',
  aceitaMudanca: true,
  aceitaViajar: true,
  pretensaoSalarialMin: 3500,
  subtipos: [
    {
      subtipoId: 1,
      subtipo: { id: 1, nome: 'Física', tipoId: 1 },
      barreiras: [
        { barreiraId: 1, barreira: { id: 1, descricao: 'Acesso físico' } },
        { barreiraId: 2, barreira: { id: 2, descricao: 'Comunicação' } }
      ]
    }
  ],
  experiencias: [
    { cargo: 'Assistente Administrativo', empresa: 'Empresa X', dataInicio: '2020-01-01', atualmenteTrabalha: false, descricao: 'Atendimento e rotinas administrativas.' }
  ],
  formacoes: [
    { escolaridade: 'Ensino Superior Completo', instituicao: 'PUC', curso: 'Administração', situacao: 'concluido', inicio: '2016-01-01', termino: '2019-12-01' }
  ],
  cursos: [
    { nome: 'Excel Avançado', instituicao: 'SENAC' }
  ],
  competencias: [
    { tipo: 'Hard skill', nome: 'Excel', nivel: 'Avançado' },
    { tipo: 'Soft skill', nome: 'Comunicação', nivel: 'Avançado' }
  ],
  idiomas: [
    { idioma: 'Inglês', nivel: 'Intermediário' }
  ],
  areasFormacao: ['Administração']
} as any;

// Exemplo completo de vaga
const vaga = {
  id: 1,
  empresaId: 1,
  titulo: 'Analista Administrativo',
  descricao: 'Atuar com rotinas administrativas e atendimento ao cliente.',
  escolaridade: 'Ensino Superior Completo',
  cidade: 'São Paulo',
  estado: 'SP',
  area: 'Administração',
  tipoContratacao: 'CLT',
  modeloTrabalho: 'Presencial',
  exigeMudanca: false,
  exigeViagens: false,
  descricaoVaga: {
    resumo: 'Vaga para área administrativa',
    atividades: 'Atendimento, organização de documentos',
    jornada: 'Segunda a sexta',
    salarioMin: 3000,
    salarioMax: 4000
  },
  requisitos: {
    formacao: 'Administração',
    experiencia: '2 anos',
    competencias: 'Excel, Comunicação',
    habilidadesTecnicas: 'Pacote Office'
  },
  acessibilidades: [
    { acessibilidadeId: 1, acessibilidade: { id: 1, descricao: 'Acesso físico' } },
    { acessibilidadeId: 2, acessibilidade: { id: 2, descricao: 'Comunicação' } }
  ],
  beneficios: [
    { id: 1, vagaId: 1, descricao: 'Vale Transporte' },
    { id: 2, vagaId: 1, descricao: 'Vale Refeição' }
  ]
} as any;

// Extrair áreas e barreiras do candidato
const candidatoAreas = candidato.areasFormacao;
const candidatoBarreiraIds = candidato.subtipos.flatMap((st: any) => st.barreiras?.map((b: any) => b.barreiraId) || []);
const vagaBarreirasCobertasIds = vaga.acessibilidades.map((a: any) => a.acessibilidadeId);

const resultado = calcularCompatibilidade({
  candidato,
  vaga,
  candidatoAreas,
  candidatoBarreiraIds,
  vagaBarreirasCobertasIds,
});

console.log('Resultado do match:', resultado);
