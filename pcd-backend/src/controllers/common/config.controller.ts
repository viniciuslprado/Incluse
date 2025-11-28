import { Request, Response } from 'express';
import * as ConfigRepo from '../../repositories/common/config.repo';
import bcrypt from 'bcryptjs';
import { prisma } from '../../prismaClient';

export async function getConfig(req: Request, res: Response) {
  try {
    const candidatoId = Number(req.params.id);
    const config = await ConfigRepo.getCandidatoConfig(candidatoId);
    res.json(config);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Erro ao buscar configurações' });
  }
}

export async function updateConfig(req: Request, res: Response) {
  try {
    const candidatoId = Number(req.params.id);
    const config = await ConfigRepo.updateCandidatoConfig(candidatoId, req.body);
    res.json(config);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Erro ao atualizar configurações' });
  }
}

export async function alterarSenha(req: Request, res: Response) {
  try {
    const candidatoId = Number(req.params.id);
    const { senhaAtual, novaSenha } = req.body;
    
    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias' });
    }
    
    const candidato = await prisma.candidato.findUnique({
      where: { id: candidatoId }
    });
    
    if (!candidato || !candidato.senhaHash) {
      return res.status(404).json({ message: 'Candidato não encontrado' });
    }
    
    const senhaCorreta = await bcrypt.compare(senhaAtual, candidato.senhaHash);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha atual incorreta' });
    }
    
    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
    await prisma.candidato.update({
      where: { id: candidatoId },
      data: { senhaHash: novaSenhaHash }
    });
    
    res.json({ message: 'Senha alterada com sucesso' });
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Erro ao alterar senha' });
  }
}

export async function aceitarTermos(req: Request, res: Response) {
  try {
    const candidatoId = Number(req.params.id);
    const config = await ConfigRepo.aceitarTermos(candidatoId);
    res.json(config);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Erro ao aceitar termos' });
  }
}

export async function desativarConta(req: Request, res: Response) {
  try {
    const candidatoId = Number(req.params.id);
    await ConfigRepo.desativarConta(candidatoId);
    res.json({ message: 'Conta desativada com sucesso' });
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Erro ao desativar conta' });
  }
}

export async function excluirConta(req: Request, res: Response) {
  try {
    const candidatoId = Number(req.params.id);
    const { confirmar } = req.body;
    
    if (confirmar !== 'EXCLUIR') {
      return res.status(400).json({ message: 'Confirmação inválida' });
    }
    
    await ConfigRepo.excluirConta(candidatoId);
    res.json({ message: 'Conta excluída com sucesso' });
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Erro ao excluir conta' });
  }
}
