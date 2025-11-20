import { CandidatosRepo } from "../repositories/candidatos.repo";
import * as bcrypt from 'bcryptjs';
import { SubtiposRepo } from "../repositories/subtipos.repo";
import { BarreirasRepo } from "../repositories/barreiras.repo";

export const CandidatosService = {
  async getCandidato(id: number) {
    const c = await CandidatosRepo.findById(id);
    if (!c) throw Object.assign(new Error("Candidato não encontrado"), { status: 404 });
    return c;
  },

  async listarSubtipos(candidatoId: number) {
    return CandidatosRepo.listSubtipos(candidatoId);
  },

  async vincularSubtipos(candidatoId: number, subtipoIds: number[]) {
    if (!Array.isArray(subtipoIds) || subtipoIds.length === 0) {
      throw Object.assign(new Error("subtipoIds deve ser um array com pelo menos 1 id"), { status: 400 });
    }

    // Verifica candidato
    const c = await CandidatosRepo.findById(candidatoId);
    if (!c) throw Object.assign(new Error("Candidato não encontrado"), { status: 404 });

    // Verifica subtipo existe
    for (const id of subtipoIds) {
      const s = await SubtiposRepo.findById(id);
      if (!s) throw Object.assign(new Error(`Subtipo ${id} não encontrado`), { status: 404 });
    }

    await CandidatosRepo.vincularSubtipos(candidatoId, subtipoIds);
    return { ok: true };
  },

  async vincularBarreiras(candidatoId: number, subtipoId: number, barreiraIds: number[]) {
    if (!Array.isArray(barreiraIds) || barreiraIds.length === 0) {
      throw Object.assign(new Error("barreiraIds deve ser um array com pelo menos 1 id"), { status: 400 });
    }

    // Verifica candidato
    const c = await CandidatosRepo.findById(candidatoId);
    if (!c) throw Object.assign(new Error("Candidato não encontrado"), { status: 404 });

    // Verifica subtipo
    const s = await SubtiposRepo.findById(subtipoId);
    if (!s) throw Object.assign(new Error("Subtipo não encontrado"), { status: 404 });

    for (const id of barreiraIds) {
      const b = await BarreirasRepo.findById(id);
      if (!b) throw Object.assign(new Error(`Barreira ${id} não encontrada`), { status: 404 });
    }

    await CandidatosRepo.vincularBarreiras(candidatoId, subtipoId, barreiraIds);
    return { ok: true };
  },

  async criarCandidato(data: { nome: string; cpf?: string; telefone?: string; email?: string; escolaridade?: string; senha?: string }) {
    const { nome, cpf, email, senha, telefone, escolaridade } = data;
    if (!nome?.trim()) throw Object.assign(new Error('Nome é obrigatório'), { status: 400 });
    if (!senha || senha.length < 6) throw Object.assign(new Error('Senha inválida (mínimo 6 caracteres)'), { status: 400 });
    // normaliza e valida
    const normalizedEmail = email?.trim().toLowerCase() ?? undefined;
    const normalizedCpf = cpf ? cpf.replace(/\D/g, '') : undefined;
    if (normalizedCpf && normalizedCpf.length !== 11) throw Object.assign(new Error('CPF inválido (deve conter 11 dígitos)'), { status: 400 });

    // verifica duplicados
    if (normalizedEmail) {
      const e = await CandidatosRepo.findByEmail(normalizedEmail);
      if (e) throw Object.assign(new Error('E-mail já cadastrado'), { status: 400 });
    }
    if (normalizedCpf) {
      const c = await CandidatosRepo.findByCpf(normalizedCpf);
      if (c) throw Object.assign(new Error('CPF já cadastrado'), { status: 400 });
    }
  const senhaHash = (bcrypt as any).hashSync(senha, 8);
  const created = await CandidatosRepo.create({ nome: nome.trim(), cpf: normalizedCpf, email: normalizedEmail, telefone, escolaridade: escolaridade ?? 'Não informado', senhaHash });
    // don't return senhaHash to caller
    if (created) {
      const c: any = created;
      return { id: c.id, nome: c.nome, email: c.email ?? null, cpf: c.cpf ?? null };
    }
    throw Object.assign(new Error('Erro ao criar candidato'), { status: 500 });
  }
};
