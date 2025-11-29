import { EmpresaUsuariosRepo } from "../../repositories/empresa/empresa-usuarios.repo";
import bcrypt from 'bcryptjs';

export const EmpresaUsuariosService = {
  async listarUsuarios(empresaId: number) {
    return EmpresaUsuariosRepo.listar(empresaId);
  },

  async criarUsuario(empresaId: number, data: any) {
    const { nome, email, senha, tipo } = data;

    if (!nome?.trim()) throw new Error("Nome é obrigatório");
    if (!email?.trim()) throw new Error("Email é obrigatório");
    if (!senha?.trim()) throw new Error("Senha é obrigatória");
    
    const emailExists = await EmpresaUsuariosRepo.findByEmail(email);
    if (emailExists) throw new Error("Email já cadastrado");
    
    const senhaHash = bcrypt.hashSync(senha, 8);
    
    return EmpresaUsuariosRepo.criar({
      empresaId,
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senhaHash,
      tipo: tipo || 'gestor'
    });
  },

  async atualizarUsuario(id: number, empresaId: number, data: any) {
    const usuario = await EmpresaUsuariosRepo.findById(id);
    if (!usuario || usuario.empresaId !== empresaId) {
      throw new Error("Usuário não encontrado");
    }
    
    if (data.email && data.email !== usuario.email) {
      const emailExists = await EmpresaUsuariosRepo.findByEmail(data.email);
      if (emailExists && emailExists.id !== id) {
        throw new Error("Email já cadastrado");
      }
    }
    
    if (data.senha) {
      data.senhaHash = bcrypt.hashSync(data.senha, 8);
      delete data.senha;
    }
    
    return EmpresaUsuariosRepo.atualizar(id, data);
  },

  async desativarUsuario(id: number, empresaId: number) {
    const usuario = await EmpresaUsuariosRepo.findById(id);
    if (!usuario || usuario.empresaId !== empresaId) {
      throw new Error("Usuário não encontrado");
    }
    
    return EmpresaUsuariosRepo.desativar(id);
  },
};