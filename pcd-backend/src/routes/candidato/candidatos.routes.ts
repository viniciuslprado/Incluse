import { Router } from "express";
import multer from "multer";
import multerConfig from "../../config/multer";
import { CandidatosController } from "../../controllers/candidato/candidatos.controller";
import { verifyJWT, ensureSelfCandidate, ensureRole } from "../../middleware/auth";
import { uploadCurriculo } from "../../middleware/upload-curriculo";
import { NotificacoesController } from "../../controllers/common/notificacoes.controller";
import { CurriculoController } from "../../controllers/candidato/curriculo.controller";
import * as ConfigController from "../../controllers/common/config.controller";
import { MatchController } from "../../controllers/common/match.controller";
const router = Router();
// Laudo médico
router.get('/:id/laudo', verifyJWT, ensureSelfCandidate, CandidatosController.getLaudo);
router.delete('/:id/laudo', verifyJWT, ensureSelfCandidate, CandidatosController.excluirLaudo);
// Upload de laudo médico
router.post('/:id/laudo', verifyJWT, ensureSelfCandidate, multer({
	storage: multerConfig.upload('uploads').storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
		if (!allowed.includes(file.mimetype)) {
			return cb(new Error('O laudo deve ser PDF ou imagem (JPG/PNG)'));
		}
		cb(null, true);
	}
}).single('laudo'), CandidatosController.uploadLaudo);
// Configure multer for PDF uploads with size + MIME validation
const pdfUpload = multer({
	storage: multerConfig.upload("uploads").storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
	fileFilter: (req, file, cb) => {
		const isCurriculo = file.fieldname === 'file';
		const isLaudo = file.fieldname === 'laudo';
		const mime = file.mimetype;
		if (isCurriculo) {
			if (mime !== 'application/pdf') {
				return cb(new Error('O currículo deve ser um arquivo PDF'));
			}
			return cb(null, true);
		}
		if (isLaudo) {
			const allowedLaudo = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
			if (!allowedLaudo.includes(mime)) {
				return cb(new Error('O laudo deve ser PDF ou imagem (JPG/PNG)'));
			}
			return cb(null, true);
		}
		// Qualquer outro campo de arquivo não é permitido aqui
		return cb(new Error('Campo de arquivo não suportado'));
	},
}).fields([
	{ name: "file", maxCount: 1 },
	{ name: "laudo", maxCount: 1 },
]);

// POST /candidatos → criar candidato (aceita arquivos opcionais 'file' e 'laudo')
router.post("/", pdfUpload, CandidatosController.criar);

// Validation endpoints (public, for real-time checking)
router.get("/check-cpf/:cpf", CandidatosController.checkCpf);
router.get("/check-email/:email", CandidatosController.checkEmail);

// Compatibilidade com frontend: rota /candidatos/cpf/:cpf/exists
import { CandidatosService } from '../../services/candidato/candidatos.service';
router.get("/cpf/:cpf/exists", async (req, res) => {
	try {
		const { cpf } = req.params;
		const exists = await CandidatosService.checkCpfExists(cpf);
		res.json({ exists: !!exists });
	} catch (e) {
		res.status(500).json({ error: 'Erro ao verificar CPF' });
	}
});

// GET /candidato/:id/inicio (substitui o antigo /:id)
router.get("/:id/inicio", CandidatosController.getCandidato);

// GET /candidato/:id/match - retorna vagas compatíveis para o candidato
router.get("/:id/match", MatchController.matchCandidato);

// PUT /candidatos/:id
router.put("/:id", verifyJWT, ensureSelfCandidate, CandidatosController.atualizar);

// GET /candidatos/:id/subtipos (temporário sem auth para desenvolvimento)
router.get("/:id/subtipos", CandidatosController.listarSubtipos);

// GET /candidatos/:id/areas-formacao
router.get("/:id/areas-formacao", CandidatosController.listarAreasFormacao);

// POST /candidatos/:id/subtipos
router.post("/:id/subtipos", CandidatosController.vincularSubtipos);

// POST /candidatos/:id/subtipos/:subtipoId/barreiras
router.post("/:id/subtipos/:subtipoId/barreiras", CandidatosController.vincularBarreiras);

