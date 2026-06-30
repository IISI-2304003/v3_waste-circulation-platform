<template>
  <div class="particle-background" ref="particleContainer"></div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'

const particleContainer = ref(null)
let animationId = null
let particles = []
let canvas = null
let ctx = null

// 粒子類別
class Particle {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.alpha = Math.random() * 0.5 + 0.3
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(76, 175, 80, ${this.alpha})`
    ctx.fill()
  }

  update() {
    this.x += this.vx
    this.y += this.vy

    // 邊界檢測
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1

    this.draw()
  }
}

// 初始化畫布
// 說明：建立初始化資料或執行初始化流程，供後續操作使用。
const initCanvas = () => {
  canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx = canvas.getContext('2d')
  particleContainer.value.appendChild(canvas)
}

// 創建粒子
// 說明：建立初始化資料或執行初始化流程，供後續操作使用。
const createParticles = () => {
  const particleCount = window.innerWidth < 768 ? 30 : 60
  particles = []

  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radius = Math.random() * 3 + 1
    particles.push(new Particle(x, y, radius))
  }
}

// 動畫循環
// 說明：在動畫循環中逐步更新數值與畫面，呈現動態效果。
const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  particles.forEach(particle => {
    particle.update()
  })

  // 繪製連接線
  particles.forEach((p1, i) => {
    particles.slice(i + 1).forEach(p2 => {
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 100) {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(76, 175, 80, ${0.15 * (1 - distance / 100)})`
        ctx.lineWidth = 1
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
      }
    })
  })

  animationId = requestAnimationFrame(animate)
}

// 視窗大小調整
// 說明：由使用者互動觸發；執行「handle Resize」流程並同步更新相關狀態。
const handleResize = () => {
  if (canvas) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    createParticles()
  }
}

onMounted(() => {
  initCanvas()
  createParticles()
  animate()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.particle-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
