
import { useEffect, useState } from "react";
import { api } from '../../../lib/api';
import type { Barreira, SubtipoDeficiencia, TipoDeficiencia } from '../../../types';
import CrudModal from './CrudModal';
import ConfirmModal from '../../common/ConfirmModal';
import Button from '../../common/Button';
import { useToast } from '../../common/Toast';

export default function BarreirasTab() {
  const [tipos, setTipos] = useState<TipoDeficiencia[]>([]);
  const [tipoId, setTipoId] = useState<number | null>(null);
  const [subtipos, setSubtipos] = useState<SubtipoDeficiencia[]>([]);
  const [subtipoId, setSubtipoId] = useState<number | null>(null);
  const [barreiras, setBarreiras] = useState<Barreira[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBarreira, setEditBarreira] = useState<Barreira | null>(null);
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
      setLoading(true);
      api.listarBarreirasPorSubtipo(subtipoId)
        .then(setBarreiras)
        .catch(() => toast.addToast({ message: "Erro ao carregar barreiras", type: "error" }))
        .finally(() => setLoading(false));
    } else {
      setBarreiras([]);
    }
  }, [subtipoId]);

  function openCreate() {
    setEditBarreira(null);
    setDescricao("");
    setModalOpen(true);
  }
  function openEdit(barreira: Barreira) {
    setEditBarreira(barreira);
    setDescricao(barreira.descricao);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditBarreira(null);
    setDescricao("");
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!descricao.trim() || !subtipoId) return toast.addToast({ message: "Preencha todos os campos", type: "error" });
    setLoading(true);
    const op = editBarreira
      ? api.atualizarBarreira(editBarreira.id, descricao)
      : api.criarBarreira(descricao); // Supondo que backend já vincula subtipoId
    op.then(() => {
      toast.addToast({ message: editBarreira ? "Barreira atualizada" : "Barreira criada", type: "success" });
      if (subtipoId) api.listarBarreiras().then(data => setBarreiras(data.filter((b: any) => b.subtipoId === subtipoId)));
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
    api.deletarBarreira(deleteId)
      .then(() => {
        toast.addToast({ message: "Barreira excluída", type: "success" });
        if (subtipoId) api.listarBarreiras().then(data => setBarreiras(data.filter((b: any) => b.subtipoId === subtipoId)));
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
        <h2 className="text-xl font-semibold">Barreiras</h2>
        <Button variant="primary" onClick={openCreate} disabled={!subtipoId}>Criar Novo</Button>
      </div>
      <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-3 text-blue-900 rounded">
        <strong>Instrução:</strong> Cadastre barreiras e vincule a subtipos. Exemplo: Escada, Falta de intérprete, Iluminação inadequada...
      </div>
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Tipo de Deficiência</label>
          <select
            className="w-full max-w-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-incluse-primary focus:border-incluse-primary transition shadow-sm appearance-none"
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
            className="w-full max-w-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-incluse-primary focus:border-incluse-primary transition shadow-sm appearance-none"
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
            ) : barreiras.length === 0 ? (
              <tr><td colSpan={2} className="text-center py-6">Nenhuma barreira cadastrada</td></tr>
            ) : barreiras.map(barreira => (
              <tr key={barreira.id} className="border-b last:border-0">
                <td className="px-4 py-2">{barreira.descricao}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button variant="secondary" onClick={() => openEdit(barreira)}>Editar</Button>
                  <Button variant="danger" onClick={() => askDelete(barreira.id)}>Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CrudModal
        open={modalOpen}
        title={editBarreira ? "Editar Barreira" : "Criar Barreira"}
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
          disabled: !!editBarreira,
        }, {
          label: "Subtipo",
          name: "subtipoId",
          value: subtipoId ?? '',
          onChange: v => setSubtipoId(Number(v) || null),
          as: "select",
          options: subtipos.map(s => ({ value: s.id, label: s.nome })),
          required: true,
          disabled: !!editBarreira,
        }, {
          label: "Descrição",
          name: "descricao",
          value: descricao,
          onChange: setDescricao,
          required: true,
          maxLength: 100,
        }]}
        submitLabel={editBarreira ? "Salvar" : "Criar"}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title="Excluir Barreira?"
        message="Tem certeza que deseja excluir esta barreira? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        danger
      />
    </div>
  );
}
