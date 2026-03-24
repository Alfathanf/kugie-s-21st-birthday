<template>
  <section class="screen menu-screen">
    <div class="menu-container">
      <h2 class="menu-title">✨ Choose Your Gift ✨</h2>
      <div class="gift-grid">
        <button class="gift-box" @click="navigate('comic')" title="Love Letter">
          <div class="gift-image-container">
            <img src="/assets/images/gift1.png" alt="Letter" />
            <span class="gift-emoji">💌</span>
          </div>
        </button>
        <button class="gift-box" @click="navigate('invitation')" title="Invitation">
          <div class="gift-image-container">
            <img src="/assets/images/gift2.png" alt="Invitation" />
            <span class="gift-emoji">❤️</span>
          </div>
        </button>
        <button class="gift-box" @click="navigate('game')" title="Memory Game">
          <div class="gift-image-container">
            <img src="/assets/images/gift3.png" alt="Game" />
            <span class="gift-emoji">🧠</span>
          </div>
        </button>
        <button class="gift-box" @click="navigate('camera')" title="Photo Booth">
          <div class="gift-image-container">
            <img src="/assets/images/gift4.png" alt="Camera" />
            <span class="gift-emoji">📸</span>
          </div>
        </button>
        <button class="gift-box" @click="navigate('crossword')" title="Crossword">
          <div class="gift-image-container">
            <img src="/assets/images/gift5.png" alt="Crossword" />
            <span class="gift-emoji">🧩</span>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
function navigate(route) {
  router.push({ name: route.charAt(0).toUpperCase() + route.slice(1) });
}
</script>

<style scoped>
.menu-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  animation: fadeInDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-title {
  font-size: 28px;
  background: linear-gradient(120deg, #ff6b9d, #c44569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  margin-bottom: 8px;
}

.gift-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  width: min(720px, 90vw);
}

.gift-box {
  animation: scaleInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.gift-box:nth-child(1) { animation-delay: 0.1s; }
.gift-box:nth-child(2) { animation-delay: 0.2s; }
.gift-box:nth-child(3) { animation-delay: 0.3s; }
.gift-box:nth-child(4) { animation-delay: 0.4s; }

@keyframes scaleInUp {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.gift-image-container img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.gift-emoji {
  position: absolute;
  font-size: 26px;
  animation: floatEmoji 2s ease-in-out infinite;
}

@keyframes floatEmoji {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
</style>

