
import { useEffect, useState } from "react";
import CustomSelect from '../../common/CustomSelect';
import { api } from '../../../lib/api';
import type { Acessibilidade, Barreira, SubtipoDeficiencia, TipoDeficiencia } from '../../../types';
import CrudModal from './CrudModal';
import ConfirmModal from '../../common/ConfirmModal';
import Button from '../../common/Button';
import { useToast } from '../../common/Toast';

export default function AcessibilidadesTab() {
  const [tipos, setTipos] = useState<TipoDeficiencia[]>([]);
  const [tipoId, setTipoId] = useState<number | null>(null);
  const [subtipos, setSubtipos] = useState<SubtipoDeficiencia[]>([]);
  const [subtipoId, setSubtipoId] = useState<number | null>(null);
  const [barreiras, setBarreiras] = useState<Barreira[]>([]);
  const [barreiraId, setBarreiraId] = useState<number | null>(null);
  const [acessibilidades, setAcessibilidades] = useState<Acessibilidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState("");
  const [buscaAplicada, setBuscaAplicada] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editAcess, setEditAcess] = useState<Acessibilidade | null>(null);
  const [descricao, setDescricao] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    api.listarTipos().then(setTipos).catch(() => toast.addToast({ message: "Erro ao carregar tipos", type: "error" }));
  }, []);

  useEffect(() => {
    if (tipoId) {
      api.listarTiposComSubtiposPublico()
        .then((tiposComSubtipos) => {
          const tipo = tiposComSubtipos.find((t: any) => t.id === tipoId);
          setSubtipos(tipo ? tipo.subtipos : []);
        })
        .catch(() => toast.addToast({ message: "Erro ao carregar subtipos", type: "error" }));
    } else {
      setSubtipos([]);
      setSubtipoId(null);
    }
  }, [tipoId]);

  useEffect(() => {
    if (subtipoId) {
      api.listarBarreirasPorSubtipo(subtipoId)
        .then(setBarreiras)
        .catch(() => toast.addToast({ message: "Erro ao carregar barreiras", type: "error" }));
    } else {
      setBarreiras([]);
      setBarreiraId(null);
    }
  }, [subtipoId]);

  useEffect(() => {
    if (barreiraId) {
      setLoading(true);
      api.listarAcessibilidadesPorBarreira(barreiraId)
        .then(setAcessibilidades)
        .catch(() => toast.addToast({ message: "Erro ao carregar acessibilidades", type: "error" }))
        .finally(() => setLoading(false));
    } else {
      setAcessibilidades([]);
    }
  }, [barreiraId]);

  function openCreate() {
    setEditAcess(null);
    setDescricao("");
    setModalOpen(true);
  }
  function openEdit(acess: Acessibilidade) {
    setEditAcess(acess);
    setDescricao(acess.descricao);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditAcess(null);
    setDescricao("");
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!descricao.trim() || !barreiraId) return toast.addToast({ message: "Preencha todos os campos", type: "error" });
    setLoading(true);
    const op = editAcess
      ? api.atualizarAcessibilidade(editAcess.id, descricao)
      : api.criarAcessibilidade(descricao); // Supondo que backend já vincula barreiraId
    op.then(() => {
      toast.addToast({ message: editAcess ? "Acessibilidade atualizada" : "Acessibilidade criada", type: "success" });
      if (barreiraId) api.listarAcessibilidades().then(data => setAcessibilidades(data.filter((a: any) => a.barreiraId === barreiraId)));
      closeModal();
    })
      .catch(() => toast.addToast({ message: "Erro ao salvar", type: "error" }))
      .finally(() => setLoading(false));
  }

  function askDelete(id: number) {
    setDeleteId(id);
    setConfirmOpen(true);
  }
  function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    api.deletarAcessibilidade(deleteId)
      .then(() => {
        toast.addToast({ message: "Acessibilidade excluída", type: "success" });
        if (barreiraId) api.listarAcessibilidades().then(data => setAcessibilidades(data.filter((a: any) => a.barreiraId === barreiraId)));
      })
      .catch(() => toast.addToast({ message: "Erro ao excluir", type: "error" }))
      .finally(() => {
        setLoading(false);
        setConfirmOpen(false);
        setDeleteId(null);
      });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Acessibilidades</h2>
        <Button variant="primary" onClick={openCreate} disabled={!barreiraId}>Criar Novo</Button>
      </div>
      <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-3 text-blue-900 rounded">
        <strong>Instrução:</strong> Cadastre recursos de acessibilidade e vincule a barreiras. Exemplo: Rampa, Elevador, Sinalização tátil...
      </div>
      <div className="flex flex-col sm:flex-row sm:items-end gap-2 mb-2">
        <div>
          <label className="block mb-1 font-medium">Tipo de Deficiência</label>
          <CustomSelect
            value={tipoId?.toString() ?? ''}
            onChange={v => setTipoId(v ? Number(v) : null)}
            options={[
              { value: '', label: 'Selecione...' },
              ...tipos.map(t => ({ value: t.id.toString(), label: t.nome }))
            ]}
            className="w-full max-w-xs"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Subtipo</label>
          <CustomSelect
            value={subtipoId?.toString() ?? ''}
            onChange={v => setSubtipoId(v ? Number(v) : null)}
            options={[
              { value: '', label: 'Selecione...' },
              ...subtipos.map(s => ({ value: s.id.toString(), label: s.nome }))
            ]}
            className="w-full max-w-xs"
            disabled={!tipoId}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Barreira</label>
          <CustomSelect
            value={barreiraId?.toString() ?? ''}
            onChange={v => setBarreiraId(v ? Number(v) : null)}
            options={[
              { value: '', label: 'Selecione...' },
              ...barreiras.map(b => ({ value: b.id.toString(), label: b.descricao }))
            ]}
            className="w-full max-w-xs"
            disabled={!subtipoId}
          />
        </div>
      </div>
      <div className="mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
            <input
              type="text"
              className="pl-10 pr-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
              placeholder="Buscar acessibilidade..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              disabled={loading || acessibilidades.length === 0}
              onKeyDown={e => { if (e.key === 'Enter') setBuscaAplicada(busca); }}
            />
          </div>
          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            onClick={() => setBuscaAplicada(busca)}
            disabled={loading || acessibilidades.length === 0}
            title="Buscar"
          >Buscar</button>
        </div>
      </div>
      <div className="card p-0 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-4 py-2 text-left">Descrição</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={2} className="text-center py-6">Carregando...</td></tr>
            ) : acessibilidades.length === 0 ? (
              <tr><td colSpan={2} className="text-center py-6">Nenhuma acessibilidade cadastrada</td></tr>
            ) : acessibilidades.filter(a => a.descricao.toLowerCase().includes(buscaAplicada.toLowerCase())).length === 0 ? (
              <tr><td colSpan={2} className="text-center py-6">Nenhum resultado encontrado</td></tr>
            ) : acessibilidades.filter(a => a.descricao.toLowerCase().includes(buscaAplicada.toLowerCase())).map(acess => (
              <tr key={acess.id} className="border-b last:border-0">
                <td className="px-4 py-2">{acess.descricao}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button variant="secondary" onClick={() => openEdit(acess)}>Editar</Button>
                  <Button variant="danger" onClick={() => askDelete(acess.id)}>Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CrudModal
        open={modalOpen}
        title={editAcess ? "Editar Acessibilidade" : "Criar Acessibilidade"}
        onClose={closeModal}
        onSubmit={handleSave}
        loading={loading}
        fields={[{
          label: "Tipo de Deficiência",
          name: "tipoId",
          value: tipoId ?? '',
          onChange: v => setTipoId(Number(v) || null),
          as: "select",
          options: tipos.map(t => ({ value: t.id, label: t.nome })),
          required: true,
          disabled: !!editAcess,
        }, {
          label: "Subtipo",
          name: "subtipoId",
          value: subtipoId ?? '',
          onChange: v => setSubtipoId(Number(v) || null),
          as: "select",
          options: subtipos.map(s => ({ value: s.id, label: s.nome })),
          required: true,
          disabled: !!editAcess,
        }, {
          label: "Barreira",
          name: "barreiraId",
          value: barreiraId ?? '',
          onChange: v => setBarreiraId(Number(v) || null),
          as: "select",
          options: barreiras.map(b => ({ value: b.id, label: b.descricao })),
          required: true,
          disabled: !!editAcess,
        }, {
          label: "Descrição",
          name: "descricao",
          value: descricao,
          onChange: setDescricao,
          required: true,
          maxLength: 100,
        }]}
        submitLabel={editAcess ? "Salvar" : "Criar"}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title="Excluir Acessibilidade?"
        message="Tem certeza que deseja excluir esta acessibilidade? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        danger
      />
    </div>
  );
}
