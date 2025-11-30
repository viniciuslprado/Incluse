import { AcessRepo } from "../../repositories/common/acessibilidades.repo";

export const AcessService = {
  list() {
    return AcessRepo.list();
  },
  async create(descricao: string) {
    const final = (descricao ?? "").trim();
    if (!final) throw Object.assign(new Error("O campo 'descricao' é obrigatório"), { status: 400 });
    return AcessRepo.create(final);
  },
  async update(id: number, descricao: string) {
    const final = (descricao ?? "").trim();
    if (!final) throw Object.assign(new Error("O campo 'descricao' é obrigatório"), { status: 400 });
    return AcessRepo.update(id, final);
  },
  async delete(id: number) {
    return AcessRepo.delete(id);
  },
};