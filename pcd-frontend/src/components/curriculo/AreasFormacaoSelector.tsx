import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../ui/Toast';

type AreaFormacao = {
  id: number;
  nome: string;
};

type Props = {
  candidatoId: number;
  onSave?: () => void;
};

export default function AreasFormacaoSelector({ candidatoId, onSave }: Props) {
  const [areas, setAreas] = useState<AreaFormacao[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    async function carregarDados() {
      try {
        const [todasAreas, areasVinculadas] = await Promise.all([
          api.listarAreasFormacao(),
          api.listarAreasFormacaoCandidato(candidatoId)
        ]);
        
        setAreas(todasAreas);
        setSelectedAreas(areasVinculadas.map((area: AreaFormacao) => area.id));
      } catch (err: any) {
        addToast({ type: 'error', title: 'Erro', message: 'Erro ao carregar áreas de formação' });
      } finally {
        setLoading(false);
      }
    }
    
    carregarDados();
  }, [candidatoId]);

  const toggleArea = (areaId: number) => {
    setSelectedAreas(prev => 
      prev.includes(areaId) 
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    );
  };

  const handleSave = async () => {
    if (selectedAreas.length === 0) {
      addToast({ type: 'error', title: 'Erro', message: 'Selecione pelo menos uma área de formação' });
      return;
    }

    setSaving(true);
    try {
      await api.vincularAreasFormacaoCandidato(candidatoId, selectedAreas);
      addToast({ type: 'success', title: 'Sucesso', message: 'Áreas de formação salvas!' });
      onSave?.();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Erro', message: 'Erro ao salvar áreas de formação' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4">Carregando áreas de formação...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Selecione uma ou mais áreas relacionadas à sua formação</h3>
        <p className="text-sm text-gray-600 mb-4">
          Use Ctrl/Cmd + clique para selecionar múltiplas áreas
        </p>
        
        {selectedAreas.length === 0 && (
          <p className="text-sm text-red-600 mb-4">
            Selecione pelo menos uma área de formação (ensino superior).
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded p-4 bg-gray-50">
        {areas.map(area => (
          <label 
            key={area.id} 
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
          >
            <input
              type="checkbox"
              checked={selectedAreas.includes(area.id)}
              onChange={() => toggleArea(area.id)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm">{area.nome}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || selectedAreas.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar Áreas'}
        </button>
      </div>
    </div>
  );
}