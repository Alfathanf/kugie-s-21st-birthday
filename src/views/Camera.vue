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

        <!-- FRAME -->
        <img src="/assets/images/camera_frame.png" class="frame-overlay" />

        <!-- VIDEO AREA (lubang frame) -->
        <div class="camera-inner">
          <video ref="videoRef" autoplay muted playsinline class="video-feed"></video>
        </div>

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

    <!-- CONTROLS -->
    <div class="camera-controls">
      <button v-if="mode === 'idle'" @click="openCamera" class="btn-primary">
        📷 Open Camera
      </button>

      <button v-if="mode === 'camera'" @click="capturePhoto" class="btn-primary">
        ✨ Capture
      </button>

      <button v-if="mode === 'polaroid'" @click="retake" class="btn-secondary">
        🔄 Retake
      </button>

      <button v-if="mode === 'polaroid'" @click="downloadPhoto" class="btn-primary">
        💾 Save Photo
      </button>

      <button @click="goBack" class="btn-back">← Back</button>
    </div>

  </section>
</template>

<script setup>
import { ref, nextTick, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const mode = ref('idle')
const videoRef = ref(null)
const streamRef = ref(null)
const capturedImage = ref('')

const constraints = {
  video: {
    facingMode: 'user',
    width: { ideal: 640 },
    height: { ideal: 800 }
  }
}

// OPEN CAMERA
async function openCamera() {
  try {
    stopStream()

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
    alert('Camera error 😢')
  }
}

// CAPTURE (CROP SESUAI FRAME)
function capturePhoto() {
  const video = videoRef.value
  if (!video) return

  const canvas = document.createElement('canvas')

  const vw = video.videoWidth
  const vh = video.videoHeight

  // 🔥 SAMA DENGAN CSS
  const cropX = vw * 0.12
  const cropY = vh * 0.18
  const cropW = vw * 0.76
  const cropH = vh * 0.58

  canvas.width = cropW
  canvas.height = cropH

  const ctx = canvas.getContext('2d')

  // mirror
  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)

  ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height)

  capturedImage.value = canvas.toDataURL('image/png')

  mode.value = 'polaroid'
  stopStream()
}

// RETAKE
function retake() {
  capturedImage.value = ''
  openCamera()
}

// STOP CAMERA
function stopStream() {
  if (streamRef.value) {
    streamRef.value.getTracks().forEach(t => t.stop())
    streamRef.value = null
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null
  }
}

// DOWNLOAD FOTO + FRAME
async function downloadPhoto() {
  if (!capturedImage.value) return

  const frame = new Image()
  frame.src = '/assets/images/polaroid_frame.png'

  const photo = new Image()
  photo.src = capturedImage.value

  await Promise.all([
    new Promise(r => frame.onload = r),
    new Promise(r => photo.onload = r)
  ])

  const canvas = document.createElement('canvas')
  canvas.width = frame.width
  canvas.height = frame.height

  const ctx = canvas.getContext('2d')

  ctx.drawImage(frame, 0, 0)

  const x = canvas.width * 0.1
  const y = canvas.height * 0.15
  const w = canvas.width * 0.8
  const h = canvas.height * 0.55

  ctx.drawImage(photo, x, y, w, h)

  const link = document.createElement('a')
  link.download = 'polaroid.png'
  link.href = canvas.toDataURL()
  link.click()
}

// NAV
function goBack() {
  stopStream()
  router.push({ name: 'Menu' })
}

onBeforeUnmount(stopStream)
</script>

<style scoped>
.camera-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.camera-title {
  font-size: 24px;
  font-weight: bold;
  color: #ff6b9d;
}

.camera-area {
  width: 100%;
  display: grid;
  place-items: center;
}

/* FRAME SYSTEM */
.camera-window {
  position: relative;
  width: 100%;
  max-width: 420px;
}

.frame-overlay {
  width: 100%;
}

/* 🔥 LUBANG FRAME */
.camera-inner {
  position: absolute;
  top: 18%;
  left: 12%;
  width: 76%;
  height: 58%;
  overflow: hidden;
  border-radius: 12px;
}

/* VIDEO */
.video-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
}

/* POLAROID */
.polaroid-frame-wrapper {
  position: relative;
  width: 320px;
}

.polaroid-frame-image {
  width: 100%;
}

.polaroid-photo {
  position: absolute;
  top: 15%;
  left: 10%;
  width: 80%;
  height: 55%;
  object-fit: cover;
}

/* BUTTON */
.camera-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
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
  background: #ffc0cb;
}

.btn-back {
  background: #ddd;
}
</style>