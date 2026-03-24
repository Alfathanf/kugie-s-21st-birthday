let audioInstance = null;

function createAudio() {
  if (audioInstance) return audioInstance;

  audioInstance = new Audio('/assets/audio/background.mp3');
  audioInstance.loop = true;
  audioInstance.volume = 0.18;
  audioInstance.preload = 'auto';
  audioInstance.crossOrigin = 'anonymous';

  function tryPlay() {
    audioInstance.play().catch(() => {
      // Autoplay restrictions: will play on first user interaction
      document.addEventListener('click', () => audioInstance.play().catch(() => {}), { once: true });
      document.addEventListener('touchstart', () => audioInstance.play().catch(() => {}), { once: true });
    });
  }

  tryPlay();
  return audioInstance;
}

export function useAudio() {
  const audio = createAudio();

  return {
    audio,
    play() {
      return audio.play().catch(() => {});
    },
    pause() {
      audio.pause();
    },
    setVolume(value) {
      audio.volume = Math.max(0, Math.min(1, value));
    }
  };
}
