// Cloudflare Pages Function: POST /api/waitlist
// Riceve i contatti dal modulo di /lezione-di-prova, valida e invia
// una email di notifica alla scuola tramite Resend.
// La chiave RESEND_API_KEY va impostata come variabile d'ambiente del
// progetto su Cloudflare Pages (e in .dev.vars per il test locale con wrangler).

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON non valido' }, 400);
  }

  const nome = String(body?.nome || '').trim();
  const cognome = String(body?.cognome || '').trim();
  const email = String(body?.email || '').trim();
  const telefono = String(body?.telefono || '').trim();
  const consenso = body?.consenso === true;

  if (!nome || !cognome || !email || !telefono || !consenso) {
    return json({ error: 'Campi mancanti' }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Email non valida' }, 400);
  }

  const ricevutoIl = new Date().toISOString();

  const testo = [
    'Nuova richiesta dalla pagina Lezione di prova.',
    '',
    `Nome: ${nome}`,
    `Cognome: ${cognome}`,
    `Email: ${email}`,
    `Telefono: ${telefono}`,
    `Consenso privacy: ${consenso ? 'sì' : 'no'}`,
    `Ricevuto il: ${ricevutoIl}`,
  ].join('\n');

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Open Day Sala Marea <openday@send.saladarmimarea.it>',
      to: ['info@saladarmimarea.it'],
      reply_to: email,
      subject: `Nuovo interesse Open Day: ${nome} ${cognome}`,
      text: testo,
    }),
  });

  if (!resendResponse.ok) {
    return json({ error: 'Invio non riuscito' }, 502);
  }

  return json({ ok: true }, 200);
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
