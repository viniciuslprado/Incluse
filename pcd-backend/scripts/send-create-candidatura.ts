import 'dotenv/config';

async function main() {
  const url = 'http://localhost:3000/candidaturas/1';
  const body = { candidatoId: 8 };
  console.log('POST', url, 'body=', body);
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const text = await res.text();
    console.log('status', res.status);
    console.log('body', text);
  } catch (e) {
    console.error('request error', e);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
