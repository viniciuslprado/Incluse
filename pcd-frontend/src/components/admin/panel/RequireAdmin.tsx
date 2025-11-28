import { useAuth } from '../../../contexts/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function RequireAdmin() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if ((user as any).role !== 'admin') {
    return <div className="p-8 text-center text-red-600">Acesso restrito ao administrador.</div>;
  }
  return <Outlet />;
}
