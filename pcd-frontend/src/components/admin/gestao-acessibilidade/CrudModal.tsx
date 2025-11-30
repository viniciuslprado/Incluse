import React from "react";
import Modal from "../../common/Modal";
import Button from "../../common/Button";

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
              <select
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-incluse-primary focus:border-incluse-primary transition shadow-sm appearance-none"
                value={f.value}
                onChange={e => f.onChange(e.target.value)}
                disabled={f.disabled}
                required={f.required}
              >
                <option value="">Selecione...</option>
                {f.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                className="input w-full"
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
