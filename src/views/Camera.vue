<template>
  <section class="screen camera-screen">
    <h2 class="camera-title">📸 Digicam 📸</h2>

    <div class="camera-area">
      <!-- IDLE -->
      <div v-if="mode === 'idle'" class="idle-message">
        <p>Ready to capture a memory? 📷</p>
      </div>

      <!-- CAMERA -->
      <div v-if="mode === 'camera'" class="camera-window">
        <video ref="videoRef" autoplay muted playsinline class="video-feed"></video>
        <img src="/assets/images/camera_frame.png" class="frame-overlay" />
      </div>

      <!-- POLAROID -->
      <div v-if="mode === 'polaroid'" class="polaroid-window">
        <div class="polaroid-frame-wrapper">
          <img src="/assets/images/polaroid_frame.png" class="polaroid-frame-image" />
          <img v-if="capturedImage" :src="capturedImage" class="polaroid-photo" />

          <button @click="downloadPhoto" class="btn-primary">
            💾 Save Photo
          </button>
        </div>
      </div>
    </div>

    <!-- BUTTON -->
    <div class="camera-controls">
      <button v-if="mode === 'idle'" @click="openCamera" class="btn-primary">
        📷 Open Camera
      </button>

      <button v-if="mode === 'camera'" @click="capturePhoto" class="btn-primary">
        ✨ Capture
      </button>

      <button v-if="mode === 'polaroid'" @click="retake" class="btn-secondary">
        Retake
      </button>

      <button @click="goBack" class="btn-back">← Back</button>
    </div>
  </section>
</template>

<script setup>
import { ref, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const mode = ref('idle')
const videoRef = ref(null)
const streamRef = ref(null)
const capturedImage = ref('')

const constraints = {
  video: { facingMode: 'user' }
}

// ================= CAMERA =================
async function openCamera() {
  try {
    stopStream()

    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    streamRef.value = stream
    mode.value = 'camera'

    await nextTick()

    videoRef.value.srcObject = stream
    await videoRef.value.play()

  } catch (err) {
    console.error(err)
    alert('Camera error 😭')
  }
}

// ================= CAPTURE =================
function capturePhoto() {
  const video = videoRef.value
  if (!video) return

  const canvas = document.createElement('canvas')

  // 🔥 ukuran area layar kamera (sudah disesuaikan)
  canvas.width = 360
  canvas.height = 230

  const ctx = canvas.getContext('2d')

  // mirror
  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)

  ctx.drawImage(
    video,
    0, 0, video.videoWidth, video.videoHeight,
    0, 0, canvas.width, canvas.height
  )

  capturedImage.value = canvas.toDataURL('image/png')

  mode.value = 'polaroid'
  stopStream()
}

// ================= DOWNLOAD =================
async function downloadPhoto() {
  const frame = new Image()
  frame.src = '/assets/images/polaroid_frame.png'

  const photo = new Image()
  photo.src = capturedImage.value

  await Promise.all([
    new Promise(res => frame.onload = res),
    new Promise(res => photo.onload = res)
  ])

  const canvas = document.createElement('canvas')
  canvas.width = frame.width
  canvas.height = frame.height

  const ctx = canvas.getContext('2d')

  ctx.drawImage(frame, 0, 0)

  // 🔥 posisi PAS di hole polaroid
  ctx.drawImage(
    photo,
    frame.width * 0.12,
    frame.height * 0.18,
    frame.width * 0.76,
    frame.height * 0.52
  )

  const link = document.createElement('a')
  link.download = 'polaroid.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

// ================= RETAKE =================
function retake() {
  capturedImage.value = ''
  openCamera()
}

// ================= STOP =================
function stopStream() {
  if (streamRef.value) {
    streamRef.value.getTracks().forEach(t => t.stop())
    streamRef.value = null
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null
  }
}

// ================= NAV =================
function goBack() {
  stopStream()
  router.push({ name: 'Menu' })
}

onBeforeUnmount(() => stopStream())
</script>

<style scoped>
.camera-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.camera-area {
  display: grid;
  place-items: center;
}

/* ================= CAMERA ================= */

.camera-window {
  position: relative;
  width: 520px;
  max-width: 95vw;
}

/* 🔥 POSISI VIDEO (SUDAH PAS KE FRAME) */
.video-feed {
  position: absolute;
  top: 12%;     /* SESUAIKAN DENGAN HOLE FRAME */
  left: 8%;
  width: 64%;
  height: 52%;
  object-fit: cover;
  z-index: 1;

  transform: scaleX(-1); /* mirror */
}

/* FRAME */
.frame-overlay {
  width: 100%;
  display: block;
  z-index: 2;
  position: relative;
}

/* ================= POLAROID ================= */

.polaroid-frame-wrapper {
  position: relative;
  width: 420px;
}

.polaroid-frame-image {
  width: 100%;
}

/* 🔥 FOTO MASUK KE HOLE */
.polaroid-photo {
  position: absolute;

  top: 75px;
  left: 50px;

  width: 320px;
  height: 220px;

  object-fit: cover;
}

/* ================= BUTTON ================= */

.camera-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-primary {
  background: #ff6b9d;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
}

.btn-secondary {
  background: #ffc9de;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
}

.btn-back {
  background: #ddd;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
}
</style>