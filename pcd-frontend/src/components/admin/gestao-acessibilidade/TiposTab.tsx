
import { useEffect, useState } from "react";
import { api } from '../../../lib/api';
import type { TipoDeficiencia } from '../../../types';
import CrudModal from './CrudModal';
import ConfirmModal from '../../common/ConfirmModal';
import Button from '../../common/Button';
import { useToast } from '../../common/Toast';

export default function TiposTab() {
  const [tipos, setTipos] = useState<TipoDeficiencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTipo, setEditTipo] = useState<TipoDeficiencia | null>(null);
  const [nome, setNome] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const toast = useToast();

  function fetchTipos() {
    setLoading(true);
    api.listarTipos()
      .then(setTipos)
      .catch(() => toast.addToast({ message: "Erro ao carregar tipos", type: "error" }))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchTipos(); }, []);

  function openCreate() {
    setEditTipo(null);
    setNome("");
    setModalOpen(true);
  }
  function openEdit(tipo: TipoDeficiencia) {
    setEditTipo(tipo);
    setNome(tipo.nome);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditTipo(null);
    setNome("");
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return toast.addToast({ message: "Nome obrigatório", type: "error" });
    setLoading(true);
    const op = editTipo
      ? api.atualizarTipo(editTipo.id, nome)
      : api.criarTipo(nome);
    op.then(() => {
      toast.addToast({ message: editTipo ? "Tipo atualizado" : "Tipo criado", type: "success" });
      fetchTipos();
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
    api.deletarTipo(deleteId)
      .then(() => {
        toast.addToast({ message: "Tipo excluído", type: "success" });
        fetchTipos();
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
        <h2 className="text-xl font-semibold">Tipos de Deficiência</h2>
        <Button variant="primary" onClick={openCreate}>Criar Novo</Button>
      </div>
      <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-3 text-blue-900 rounded">
        <strong>Instrução:</strong> Cadastre e gerencie os tipos de deficiência do sistema. Exemplo: Física, Visual, Auditiva...
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
            ) : tipos.length === 0 ? (
              <tr><td colSpan={2} className="text-center py-6">Nenhum tipo cadastrado</td></tr>
            ) : tipos.map(tipo => (
              <tr key={tipo.id} className="border-b last:border-0">
                <td className="px-4 py-2">{tipo.nome}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button variant="secondary" onClick={() => openEdit(tipo)}>Editar</Button>
                  <Button variant="danger" onClick={() => askDelete(tipo.id)}>Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CrudModal
        open={modalOpen}
        title={editTipo ? "Editar Tipo" : "Criar Tipo"}
        onClose={closeModal}
        onSubmit={handleSave}
        loading={loading}
        fields={[{
          label: "Nome",
          name: "nome",
          value: nome,
          onChange: setNome,
          required: true,
          maxLength: 60,
        }]}
        submitLabel={editTipo ? "Salvar" : "Criar"}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title="Excluir Tipo?"
        message="Tem certeza que deseja excluir este tipo? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        danger
      />
    </div>
  );
}
