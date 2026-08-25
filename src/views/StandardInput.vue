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

    <ConditionSetupWorkspace @next="goCompanyMatch" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import ConditionSetupWorkspace from '@/components/condition-setup/ConditionSetupWorkspace.vue'
import { postCompanyData } from '@/api/company'
import { useConditionSetupStore } from '@/stores/conditionSetup'

const router = useRouter()
const conditionStore = useConditionSetupStore()
const isSubmitting = ref(false)

const buildCompanyPayload = () => ({
  // 目前使用者停留的條件區塊 ID（例如 physical/source/site）
  activeSection: conditionStore.activeSection,
  sourceConditions: {
    // 來源產業 ID（下拉選單 value）
    industry: conditionStore.sourceConditions.industry,
    // 來源產業名稱（下拉選單 label）
    industryLabel: conditionStore.sourceConditions.industryLabel,
    // 來源製程 ID
    process: conditionStore.sourceConditions.process,
    // 產出量（公噸）
    outputAmount: conditionStore.sourceConditions.outputAmount,
    // 產出頻率（daily/weekly/monthly/quarterly）
    frequency: conditionStore.sourceConditions.frequency,
  },
  siteConditions: {
    // 場地區域（可複選，陣列）
    region: Array.isArray(conditionStore.siteConditions.region) ? [...conditionStore.siteConditions.region] : [],
    // 是否有再利用空間（true/false/null）
    hasReuseSpace: conditionStore.siteConditions.hasReuseSpace,
    // 是否有產生衍生廢棄物（true/false/null）
    hasSecondaryWaste: conditionStore.siteConditions.hasSecondaryWaste,
  },
  businessConditions: {
    // 事業名稱
    businessName: conditionStore.businessConditions.businessName,
    // 事業地址
    businessAddress: conditionStore.businessConditions.businessAddress,
    // 資本額區間代碼
    capitalAmount: conditionStore.businessConditions.capitalAmount,
    // 清除頻率（daily/weekly/monthly/quarterly/yearly）
    clearanceFrequency: conditionStore.businessConditions.clearanceFrequency,
    // 清除量（公噸）
    clearanceAmount: conditionStore.businessConditions.clearanceAmount,
    // 清除費用（元/公噸）
    clearanceCost: conditionStore.businessConditions.clearanceCost,
    // 處理量（公噸）
    processingAmount: conditionStore.businessConditions.processingAmount,
    // 處理費用（元/公噸）
    processingCost: conditionStore.businessConditions.processingCost,
    // 技術成熟度分數/等級值
    technologyMaturity: conditionStore.businessConditions.technologyMaturity,
    // 再生產品需求描述
    recycledProductDemand: conditionStore.businessConditions.recycledProductDemand,
  },
  // 允收條件清單（每筆包含 parameter/operator/value/unit/condition 等）
  acceptanceConditions: Array.isArray(conditionStore.acceptanceConditions)
    ? conditionStore.acceptanceConditions.map((condition) => ({ ...condition }))
    : [],
  // 上傳報告清單（目前若有接檔案會放在此）
  uploadedReports: Array.isArray(conditionStore.uploadedReports)
    ? conditionStore.uploadedReports.map((file) => ({ ...file }))
    : [],
  // 技術成熟度選項（複選值陣列）
  technologySelections: [...conditionStore.technologySelections],
  // 再生產品使用者需求選項（複選值陣列）
  demandSelections: [...conditionStore.demandSelections],
})

// 說明：由導覽按鈕觸發；切換路由或流程步驟狀態。
const goCompanyMatch = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    await postCompanyData(buildCompanyPayload())
    router.push('/company-match')
  } catch (error) {
    const errorMessage = error?.response?.data?.message || '資料送出失敗，請稍後再試'
    ElMessage.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
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
