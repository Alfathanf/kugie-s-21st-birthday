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

          <img
            v-if="capturedImage"
            :src="capturedImage"
            class="polaroid-photo"
          />
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

      <button v-if="mode === 'polaroid'" @click="downloadPhoto" class="btn-secondary">
        💾 Download
      </button>

      <button v-if="mode === 'polaroid'" @click="retake" class="btn-secondary">
        🔄 Retake
      </button>

      <button @click="goBack" class="btn-back">
        ← Back
      </button>
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
  video: {
    facingMode: 'user'
  }
}

// ================= CAMERA =================
async function openCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    streamRef.value = stream
    mode.value = 'camera'

    await nextTick()

    if (videoRef.value) {
      videoRef.value.srcObject = stream
      await videoRef.value.play()
    }
  } catch (err) {
    console.error(err)
    alert('Camera error bro 😭')
  }
}

// ================= CAPTURE =================
function capturePhoto() {
  const video = videoRef.value
  if (!video) return

  const canvas = document.createElement('canvas')

  // 🔥 ukuran area layar kamera (SUDAH DI-ADJUST)
  canvas.width = 370
  canvas.height = 250

  const ctx = canvas.getContext('2d')

  // mirror fix
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
function downloadPhoto() {
  const link = document.createElement('a')
  link.href = capturedImage.value
  link.download = 'photo.png'
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
}

// ================= NAV =================
function goBack() {
  stopStream()
  router.push({ name: 'Menu' })
}

onBeforeUnmount(() => {
  stopStream()
})
</script>

<style scoped>
.camera-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.camera-area {
  min-height: 360px;
  display: grid;
  place-items: center;
}

/* ================= CAMERA ================= */

.camera-window {
  position: relative;
  width: 520px;
  max-width: 95vw;
}

/* 🔥 VIDEO POSITION (SUDAH DI-ADJUST) */
.video-feed {
  position: absolute;

  top: 65px;
  left: 55px;

  width: 370px;
  height: 250px;

  object-fit: cover;
  transform: scaleX(-1);
  border-radius: 6px;
}

/* FRAME */
.frame-overlay {
  width: 100%;
  display: block;
}

/* ================= POLAROID ================= */

.polaroid-frame-wrapper {
  position: relative;
  width: 420px;
  max-width: 90vw;
}

.polaroid-frame-image {
  width: 100%;
}

/* 🔥 HASIL FOTO MASUK KE HOLE */
.polaroid-photo {
  position: absolute;

  top: 95px;
  left: 45px;

  width: 330px;
  height: 270px;

  object-fit: cover;
  border-radius: 6px;
}

/* ================= BUTTON ================= */

.camera-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-primary,
.btn-secondary,
.btn-back {
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #ff6b9d;
  color: white;
}

.btn-secondary {
  background: #ffc9de;
}

.btn-back {
  background: #ddd;
}
</style>