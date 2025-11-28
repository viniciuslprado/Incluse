import { prisma } from "../../prismaClient";

// NOTA: Tabela EmpresaUsuario não existe no schema atual
// Este repositório está desabilitado até que a tabela seja criada
export const EmpresaUsuariosRepo = {
  listar(empresaId: number) {
    // return prisma.empresaUsuario.findMany({
    return Promise.resolve([]);
    // });
  },

  findById(id: number): Promise<any | null> {
    // return prisma.empresaUsuario.findUnique({
    return Promise.resolve(null);
    // });
  },

  findByEmail(email: string): Promise<any | null> {
    // return prisma.empresaUsuario.findUnique({
    return Promise.resolve(null);
    // });
  },

  criar(data: any) {
    // return prisma.empresaUsuario.create({
    throw new Error("EmpresaUsuario não implementado - tabela não existe no schema");
    // });
  },

  atualizar(id: number, data: any) {
    // return prisma.empresaUsuario.update({
    throw new Error("EmpresaUsuario não implementado - tabela não existe no schema");
    // });
  },

  desativar(id: number) {
    // return prisma.empresaUsuario.update({
    throw new Error("EmpresaUsuario não implementado - tabela não existe no schema");
    // });
  },
};