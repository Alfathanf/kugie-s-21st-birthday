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
          <img v-if="card.image" :src="card.image" />
        </div>
      </button>
    </div>

    <button class="back-btn" @click="goBack">← Back to Menu</button>

    <!-- 🎉 MODAL -->
    <div v-if="state.completed" class="modal-layer">
      <div class="modal-content celebration">

        <h2>🎉 You Did It! 🎉</h2>
        <p>You matched all the pairs! ❤️</p>
        <p class="completion-message">You're amazing!</p>

        <button @click="goToReward">Get Your Reward 🎁</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, computed } from 'vue';
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
    .map((c, i) => ({
      ...c,
      id: i,
      matched: false,
      flipped: false
    }))
    .sort(() => Math.random() - 0.5);
}

function initGame() {
  state.cards = makeDeck();
  state.picked = [];
  state.lock = false;
  state.completed = false;
}

function flipCard(card) {
  if (state.lock || card.flipped || card.matched) return;

  card.flipped = true;
  state.picked.push(card);

  if (state.picked.length === 2) {
    state.lock = true;

    const [first, second] = state.picked;

    if (first.image === second.image) {
      setTimeout(() => {
        first.matched = true;
        second.matched = true;

        state.picked = [];
        state.lock = false;

        checkCompletion(); // 🔥 FIX UTAMA
      }, 500);
    } else {
      setTimeout(() => {
        first.flipped = false;
        second.flipped = false;

        state.picked = [];
        state.lock = false;
      }, 900);
    }
  }
}

function checkCompletion() {
  const isComplete =
    state.cards.length > 0 &&
    state.cards.every(card => card.matched);

  if (isComplete) {
    // delay biar animasi flip selesai dulu
    setTimeout(() => {
      state.completed = true;
    }, 300);
  }
}

const cards = computed(() => state.cards);

function goBack() {
  initGame(); // reset game biar fresh
  router.push({ name: 'Menu' });
}

function goToReward() {
  router.push({ name: 'Invitation' });
}

// init pertama kali
initGame();
</script>