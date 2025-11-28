import { Router } from 'express';
import * as ConfigController from '../../controllers/common/config.controller';

const router = Router();

// GET /candidatos/:candidatoId/config
router.get('/:candidatoId/config', ConfigController.getConfig);

// PUT /candidatos/:candidatoId/config
router.put('/:candidatoId/config', ConfigController.updateConfig);

// POST /candidatos/:candidatoId/alterar-senha
router.post('/:candidatoId/alterar-senha', ConfigController.alterarSenha);

// POST /candidatos/:candidatoId/aceitar-termos
router.post('/:candidatoId/aceitar-termos', ConfigController.aceitarTermos);

// POST /candidatos/:candidatoId/desativar-conta
router.post('/:candidatoId/desativar-conta', ConfigController.desativarConta);

// DELETE /candidatos/:candidatoId/excluir-conta
router.delete('/:candidatoId/excluir-conta', ConfigController.excluirConta);

export default router;
