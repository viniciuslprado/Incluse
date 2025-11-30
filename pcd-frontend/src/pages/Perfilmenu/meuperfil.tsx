
import CustomSelect from '../../components/common/CustomSelect';
import { formatPhone } from '../../utils/formatters';

type Props = {
  avatarPreview: string | null;
  candidato: any;
  fileRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeAvatar: () => void;
  form: any;
  handleInput: (key: string, value: any) => void;
  errors: Record<string,string>;
};

export default function MeuPerfil({ avatarPreview, candidato, fileRef, handleFileChange, removeAvatar, form, handleInput, errors }: Props) {
  return (
    <>
      <div id="perfil-overview" className="flex flex-col items-center text-center gap-6">
        <div className="w-full flex justify-center">
          <div className="text-center">
            <div className="text-sm font-medium mb-2">Foto de perfil</div>
            <img src={avatarPreview ?? candidato?.fotoUrl ?? '/vite.svg'} alt="Avatar" className="w-32 h-32 rounded-full object-cover border mx-auto" />
            <div className="mt-3 flex items-center gap-2 justify-center">
              <label className="cursor-pointer px-3 py-1 rounded bg-gray-100 text-sm" htmlFor="avatarFile">Upload / Alterar</label>
              <input ref={fileRef} id="avatarFile" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" aria-label="Alterar foto de perfil" />
              <button onClick={removeAvatar} className="px-3 py-1 rounded bg-red-50 text-red-600 text-sm" aria-label="Remover foto de perfil">Remover</button>
            </div>
          </div>
        </div>
      </div>

      <section id="dados-pessoais" className="space-y-4">
        <h3 className="text-sm text-gray-500 mb-2">Dados pessoais</h3>
        <div>
          <label className="block text-sm font-medium">Nome completo<span className="text-red-600">*</span></label>
          <input aria-required="true" value={form.nome} onChange={e => handleInput('nome', e.target.value)} placeholder="Nome completo (ou deixe em branco e preencha Nome Social)" className="p-3 border rounded w-full" />
          {errors.nome && <div className="text-xs text-red-600 mt-1">{errors.nome}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium">CPF <span className="text-red-600">*</span></label>
          <input aria-required="true" value={form.cpf} disabled placeholder="CPF" className="p-3 border rounded bg-gray-50 w-full" />
          {errors.cpf && <div className="text-xs text-red-600 mt-1">{errors.cpf}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium">E-mail <span className="text-red-600">*</span></label>
          <input aria-required="true" value={form.email} onChange={e => handleInput('email', e.target.value)} placeholder="Email" className="p-3 border rounded w-full" />
          {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium">Celular <span className="text-red-600">*</span></label>
          <input 
            aria-required="true" 
            value={formatPhone(form.telefone || '')} 
            onChange={e => {
              const unformatted = e.target.value.replace(/\D/g, '');
              handleInput('telefone', unformatted);
            }}
            placeholder="+55 (DD) 9XXXX-XXXX" 
            className="p-3 border rounded w-full" 
          />
          <div className="text-xs text-gray-500 mt-1">Formato: +55 (DD) 9XXXX-XXXX</div>
          {errors.telefone && <div className="text-xs text-red-600 mt-1">{errors.telefone}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium">Nome de usuário <span className="text-sm text-gray-500">(opcional)</span></label>
          <input value={form.username} onChange={e => handleInput('username', e.target.value)} placeholder="@usuário (opcional)" className="p-3 border rounded w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Escolaridade <span className="text-red-600">*</span></label>
          <CustomSelect
            value={form.escolaridade || ''}
            onChange={val => handleInput('escolaridade', val)}
            options={[
              { value: '', label: 'Selecione sua escolaridade' },
              { value: 'Ensino Fundamental Incompleto', label: 'Ensino Fundamental Incompleto' },
              { value: 'Ensino Fundamental Completo', label: 'Ensino Fundamental Completo' },
              { value: 'Ensino Médio Incompleto', label: 'Ensino Médio Incompleto' },
              { value: 'Ensino Médio Completo', label: 'Ensino Médio Completo' },
              { value: 'Ensino Superior Incompleto', label: 'Ensino Superior Incompleto' },
              { value: 'Ensino Superior Completo', label: 'Ensino Superior Completo' },
              { value: 'Pós-graduação', label: 'Pós-graduação' },
              { value: 'Mestrado', label: 'Mestrado' },
              { value: 'Doutorado', label: 'Doutorado' },
            ]}
            placeholder="Selecione sua escolaridade"
            className="w-full"
          />
          {errors.escolaridade && <div className="text-xs text-red-600 mt-1">{errors.escolaridade}</div>}
        </div>
        {form.escolaridade && /superior|pós|mestrado|doutorado/i.test(form.escolaridade) && (
          <div>
            <label className="block text-sm font-medium mb-2">Área de formação <span className="text-red-600">*</span></label>
            <p className="text-xs text-gray-500 mb-2">Selecione uma ou mais áreas relacionadas à sua formação</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded p-4 bg-gray-50">
              {form.areasFormacaoDisponiveis?.sort((a: any, b: any) => a.nome.localeCompare(b.nome)).map((area: any) => (
                <label key={area.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={(form.areasFormacao || []).includes(area.id)}
                    onChange={(e) => {
                      const current = form.areasFormacao || [];
                      const updated = e.target.checked 
                        ? [...current, area.id]
                        : current.filter((id: number) => id !== area.id);
                      handleInput('areasFormacao', updated);
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm">{area.nome}</span>
                </label>
              ))}
            </div>
            {errors.areasFormacao && <div className="text-xs text-red-600 mt-1">{errors.areasFormacao}</div>}
          </div>
        )}
      </section>
    </>
  );
}
