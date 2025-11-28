
import { useEffect, useState } from "react";
import { api } from '../../../lib/api';
import type { Acessibilidade, Barreira, SubtipoDeficiencia, TipoDeficiencia } from '../../../types';
import CrudModal from './CrudModal';
import ConfirmModal from '../../ui/ConfirmModal';
import Button from '../../ui/Button';
import { useToast } from '../../ui/Toast';

export default function AcessibilidadesTab() {
  const [tipos, setTipos] = useState<TipoDeficiencia[]>([]);
  const [tipoId, setTipoId] = useState<number | null>(null);
  const [subtipos, setSubtipos] = useState<SubtipoDeficiencia[]>([]);
  const [subtipoId, setSubtipoId] = useState<number | null>(null);
  const [barreiras, setBarreiras] = useState<Barreira[]>([]);
  const [barreiraId, setBarreiraId] = useState<number | null>(null);
  const [acessibilidades, setAcessibilidades] = useState<Acessibilidade[]>([]);
  const [loading, setLoading] = useState(false);
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
      api.listarSubtiposPorTipo(tipoId).then(setSubtipos).catch(() => toast.addToast({ message: "Erro ao carregar subtipos", type: "error" }));
    } else {
      setSubtipos([]);
      setSubtipoId(null);
    }
  }, [tipoId]);

  useEffect(() => {
    if (subtipoId) {
      api.listarBarreiras().then(data => setBarreiras(data.filter((b: any) => b.subtipoId === subtipoId))).catch(() => toast.addToast({ message: "Erro ao carregar barreiras", type: "error" }));
    } else {
      setBarreiras([]);
      setBarreiraId(null);
    }
  }, [subtipoId]);

  useEffect(() => {
    if (barreiraId) {
      setLoading(true);
      api.listarAcessibilidades()
        .then(data => setAcessibilidades(data.filter((a: any) => a.barreiraId === barreiraId)))
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
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Tipo de Deficiência</label>
          <select
            className="input w-full max-w-xs"
            value={tipoId ?? ''}
            onChange={e => setTipoId(Number(e.target.value) || null)}
          >
            <option value="">Selecione...</option>
            {tipos.map(t => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Subtipo</label>
          <select
            className="input w-full max-w-xs"
            value={subtipoId ?? ''}
            onChange={e => setSubtipoId(Number(e.target.value) || null)}
            disabled={!tipoId}
          >
            <option value="">Selecione...</option>
            {subtipos.map(s => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Barreira</label>
          <select
            className="input w-full max-w-xs"
            value={barreiraId ?? ''}
            onChange={e => setBarreiraId(Number(e.target.value) || null)}
            disabled={!subtipoId}
          >
            <option value="">Selecione...</option>
            {barreiras.map(b => (
              <option key={b.id} value={b.id}>{b.descricao}</option>
            ))}
          </select>
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
            ) : acessibilidades.map(acess => (
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
