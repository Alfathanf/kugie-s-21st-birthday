<template>
  <section class="screen invitation-screen">
    <div class="invite-card">
      <div class="invite-header">
        <h1>💕 You're Invited 💕</h1>
        <p>Dinner Date With Me?</p>
      </div>
      <div class="invite-action-row">
        <button class="btn-accept" @click="acceptInvite">Accept ❤️</button>
        <button 
          class="btn-reject" 
          :style="rejectStyle" 
          @pointerenter="moveReject"
          @touchstart="moveReject"
        >
          Reject ❌
        </button>
      </div>
    </div>

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
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showModal = ref(false);
const rejectStyle = reactive({ position: 'relative', top: 'auto', left: 'auto' });

const BUTTON_SIZE = { width: 130, height: 50 };
const PADDING = 20;

function acceptInvite() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  router.push({ name: 'Menu' });
}

function moveReject() {
  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Calculate safe boundaries (clamp so button stays visible)
  const maxX = Math.max(PADDING, viewportWidth - BUTTON_SIZE.width - PADDING);
  const maxY = Math.max(PADDING, viewportHeight - BUTTON_SIZE.height - PADDING);
  
  // Generate random position within safe boundaries
  const randomX = PADDING + Math.random() * (maxX - PADDING);
  const randomY = PADDING + Math.random() * (maxY - PADDING);
  
  rejectStyle.position = 'fixed';
  rejectStyle.left = `${randomX}px`;
  rejectStyle.top = `${randomY}px`;
}
</script>

<style scoped>
.invitation-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  background-clip: text;
  font-weight: 700;
}

.invite-header p {
  color: #9f2d5f;
  font-weight: 500;
  font-size: 15px;
}

.invite-action-row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: 70px;
}

.btn-accept {
  font-weight: 600;
  min-width: 130px;
}

.btn-reject {
  font-weight: 600;
  min-width: 130px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform, left, top;
}

.btn-reject:hover {
  transform: scale(1.02) rotate(5deg);
}
</style>

