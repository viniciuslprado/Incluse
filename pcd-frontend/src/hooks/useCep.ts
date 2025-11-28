import { useState } from 'react';
import cep from 'cep-promise';

interface CepData {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
}

export function useCep() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarCepViaCEP = async (cleanCep: string): Promise<CepData> => {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }
    
    return {
      cep: cleanCep,
      state: data.uf,
      city: data.localidade,
      neighborhood: data.bairro,
      street: data.logradouro
    };
  };

  const buscarCep = async (cepValue: string): Promise<CepData | null> => {
    if (!cepValue || cepValue.replace(/\D/g, '').length !== 8) {
      setError('CEP deve ter 8 dígitos');
      return null;
    }

    setLoading(true);
    setError(null);

    const cleanCep = cepValue.replace(/\D/g, '');

    // Estratégia 1: cep-promise (melhor - múltiplas APIs com fallback)
    try {
      const data = await cep(cleanCep);
      setLoading(false);
      console.log('✅ CEP encontrado via cep-promise');
      return data;
    } catch (err) {
      console.warn('⚠️ cep-promise falhou (possível CORS), tentando ViaCEP direto:', err);
    }

    // Estratégia 2: ViaCEP direto (sem CORS)
    try {
      const data = await buscarCepViaCEP(cleanCep);
      setLoading(false);
      console.log('✅ CEP encontrado via ViaCEP direto');
      return data;
    } catch (fallbackErr) {
      console.warn('⚠️ ViaCEP direto também falhou:', fallbackErr);
    }

    // Estratégia 3: Postmon (alternativa)
    try {
      const response = await fetch(`https://api.postmon.com.br/v1/cep/${cleanCep}`);
      const data = await response.json();
      
      if (!data.logradouro && !data.district) {
        throw new Error('CEP não encontrado no Postmon');
      }
      
      setLoading(false);
      console.log('✅ CEP encontrado via Postmon');
      return {
        cep: cleanCep,
        state: data.state,
        city: data.city,
        neighborhood: data.district,
        street: data.logradouro
      };
    } catch (postmonErr) {
      console.warn('⚠️ Postmon também falhou:', postmonErr);
    }

    // Todas as estratégias falharam
    console.error('❌ Todas as APIs de CEP falharam');
    setError('CEP não encontrado. Tente novamente.');
    setLoading(false);
    return null;
  };

  return { buscarCep, loading, error };
}