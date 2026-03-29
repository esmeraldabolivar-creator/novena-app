export async function POST(request) {
  const { text, language } = await request.json();
  
  const voice = language === 'es' ? 'es-MX-DaliaNeural' : 'en-US-JennyNeural';
  const lang = language === 'es' ? 'es-MX' : 'en-US';
  
  const ssml = `<speak version='1.0' xml:lang='${lang}'><voice name='${voice}'><prosody rate='0.85'>${text}</prosody></voice></speak>`;

  try {
    const tokenResponse = await fetch(
      `https://eastus.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
          'Content-Length': '0',
        },
      }
    );

    const token = await tokenResponse.text();

    const audioResponse = await fetch(
      `https://eastus.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          'User-Agent': 'novena-app',
        },
        body: ssml,
      }
    );

    const audioBuffer = await audioResponse.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch(error) {
    return new Response(JSON.stringify({error: error.message}), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  }
}
```

Press **Command + S** to save, then run the three git commands again:
```
git add .
```
```
git commit -m "fix azure tts"
```
```
git push https://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@github.com/esmeraldabolivar-creator/novena-app.git main