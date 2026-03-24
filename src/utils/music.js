import { reactive } from 'vue';

const bgAudio = new Audio('/assets/audio/background.mp3');
bgAudio.loop = true;
bgAudio.volume = 0.3;

const state = reactive({
  isPlaying: false,
  initialized: false,
  error: null
});

function start() {
  if (!state.isPlaying) {
    bgAudio.play()
      .then(() => {
        state.isPlaying = true;
        state.initialized = true;
      })
      .catch(err => {
        state.error = err;
      });
  }
}

function pause() {
  if (state.isPlaying) {
    bgAudio.pause();
    state.isPlaying = false;
  }
}

function setTime(time) {
  bgAudio.currentTime = time;
}

function getState() {
  return state;
}

export default {
  start,
  pause,
  setTime,
  getState
};
