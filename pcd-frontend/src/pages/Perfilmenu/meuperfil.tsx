import React from 'react';

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
          <input aria-required="true" value={form.telefone} onChange={e => handleInput('telefone', e.target.value)} placeholder="Telefone" className="p-3 border rounded w-full" />
          {errors.telefone && <div className="text-xs text-red-600 mt-1">{errors.telefone}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium">Nome social <span className="text-sm text-gray-500">(opcional)</span></label>
          <input value={form.nomeSocial} onChange={e => handleInput('nomeSocial', e.target.value)} placeholder="Nome social (opcional)" className="p-3 border rounded w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Nome de usuário <span className="text-sm text-gray-500">(opcional)</span></label>
          <input value={form.username} onChange={e => handleInput('username', e.target.value)} placeholder="@usuário (opcional)" className="p-3 border rounded w-full" />
        </div>
      </section>
    </>
  );
}
