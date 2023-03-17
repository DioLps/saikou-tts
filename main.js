import { ChatClient } from '@twurple/chat'
;(async function () {
  const urlQuery = window.location.search.split('=')
  const channelName = urlQuery[1]
  if (!channelName) {
    return
  }

  function setSpeech() {
    return new Promise(function (resolve, reject) {
      let synth = window.speechSynthesis
      let id

      id = setInterval(() => {
        if (synth.getVoices().length !== 0) {
          resolve(synth.getVoices())
          clearInterval(id)
        }
      }, 10)
    })
  }

  // Crie uma nova instância do objeto SpeechSynthesisUtterance
  const voiceSyn = new SpeechSynthesisUtterance()

  voiceSyn.onerror = (e) => {
    console.log('e', e)
  }

  const chatClient = new ChatClient({ channels: [channelName] })
  chatClient.connect()
  const voices = await setSpeech()

  chatClient.onMessage((channel, user, text, msg) => {
    if (msg.isRedemption) {
      try {
        // Defina o texto que deve ser lido em voz alta
        voiceSyn.text = text

        // Escolha uma voz de leitura. Por exemplo, a primeira voz disponível:
        voiceSyn.voice = voices[0]

        // Defina a velocidade de leitura, variando de 0,1 (muito lento) a 10 (muito rápido)
        voiceSyn.rate = 1

        // Defina a altura da voz, variando de 0 (muito grave) a 2 (muito aguda)
        voiceSyn.pitch = 0.7

        // Inicie a leitura do texto em voz alta
        speechSynthesis.cancel()
        speechSynthesis.speak(voiceSyn)
      } catch (error) {
        console.log('error', error)
      }
    }
  })
})()
