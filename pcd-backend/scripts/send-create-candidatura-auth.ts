import 'dotenv/config';
import jwt from 'jsonwebtoken';

async function main() {
  const candidatoId = 8;
  const vagaId = 1;
  const secret = process.env.JWT_SECRET || 'dev-secret';
  const token = jwt.sign({ sub: candidatoId, role: 'candidato' }, secret, { expiresIn: '1h' });

  const url = `http://localhost:3000/candidaturas/${vagaId}`;
  console.log('POST', url, 'as candidato', candidatoId);

  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({}) });
    const text = await res.text();
    console.log('status', res.status);
    console.log('body', text);
  } catch (e) {
    console.error('request error', e);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
