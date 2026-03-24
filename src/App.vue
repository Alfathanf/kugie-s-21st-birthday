<template>
  <div class="app-shell" @pointermove="heartTrail">
    <div class="floating-hearts"></div>
    <div class="main-wrapper">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAudio } from './composables/useAudio';

const pointerTimer = ref(null);

const { play } = useAudio();

onMounted(() => {
  play();
});

function heartTrail(event) {
  if (pointerTimer.value) return;
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.textContent = '💝';
  heart.style.left = `${event.pageX}px`;
  heart.style.top = `${event.pageY}px`;
  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 900);

  pointerTimer.value = setTimeout(() => {
    clearTimeout(pointerTimer.value);
    pointerTimer.value = null;
  }, 70);
}
</script>
