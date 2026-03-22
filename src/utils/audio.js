export function canUseSpeechSynthesis() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stopSpeechPlayback() {
  if (canUseSpeechSynthesis()) {
    window.speechSynthesis.cancel();
  }
}

export function speakArabicText(text, playbackRate = 1, callbacks = {}) {
  if (!canUseSpeechSynthesis() || !text) {
    return null;
  }

  stopSpeechPlayback();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = Math.min(Math.max(playbackRate, 0.5), 1);
  utterance.pitch = 1;

  const voices = window.speechSynthesis.getVoices();
  const arabicVoice = voices.find((voice) => voice.lang?.toLowerCase().startsWith('ar'));
  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  if (callbacks.onStart) {
    utterance.onstart = callbacks.onStart;
  }

  utterance.onend = () => {
    callbacks.onEnd?.();
  };

  utterance.onerror = (event) => {
    callbacks.onError?.(event);
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function toggleSpeechPause(isPlaying) {
  if (!canUseSpeechSynthesis()) {
    return false;
  }

  if (isPlaying && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause();
    return true;
  }

  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    return true;
  }

  return false;
}
