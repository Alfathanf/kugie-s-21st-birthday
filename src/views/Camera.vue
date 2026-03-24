<template>
  <section class="screen camera-screen">
    <h2 class="camera-title">📸 Digicam 📸</h2>
    <div class="camera-area">
      <div v-if="mode === 'idle'" class="idle-message">
        <p>Ready to capture a memory? 📷</p>
      </div>

      <div v-if="mode === 'camera'" class="camera-window">
        <video ref="videoRef" autoplay muted playsinline class="video-feed"></video>
        <img src="/assets/images/camera_frame.png" alt="Frame" class="frame-overlay" />
      </div>

      <div v-if="mode === 'polaroid'" class="polaroid-window">
        <div class="polaroid-frame-wrapper">
          <img src="/assets/images/polaroid_frame.png" alt="Polaroid Frame" class="polaroid-frame-image" />
          <img v-if="capturedImage" :src="capturedImage" alt="Captured" class="polaroid-photo" />
          <button 
  v-if="mode === 'polaroid'" 
  @click="downloadPhoto" 
  class="btn-primary"
>
  💾 Save Photo
</button>
        </div>
      </div>
    </div>

    <div class="camera-controls">
      <button v-if="mode === 'idle'" @click="openCamera" class="btn-primary">
        📷 Open Camera
      </button>
      <button v-if="mode === 'camera'" @click="capturePhoto" class="btn-primary btn-capture">
        ✨ Capture 📸
      </button>
      <button v-if="mode === 'polaroid'" @click="retake" class="btn-secondary">
        🔄 Retake
      </button>
      <button @click="goBack" class="btn-back">← Back to Menu</button>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const mode = ref('idle');
const videoRef = ref(null);
const streamRef = ref(null);
const capturedImage = ref('');

const constraints = { 
  video: { 
    facingMode: 'user', 
    width: { ideal: 640 }, 
    height: { ideal: 800 } 
  } 
};

async function openCamera() {
  try {
    stopStream(); // pastikan bersih dulu

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    streamRef.value = stream;

    mode.value = 'camera';

    // ⏳ tunggu DOM render
    await nextTick();

    if (videoRef.value) {
      videoRef.value.srcObject = stream;

      // ⚠️ penting untuk HP browser
      await videoRef.value.play();
    }

  } catch (err) {
    console.error('Camera error:', err);
    alert('Unable to access camera. Please check permissions.');
  }
}

function capturePhoto() {
  if (!videoRef.value) return;

  const video = videoRef.value;

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 800;

  const ctx = canvas.getContext('2d');

  addFlashEffect();

  // 🔥 mirror hasil capture juga
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  capturedImage.value = canvas.toDataURL('image/png');

  mode.value = 'polaroid';

  stopStream();
}

function retake() {
  capturedImage.value = '';
  openCamera(); // 🔥 langsung nyalakan lagi
}

function stopStream() {
  if (streamRef.value) {
    streamRef.value.getTracks().forEach(track => track.stop());
    streamRef.value = null;
  }

  if (videoRef.value) {
    videoRef.value.srcObject = null;
  }
}

function addFlashEffect() {
  const flash = document.createElement('div');
  flash.style.cssText = `
    position: fixed;
    inset: 0;
    background: white;
    pointer-events: none;
    z-index: 1000;
    animation: flashBurst 0.4s ease-out;
  `;
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 400);
}

function goBack() {
  stopStream();
  router.push({ name: 'Menu' });
}

onBeforeUnmount(() => {
  stopStream();
});
async function downloadPhoto() {
  if (!capturedImage.value) return;

  const frame = new Image();
  frame.src = '/assets/images/polaroid_frame.png';

  const photo = new Image();
  photo.src = capturedImage.value;

  await Promise.all([
    new Promise(res => frame.onload = res),
    new Promise(res => photo.onload = res)
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = frame.width;
  canvas.height = frame.height;

  const ctx = canvas.getContext('2d');

  // 🔥 gambar frame dulu
  ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

  // 🔥 posisi foto di dalam frame (adjust sesuai asset kamu)
  const photoX = canvas.width * 0.1;
  const photoY = canvas.height * 0.15;
  const photoWidth = canvas.width * 0.8;
  const photoHeight = canvas.height * 0.55;

  ctx.drawImage(photo, photoX, photoY, photoWidth, photoHeight);

  // 🔥 convert ke file
  const link = document.createElement('a');
  link.download = 'polaroid-photo.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
</script>

<style scoped>
.camera-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
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

.camera-title {
  font-size: 24px;
  background: linear-gradient(120deg, #ff6b9d, #c44569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  margin-bottom: 8px;
}

.camera-area {
  width: min(540px, 90vw);
  display: grid;
  place-items: center;
  min-height: 360px;
  animation: slideUp 0.4s ease;
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

.idle-message {
  text-align: center;
  color: #9f2d5f;
  font-size: 16px;
  font-weight: 500;
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.camera-window,
.polaroid-window {
  position: relative;
  width: 100%;
  height: auto;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(255, 140, 199, 0.2);
}

.video-feed {
  width: 100%;
  border-radius: 16px;
  display: block;
  background: #f5e6f0;
  object-fit: cover;

  /* 🔥 mirror effect */
  transform: scaleX(-1);
}

.frame-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-radius: 16px;
}

.polaroid-window {
  animation: polaroidAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes polaroidAppear {
  from {
    opacity: 0;
    transform: scale(0.85) rotateZ(-5deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotateZ(0);
  }
}

.polaroid-frame-wrapper {
  position: relative;
  width: min(420px, 90vw);
  max-width: 420px;
}

.polaroid-frame-image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.polaroid-photo {
  position: absolute;
  top: 15%;
  left: 10%;
  width: 80%;
  height: 55%;
  object-fit: cover;
  border-radius: 8px;
}

.polaroid-frame {
  border: 14px solid #fff;
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18), 2px 8px 16px rgba(0, 0, 0, 0.1);
  position: relative;
  transform: rotateZ(-2deg);
}

.polaroid-photo {
  width: 100%;
  border-radius: 4px;
  display: block;
}

.polaroid-frame::after {
  content: '';
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 20px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  filter: blur(8px);
}

.camera-controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 16px;
}

.btn-primary,
.btn-secondary,
.btn-back {
  padding: 12px 20px;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 6px 16px rgba(255, 140, 199, 0.3);
}

.btn-primary {
  background: linear-gradient(135deg, #ff8fc7, #ff6b9d);
  color: #fff;
}

.btn-primary:hover,
.btn-secondary:hover,
.btn-back:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 28px rgba(255, 107, 157, 0.5);
}

.btn-capture {
  min-width: 140px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 6px 16px rgba(255, 140, 199, 0.3);
  }
  50% {
    box-shadow: 0 8px 24px rgba(255, 140, 199, 0.6);
  }
}

.btn-secondary {
  background: linear-gradient(135deg, #ffc9de, #ffb3d9);
  color: #d81f55;
}

.btn-back {
  background: linear-gradient(135deg, #e6c7d8, #d9afc8);
  color: #6b4c66;
}

@keyframes flashBurst {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>

