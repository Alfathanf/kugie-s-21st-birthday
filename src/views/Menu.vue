<template>
  <section class="screen menu-screen">
    <div class="menu-container">
      <h2 class="menu-title">✨ Choose Your Gift ✨</h2>

      <div class="gift-grid">
        
        <!-- ITEM 1 -->
        <div class="gift-item" @click="navigate('game')">
          <img src="/assets/images/gift.png" alt="Game" />
        </div>

        <!-- ITEM 2 -->
        <div class="gift-item" @click="navigate('camera')">
          <img src="/assets/images/gift.png" alt="Camera" />
        </div>

        <!-- ITEM 3 -->
        <div class="gift-item" @click="navigate('crossword')">
          <img src="/assets/images/gift.png" alt="Crossword" />
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function navigate(route) {
  router.push({ name: route.charAt(0).toUpperCase() + route.slice(1) })
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
  font-weight: 700;
}

.gift-grid {
  display: flex;
  justify-content: center;   /* center horizontal */
  align-items: center;
  gap: 24px;
  flex-wrap: nowrap;         /* ❗ penting: biar ga turun baris */
  width: 100%;  
}

/* 🔥 ITEM = PURE IMAGE CLICKABLE */
.gift-item {
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: scaleInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  transition: transform 0.25s ease;
}

/* delay animasi */
.gift-item:nth-child(1) { animation-delay: 0.1s; }
.gift-item:nth-child(2) { animation-delay: 0.2s; }
.gift-item:nth-child(3) { animation-delay: 0.3s; }
.gift-item:nth-child(4) { animation-delay: 0.4s; }
.gift-item:nth-child(5) { animation-delay: 0.5s; }

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

/* IMAGE */
.gift-item img {
  width: 90px;
  height: 90px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

/* HOVER EFFECT 🔥 */
.gift-item:hover img {
  transform: scale(1.15) rotate(-5deg);
}

.gift-item:active img {
  transform: scale(0.95);
}

/* EMOJI FLOAT */
.gift-emoji {
  position: absolute;
  font-size: 28px;
  animation: floatEmoji 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes floatEmoji {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>