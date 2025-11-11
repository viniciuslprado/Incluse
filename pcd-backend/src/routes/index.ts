import { Router } from "express";
import tipos from "./tipos.routes";
import subtipos from "./subtipos.routes";
import barreiras from "./barreiras.routes";
import acessibilidades from "./acessibilidades.routes";
import vinculos from "./vinculos.routes";
import vagas from "./vagas.routes";
import empresas from "./empresas.routes";
import candidatos from "./candidatos.routes";
import match from "./match.routes";

const router = Router();

router.use("/tipos", tipos);
router.use("/subtipos", subtipos);
router.use("/barreiras", barreiras);
router.use("/acessibilidades", acessibilidades);
router.use("/vagas", vagas);
router.use("/empresas", empresas);
router.use("/candidatos", candidatos);
router.use("/match", match);
router.use("/", vinculos); // rotas de vínculo

export default router;