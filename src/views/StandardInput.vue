<template>
  <div class="standard-input-page">
    <div class="page-header">
      <el-button text @click="goBackHome" class="back-btn">
        <el-icon>
          <ArrowLeft />
        </el-icon>
        返回首頁
      </el-button>
      <div class="header-title">
        <h1>產業廢棄物循環利用智慧媒合平台</h1>
        <p>條件設定</p>
      </div>

    </div>

    <ConditionSetupWorkspace @next="goCompanyMatch" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import ConditionSetupWorkspace from '@/components/condition-setup/ConditionSetupWorkspace.vue'
import { useConditionSetupStore } from '@/stores/conditionSetup'

const router = useRouter()
const conditionStore = useConditionSetupStore()

const goCompanyMatch = () => {
  router.push('/company-match')
}

const goBack = () => {
  router.back()
}
const goBackHome = () => {
  conditionStore.resetAll()
  router.push('/')
}
</script>

<style scoped lang="scss">
.standard-input-page {
  // max-width: min(92vw, 1700px);
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  isolation: isolate;
  background:
    radial-gradient(circle at 10% 20%, rgba(143, 178, 224, 0.1), transparent 50%),
    radial-gradient(circle at 70% 20%, rgba(33, 150, 243, 0.2), transparent 40%),
    radial-gradient(circle at 10% 100%, rgba(143, 178, 224, 0.3), transparent 50%);

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: min(540px, 54vh);
    background: url('../assets/Bg_v4_850.png') center top / 100% auto no-repeat;
    mask-image: linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.35) 16%, rgba(0, 0, 0, 0.78) 38%, #000 60%);
    -webkit-mask-image: linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.35) 16%, rgba(0, 0, 0, 0.78) 38%, #000 60%);
    z-index: 0;
    pointer-events: none;
  }

  > * {
    position: relative;
    z-index: 1;
  }
}

.page-header {
  backdrop-filter: blur(16px);
  padding: 24px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;

  .header-title {
    flex: 1;
    text-align: center;

    h1 {
      margin: 0;
      font-size: clamp(24px, 2.4vw, 46px);
      font-weight: 700;
      color: #2d554a;
    }

    p {
      margin: 3px 0 0;
      font-size: 18px;
      color: #5d7772;
      font-weight: 600;
    }
  }
}

@media (max-width: 768px) {
  .standard-input-page {
    padding: 16px;

    &::before {
      height: min(420px, 42vh);
      background-size: cover;
    }
  }
}

@media (min-width: 1600px) {
  .standard-input-page {
    // max-width: min(92vw, 1820px);
    padding: 28px 20px;
  }
}
</style>
