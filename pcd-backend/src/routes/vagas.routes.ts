import { Router } from "express";
import { VagasController } from "../controllers/vagas.controller";

const r = Router();

r.get("/empresa/:id", VagasController.listar);
r.get("/:id", VagasController.detalhar);
r.post("/", VagasController.criar);

// N:N
r.post("/:id/subtipos", VagasController.vincularSubtipos);
r.post("/:id/acessibilidades", VagasController.vincularAcessibilidades);

export default r;