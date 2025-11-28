import { useState } from "react";
import TiposTab from "../../components/admin/gestao-acessibilidade/TiposTab";
import SubtiposTab from "../../components/admin/gestao-acessibilidade/SubtiposTab";
import BarreirasTab from "../../components/admin/gestao-acessibilidade/BarreirasTab";
import AcessibilidadesTab from "../../components/admin/gestao-acessibilidade/AcessibilidadesTab";

const TABS = [
  { key: "tipos", label: "Tipos de Deficiência" },
  { key: "subtipos", label: "Subtipos" },
  { key: "barreiras", label: "Barreiras" },
  { key: "acessibilidades", label: "Acessibilidades" },
];

export default function GestaoAcessibilidadePage() {
  const [tab, setTab] = useState("tipos");

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold mb-6">Gestão de Acessibilidade</h1>
      <div className="flex gap-2 border-b mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${tab === t.key ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 dark:text-gray-300"}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>
        {tab === "tipos" && <TiposTab />}
        {tab === "subtipos" && <SubtiposTab />}
        {tab === "barreiras" && <BarreirasTab />}
        {tab === "acessibilidades" && <AcessibilidadesTab />}
      </div>
    </div>
  );
}
