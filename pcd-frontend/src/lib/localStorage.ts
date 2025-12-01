type SavedVaga = { id: number; titulo?: string; empresaNome?: string; savedAt: string };
type Candidatura = { id: number; titulo?: string; empresaNome?: string; appliedAt: string };
import type { Vaga } from '../types';

const keySaved = (candidatoId: number) => `incluse:saved:${candidatoId}`;
const keyApplied = (candidatoId: number) => `incluse:candidaturas:${candidatoId}`;

export function getSavedIds(candidatoId: number): number[] {
  try {
    const raw = localStorage.getItem(keySaved(candidatoId));
    if (!raw) return [];
    const arr: SavedVaga[] = JSON.parse(raw);
    return arr.map(a => a.id);
  } catch (e) { return []; }
}

export function getSavedVagas(candidatoId: number): SavedVaga[] {
  try {
    const raw = localStorage.getItem(keySaved(candidatoId));
    if (!raw) return [];
    return JSON.parse(raw) as SavedVaga[];
  } catch (e) { return []; }
}

export function toggleSaveVaga(candidatoId: number, vaga: Vaga): boolean {
  const key = keySaved(candidatoId);
  const current = getSavedVagas(candidatoId);
  const idx = current.findIndex(s => s.id === vaga.id);
  if (idx >= 0) {
    current.splice(idx, 1);
    localStorage.setItem(key, JSON.stringify(current));
    return false;
  }
  const nv: SavedVaga = { id: vaga.id, titulo: vaga.titulo, empresaNome: vaga.empresa?.nome, savedAt: new Date().toISOString() };
  current.unshift(nv);
  localStorage.setItem(key, JSON.stringify(current));
  return true;
}

export function isVagaSaved(candidatoId: number, vagaId: number): boolean {
  return getSavedIds(candidatoId).includes(vagaId);
}

export function getAppliedIds(candidatoId: number): number[] {
  try {
    const raw = localStorage.getItem(keyApplied(candidatoId));
    if (!raw) return [];
    const arr: Candidatura[] = JSON.parse(raw);
    return arr.map(a => a.id);
  } catch (e) { return []; }
}

export function addCandidatura(candidatoId: number, vaga: Vaga): boolean {
  const key = keyApplied(candidatoId);
  try {
    const raw = localStorage.getItem(key);
    const arr: Candidatura[] = raw ? JSON.parse(raw) : [];
    if (arr.find(a => a.id === vaga.id)) return false;
    const novo: Candidatura = { 
      id: vaga.id, 
      titulo: vaga.titulo, 
      empresaNome: vaga.empresa?.nome,
      appliedAt: new Date().toISOString()
    };
    arr.unshift(novo);
    localStorage.setItem(key, JSON.stringify(arr));
    
    // Disparar evento para atualizar UI
    window.dispatchEvent(new CustomEvent('candidaturaCreated'));
    
    return true;
  } catch (e) { 
    console.error('Erro ao salvar candidatura:', e);
    return false; 
  }
}

export function removeCandidatura(candidatoId: number, vagaId: number): boolean {
  const key = keyApplied(candidatoId);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const arr: Candidatura[] = JSON.parse(raw);
    const idx = arr.findIndex(a => a.id === vagaId);
    if (idx < 0) return false;
    arr.splice(idx, 1);
    localStorage.setItem(key, JSON.stringify(arr));
    return true;
  } catch {
    return false;
  }
}

export function toggleCandidatura(candidatoId: number, vaga: Vaga): { applied: boolean; changed: boolean } {
  if (isVagaApplied(candidatoId, vaga.id)) {
    const removed = removeCandidatura(candidatoId, vaga.id);
    return { applied: !removed, changed: removed };
  }
  const added = addCandidatura(candidatoId, vaga);
  return { applied: added, changed: added };
}

export function isVagaApplied(candidatoId: number, vagaId: number): boolean {
  return getAppliedIds(candidatoId).includes(vagaId);
}

export function getSavedVagasAsVagas(candidatoId: number): Vaga[] {
  const saved = getSavedVagas(candidatoId);
  return saved.map(s => ({
    id: Number(s.id),
    titulo: s.titulo ?? undefined,
    descricao: s.titulo ?? '',
    escolaridade: undefined,
    cidade: undefined,
    estado: undefined,
    empresaId: 0,
    empresa: { id: 0, nome: s.empresaNome ?? '' },
    createdAt: s.savedAt,
    updatedAt: s.savedAt,
  }));
}

// --- Favoritar empresas (localStorage)
const keyFavCompanies = (candidatoId: number) => `incluse:favCompanies:${candidatoId}`;

export function getFavoritedCompanies(candidatoId: number): { id: number; nome?: string; favoritedAt: string }[] {
  try {
    const raw = localStorage.getItem(keyFavCompanies(candidatoId));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) { return []; }
}

// --- Notificações (local)
const keyNotifications = (candidatoId: number) => `incluse:notifications:${candidatoId}`;

export function getNotifications(candidatoId: number) {
  try {
    const raw = localStorage.getItem(keyNotifications(candidatoId));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) { return []; }
}

export function getNotificationsCount(candidatoId: number) {
  return getNotifications(candidatoId).length;
}

export function markNotificationRead(candidatoId: number, notificationId: string | number): boolean {
  try {
    const key = keyNotifications(candidatoId);
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const arr = JSON.parse(raw) as any[];
    const idx = arr.findIndex(n => String(n.id) === String(notificationId));
    if (idx < 0) return false;
    arr[idx] = { ...arr[idx], read: true };
    localStorage.setItem(key, JSON.stringify(arr));
    return true;
  } catch {
    return false;
  }
}

export function markAllNotificationsRead(candidatoId: number): boolean {
  try {
    const key = keyNotifications(candidatoId);
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const arr = JSON.parse(raw) as any[];
    const newArr = arr.map(n => ({ ...n, read: true }));
    localStorage.setItem(key, JSON.stringify(newArr));
    return true;
  } catch {
    return false;
  }
}

export function isCompanyFavorited(candidatoId: number, empresaId: number): boolean {
  return getFavoritedCompanies(candidatoId).some(c => c.id === empresaId);
}

export function toggleFavoriteCompany(candidatoId: number, empresa: any): boolean {
  const key = keyFavCompanies(candidatoId);
  const current = getFavoritedCompanies(candidatoId);
  const idx = current.findIndex(c => c.id === empresa.id);
  if (idx >= 0) {
    current.splice(idx, 1);
    localStorage.setItem(key, JSON.stringify(current));
    return false;
  }
  const nv = { id: empresa.id, nome: empresa.nome ?? empresa.nome, favoritedAt: new Date().toISOString() };
  current.unshift(nv);
  localStorage.setItem(key, JSON.stringify(current));
  return true;
}

// --- Favoritos de vagas => unificados com "salvas" (alias)
// Manter assinaturas para retrocompatibilidade, mas usar mesma base (keySaved)
export function getFavoritedVagas(candidatoId: number): { id: number; titulo?: string; empresaNome?: string; favoritedAt: string }[] {
  return getSavedVagas(candidatoId).map(s => ({ id: s.id, titulo: s.titulo, empresaNome: s.empresaNome, favoritedAt: s.savedAt }));
}

export function isVagaFavorited(candidatoId: number, vagaId: number): boolean {
  return isVagaSaved(candidatoId, vagaId);
}

export function toggleFavoriteVaga(candidatoId: number, vaga: any): boolean {
  // Reutiliza toggleSaveVaga; mantém retorno (true = agora favorito/salvo)
  return toggleSaveVaga(candidatoId, vaga);
}
