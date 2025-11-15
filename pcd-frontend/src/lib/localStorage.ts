type SavedVaga = { id: number; titulo?: string; empresaNome?: string; savedAt: string };
type Candidatura = { id: number; titulo?: string; empresaNome?: string; appliedAt: string };
import type { Vaga } from '../types';

const keySaved = (candidatoId: number) => `incluse:saved:${candidatoId}`;
const keyApplied = (candidatoId: number) => `incluse:applied:${candidatoId}`;

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

export function toggleSaveVaga(candidatoId: number, vaga: any): boolean {
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

export function addCandidatura(candidatoId: number, vaga: any): boolean {
  const key = keyApplied(candidatoId);
  try {
    const raw = localStorage.getItem(key);
    const arr: Candidatura[] = raw ? JSON.parse(raw) : [];
    if (arr.find(a => a.id === vaga.id)) return false;
    const novo: Candidatura = { id: vaga.id, titulo: vaga.titulo, empresaNome: vaga.empresa?.nome, appliedAt: new Date().toISOString() };
    arr.unshift(novo);
    localStorage.setItem(key, JSON.stringify(arr));
    return true;
  } catch (e) { return false; }
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
    escolaridade: '',
    cidade: undefined,
    estado: undefined,
    empresaId: 0,
    empresa: { id: 0, nome: s.empresaNome ?? '—' },
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
