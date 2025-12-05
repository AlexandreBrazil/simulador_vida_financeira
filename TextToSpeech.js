// TextToSpeech.js

let speech = new SpeechSynthesisUtterance();
let voices = [];
let ttsGameObjectName = null; // Variável para armazenar o nome do GameObject

// Esta função é chamada pela Unity para registrar o nome do GameObject
function SetGameObjectName(name) {
  ttsGameObjectName = name;
  
  // Callback para quando as vozes do navegador estiverem carregadas
  window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    let formattedVoices = "";
    
    voices.forEach((item) => {
      formattedVoices += (item.name + ' (' + item.lang + ')' + ",");
    });
    
    formattedVoices = formattedVoices.slice(0, -1);
    
    // Envia a lista de vozes de volta para a Unity
    if (window.unityInstance && ttsGameObjectName) {
      window.unityInstance.SendMessage(ttsGameObjectName, "FillUpVoiceOptions", formattedVoices);
    }
  };

  // Dispara o callback manualmente caso as vozes já estejam carregadas
  voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    window.speechSynthesis.onvoiceschanged();
  }
}

function AdjustRate(rate) {
  speech.rate = rate;
}

function AdjustVolume(volume) {
  speech.volume = volume;
}

function AdjustPitch(pitch) {
  speech.pitch = pitch;
}

function ChangeVoice(index) {
  speech.voice = voices[index];
}

function StartToSpeak(msg) {
  speech.text = msg;

  speech.onend = (event) => {
    // Envia uma mensagem para a Unity quando a fala termina
    if (window.unityInstance && ttsGameObjectName) {
      window.unityInstance.SendMessage(ttsGameObjectName, "OnSpeechEnded", event.elapsedTime);
    }
    speech.onend = null; // Limpa o listener para evitar chamadas múltiplas
  };

  window.speechSynthesis.speak(speech);
}

function CancelSpeech() {
  window.speechSynthesis.cancel();
}
