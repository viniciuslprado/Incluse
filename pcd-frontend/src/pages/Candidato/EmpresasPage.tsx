import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { FaStar } from "react-icons/fa";

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.listarEmpresas()
      .then((res: any) => { if (mounted) setEmpresas(res || []) })
      .catch(() => setEmpresas([]))
      .finally(() => { if (mounted) setLoading(false) });
    return () => { mounted = false };
  }, []);

  function isFollowing(id: number) {
    const favs = JSON.parse(localStorage.getItem('favoritas') || '[]');
    return favs.includes(id);
  }

  function toggleFollow(id: number) {
    const favs = JSON.parse(localStorage.getItem('favoritas') || '[]');
    const idx = favs.indexOf(id);
    if (idx >= 0) favs.splice(idx, 1);
    else favs.push(id);
    localStorage.setItem('favoritas', JSON.stringify(favs));
    // trigger state update
    setEmpresas((s) => s.map((e:any) => e.id === id ? { ...e, _following: !isFollowing(id) } : e));
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Empresas</h2>
        <div className="text-sm text-gray-500">Busque e siga empresas que te interessam</div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-1 md:col-span-2 p-4 bg-white dark:bg-gray-800 border rounded">Carregando...</div>
        ) : (
          empresas.map((emp: any) => (
            <div key={emp.id} className="p-4 bg-white dark:bg-gray-800 border rounded flex items-center justify-between hover:shadow-sm transition-shadow">
              <div>
                <div className="font-semibold">{emp.nome}</div>
                <div className="text-sm text-gray-500">{emp.cidade ?? "-"} • {emp.setor ?? "-"}</div>
                <div className="text-sm text-gray-500">{(emp.vagasCount ?? 0)} vagas</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-yellow-500 flex items-center gap-1"><FaStar /> {emp.mediaAvaliacao ?? '—'}</div>
                <button onClick={() => toggleFollow(emp.id)} className={`px-3 py-1 rounded ${isFollowing(emp.id) ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                  {isFollowing(emp.id) ? 'Seguindo' : 'Seguir'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
