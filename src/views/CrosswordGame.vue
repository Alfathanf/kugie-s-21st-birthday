<template>
  <section class="screen crossword-screen">
    <h2 class="title">🧩 Romantic Crossword</h2>

    <div class="grid-shell">
      <div v-for="row in grid" :key="row[0].row" class="grid-row">
        <div
          v-for="cell in row"
          :key="`${cell.row}-${cell.col}`"
          :class="['grid-cell', cell.blocked ? 'blocked' : 'active', cell.error ? 'wrong' : '']"
        >
          <input
            v-if="!cell.blocked"
            :id="`cell-${cell.row}-${cell.col}`"
            class="cell-input"
            :value="cell.value"
            @input="onLetterInput(cell.row, cell.col, $event)"
            @keydown="onKeyDown(cell.row, cell.col, $event)"
            maxlength="1"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="characters"
            spellcheck="false"
            ref="setInputRef"
          />
        </div>
      </div>
    </div>

    <div class="clues-box">
      <div class="clues-section">
        <h3>Across</h3>
        <ul>
          <li v-for="word in acrossWords" :key="word.id">
            <strong>{{ word.id }}.</strong> {{ word.clue }} ({{ word.answer.length }})
          </li>
        </ul>
      </div>
      <div class="clues-section">
        <h3>Down</h3>
        <ul>
          <li v-for="word in downWords" :key="word.id">
            <strong>{{ word.id }}.</strong> {{ word.clue }} ({{ word.answer.length }})
          </li>
        </ul>
      </div>
    </div>

    <div class="actions">
      <button class="btn-primary" @click="checkAnswers">Check Answers</button>
      <button class="btn-secondary" @click="goBack">← Back to Menu</button>
    </div>

    <p class="feedback" v-if="feedback">{{ feedback }}</p>

    <div v-if="showSuccess" class="modal-layer" @click.self="closeModal">
      <div class="modal-content celebration">
        <div class="confetti-row">
          <span v-for="n in 18" :key="n" class="heart">💖</span>
        </div>
        <h2>🎉 Perfect Match! 🎉</h2>
        <p>
          Your love is the answer to every puzzle. You solved it like a true sweetheart!
        </p>
        <button @click="closeModal">Back to Menu</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const acrossWords = [
  { id: '1', row: 0, col: 0, answer: 'LOVEU', clue: 'A feeling from the heart' },
  { id: '3', row: 2, col: 0, answer: 'ROMEO', clue: 'A famous romantic name' },
  { id: '5', row: 4, col: 0, answer: 'HEART', clue: 'Symbol of affection' }
];

const downWords = [
  { id: '2', row: 0, col: 5, answer: 'CUTES', clue: 'Sweet and charming' },
  { id: '4', row: 1, col: 6, answer: 'HUGS', clue: 'Warm embraces' }
];

const gridSize = 7;
const grid = reactive([]);

for (let r = 0; r < gridSize; r++) {
  const rowCells = [];
  for (let c = 0; c < gridSize; c++) {
    rowCells.push({ row: r, col: c, blocked: true, value: '', solution: '', error: false });
  }
  grid.push(rowCells);
}

function setCellAnswers() {
  acrossWords.forEach((word) => {
    for (let i = 0; i < word.answer.length; i++) {
      const r = word.row;
      const c = word.col + i;
      grid[r][c].blocked = false;
      grid[r][c].solution = word.answer[i];
      grid[r][c].value = '';
      grid[r][c].error = false;
    }
  });

  downWords.forEach((word) => {
    for (let i = 0; i < word.answer.length; i++) {
      const r = word.row + i;
      const c = word.col;
      grid[r][c].blocked = false;
      grid[r][c].solution = word.answer[i];
      grid[r][c].value = '';
      grid[r][c].error = false;
    }
  });
}

setCellAnswers();

const showSuccess = ref(false);
const feedback = ref('');

const activeInputs = ref([]);

function setInputRef(el) {
  if (!el) return;
  const [row, col] = el.id.replace('cell-', '').split('-').map(Number);
  const existing = activeInputs.value.find((item) => item.row === row && item.col === col);
  if (!existing) {
    activeInputs.value.push({ row, col, el });
  } else {
    existing.el = el;
  }
}

function getActiveOrdered() {
  return activeInputs.value
    .slice()
    .sort((a, b) => (a.row - b.row) || (a.col - b.col));
}

