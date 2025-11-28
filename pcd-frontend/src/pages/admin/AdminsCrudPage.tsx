import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function AdminsCrudPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [editId, setEditId] = useState<number|null>(null);

  function fetchAdmins() {
    setLoading(true);
    api.listarAdministradores()
      .then(setAdmins)
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchAdmins(); }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    const action = editId
      ? api.atualizarAdministrador(editId, form)
      : api.criarAdministrador(form);
    action.then(() => {
      setForm({ nome: '', email: '', senha: '' });
      setEditId(null);
      fetchAdmins();
    }).catch(e => setErro(e.message));
  }

  function handleEdit(admin: any) {
    setEditId(admin.id);
    setForm({ nome: admin.nome, email: admin.email, senha: '' });
  }

  function handleDelete(id: number) {
    if (!window.confirm('Excluir este administrador?')) return;
    api.deletarAdministrador(id).then(fetchAdmins).catch(e => setErro(e.message));
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Administradores</h2>
      {erro && <div className="text-red-600 mb-2">{erro}</div>}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" className="input input-bordered w-full" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input input-bordered w-full" required type="email" />
        <input name="senha" value={form.senha} onChange={handleChange} placeholder="Senha" className="input input-bordered w-full" type="password" required={!editId} />
        <button className="btn btn-primary" type="submit">{editId ? 'Atualizar' : 'Criar'}</button>
        {editId && <button type="button" className="btn ml-2" onClick={() => { setEditId(null); setForm({ nome: '', email: '', senha: '' }); }}>Cancelar</button>}
      </form>
      {loading ? <div>Carregando...</div> : (
        <table className="table w-full">
          <thead><tr><th>ID</th><th>Nome</th><th>Email</th><th>Ações</th></tr></thead>
          <tbody>
            {admins.map((a: any) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.nome}</td>
                <td>{a.email}</td>
                <td>
                  <button className="btn btn-xs btn-info mr-2" onClick={() => handleEdit(a)}>Editar</button>
                  <button className="btn btn-xs btn-error" onClick={() => handleDelete(a.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
