import 'dotenv/config';
import { CandidatosRepo } from '../src/repositories/candidato/candidatos.repo';

async function main() {
  const candidatoId = 8;
  const vagaId = 1;
  try {
    const ok = await CandidatosRepo.checkVagaMatch(candidatoId, vagaId);
    console.log(`checkVagaMatch(candidatoId=${candidatoId}, vagaId=${vagaId}) =>`, ok);
    process.exit(0);
  } catch (err) {
    console.error('Erro ao executar checkVagaMatch:', err);
    process.exit(1);
  }
}

main();
