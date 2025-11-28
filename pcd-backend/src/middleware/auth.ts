import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';

export interface AuthPayload {
  sub: number;
  role?: string;
  name?: string;
  iat?: number;
  exp?: number;
}

declare module 'express-serve-static-core' {
  interface Request {
    auth?: AuthPayload;
    user?: { id: number; role: string; name?: string };
  }
}

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization || req.headers.Authorization as string | undefined;
    if (!header) return res.status(401).json({ error: 'Token ausente' });
    const [, token] = header.split(' ');
    if (!token) return res.status(401).json({ error: 'Token inválido' });
    const payload = jwt.verify(token, JWT_SECRET);
    // Conversão segura para AuthPayload
    let authPayload: AuthPayload | undefined;
    if (typeof payload === 'object' && payload !== null && typeof (payload as any).sub !== 'undefined') {
      // sub pode ser string ou number, converter se necessário
      const sub = typeof (payload as any).sub === 'string' ? parseInt((payload as any).sub, 10) : (payload as any).sub;
      authPayload = { ...payload, sub } as AuthPayload;
    }
    if (!authPayload || typeof authPayload.sub !== 'number' || isNaN(authPayload.sub)) {
      return res.status(401).json({ error: 'Token inválido (sub)' });
    }
    req.auth = authPayload;
    req.user = { id: authPayload.sub, role: authPayload.role || '', name: authPayload.name };
    next();
  } catch (e: any) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
}

export function ensureRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const current = req.auth?.role;
    if (!current) return res.status(401).json({ error: 'Não autorizado' });
    if (!roles.includes(current)) return res.status(403).json({ error: 'Acesso negado' });
    next();
  };
}

export function ensureSelfCandidate(req: Request, res: Response, next: NextFunction) {
  const paramId = Number(req.params.id);
  if (!req.auth) return res.status(401).json({ error: 'Não autorizado' });
  if (req.auth.role !== 'candidato') return res.status(403).json({ error: 'Acesso negado' });
  if (Number.isNaN(paramId)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  // Garantir que ambos sejam comparados como números
  const tokenId = Number(req.auth.sub);
  if (tokenId !== paramId) {
    console.log(`[ensureSelfCandidate] Token ID: ${tokenId}, Param ID: ${paramId}, Tipo token: ${typeof req.auth.sub}`);
    return res.status(403).json({ error: 'Operação não permitida para este usuário' });
  }
  next();
}
