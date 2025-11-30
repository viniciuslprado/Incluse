
import { Router } from "express";
import admin from "./admin/admin.routes";
import tipos from "./common/tipos.routes";
import subtipos from "./common/subtipos.routes";
import barreiras from "./common/barreiras.routes";
import acessibilidades from "./common/acessibilidades.routes";
import vinculos from "./common/vinculos.routes";
import vagas from "./common/vagas.routes";
import empresa from "./empresa/empresas.routes";
import candidato from "./candidato/candidatos.routes";
import candidaturas from "./candidato/candidaturas.routes";
import auth from "./public/auth.routes";
import publicTipos from "./public/tipos.routes";
import areasFormacao from "./common/areas-formacao.routes";

const router = Router();

router.use("/admin", admin);
router.use("/auth", auth);
router.use("/public/tipos", publicTipos);
router.use("/tipos", tipos);
router.use("/subtipos", subtipos);
router.use("/barreiras", barreiras);
router.use("/acessibilidades", acessibilidades);
router.use("/vagas", vagas);
router.use("/empresas", empresa);
router.use("/candidato", candidato);
router.use("/candidaturas", candidaturas);
router.use("/areas-formacao", areasFormacao);
router.use("/", vinculos); // rotas de vínculo

export default router;