// Upload de currículo
router.post("/curriculo", verifyJWT, ensureRole('candidato'), uploadCurriculo.single('curriculo'), CandidatosController.uploadCurriculo);

// Favoritos (temporário sem auth para desenvolvimento)
router.post("/:id/favoritos/:vagaId", CandidatosController.favoritarVaga);
router.delete("/:id/favoritos/:vagaId", CandidatosController.desfavoritarVaga);
router.get("/:id/favoritos", CandidatosController.listarFavoritos);

// Notificações (temporário sem auth para desenvolvimento)
router.get("/:id/notificacoes", NotificacoesController.listar);
router.patch("/:id/notificacoes/:notifId/lida", NotificacoesController.marcarLida);
router.patch("/:id/notificacoes/marcar-todas-lidas", NotificacoesController.marcarTodasLidas);

// Configurações (temporário sem auth para desenvolvimento)
router.get("/:id/config", ConfigController.getConfig);
router.put("/:id/config", ConfigController.updateConfig);
router.post("/:id/alterar-senha", ConfigController.alterarSenha);
router.post("/:id/aceitar-termos", ConfigController.aceitarTermos);
router.post("/:id/desativar-conta", ConfigController.desativarConta);
router.delete("/:id/excluir-conta", ConfigController.excluirConta);

// Desativar/Reativar conta
router.patch("/:id/desativar", verifyJWT, ensureSelfCandidate, CandidatosController.desativarConta);
router.patch("/:id/reativar", CandidatosController.reativarConta);

// Excluir conta
router.delete("/:id", verifyJWT, ensureSelfCandidate, CandidatosController.excluirConta);

// Currículo (temporário sem auth para empresas visualizarem)
router.get("/:id/curriculo", CurriculoController.obter);
router.get("/:id/curriculo/download", CurriculoController.downloadPdf);
router.put("/:id/curriculo/dados-pessoais", verifyJWT, ensureSelfCandidate, CurriculoController.atualizarDados);

// Experiências
router.post("/:id/curriculo/experiencias", verifyJWT, ensureSelfCandidate, CurriculoController.adicionarExperiencia);
router.put("/:id/curriculo/experiencias/:expId", verifyJWT, ensureSelfCandidate, CurriculoController.atualizarExperiencia);
router.delete("/:id/curriculo/experiencias/:expId", verifyJWT, ensureSelfCandidate, CurriculoController.removerExperiencia);

// Formações
router.post("/:id/curriculo/formacoes", verifyJWT, ensureSelfCandidate, CurriculoController.adicionarFormacao);
router.put("/:id/curriculo/formacoes/:formId", verifyJWT, ensureSelfCandidate, CurriculoController.atualizarFormacao);
router.delete("/:id/curriculo/formacoes/:formId", verifyJWT, ensureSelfCandidate, CurriculoController.removerFormacao);

// Cursos
router.post("/:id/curriculo/cursos", verifyJWT, ensureSelfCandidate, CurriculoController.adicionarCurso);
router.put("/:id/curriculo/cursos/:cursoId", verifyJWT, ensureSelfCandidate, CurriculoController.atualizarCurso);
router.delete("/:id/curriculo/cursos/:cursoId", verifyJWT, ensureSelfCandidate, CurriculoController.removerCurso);

// Competências
router.post("/:id/curriculo/competencias", verifyJWT, ensureSelfCandidate, CurriculoController.adicionarCompetencia);
router.put("/:id/curriculo/competencias/:compId", verifyJWT, ensureSelfCandidate, CurriculoController.atualizarCompetencia);
router.delete("/:id/curriculo/competencias/:compId", verifyJWT, ensureSelfCandidate, CurriculoController.removerCompetencia);

// Idiomas
router.post("/:id/curriculo/idiomas", verifyJWT, ensureSelfCandidate, CurriculoController.adicionarIdioma);
router.put("/:id/curriculo/idiomas/:idiomaId", verifyJWT, ensureSelfCandidate, CurriculoController.atualizarIdioma);
router.delete("/:id/curriculo/idiomas/:idiomaId", verifyJWT, ensureSelfCandidate, CurriculoController.removerIdioma);


export default router;
// Arquivo removido após padronização para /candidato.routes.ts
