import 'dotenv/config';
import express from "express";
import cors from "cors";

import path from "path";
// Using CommonJS __dirname (tsconfig set to commonjs)

import tiposRoutes from "./routes/common/tipos.routes.js";
import subtiposRoutes from "./routes/common/subtipos.routes.js";
import barreirasRoutes from "./routes/common/barreiras.routes.js";
import acessibilidadesRoutes from "./routes/common/acessibilidades.routes.js";
import vinculosRoutes from "./routes/common/vinculos.routes.js";
import vagasRoutes from "./routes/common/vagas.routes.js";
import processoSeletivoRoutes from "./routes/common/processo-seletivo.routes.js";
import areasFormacaoRoutes from "./routes/common/areas-formacao.routes.js";
import tiposDeficienciaRoutes from "./routes/common/tiposDeficienciaRoutes.js";
import acessibilidadesPublicRoutes from "./routes/common/acessibilidadesRoutes.js";

import adminRoutes from "./routes/admin/admin.routes.js";

import empresaUsuariosRoutes from "./routes/empresa/empresa-usuarios.routes.js";
import empresasRoutes from "./routes/empresa/empresas.routes.js";

import candidatosRoutes from "./routes/candidato/candidatos.routes.js";
import candidaturasRoutes from "./routes/candidato/candidaturas.routes.js";

import authRoutes from "./routes/public/auth.routes.js";

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ],
}));

app.use(express.json());
// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// usa os módulos de rotas
app.use("/tipos", tiposRoutes);
app.use("/subtipos", subtiposRoutes);
app.use("/vinculos", vinculosRoutes)
app.use("/barreiras", barreirasRoutes);
app.use("/acessibilidades", acessibilidadesRoutes);
app.use("/empresas", empresasRoutes);
app.use("/candidatos", candidatosRoutes);
app.use("/vagas", vagasRoutes);
app.use("/processo-seletivo", processoSeletivoRoutes);
app.use("/auth", authRoutes);
app.use("/tipos-deficiencia", tiposDeficienciaRoutes);
app.use("/acessibilidades", acessibilidadesPublicRoutes);

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