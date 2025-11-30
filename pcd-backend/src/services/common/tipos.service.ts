//Services – regras / validações simples
import { TiposRepo } from "../../repositories/common/tipos.repo";

export const TiposService = {
  list() {
    return TiposRepo.list();
  },
  listWithSubtipos() {
    return TiposRepo.listWithSubtipos();
  },
  async listSubtipos(tipoId: number) {
    return TiposRepo.listSubtipos(tipoId);
  },
  async create(nome: string) {
    const final = (nome ?? "").trim();
    if (!final) throw Object.assign(new Error("O campo 'nome' é obrigatório"), { status: 400 });
    return TiposRepo.create(final);
  },
  async update(id: number, nome: string) {
    const final = (nome ?? "").trim();
    if (!final) throw Object.assign(new Error("O campo 'nome' é obrigatório"), { status: 400 });
    return TiposRepo.update(id, final);
  },
};