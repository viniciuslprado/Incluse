
import { Router } from "express";
import { AdministradoresController } from "../../controllers/admin/administradores.controller";
import { verifyJWT, ensureRole } from "../../middleware/auth";
import adminDashboardRoutes from "./adminDashboardRoutes";
import adminCandidatesRoutes from "./adminCandidatesRoutes";
import adminJobsRoutes from "./adminJobsRoutes";


import adminDeficienciasRoutes from "./adminDeficienciasRoutes";
import adminCompaniesRoutes from "./adminCompaniesRoutes";
import adminLogsRoutes from "./adminLogsRoutes";

const router = Router();

// Todas as rotas exigem autenticação e role admin
router.use(verifyJWT, ensureRole('admin'));

// CRUD de administradores
router.post("/usuarios", AdministradoresController.criar);
router.get("/usuarios", AdministradoresController.listar);
router.get("/usuarios/:id", AdministradoresController.detalhar);
router.put("/usuarios/:id", AdministradoresController.atualizar);
router.delete("/usuarios/:id", AdministradoresController.deletar);

// Outras rotas admin
router.use(adminDashboardRoutes);
router.use(adminCandidatesRoutes);
router.use(adminJobsRoutes);
router.use("/deficiencias", adminDeficienciasRoutes);
router.use(adminCompaniesRoutes);
router.use(adminLogsRoutes);

export default router;
