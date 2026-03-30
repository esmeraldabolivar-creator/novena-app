require('dotenv').config();
const { BlobServiceClient } = require('@azure/storage-blob');

const REGION = process.env.AZURE_SPEECH_REGION || 'eastus';
const SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const CONN_STR = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER = 'novena-audio';

const HM_EN = 'Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.';
const HM_ES = 'Dios te salve, María, llena eres de gracia; el Señor es contigo; bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros pecadores, ahora y en la hora de nuestra muerte. Amén.';

const prayers = {
  en: {
    HM: HM_EN,
    HM5: Array(5).fill(HM_EN).join(' '),
    OF: 'Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.',
    GB: 'Glory be to the Father, and to the Son, and to the Holy Spirit, as it was in the beginning, is now, and ever shall be, world without end. Amen.',
    FA: 'O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to heaven, especially those in most need of Thy mercy. Amen.'
  },
  es: {
    HM: HM_ES,
    HM5: Array(5).fill(HM_ES).join(' '),
    OF: 'Padre nuestro, que estás en el cielo, santificado sea tu nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en tentación, y líbranos del mal. Amén.',
    GB: 'Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.',
    FA: 'Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia. Amén.'
  }
};

const voices = { en: 'en-US-JennyNeural', es: 'es-MX-DaliaNeural' };
const langCodes = { en: 'en-US', es: 'es-MX' };

async function getToken(lang) {
  const res = await fetch(`https://${REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': SPEECH_KEY, 'Content-Length': '0' }
  });
  return res.text();
}

async function generateAudio(text, lang) {
  const token = await getToken(lang);
  const ssml = `<speak version='1.0' xml:lang='${langCodes[lang]}'><voice name='${voices[lang]}'><prosody rate='0.85'>${text}</prosody></voice></speak>`;
  const res = await fetch(`https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      'User-Agent': 'novena-app'
    },
    body: ssml
  });
  return Buffer.from(await res.arrayBuffer());
}

async function saveToBlob(key, buffer) {
  const client = BlobServiceClient.fromConnectionString(CONN_STR);
  const container = client.getContainerClient(CONTAINER);
  await container.createIfNotExists({ access: 'blob' });
  const blob = container.getBlockBlobClient(key);
  await blob.upload(buffer, buffer.length, { blobHTTPHeaders: { blobContentType: 'audio/mpeg' } });
  console.log('Saved:', key);
}

async function main() {
  for (const lang of ['en', 'es']) {
    for (const [name, text] of Object.entries(prayers[lang])) {
      const key = `fixed-${name}-${lang}.mp3`;
      console.log(`Generating ${key}...`);
      const audio = await generateAudio(text, lang);
      await saveToBlob(key, audio);
    }
  }
  console.log('Done!');
}

main().catch(console.error);
