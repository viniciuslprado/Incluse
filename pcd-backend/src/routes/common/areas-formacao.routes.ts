import { Router } from 'express';
import { AreasFormacaoController } from '../../controllers/common/areas-formacao.controller';

const router = Router();


import { verifyJWT, ensureRole } from "../../middleware/auth";

// Listar todas as áreas de formação
router.get('/', AreasFormacaoController.listarTodas);

// Listar áreas vinculadas a um candidato (privado: candidato ou admin)
router.get('/candidato/:candidatoId', verifyJWT, ensureRole('candidato', 'admin'), AreasFormacaoController.listarPorCandidato);

// Vincular áreas a um candidato (privado: candidato ou admin)
router.post('/candidato/:candidatoId', verifyJWT, ensureRole('candidato', 'admin'), AreasFormacaoController.vincularAreas);

export default router;
