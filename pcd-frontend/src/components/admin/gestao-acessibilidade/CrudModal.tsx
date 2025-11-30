import React from "react";
import Modal from "../../common/Modal";
import Button from "../../common/Button";

import CustomSelect from '../../common/CustomSelect';

interface CrudModalProps {
  open: boolean;
  title: string;
  fields: Array<{
    label: string;
    name: string;
    value: string | number;
    onChange: (v: string) => void;
    type?: string;
    options?: Array<{ value: string | number; label: string }>;
    disabled?: boolean;
    required?: boolean;
    as?: "input" | "select";
    maxLength?: number;
  }>;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
}

export default function CrudModal({
  open,
  title,
  fields,
  loading,
  onClose,
  onSubmit,
  submitLabel = "Salvar",
  cancelLabel = "Cancelar",
}: CrudModalProps) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map((f, i) => (
          <div key={f.name + i}>
            <label className="block mb-1 font-medium">{f.label}</label>
            {f.as === "select" ? (
              <CustomSelect
                value={f.value?.toString() ?? ''}
                onChange={f.onChange}
                options={[
                  { value: '', label: 'Selecione...' },
                  ...(f.options || []).map(opt => ({ value: opt.value.toString(), label: opt.label }))
                ]}
                disabled={f.disabled}
                className="w-full max-w-xs"
              />
            ) : (
              <input
                className={`input w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${f.name === 'descricao' || f.name === 'nome' ? '' : ''}`}
                value={f.value}
                onChange={e => f.onChange(e.target.value)}
                type={f.type || "text"}
                disabled={f.disabled}
                required={f.required}
                maxLength={f.maxLength}
                autoFocus={i === 0}
              />
            )}
          </div>
        ))}
        <div className="flex justify-end gap-2">
          <Button type="button" onClick={onClose} variant="neutral">{cancelLabel}</Button>
          <Button type="submit" variant="primary" disabled={loading}>{submitLabel}</Button>
        </div>
      </form>
    </Modal>
  );
}
