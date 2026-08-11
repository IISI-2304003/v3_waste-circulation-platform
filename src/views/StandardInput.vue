<template>
  <div class="standard-input-page">
    <div class="page-header">
      <el-row :gutter="24" align="middle" class="header-row">
        <el-col :xs="24" :md="3">
          <el-button text @click="goBackHome" class="back-btn">
            <el-icon>
              <ArrowLeft />
            </el-icon>
            返回首頁
          </el-button>
        </el-col>
        <el-col :xs="24" :md="18">
          <div class="header-title">
            <h1 class="hero-title">產業資源循環利用<br><span style="color: #4CAF50;">路徑決策</span><span style="color: #06B6D4;">系統</span></h1>
            <p>條件設定</p>
          </div>
        </el-col>
      </el-row>

    </div>

    <ConditionSetupWorkspace :property-options="propertyOptions" @next="goCompanyMatch" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ConditionSetupWorkspace from '@/components/condition-setup/ConditionSetupWorkspace.vue'
import { useConditionSetupStore } from '@/stores/conditionSetup'
import { getWasteCodeProperties } from '@/api/wasteCode'

const router = useRouter()
const route = useRoute()
const conditionStore = useConditionSetupStore()
const propertyOptions = ref([])

const normalizePropertyOptions = (payload) => {
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.items)
        ? payload.items
        : []

  const normalizedItems = items
    .map((item) => {
      if (typeof item === 'string') {
        const name = item.trim()
        return name ? { name, unit: '' } : null
      }

      const name = String(
        item?.test_item ||
        item?.parameter ||
        item?.property ||
        item?.propertyName ||
        item?.property_name ||
        item?.name ||
        item?.label ||
        ''
      ).trim()

      if (!name) return null

      const unit = String(item?.unit || item?.test_unit || '').trim()
      return { name, unit }
    })
    .filter(Boolean)

  const propertyMap = new Map()
  for (const item of normalizedItems) {
    if (!propertyMap.has(item.name)) {
      propertyMap.set(item.name, item)
      continue
    }

    const existing = propertyMap.get(item.name)
    if (!existing.unit && item.unit) {
      propertyMap.set(item.name, item)
    }
  }

  return Array.from(propertyMap.values())
}

const loadWasteCodeProperties = async () => {
  const code = String(route.query.code || '').trim()
  if (!code) return

  try {
    const data = await getWasteCodeProperties(code)
    propertyOptions.value = normalizePropertyOptions(data)

    if (propertyOptions.value.length === 0) {
      ElMessage.warning('已取得資料，但該廢棄物目前沒有可用的物化特性參數')
    }
  } catch (error) {
    console.error('取得廢棄物物化特性參數失敗', error)
    const statusCode = error?.response?.status
    const backendMessage = error?.response?.data?.message || error?.response?.data?.error
    ElMessage.warning(`無法載入該廢棄物的物化特性參數（${statusCode || '網路錯誤'}${backendMessage ? `: ${backendMessage}` : ''}），已改用預設選項`)
  }
}

onMounted(loadWasteCodeProperties)

// 說明：由導覽按鈕觸發；切換路由或流程步驟狀態。
const goCompanyMatch = () => {
  router.push('/company-match')
}

// 說明：由導覽按鈕觸發；切換路由或流程步驟狀態。
const goBackHome = () => {
  conditionStore.resetAll()
  router.push('/')
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.standard-input-page {
  // max-width: min(92vw, 1700px);
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  padding: 24px 20px 96px;
  // isolation: isolate;
  background:
    radial-gradient(circle at 10% 20%, rgba(143, 178, 224, 0.1), transparent 50%),
    radial-gradient(circle at 70% 20%, rgba(33, 150, 243, 0.2), transparent 40%),
    radial-gradient(circle at 10% 100%, rgba(143, 178, 224, 0.3), transparent 50%);

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: min(400px, 54vh);
    background: url('../assets/Bg_v4_850.png') center center / 100% auto no-repeat;
    // mask-image: linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.35) 16%, rgba(0, 0, 0, 0.78) 38%, #000 60%);
    // -webkit-mask-image: linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.35) 16%, rgba(0, 0, 0, 0.78) 38%, #000 60%);
    z-index: 0;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    background: url('../assets/Footer_v3.png') center bottom / 100% auto no-repeat;
    pointer-events: none;
    z-index: 0;
  }

  >* {
    position: relative;
    z-index: 1;
  }
}

.page-header {
  // backdrop-filter: blur(16px);
  // padding: 24px 24px;


  .header-row {
    text-align: left;
    margin-top: 0px;


    h1 {
      margin: 0;
      font-size: clamp(36px, 3.2vw, 68px);
      font-weight: 700;
      color: #2d554a;
    }

    p {
      margin: 3px 0 0;
      font-size: clamp(24px, 0.898rem + 0.49vw, 36px);
      color: #5d7772;
      font-weight: 600;
    }
  }
}

.header-title {
  text-align: left;
}

@media (max-width: 768px) {
  .standard-input-page {
    padding: 18px 12px 88px;
    min-height: auto;

    &::before {
      height: min(850px, 150vh);
      // background-size: cover;
      background: url('../assets/Bg_mobile.png') center top / 100% auto no-repeat;
      mask-image: linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.35) 16% #000 60%);
      -webkit-mask-image: linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.35) 16%, #000 20%);
    }
  }

  .header-title {
    text-align: center;
  }
}

@media (min-width: 1600px) {
  .standard-input-page {
    // max-width: min(92vw, 1820px);
    padding: 28px 20px;
  }
}
</style>
