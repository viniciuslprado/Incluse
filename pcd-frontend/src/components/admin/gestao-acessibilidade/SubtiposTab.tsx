
import { useEffect, useState } from "react";
import { api } from '../../../lib/api';
import type { SubtipoDeficiencia, TipoDeficiencia } from '../../../types';
import CrudModal from './CrudModal';
import ConfirmModal from '../../common/ConfirmModal';
import Button from '../../common/Button';
import { useToast } from '../../common/Toast';

export default function SubtiposTab() {
  const [tipos, setTipos] = useState<TipoDeficiencia[]>([]);
  const [tipoId, setTipoId] = useState<number | null>(null);
  const [subtipos, setSubtipos] = useState<SubtipoDeficiencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSubtipo, setEditSubtipo] = useState<SubtipoDeficiencia | null>(null);
  const [nome, setNome] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    api.listarTipos().then(setTipos).catch(() => toast.addToast({ message: "Erro ao carregar tipos", type: "error" }));
  }, []);

  useEffect(() => {
    if (tipoId) {
      setLoading(true);
      api.listarSubtiposPorTipo(tipoId)
        .then(setSubtipos)
        .catch(() => toast.addToast({ message: "Erro ao carregar subtipos", type: "error" }))
        .finally(() => setLoading(false));
    } else {
      setSubtipos([]);
    }
  }, [tipoId]);

  function openCreate() {
    setEditSubtipo(null);
    setNome("");
    setModalOpen(true);
  }
  function openEdit(subtipo: SubtipoDeficiencia) {
    setEditSubtipo(subtipo);
    setNome(subtipo.nome);
    setTipoId(subtipo.tipoId);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditSubtipo(null);
    setNome("");
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !tipoId) return toast.addToast({ message: "Preencha todos os campos", type: "error" });
    setLoading(true);
    const op = editSubtipo
      ? api.atualizarSubtipo(editSubtipo.id, nome)
      : api.criarSubtipo(tipoId, nome);
    op.then(() => {
      toast.addToast({ message: editSubtipo ? "Subtipo atualizado" : "Subtipo criado", type: "success" });
      if (tipoId) api.listarSubtiposPorTipo(tipoId).then(setSubtipos);
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
    api.deletarSubtipo(deleteId)
      .then(() => {
        toast.addToast({ message: "Subtipo excluído", type: "success" });
        if (tipoId) api.listarSubtiposPorTipo(tipoId).then(setSubtipos);
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
        <h2 className="text-xl font-semibold">Subtipos</h2>
        <Button variant="primary" onClick={openCreate} disabled={!tipoId}>Criar Novo</Button>
      </div>
      <div className="mb-4">
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
      <div className="card p-0 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={2} className="text-center py-6">Carregando...</td></tr>
            ) : subtipos.length === 0 ? (
              <tr><td colSpan={2} className="text-center py-6">Nenhum subtipo cadastrado</td></tr>
            ) : subtipos.map(subtipo => (
              <tr key={subtipo.id} className="border-b last:border-0">
                <td className="px-4 py-2">{subtipo.nome}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button variant="secondary" onClick={() => openEdit(subtipo)}>Editar</Button>
                  <Button variant="danger" onClick={() => askDelete(subtipo.id)}>Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CrudModal
        open={modalOpen}
        title={editSubtipo ? "Editar Subtipo" : "Criar Subtipo"}
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
          disabled: !!editSubtipo,
        }, {
          label: "Nome",
          name: "nome",
          value: nome,
          onChange: setNome,
          required: true,
          maxLength: 60,
        }]}
        submitLabel={editSubtipo ? "Salvar" : "Criar"}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title="Excluir Subtipo?"
        message="Tem certeza que deseja excluir este subtipo? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        danger
      />
    </div>
  );
}
