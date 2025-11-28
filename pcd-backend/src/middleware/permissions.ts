import { Request, Response, NextFunction } from 'express';

export function ensurePermission(action: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userType = (req as any).user?.tipo || 'admin';
    
    const permissions = {
      admin: ['*'], // Todas as permissões
      gestor: [
        'vaga:create', 'vaga:read', 'vaga:update', 'vaga:delete',
        'candidato:read', 'candidato:update', 'candidato:evaluate',
        'usuario:create', 'usuario:read', 'usuario:update',
        'stats:read', 'config:update'
      ],
      recrutador: [
        'vaga:read', 'vaga:update',
        'candidato:read', 'candidato:update', 'candidato:evaluate',
        'stats:read'
      ]
    };
    
    const userPermissions = permissions[userType as keyof typeof permissions] || [];
    
    if (userPermissions.includes('*') || userPermissions.includes(action)) {
      return next();
    }
    
    return res.status(403).json({ error: 'Permissão insuficiente' });
  };
}

export function canManageUsers(req: Request, res: Response, next: NextFunction) {
  const userType = (req as any).user?.tipo || 'admin';
  
  if (userType === 'admin' || userType === 'gestor') {
    return next();
  }
  
  return res.status(403).json({ error: 'Apenas administradores e gestores podem gerenciar usuários' });
}