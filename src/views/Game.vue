<template>
  <section class="screen game-screen">
    <h2 class="game-title">🧠 Memory Game 🧠</h2>
    <div class="game-grid">
      <button 
        v-for="card in cards" 
        :key="card.id" 
        class="card" 
        :class="{ flipped: card.flipped || card.matched }" 
        @click="flipCard(card)"
      >
        <div class="card-face card-back">❓</div>
        <div class="card-face card-front">
          <img v-if="card.image" :src="card.image" alt="memory card" />
        </div>
      </button>
    </div>
    <button class="back-btn" @click="goBack">← Back to Menu</button>

    <div v-if="completed" class="modal-layer" @click.self="resetGame">
      <div class="modal-content celebration">
        <div class="confetti-container">
          <span v-for="i in 20" :key="i" class="confetti">🎉</span>
        </div>
        <h2>🎉 You Did It! 🎉</h2>
        <p>You matched all the pairs! Great job! ❤️</p>
        <p class="completion-message">You're amazing!</p>
        <button @click="resetGame">Back to Menu ✨</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const CARD_PATHS = [
  '/assets/images/card1.png',
  '/assets/images/card2.png',
  '/assets/images/card3.png',
  '/assets/images/card4.png',
  '/assets/images/card5.png',
  '/assets/images/card6.png'
];

const state = reactive({
  cards: [],
  picked: [],
  lock: false,
  completed: false
});

function makeDeck() {
  const deck = CARD_PATHS.flatMap(path => [{ image: path }, { image: path }]);
  return deck
    .map((c, i) => ({ ...c, id: i + 1, matched: false, flipped: false }))
    .sort(() => Math.random() - 0.5);
}

function resetGame() {
  state.cards = makeDeck();
  state.picked = [];
  state.lock = false;
  state.completed = false;
  router.push({ name: 'Menu' });
}

function initGame() {
  state.cards = makeDeck();
  state.completed = false;
}

function flipCard(card) {
  if (state.lock || card.flipped || card.matched) return;
  card.flipped = true;
  state.picked.push(card);

  if (state.picked.length === 2) {
    state.lock = true;
    if (state.picked[0].image === state.picked[1].image) {
      setTimeout(() => {
        state.picked[0].matched = true;
        state.picked[1].matched = true;
        state.picked = [];
        state.lock = false;
        checkCompletion();
      }, 500);
    } else {
      setTimeout(() => {
        state.picked[0].flipped = false;
        state.picked[1].flipped = false;
        state.picked = [];
        state.lock = false;
      }, 900);
    }
  }
}

function checkCompletion() {
  if (state.cards.every(card => card.matched)) {
    state.completed = true;
  }
}

const cards = computed(() => state.cards);

initGame();

function goBack() {
  router.push({ name: 'Menu' });
}
</script>

<style scoped>
.game-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.game-title {
  font-size: 24px;
  background: linear-gradient(120deg, #ff6b9d, #c44569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  margin-bottom: 12px;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(80px, 1fr));
  gap: 12px;
  width: min(520px, 90vw);
  margin: 20px 0;
  perspective: 1000px;
  animation: scaleIn 0.4s ease;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.card {
  border: none;
  padding: 0;
  border-radius: 14px;
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  perspective: 1000px;
  cursor: pointer;
  transition: transform 0.2s;
}

.card:hover:not(.card.flipped) {
  transform: scale(1.08);
}

.card:active {
  transform: scale(0.98);
}

.card-face {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  display: grid;
  place-items: center;
  backface-visibility: hidden;
  transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.card-back {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 245, 250, 0.95));
  color: #f08fbc;
  font-size: 24px;
  transform: rotateY(0deg);
  border: 2px solid rgba(255, 140, 199, 0.5);
  box-shadow: 0 6px 14px rgba(255, 140, 199, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.8);
}

.card-front {
  background: #fff;
  transform: rotateY(180deg);
  border: 2px solid rgba(255, 192, 218, 0.4);
}

.card img {
  width: 90%;
  height: 90%;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.card.flipped .card-back {
  transform: rotateY(180deg);
}

.card.flipped .card-front {
  transform: rotateY(360deg);
}

.modal-content.celebration {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 240, 245, 0.98));
}

.confetti-container {
  position: absolute;
  top: -10px;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

.confetti {
  display: inline-block;
  font-size: 20px;
  animation: confettiFall 2.5s ease-in forwards;
  position: absolute;
}

.confetti:nth-child(1) { left: 10%; animation-delay: 0s; }
.confetti:nth-child(2) { left: 20%; animation-delay: 0.1s; }
.confetti:nth-child(3) { left: 30%; animation-delay: 0.2s; }
.confetti:nth-child(4) { left: 40%; animation-delay: 0.1s; }
.confetti:nth-child(5) { left: 50%; animation-delay: 0s; }
.confetti:nth-child(6) { left: 60%; animation-delay: 0.15s; }
.confetti:nth-child(7) { left: 70%; animation-delay: 0.05s; }
.confetti:nth-child(8) { left: 80%; animation-delay: 0.2s; }
.confetti:nth-child(9) { left: 90%; animation-delay: 0.1s; }
.confetti:nth-child(10) { left: 15%; animation-delay: 0.05s; }
.confetti:nth-child(11) { left: 25%; animation-delay: 0.15s; }
.confetti:nth-child(12) { left: 35%; animation-delay: 0s; }
.confetti:nth-child(13) { left: 45%; animation-delay: 0.2s; }
.confetti:nth-child(14) { left: 55%; animation-delay: 0.05s; }
.confetti:nth-child(15) { left: 65%; animation-delay: 0.1s; }
.confetti:nth-child(16) { left: 75%; animation-delay: 0.15s; }
.confetti:nth-child(17) { left: 85%; animation-delay: 0s; }
.confetti:nth-child(18) { left: 5%; animation-delay: 0.1s; }
.confetti:nth-child(19) { left: 95%; animation-delay: 0.05s; }
.confetti:nth-child(20) { left: 50%; animation-delay: 0.12s; }

@keyframes confettiFall {
  to {
    transform: translateY(200px) rotate(720deg);
    opacity: 0;
  }
}

.completion-message {
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(120deg, #ff6b9d, #c44569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 8px 0 !important;
}

.back-btn {
  margin-top: 20px;
}
</style>

