
import 'dotenv/config';
import express from "express";
import cors from "cors";
import path from "path";

import tiposRoutes from "./routes/common/tipos.routes";
import subtiposRoutes from "./routes/common/subtipos.routes";
import barreirasRoutes from "./routes/common/barreiras.routes";
import acessibilidadesRoutes from "./routes/common/acessibilidades.routes";
import vinculosRoutes from "./routes/common/vinculos.routes";
import vagasRoutes from "./routes/common/vagas.routes";
import matchRoutes from "./routes/common/match.routes";
import processoSeletivoRoutes from "./routes/common/processo-seletivo.routes";
import areasFormacaoRoutes from "./routes/common/areas-formacao.routes";

import adminRoutes from "./routes/admin/admin.routes";

import empresaUsuariosRoutes from "./routes/empresa/empresa-usuarios.routes";
import empresasRoutes from "./routes/empresa/empresas.routes";

import candidatosRoutes from "./routes/candidato/candidatos.routes";
import candidaturasRoutes from "./routes/candidato/candidaturas.routes";

import authRoutes from "./routes/public/auth.routes";

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ],
}));

app.use(express.json());
// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
// usa os módulos de rotas
app.use("/tipos", tiposRoutes);
app.use("/subtipos", subtiposRoutes);
app.use("/vinculos", vinculosRoutes)
app.use("/barreiras", barreirasRoutes);
app.use("/acessibilidades", acessibilidadesRoutes);
app.use("/empresa", empresasRoutes);
app.use("/vagas", vagasRoutes);
app.use("/processo-seletivo", processoSeletivoRoutes);
app.use("/auth", authRoutes);
app.use("/match", matchRoutes);

app.use("/admin", adminRoutes);
app.use("/areas-formacao", areasFormacaoRoutes);
app.use("/candidaturas", candidaturasRoutes);


app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Erro interno" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});