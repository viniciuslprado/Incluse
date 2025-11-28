import { useState } from 'react';
import { useCep } from '../hooks/useCep';

interface Props {
  onAddressFound: (address: { cidade: string; estado: string; bairro: string; logradouro: string; cep: string }) => void;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function CepInput({ onAddressFound, className = '', value = '', onChange }: Props) {
  const [cep, setCep] = useState(value);
  const { buscarCep, loading, error } = useCep();

  const handleCepChange = (value: string) => {
    const formatted = value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
    setCep(formatted);
    onChange?.(formatted);
  };

  const handleCepBlur = async () => {
    if (cep.length === 9) {
      const data = await buscarCep(cep);
      if (data) {
        onAddressFound({
          cidade: data.city,
          estado: data.state,
          bairro: data.neighborhood,
          logradouro: data.street,
          cep: cep
        });
      }
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">CEP</label>
      <input
        type="text"
        value={cep}
        onChange={(e) => handleCepChange(e.target.value)}
        onBlur={handleCepBlur}
        placeholder="00000-000"
        maxLength={9}
        className="w-full border rounded px-3 py-2"
      />
      {loading && <p className="text-sm text-blue-600 mt-1">Buscando...</p>}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}