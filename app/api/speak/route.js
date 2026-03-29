export async function POST(request) {
  const { text, language } = await request.json();
  
  const voice = language === 'es' ? 'es-MX-DaliaNeural' : 'en-US-JennyNeural';
  
  const ssml = `
    <speak version='1.0' xml:lang='${language === 'es' ? 'es-MX' : 'en-US'}'>
      <voice name='${voice}'>
        <prosody rate='0.85'>
          ${text}
        </prosody>
      </voice>
    </speak>
  `;

  const response = await fetch(
    `https://${process.env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      },
      body: ssml,
    }
  );

  const audioBuffer = await response.arrayBuffer();
  
  return new Response(audioBuffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
    },
  });
}