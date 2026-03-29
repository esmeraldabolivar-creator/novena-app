import { BlobServiceClient } from '@azure/storage-blob';

const CONTAINER = 'novena-audio';

async function getContainer() {
  const client = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  const container = client.getContainerClient(CONTAINER);
  await container.createIfNotExists({ access: 'blob' });
  return container;
}

async function getCachedAudio(key) {
  try {
    const container = await getContainer();
    const blob = container.getBlobClient(key);
    if (!await blob.exists()) return null;
    const download = await blob.download();
    const chunks = [];
    for await (const chunk of download.readableStreamBody) chunks.push(chunk);
    return Buffer.concat(chunks);
  } catch { return null; }
}

async function saveAudio(key, buffer) {
  try {
    const container = await getContainer();
    const blob = container.getBlockBlobClient(key);
    await blob.upload(buffer, buffer.length, { blobHTTPHeaders: { blobContentType: 'audio/mpeg' } });
  } catch(e) { console.error('Cache save error:', e); }
}

async function generateAudio(text, language) {
  const voice = language === 'es' ? 'es-MX-DaliaNeural' : 'en-US-JennyNeural';
  const lang = language === 'es' ? 'es-MX' : 'en-US';
  const ssml = `<speak version='1.0' xml:lang='${lang}'><voice name='${voice}'><prosody rate='0.85'>${text}</prosody></voice></speak>`;
  const tokenRes = await fetch(`https://eastus.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY, 'Content-Length': '0' },
  });
  const token = await tokenRes.text();
  const audioRes = await fetch(`https://eastus.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      'User-Agent': 'novena-app',
    },
    body: ssml,
  });
  return Buffer.from(await audioRes.arrayBuffer());
}

export async function POST(request) {
  const { text, language, cacheKey } = await request.json();
  const cleaned = text.trim().slice(0, 2500);
  const key = cacheKey ? `${cacheKey}-${language}.mp3` : null;
  try {
    if (key) {
      const cached = await getCachedAudio(key);
      if (cached) return new Response(cached, { headers: { 'Content-Type': 'audio/mpeg' } });
    }
    const audio = await generateAudio(cleaned, language);
    if (key) await saveAudio(key, audio);
    return new Response(audio, { headers: { 'Content-Type': 'audio/mpeg' } });
  } catch(error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}