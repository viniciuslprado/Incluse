import { AdminRepo } from "../../repositories/admin/admin.repo";

export const AdminService = {
  async listarEmpresas(filters: any) {
    const { page, limit, status } = filters;
    const where: any = {};
    
    if (status === 'ativa') where.isActive = true;
    if (status === 'inativa') where.isActive = false;
    
    const empresas = await AdminRepo.getEmpresas(where, page, limit);
    const total = await AdminRepo.countEmpresas(where);
    
    return {
      data: empresas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async atualizarStatusEmpresa(id: number, isActive: boolean) {
    const empresa = await AdminRepo.findEmpresaById(id);
    if (!empresa) throw new Error("Empresa não encontrada");
    
    return AdminRepo.updateEmpresaStatus(id, isActive);
  },

  async listarCandidatos(filters: any) {
    const { page, limit } = filters;
    const candidatos = await AdminRepo.getCandidatos(page, limit);
    const total = await AdminRepo.countCandidatos();
    
    return {
      data: candidatos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async listarVagas(filters: any) {
    const { page, limit, status } = filters;
    const where: any = {};
    
    if (status) where.status = status;
    
    const vagas = await AdminRepo.getVagas(where, page, limit);
    const total = await AdminRepo.countVagas(where);
    
    return {
      data: vagas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async pausarVaga(id: number) {
    const vaga = await AdminRepo.findVagaById(id);
    if (!vaga) throw new Error("Vaga não encontrada");
    
    return AdminRepo.updateVagaStatus(id, 'pausada');
  },

  async getDashboard() {
    const totalEmpresas = await AdminRepo.countEmpresas({});
    const empresasAtivas = await AdminRepo.countEmpresas({ isActive: true });
    const totalCandidatos = await AdminRepo.countCandidatos();
    const totalVagas = await AdminRepo.countVagas({});
    const vagasAtivas = await AdminRepo.countVagas({ status: 'ativa' });
    const totalCandidaturas = await AdminRepo.countCandidaturas();
    
    return {
      empresas: {
        total: totalEmpresas,
        ativas: empresasAtivas,
        inativas: totalEmpresas - empresasAtivas
      },
      candidatos: {
        total: totalCandidatos
      },
      vagas: {
        total: totalVagas,
        ativas: vagasAtivas,
        pausadas: await AdminRepo.countVagas({ status: 'pausada' }),
        encerradas: await AdminRepo.countVagas({ status: 'encerrada' })
      },
      candidaturas: {
        total: totalCandidaturas
      }
    };
  },

  async obterLogs(filters: any) {
    const { page, limit, tipo } = filters;
    const logs = await AdminRepo.getLogs(tipo, page, limit);
    const total = await AdminRepo.countLogs(tipo);
    
    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },
};