function focusNext(row, col) {
  const ordered = getActiveOrdered();
  const currentIndex = ordered.findIndex((item) => item.row === row && item.col === col);
  if (currentIndex >= 0 && currentIndex < ordered.length - 1) {
    ordered[currentIndex + 1].el.focus();
  }
}

function focusPrevious(row, col) {
  const ordered = getActiveOrdered();
  const currentIndex = ordered.findIndex((item) => item.row === row && item.col === col);
  if (currentIndex > 0) {
    ordered[currentIndex - 1].el.focus();
  }
}

function onLetterInput(row, col, event) {
  const raw = event.target.value.toUpperCase().replace(/[^A-Z]/g, '');
  const char = raw.slice(0, 1);
  event.target.value = char;
  grid[row][col].value = char;
  grid[row][col].error = false;

  if (char) {
    focusNext(row, col);
  }
}

function onKeyDown(row, col, event) {
  if (event.key === 'Backspace' && !grid[row][col].value) {
    event.preventDefault();
    focusPrevious(row, col);
  }
}

function checkAnswers() {
  let allCorrect = true;

  acrossWords.forEach((word) => {
    const answer = word.answer.toUpperCase();
    let typed = '';

    for (let i = 0; i < answer.length; i++) {
      const cell = grid[word.row][word.col + i];
      typed += cell.value || '';
    }

    if (typed !== answer) {
      allCorrect = false;
      for (let i = 0; i < answer.length; i++) {
        grid[word.row][word.col + i].error = true;
      }
    }
  });

  downWords.forEach((word) => {
    const answer = word.answer.toUpperCase();
    let typed = '';

    for (let i = 0; i < answer.length; i++) {
      const cell = grid[word.row + i][word.col];
      typed += cell.value || '';
    }

    if (typed !== answer) {
      allCorrect = false;
      for (let i = 0; i < answer.length; i++) {
        grid[word.row + i][word.col].error = true;
      }
    }
  });

  if (allCorrect) {
    showSuccess.value = true;
    feedback.value = '';
  } else {
    showSuccess.value = false;
    feedback.value = 'Some words are not quite right yet. Keep going!';
  }
}

function closeModal() {
  showSuccess.value = false;
  router.push({ name: 'Menu' });
}

function goBack() {
  router.push({ name: 'Menu' });
}
</script>

<style scoped>
.crossword-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  animation: fadeInDown 0.5s ease;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.title {
  font-size: 26px;
  background: linear-gradient(120deg, #ff6b9d, #c44569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.grid-shell {
  display: inline-grid;
  background: #ffeaf3;
  border: 4px solid rgba(255, 145, 175, 0.8);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 12px 24px rgba(255, 112, 168, 0.25);
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(7, 46px);
  gap: 6px;
}

.grid-cell {
  width: 46px;
  height: 46px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  position: relative;
}

.grid-cell.blocked {
  background: #c687a3;
}

.grid-cell.active {
  background: #fff;
  border: 2px solid rgba(255, 140, 199, 0.6);
}

.grid-cell.wrong {
  border-color: #e41d74;
  box-shadow: 0 0 14px rgba(228, 47, 82, 0.4);
}

.cell-input {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 22px;
  font-weight: 800;
  color: #6b3656;
}

.clues-box {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 760px;
}

.clues-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  border: 2px solid rgba(255, 140, 199, 0.55);
  padding: 12px 16px;
  width: min(320px, 90vw);
  text-align: left;
}

.clues-section h3 {
  margin-bottom: 8px;
  font-size: 18px;
}

.clues-section ul {
  list-style: outside disc;
  padding-left: 20px;
  margin: 0;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.feedback {
  color: #c02a6f;
  font-weight: 700;
  animation: pulse 0.8s ease-in-out;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.modal-layer {
  position: fixed;
  inset: 0;
  background: rgba(20, 12, 32, 0.7);
  display: grid;
  place-items: center;
  z-index: 100;
}

.modal-content {
  background: white;
  border-radius: 20px;
  border: 2px solid #ff6b9d;
  padding: 20px;
  width: min(380px, 90vw);
  text-align: center;
  box-shadow: 0 22px 44px rgba(209, 47, 96, 0.35);
  animation: popIn 0.5s ease;
}

@keyframes popIn {
  from { opacity: 0; transform: translateY(-18px) scale(0.94); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.confetti-row {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 8px;
}

.heart {
  font-size: 24px;
  animation: float 1.6s ease-in-out infinite;
}

.heart:nth-child(2n) {
  animation-delay: 0.2s;
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
}
</style>
