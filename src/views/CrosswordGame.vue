<template>
  <section class="screen game-screen">
    <h2>Complete the Crossword Puzzle to Get Your Gift! (harusnya bisa sih ya)</h2>

    <!-- GRID -->
    <div class="grid-shell">
      <div v-for="row in grid" :key="row[0].row" class="grid-row">
        <div
          v-for="cell in row"
          :key="cell.id"
          :class="['grid-cell', cell.blocked ? 'blocked' : 'active', cell.error ? 'wrong' : '']"
        >
          <!-- NUMBER -->
          <span v-if="cell.number" class="cell-number">
            {{ cell.number }}
          </span>

          <!-- INPUT -->
          <input
            v-if="!cell.blocked"
            class="cell-input"
            maxlength="1"
            v-model="cell.value"
            @input="handleInput(cell)"
          />
        </div>
      </div>
    </div>

    <!-- ACTION -->
    <div class="actions">
      <button class="back-btn" @click="checkAnswers">Check Answers</button>
      <button class="back-btn" @click="goBack">More Giftsssss!!!!!</button>
    </div>

    <p class="feedback" v-if="feedback">{{ feedback }}</p>

    <!-- MODAL -->
    <div v-if="showSuccess" class="modal-layer">
      <div class="modal-content">
        <h2>🎉 GOKILLLL 🎉</h2>
        <p>You solved the crossword, good jobbb sayangg ❤️</p>
        <button @click="goToSurprise">Your Gift! 🎁</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showSuccess = ref(false)
const feedback = ref('')

// ===== GRID PATTERN =====
const layout = [
  "PINK----M",
  "---U----A",
  "---G----T",
  "--HITAM-C",
  "---E----H",
  "-FUNTOPIA",
  "-A-R---C-",
  "-R-E---I-",
  "-R-L---L-",
  "-E-------",
  "-L-------"
]

// INIT GRID
const grid = reactive(
  layout.map((row, r) =>
    row.split('').map((char, c) => ({
      id: `${r}-${c}`,
      row: r,
      col: c,
      blocked: char === '-',
      solution: char === '-' ? '' : char,
      value: '',
      error: false,
      number: null
    }))
  )
)

// ===== NUMBERING SYSTEM (LIKE REAL TTS) =====
// ===== MANUAL NUMBERING =====
const manualNumbers = [
  { row: 0, col: 0, num: 1 }, // (1,1)
  { row: 0, col: 3, num: 2 }, // (4,1)
  { row: 3, col: 2, num: 3 }, // (3,4)
  { row: 5, col: 1, num: 4 }, // (2,6)
  { row: 0, col: 8, num: 5 }, // (9,1)
  { row: 5, col: 7, num: 6 }  // (8,6)
]

manualNumbers.forEach(({ row, col, num }) => {
  if (!grid[row][col].blocked) {
    grid[row][col].number = num
  }
})

// ===== INPUT =====
function handleInput(cell) {
  cell.value = cell.value.toUpperCase().slice(0, 1)
  cell.error = false
}

// ===== CHECK =====
function checkAnswers() {
  let allCorrect = true

  grid.forEach(row => {
    row.forEach(cell => {
      if (!cell.blocked) {
        if (cell.value !== cell.solution) {
          cell.error = true
          allCorrect = false
        }
      }
    })
  })

  if (allCorrect) {
    showSuccess.value = true
    feedback.value = ''
  } else {
    feedback.value = 'tetttt totttt! coba cek lagi clue nya, semangatttt!'
  }
}

// ===== NAV =====
function goBack() {
  router.push({ name: 'Menu' })
}

function goToSurprise() {
  router.push({ name: 'Comic' })
}
</script>

<style scoped>
.crossword-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.title {
  font-size: 26px;
  font-weight: bold;
  color: #ff6b9d;
}

.grid-shell {
  background: #ffeaf3;
  padding: 10px;
  border-radius: 14px;
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(9, 40px);
  gap: 5px;
}

.grid-cell {
  width: 40px;
  height: 40px;
  position: relative;
}

.blocked {
  background: #d49ab3;
}

.active {
  background: white;
  border: 2px solid pink;
}

.wrong {
  border-color: red;
}

.cell-input {
  width: 100%;
  height: 100%;
  border: none;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  background: transparent;
}

/* 🔥 NOMOR KECIL DI POJOK */
.cell-number {
  position: absolute;
  top: 2px;
  left: 4px;
  font-size: 10px;
  font-weight: bold;
  color: #ff6b9d;
  pointer-events: none;
}

.actions {
  display: flex;
  gap: 10px;
}

.feedback {
  color: crimson;
  font-weight: bold;
}

.modal-layer {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: grid;
  place-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}
</style>