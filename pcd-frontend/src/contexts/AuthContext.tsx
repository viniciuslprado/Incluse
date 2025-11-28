import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../lib/api';


type User =
  | {
      id: number;
      nome: string;
      email: string;
      tipo: 'candidato';
      role?: undefined;
    }
  | {
      id: number;
      nome: string;
      email: string;
      tipo: 'empresa';
      role?: undefined;
    }
  | {
      id: number;
      nome: string;
      email: string;
      tipo: 'admin';
      role: 'admin';
    };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (id: number, tipo: 'candidato' | 'empresa' | 'admin', extraUserData?: Partial<User>) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('auth_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      loadUserData(parsed.id, parsed.tipo, parsed);
    } else {
      setLoading(false);
    }
  }, []);


  async function loadUserData(
    id: number,
    tipo: 'candidato' | 'empresa' | 'admin',
    extraUserData?: Partial<User>
  ) {
    try {
      if (tipo === 'candidato') {
        const candidato = await api.getCandidato(id);
        setUser({
          id: candidato.id,
          nome: candidato.nome,
          email: candidato.email || '',
          tipo: 'candidato',
        });
      } else if (tipo === 'empresa') {
        setUser({
          id,
          nome: extraUserData?.nome || 'Empresa',
          email: extraUserData?.email || '',
          tipo: 'empresa',
        });
      } else if (tipo === 'admin') {
        setUser({
          id,
          nome: extraUserData?.nome || 'Administrador',
          email: extraUserData?.email || '',
          tipo: 'admin',
          role: 'admin',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      sessionStorage.removeItem('auth_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }


  async function login(
    id: number,
    tipo: 'candidato' | 'empresa' | 'admin',
    extraUserData?: Partial<User>
  ) {
    setLoading(true);
    sessionStorage.setItem('auth_user', JSON.stringify({ id, tipo, ...extraUserData }));
    await loadUserData(id, tipo, extraUserData);
  }

  function logout() {
    sessionStorage.removeItem('auth_user');
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    } catch (e) {}
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
  }
  return context;
}
