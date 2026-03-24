<template>
  <section class="screen lock-screen">
    <div class="lock-card">
      <div class="title-container">
        <h1>🎂 Happy 21st</h1>
        <p class="subtitle">Enter Your PIN to unlock your gifts</p>
      </div>
      <div class="pin-display">
        <span v-for="n in 6" :key="n" :class="['pin-dot', { filled: n <= pinValue.length }]" />
      </div>

      <div class="keypad">
        <button v-for="num in digits" :key="num" class="key" @click="addDigit(num)">{{ num }}</button>
        <button class="key key-empty"> </button>
        <button class="key" @click="addDigit('0')">0</button>
        <button class="key key-delete" @click="deleteDigit()">⌫</button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const CORRECT_PIN = '150622';
const router = useRouter();
const pinValue = ref('');
const error = ref('');
const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

function addDigit(value) {
  if (pinValue.value.length >= 6) return;
  pinValue.value += value;
  if (pinValue.value.length === 6) {
    setTimeout(checkPin, 250);
  }
}

function deleteDigit() {
  pinValue.value = pinValue.value.slice(0, -1);
}

function checkPin() {
  if (pinValue.value === CORRECT_PIN) {
    error.value = '';
    router.push('/menu');
  } else {
    error.value = 'Incorrect PIN. Try again!';
    pinValue.value = '';
  }
}
</script>

<style scoped>
.lock-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.lock-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  animation: slideInAndFade 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideInAndFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title-container {
  text-align: center;
  margin-bottom: 8px;
}

.title-container h1 {
  font-size: 32px;
  margin-bottom: 4px;
}

.subtitle {
  color: #9f2d5f;
  font-size: 14px;
  font-weight: 500;
}
</style>

