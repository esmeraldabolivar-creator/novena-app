const { BlobServiceClient } = require('@azure/storage-blob');

const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'eastus';
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER = 'novena-audio';

const prayers = {
  en: {
    HM: 'Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.',
    OF: 'Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.',
    GB: 'Glory be to the Father, and to the Son, and to the Holy Spirit, as it was in the beginning, is now, and ever shall be, world without end. Amen.',
    FA: 'O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to heaven, especially those in most need of Thy mercy. Amen.',
    HM5: Array(5).fill('Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.').join(' ')
  },
  es: {
    HM: 'Dios te salve, María, llena eres de gracia; el Señor es contigo; bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros pecadores, ahora y en la hora de nuestra muerte. Amén.',
    OF: 'Padre nuestro, que estás en el cielo, santificado sea tu nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en tentación, y líbranos del mal. Amén.',
    GB: 'Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.',
    FA: 'Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia. Amén.',
    HM5: Array(5).fill('Dios te salve, María, llena eres de gracia; el Señor es contigo; bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros pecadores, ahora y en la hora de nuestra muerte. Amén.').join(' ')
  }
};

const voices = { en: 'en-US-JennyNeural', es: 'es-MX-DaliaNeural' };
const langs = { en: 'en-US', es: 'es-MX' };

async function getToken() {
  const res = await fetch(`https://${AZURE_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY, 'Content-Length': '0' }
  });
  return res.text();
}

async function generateAudio(text, lang) {
  const token = await getToken();
  const ssml = `<speak version='1.0' xml:lang='${langs[lang]}'><voice name='${voices[lang]}'><prosody rate='0.85'>${text}</prosody></voice></speak>`;
  const res = await fetch(`https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
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
  const client = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const container = client.getContainerClient(CONTAINER);
  await container.createIfNotExists();
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
  console.log('Done! All fixed prayers pre-generated.');
}

main().catch(console.error);
