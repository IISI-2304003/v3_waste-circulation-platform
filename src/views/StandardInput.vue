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
  background:
    radial-gradient(circle at 14% 22%, rgba(87, 166, 255, 0.36), transparent 24%),
    radial-gradient(circle at 82% 14%, rgba(117, 135, 255, 0.26), transparent 12%),
    radial-gradient(circle at 70% 78%, rgba(104, 218, 255, 0.2), transparent 16%),
    linear-gradient(180deg, #e8f4ff 0%, #dceeff 46%, #f4f9ff 100%);
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
  }
}

@media (min-width: 1600px) {
  .standard-input-page {
    // max-width: min(92vw, 1820px);
    padding: 28px 20px;
  }
}
</style>
