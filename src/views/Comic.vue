<template>
  <section class="screen comic-screen">
    <div class="comic-header">
      <h2>💌 Love Letter</h2>
    </div>
    <div class="comic-container">
      <div class="comic-frames">
        <img 
          v-for="(img, index) in images" 
          :key="index" 
          :src="img" 
          :alt="`Comic ${index + 1}`" 
          class="comic-image"
        />
      </div>
    </div>
    <button class="back-btn" @click="goBack">← Back to Menu</button>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const images = [
  '/assets/images/comic1.png',
  '/assets/images/comic2.png',
  '/assets/images/comic3.png',
  '/assets/images/comic4.png',
  '/assets/images/comic5.png'
];

function goBack() {
  router.push({ name: 'Menu' });
}
</script>

<style scoped>
.comic-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  animation: fadeInDown 0.5s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.comic-header {
  text-align: center;
  margin-bottom: 8px;
}

.comic-header h2 {
  font-size: 24px;
  background: linear-gradient(120deg, #ff6b9d, #c44569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.comic-container {
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.comic-frames {
  display: flex;
  flex-direction: column;
}

.comic-image {
  animation: imageSlideIn 0.6s ease both;
}

.comic-image:nth-child(1) { animation-delay: 0.1s; }
.comic-image:nth-child(2) { animation-delay: 0.2s; }
.comic-image:nth-child(3) { animation-delay: 0.3s; }
.comic-image:nth-child(4) { animation-delay: 0.4s; }
.comic-image:nth-child(5) { animation-delay: 0.5s; }

@keyframes imageSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.back-btn {
  margin-top: 16px;
}
</style>

