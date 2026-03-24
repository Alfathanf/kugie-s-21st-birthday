<template>
  <section class="screen invitation-screen">
    <div class="invite-card">
      <div class="invite-header">
        <h1>💕 You're Invited 💕</h1>
        <p>Dinner Date With Me?</p>
      </div>

      <div class="invite-action-row">
        <button class="btn-accept" @click="acceptInvite">
          Accept ❤️
        </button>

        <button
          class="btn-reject"
          :style="rejectStyle"
          @pointerenter="moveReject"
          @pointermove="moveReject"
          @touchstart="moveReject"
        >
          Reject ❌
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-layer" @click.self="closeModal">
      <div class="modal-content">
        <h2>🎉 YAY! 🎉</h2>
        <p>I can't wait! Let's make it special together. ❤️</p>
        <button @click="closeModal">Thank You! ✨</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showModal = ref(false)

/* 🔥 pakai transform biar aman (tidak keluar layar) */
const rejectStyle = reactive({
  transform: 'translate(0px, 0px)'
})

function acceptInvite() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  router.push({ name: 'Menu' })
}

/* 😈 SMART EVADE BUTTON */
function moveReject(e) {
  const btn = document.querySelector('.btn-reject')
  if (!btn) return

  const rect = btn.getBoundingClientRect()

  // posisi cursor (support mouse & touch)
  const cursorX = e.clientX || (e.touches && e.touches[0].clientX)
  const cursorY = e.clientY || (e.touches && e.touches[0].clientY)

  if (!cursorX || !cursorY) return

  // center tombol
  const btnCenterX = rect.left + rect.width / 2
  const btnCenterY = rect.top + rect.height / 2

  // arah menjauh dari cursor
  let dx = btnCenterX - cursorX
  let dy = btnCenterY - cursorY

  const distance = Math.sqrt(dx * dx + dy * dy) || 1
  dx /= distance
  dy /= distance

  /* 🔥 panic mode (semakin dekat → semakin jauh lari) */
  let moveDistance = distance < 120 ? 180 : 100

  let moveX = dx * moveDistance
  let moveY = dy * moveDistance

  /* 🔥 batas biar nggak over kabur */
  const MAX_OFFSET = 160

  moveX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, moveX))
  moveY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, moveY))

  /* ✨ sedikit random biar natural */
  moveX += (Math.random() - 0.5) * 20
  moveY += (Math.random() - 0.5) * 20

  rejectStyle.transform = `translate(${moveX}px, ${moveY}px)`
}
</script>

<style scoped>
.invitation-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  animation: fadeInScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.invite-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.invite-header {
  text-align: center;
}

.invite-header h1 {
  font-size: 28px;
  margin-bottom: 8px;
  background: linear-gradient(120deg, #ff6b9d, #c44569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.invite-header p {
  color: #9f2d5f;
  font-weight: 500;
  font-size: 15px;
}

.invite-action-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.btn-accept,
.btn-reject {
  padding: 12px 20px;
  border-radius: 14px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  min-width: 130px;
  transition: all 0.25s ease;
}

.btn-accept {
  background: linear-gradient(135deg, #ff8fc7, #ff6b9d);
  color: white;
}

.btn-reject {
  background: #ffd6e8;
  color: #c44569;
  will-change: transform;
}

.btn-reject:hover {
  transform: scale(1.1) rotate(8deg);
}

/* MODAL */
.modal-layer {
  position: fixed;
  inset: 0;
  background: rgba(255, 192, 203, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  animation: popUp 0.4s ease;
}

@keyframes popUp {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-content button {
  margin-top: 12px;
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  background: #ff8fc7;
  color: white;
  cursor: pointer;
}
</style>