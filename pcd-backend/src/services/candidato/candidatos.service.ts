import { CandidatosRepo } from "../../repositories/candidato/candidatos.repo";
import prisma from '../../prismaClient';
// Importação compatível com CommonJS/ESM para bcryptjs
import bcryptjs from 'bcryptjs';
const bcrypt = bcryptjs;
import { SubtiposRepo } from "../../repositories/common/subtipos.repo";
import { BarreirasRepo } from "../../repositories/common/barreiras.repo";

export const CandidatosService = {
  // Lista as barreiras vinculadas a um subtipo para um candidato
  async listarBarreirasVinculadas(candidatoId: number, subtipoId: number) {
    // Busca todas as barreiras vinculadas ao candidato e subtipo
    const barreiras = await CandidatosRepo.listarBarreirasVinculadas(candidatoId, subtipoId);
    return barreiras;
  },
  async listarAreasFormacao(id: number) {
    return CandidatosRepo.listarAreasFormacao(id);
  },
  async getCandidato(id: number) {
    const c = await CandidatosRepo.findById(id);
    if (!c) throw Object.assign(new Error("Candidato não encontrado"), { status: 404 });
    return c;
  },

  async listarSubtipos(candidatoId: number) {
    return CandidatosRepo.listSubtipos(candidatoId);
  },

  async vincularSubtipos(candidatoId: number, subtipoIds: number[]) {
    if (!Array.isArray(subtipoIds)) {
      throw Object.assign(new Error("subtipoIds deve ser um array"), { status: 400 });
    }
    // Verifica candidato
    const c = await CandidatosRepo.findById(candidatoId);
    if (!c) throw Object.assign(new Error("Candidato não encontrado"), { status: 404 });
    // Validação: candidato deve ter pelo menos um subtipo
    if (subtipoIds.length === 0) {
      throw Object.assign(new Error("Candidato deve ter pelo menos um tipo de deficiência selecionado"), { status: 400 });
    }
    // Verifica subtipo existe
    for (const id of subtipoIds) {
      const s = await SubtiposRepo.findById(id);
      if (!s) throw Object.assign(new Error(`Subtipo ${id} não encontrado`), { status: 404 });
    }
    await CandidatosRepo.replaceSubtipos(candidatoId, subtipoIds);
    return { ok: true };
  },

  async vincularBarreiras(candidatoId: number, subtipoId: number, barreiraIds: number[]) {
    if (!Array.isArray(barreiraIds)) {
      throw Object.assign(new Error("barreiraIds deve ser um array"), { status: 400 });
    }
    // Verifica candidato
    const c = await CandidatosRepo.findById(candidatoId);
    if (!c) throw Object.assign(new Error("Candidato não encontrado"), { status: 404 });
    // Verifica subtipo
    const s = await SubtiposRepo.findById(subtipoId);
    if (!s) throw Object.assign(new Error("Subtipo não encontrado"), { status: 404 });
    // Validação: candidato deve ter pelo menos uma barreira por subtipo
    if (barreiraIds.length === 0) {
      throw Object.assign(new Error("Você deve ter pelo menos uma barreira selecionada para este tipo de deficiência"), { status: 400 });
    }
    for (const id of barreiraIds) {
      const b = await BarreirasRepo.findById(id);
      if (!b) throw Object.assign(new Error(`Barreira ${id} não encontrada`), { status: 404 });
    }
    // Garantia: cada barreira selecionada deve ter ao menos uma acessibilidade vinculada
    const barreiraAcess = await prisma.barreiraAcessibilidade.findMany({ where: { barreiraId: { in: barreiraIds } }, select: { barreiraId: true } });
    const barreirasComAcessSet = new Set(barreiraAcess.map(b => b.barreiraId));
    const missing = barreiraIds.filter(id => !barreirasComAcessSet.has(id));
    if (missing.length) {
      // busca nomes para mensagem mais amigável
      const nomes = await Promise.all(missing.map(async (id) => {
        const bb: any = await BarreirasRepo.findById(id);
        return bb ? `${bb.id} - ${bb.descricao}` : String(id);
      }));
      throw Object.assign(new Error(`As seguintes barreiras não têm acessibilidades vinculadas: ${nomes.join(', ')}`), { status: 400 });
    }

    await CandidatosRepo.replaceBarreiras(candidatoId, subtipoId, barreiraIds);
    return { ok: true };
  },

  async criarCandidato(data: { nome: string; cpf?: string; telefone?: string; email?: string; escolaridade?: string; curso?: string; situacao?: string; senha?: string; curriculo?: string; laudo?: string }) {
    const { nome, cpf, email, senha, telefone, escolaridade, curso, situacao, curriculo, laudo } = data;
    if (!nome?.trim()) throw Object.assign(new Error('Nome é obrigatório'), { status: 400 });
    if (!senha || senha.length < 6) throw Object.assign(new Error('Senha inválida (mínimo 6 caracteres)'), { status: 400 });
    // normaliza e valida
    const normalizedEmail = email?.trim() ? email.trim().toLowerCase() : undefined;
    const normalizedCpf = cpf?.replace ? cpf.replace(/\D/g, '') : undefined;
    if (normalizedCpf && normalizedCpf.length !== 11) throw Object.assign(new Error('CPF inválido (deve conter 11 dígitos)'), { status: 400 });

    // Validação de telefone/celular: aceita 10 a 13 dígitos (com ou sem DDI)
    if (telefone) {
      const normalizedTel = telefone.replace(/\D/g, '');
      if (!(normalizedTel.length >= 10 && normalizedTel.length <= 13)) {
        throw Object.assign(new Error('Celular inválido. Use o formato: (DD) XXXXX-XXXX ou com DDI'), { status: 400 });
      }
    }

    // verifica duplicados
    if (normalizedEmail) {
      const e = await CandidatosRepo.findByEmail(normalizedEmail);
      if (e) throw Object.assign(new Error('Já existe uma conta cadastrada com este e-mail'), { status: 400 });
    }
    if (normalizedCpf) {
      const c = await CandidatosRepo.findByCpf(normalizedCpf);
      if (c) throw Object.assign(new Error('Já existe uma conta cadastrada com este CPF'), { status: 400 });
    }
    const senhaHash = bcrypt.hashSync(senha, 8);
    const createData: any = { nome: nome.trim(), cpf: normalizedCpf, email: normalizedEmail, telefone, escolaridade: escolaridade ?? 'Não informado', curso, situacao, senhaHash, curriculo, laudo };
    let created: any;
    try {
      created = await CandidatosRepo.create(createData);
    } catch (err: any) {
      // Se o Prisma indicar conflito de unicidade no campo `id`, pode ser sequência do Postgres fora de sincronia.
      if (err && err.code === 'P2002') {
        const metaTarget = err.meta?.target;
        const targets = Array.isArray(metaTarget) ? metaTarget.map((t: any) => String(t).toLowerCase()) : [String(metaTarget || '')];
        if (targets.some((t: string) => t.includes('id'))) {
          try {
            // Ajusta a sequência do id para o maior id atual + 1 e tenta criar novamente
            await prisma.$executeRawUnsafe("SELECT setval(pg_get_serial_sequence('candidato','id'), (SELECT COALESCE(MAX(id),0)+1 FROM candidato))");
            created = await CandidatosRepo.create(createData);
          } catch (e2: any) {
            // se falhar, reaproveita o erro original para tratamento acima
            throw err;
          }
        } else {
          throw err;
        }
      } else {
        throw err;
      }
    }
    // don't return senhaHash to caller
    if (created) {
      const c: any = created;
      return { id: c.id, nome: c.nome, email: c.email ?? null, cpf: c.cpf ?? null };
    }
    throw Object.assign(new Error('Erro ao criar candidato'), { status: 500 });
  },

  async atualizarCandidato(id: number, data: any) {
    const candidato = await CandidatosRepo.findById(id);
    if (!candidato) throw new Error("Candidato não encontrado");
    
    const updateData: any = {};
    if (data.nome) updateData.nome = data.nome.trim();
    if (data.email !== undefined) {
      const normalizedEmail = data.email?.trim().toLowerCase();
      if (normalizedEmail && normalizedEmail !== candidato.email) {
        // Verificar se email já existe
        const existing = await CandidatosRepo.findByEmail(normalizedEmail);
        if (existing && existing.id !== id) {
          throw new Error("Já existe uma conta cadastrada com este e-mail");
        }
      }
      updateData.email = normalizedEmail || null;
    }
    if (data.telefone !== undefined) updateData.telefone = data.telefone;
    if (data.escolaridade) updateData.escolaridade = data.escolaridade;
    if (data.curso !== undefined) updateData.curso = data.curso;
    if (data.situacao !== undefined) updateData.situacao = data.situacao;
    if (data.cidade !== undefined) updateData.cidade = data.cidade;
    if (data.estado !== undefined) updateData.estado = data.estado;
    if (data.aceitaMudanca !== undefined) updateData.aceitaMudanca = Boolean(data.aceitaMudanca);
    if (data.aceitaViajar !== undefined) updateData.aceitaViajar = Boolean(data.aceitaViajar);
    if (data.pretensaoSalarialMin !== undefined && data.pretensaoSalarialMin !== null && data.pretensaoSalarialMin !== '') {
      const val = Number(data.pretensaoSalarialMin);
      if (Number.isFinite(val) && val >= 0) updateData.pretensaoSalarialMin = val;
    }
    
    return CandidatosRepo.update(id, updateData);
  },

  async checkCpfExists(cpf: string): Promise<boolean> {
    const normalized = cpf.replace(/\D/g, '');
    if (normalized.length !== 11) return false;
    const existing = await CandidatosRepo.findByCpf(normalized);
    return !!existing;
  },

  async checkEmailExists(email: string): Promise<boolean> {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return false;
    const existing = await CandidatosRepo.findByEmail(normalized);
    return !!existing;
  },


  async updateCurriculo(candidatoId: number, curriculoUrl: string) {
    return CandidatosRepo.updateCurriculo(candidatoId, curriculoUrl);
  },

  async updateLaudo(candidatoId: number, laudoUrl: string) {
    return CandidatosRepo.update(candidatoId, { laudo: laudoUrl });
  },

  async updateFoto(candidatoId: number, fotoUrl: string) {
    return CandidatosRepo.update(candidatoId, { foto: fotoUrl });
  },

  async favoritarVaga(candidatoId: number, vagaId: number) {
    // Verificar se candidato e vaga existem
    const candidato = await CandidatosRepo.findById(candidatoId);
    if (!candidato) throw new Error("Candidato não encontrado");
    
    const vaga = await CandidatosRepo.findVagaById(vagaId);
    if (!vaga) throw new Error("Vaga não encontrada");
    if (vaga.status !== 'ativa') throw new Error("Vaga não está ativa");
    
    // Verificar se há match
    const hasMatch = await CandidatosRepo.checkVagaMatch(candidatoId, vagaId);
    if (!hasMatch) throw new Error("Você não tem compatibilidade com esta vaga");
    
    return CandidatosRepo.createFavorito(candidatoId, vagaId);
  },

  async desfavoritarVaga(candidatoId: number, vagaId: number) {
    return CandidatosRepo.deleteFavorito(candidatoId, vagaId);
  },

  async listarVagasFavoritas(candidatoId: number) {
    return CandidatosRepo.getFavoritos(candidatoId);
  },

  async excluirCandidato(id: number) {
    const candidato = await CandidatosRepo.findById(id);
    if (!candidato) throw Object.assign(new Error("Candidato não encontrado"), { status: 404 });
    
    return CandidatosRepo.delete(id);
  },

  async desativarCandidato(id: number) {
    const candidato = await CandidatosRepo.findById(id);
    if (!candidato) throw Object.assign(new Error("Candidato não encontrado"), { status: 404 });
    
    return CandidatosRepo.update(id, { isActive: false });
  },

  async reativarCandidato(id: number) {
    const candidato = await CandidatosRepo.findById(id);
    if (!candidato) throw Object.assign(new Error("Candidato não encontrado"), { status: 404 });
    
    return CandidatosRepo.update(id, { isActive: true });
  },
};
