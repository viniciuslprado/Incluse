
import CepInput from '../../components/CepInput';

type Props = {
  form: any;
  handleInput: (key: string, value: any) => void;
};

export default function Endereco({ form, handleInput }: Props) {
  const handleAddressFound = (address: { cidade: string; estado: string; bairro: string; logradouro: string; cep: string }) => {
    handleInput('cep', address.cep);
    handleInput('cidade', address.cidade);
    handleInput('estado', address.estado);
    handleInput('bairro', address.bairro);
    handleInput('rua', address.logradouro);
  };

  return (
    <section id="endereco" className="space-y-4">
      <h3 className="font-semibold">Endereço</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {/* CEP primeiro com busca automática */}
        <div className="md:col-span-1">
          <CepInput 
            onAddressFound={handleAddressFound}
            value={form.cep || ''}
            onChange={(value) => handleInput('cep', value)}
            className="w-full"
          />
        </div>
        
        {/* Bairro */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1">Bairro</label>
          <input 
            value={form.bairro || ''} 
            onChange={e => handleInput('bairro', e.target.value)} 
            placeholder="Bairro (opcional)" 
            className="w-full border rounded px-3 py-2" 
          />
        </div>
        
        {/* Rua/Logradouro - ocupa 2 colunas */}
        <div className="md:col-span-2">
          <input 
            value={form.rua || ''} 
            onChange={e => handleInput('rua', e.target.value)} 
            placeholder="Rua/Logradouro (opcional)" 
            className="w-full border rounded px-3 py-2" 
          />
        </div>
        
        {/* Número */}
        <div className="md:col-span-1">
          <input 
            value={form.numero || ''} 
            onChange={e => handleInput('numero', e.target.value)} 
            placeholder="Número (opcional)" 
            className="w-full border rounded px-3 py-2" 
          />
        </div>
        
        {/* Cidade */}
        <div className="md:col-span-1">
          <input 
            value={form.cidade || ''} 
            onChange={e => handleInput('cidade', e.target.value)} 
            placeholder="Cidade onde mora *" 
            className="w-full border rounded px-3 py-2" 
            aria-required="true"
          />
        </div>
        
        {/* Estado */}
        <div className="md:col-span-1">
          <input 
            value={form.estado || ''} 
            onChange={e => handleInput('estado', e.target.value)} 
            placeholder="Estado *" 
            className="w-full border rounded px-3 py-2" 
            aria-required="true"
          />
        </div>
        
        {/* Disponibilidade Geográfica */}
        
        {/* Aceita mudança */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Aceita mudança de cidade? *</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name="aceitaMudanca" 
                checked={form.aceitaMudanca === true} 
                onChange={() => handleInput('aceitaMudanca', true)}
              />
              <span>Sim</span>
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name="aceitaMudanca" 
                checked={form.aceitaMudanca === false} 
                onChange={() => handleInput('aceitaMudanca', false)}
              />
              <span>Não</span>
            </label>
          </div>
        </div>
        
        {/* Aceita viajar */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Aceita viajar a trabalho? *</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name="aceitaViajar" 
                checked={form.aceitaViajar === true} 
                onChange={() => handleInput('aceitaViajar', true)}
              />
              <span>Sim</span>
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name="aceitaViajar" 
                checked={form.aceitaViajar === false} 
                onChange={() => handleInput('aceitaViajar', false)}
              />
              <span>Não</span>
            </label>
          </div>
        </div>
        
        {/* Pretensão salarial (opcional) */}
        <div className="space-y-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Pretensão salarial mínima (opcional)</label>
          <input 
            type="number"
            value={form.pretensaoSalarialMin || ''} 
            onChange={e => handleInput('pretensaoSalarialMin', e.target.value)} 
            placeholder="Ex: 2500" 
            className="w-full border rounded px-3 py-2"
            min="0"
          />
          <p className="text-xs text-gray-500">Informação opcional que não afeta seu score de compatibilidade.</p>
        </div>
      </div>
    </section>
  );
}
