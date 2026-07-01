<template>
  <div class="company-match-page">
    <!-- 頂部頁頭 -->
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
            <h1 class="hero-title">產業廢棄物循環利用<br><span class="hero-title-accent">路徑決策</span><span class="hero-title-accent-secondary">系統</span></h1>
            <p>路徑推薦</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="padding: 24px">
      <!-- Step Progress (與條件設定頁共用元件) -->
      <FlowStepProgress :active-step="2" class="progress-top" />
      <!-- AI 分析結果橫幅 -->
      <div class="analysis-banner">
        <el-row :gutter="24" align="middle" class="banner-row">
          <el-col :xs="24" :md="5">
            <div class="banner-left">
              <div class="banner-title-row">
                <div class="ai-icon"><el-icon>
                    <Monitor />
                  </el-icon>
                </div>
                <div>
                  <h2>媒合分析結果</h2>
                  <p>根據您設定的條件，系統已完成循環利用可行性分析，並推薦最適合的循環路徑。</p>
                  <p class="reminder-text">貼心提醒: 本系統僅提供建議，最終決策仍需依據實際情況進行判斷。</p>
                </div>
              </div>

            </div>
          </el-col>
          <el-col :xs="24" :md="11">

            <div class="banner-summary">
              <div class="summary-title">您本次條件分析</div>
              <div class="summary-list">
                <div class="summary-row" v-for="item in conditionSummary" :key="item.id">
                  <div class="summary-item-grid">
                    <div class="summary-icon" :style="{ color: item.color }">
                      <el-icon>
                        <component :is="item.icon" />
                      </el-icon>
                    </div>
                    <div class="summary-main">
                      <div class="summary-label">{{ item.label }}</div>
                      <div class="summary-value">{{ item.value }}</div>
                    </div>
                    <div class="summary-impact-tag" :style="{ backgroundColor: item.color + '20', borderColor: item.color }">
                      <span class="impact-dot" :style="{ backgroundColor: item.color }"></span>
                      <span class="impact-label">{{ item.levelLabel }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :md="8" style="padding: 0px;">
            <div class="banner-radar">
              <v-chart :option="radarOption" autoresize class="radar-chart" />
            </div>
          </el-col>
        </el-row>


      </div>

      <!-- 推薦循環路徑標頭 -->
      <div class="section-header-row">
        <div class="section-title-group">
          <div class="section-bar"></div>
          <div>
            <span class="section-title">推薦循環路徑</span>
            <span class="section-desc">依據您的條件，為您推薦最適合的三種循環路徑</span>
          </div>
        </div>
        <el-button text type="primary" class="modes-link" @click="openModesDialog">
          <el-icon>
            <WarningFilled />
          </el-icon>查看十大循環模式說明
        </el-button>
      </div>

      <!-- 路徑卡片 - 三格一排 -->
      <div class="path-list">
        <el-row :gutter="16">
          <el-col v-for="path in recommendedPaths" :key="path.id" :xs="24" :md="8" class="path-col">
            <div class="path-card">
              <!-- 頂部色塊區 -->
              <div class="path-header">
                <span class="path-rank-badge" :style="{ background: path.gradient }">推薦路徑{{ path.rank }}</span>
              </div>
              <!-- 流程圖區 -->
              <div class="path-body">
                <div class="path-intro">
                  <span class="path-mode-name" :style="{ color: path.accentColor }">{{ path.modeName }}</span>
                  <span v-if="path.rank === 1" class="best-tag">最佳方案</span>
                  <p class="path-summary">{{ path.summary }}</p>
                </div>
                <div class="flow-diagram">
                  <template v-for="(step, index) in path.steps" :key="`${path.id}-s${index}`">
                    <div class="flow-step">
                      <div class="flow-icon" :style="{
                        borderColor: path.accentColor + '60',
                        color: path.accentColor,

                      }">
                        <el-icon :size="22">
                          <component :is="step.icon" />
                        </el-icon>
                      </div>
                      <span class="flow-label">{{ step.label }}</span>
                    </div>
                    <div v-if="index < path.steps.length - 1" class="flow-arrow" :style="{ color: path.accentColor }">
                      <el-icon class="el-icon--right">
                        <ArrowRight />
                      </el-icon>
                    </div>
                  </template>
                </div>

                <!-- 統計數字區 -->
                <div class="path-stats">
                  <div class="stat-item">
                    <span class="stat-label">符合廠商總數</span>
                    <span class="stat-value" :style="{ color: path.accentColor }">
                      {{ path.matchRate }} <span class="stat-unit" :style="{ color: path.accentColor }">家</span>
                    </span>
                  </div>
                  <el-button type="primary" class="detail-btn" @click="goNext(path)">
                    技術媒合推薦
                    <el-icon class="el-icon--right">
                      <ArrowRight />
                    </el-icon>
                  </el-button>
                </div>

              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 底部導航 -->
    <div class="page-footer-nav">
      <el-button @click="goPrevious" class="footer-prev-btn">
        <el-icon class="el-icon--left">
          <ArrowLeft />
        </el-icon>
        上一步：條件設定
      </el-button>
      <div class="footer-hint">請先點選上方任一推薦路徑卡片的「技術媒合推薦」，即可進入下一步。</div>
      <!-- <el-button type="primary" @click="goNext">
        下一步：技術媒合推薦
        <el-icon class="el-icon--right">
          <ArrowRight />
        </el-icon>
      </el-button> -->
    </div>

    <el-dialog v-model="modesDialogVisible" class="top-modes-dialog" width="min(1080px, 94vw)" align-center destroy-on-close>
      <template #header>
        <div class="modes-dialog-header">
          <h3>十大循環模式說明</h3>
        </div>
      </template>

      <div class="modes-dialog-body" v-if="activeMode">
        <aside class="modes-dialog-list">
          <button v-for="mode in allCirculationModes" :key="mode.id" type="button" class="mode-list-item" :class="{ active: mode.id === activeModeId }" @click="activeModeId = mode.id">
            <span class="mode-dot" :style="{ background: mode.color || '#26a69a' }"></span>
            <span class="mode-list-name">{{ mode.name }}</span>
          </button>
        </aside>

        <section class="modes-dialog-detail">
          <div class="detail-title-row">
            <span class="detail-mode-name">{{ activeMode.name }}</span>
          </div>

          <div class="detail-section">
            <h4>模式說明</h4>
            <p>{{ activeMode.description || '尚無說明資料。' }}</p>
          </div>

          <div class="detail-section" v-if="activeMode.flowchartUrl">
            <h4>循環流程圖</h4>
            <div class="flowchart-box">
              <img :src="activeMode.flowchartUrl" :alt="activeMode.flowchartAlt || activeMode.name" />
            </div>
          </div>

          <!-- <div class="detail-section" v-if="activeModeSteps.length">
            <h4>流程節點</h4>
            <div class="steps-wrap">
              <span v-for="step in activeModeSteps" :key="step.label" class="step-tag">{{ step.label }}</span>
            </div>
          </div> -->

          <div class="detail-section">
            <h4>填報注意事項</h4>
            <p class="notices-text">{{ activeMode.notices || '尚無注意事項資料。' }}</p>
          </div>
        </section>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { use } from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

// 註冊 ECharts 所需模組（按需引入，減少 bundle 大小）
use([RadarChart, TooltipComponent, LegendComponent, CanvasRenderer])

import {
  ArrowLeft, ArrowRight, Monitor,
  Connection, DataAnalysis, Files, Finished,
  Goods, Location, Money, Operation, Promotion, SetUp
} from '@element-plus/icons-vue'
import FlowStepProgress from '@/components/condition-setup/FlowStepProgress.vue'
import { useConditionSetupStore } from '@/stores/conditionSetup'
import circulationModes from '@/data/circulationModes.json'
// import { b } from 'vue-router/dist/index-CzEDAlw7.js'

const router = useRouter()
const store = useConditionSetupStore()
const modesDialogVisible = ref(false)
const activeModeId = ref(1)
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1440)

// 說明：由視窗 resize 事件觸發；更新 viewportWidth 供雷達圖響應式參數重算。
const updateViewportWidth = () => {
  viewportWidth.value = window.innerWidth
}

const industryLabelMap = {
  semiconductor: '電子與半導體',
  steel: '鋼鐵冶金',
  chemical: '化工製程',
  food: '食品加工'
}

// 說明：封裝「yes No Text」商業邏輯，供目前流程重複使用。
const yesNoText = (value) => {
  if (value === true) return '有'
  if (value === false) return '無'
  return '未設定'
}

const clearanceFrequencyLabelMap = {
  daily: '每日',
  weekly: '每週',
  monthly: '每月',
  quarterly: '每季',
  yearly: '每年'
}

const toClearanceFrequencyLabel = (value) => {
  if (!value) return '未設定'
  return clearanceFrequencyLabelMap[value] || value
}

const IMPACT_LEVEL_SCORE_MAP = {
  high: 100,
  medium: 65,
  low: 30
}

// 計算條件的影響度級別
// 說明：回傳「get Impact Level」資料供畫面渲染或後續商業規則使用。
const getImpactLevel = (condition) => {
  // 根據條件的設定情況評估影響度
  // 高(high): 完整設定，100-75 分
  // 中(medium): 部分設定，74-50 分
  // 低(low): 未設定或最少設定，49-0 分
  const score = condition.score || 0
  if (score >= 75) return { level: 'high', color: 'var(--ds-primary-green)', levelLabel: '高' }
  if (score >= 50) return { level: 'medium', color: 'var(--ds-accent-orange)', levelLabel: '中' }
  return { level: 'low', color: 'var(--ds-error)', levelLabel: '低' }
}

// 說明：封裝「to Radar Score」商業邏輯，供目前流程重複使用。
const toRadarScore = (level) => IMPACT_LEVEL_SCORE_MAP[level] || 0

// 雷達圖「軸標籤文字內容」換行規則。
// 想調整每行切幾個字，改這裡的 slice 範圍。
// 說明：將輸入資料標準化為系統格式，供媒合與查詢流程使用。
const formatRadarIndicatorName = (label = '') => {
  const text = String(label)
  if (text.length <= 5) return text
  if (text.length <= 10) return `${text.slice(0, 4)}\n${text.slice(4)}`
  return `${text.slice(0, 4)}\n${text.slice(4, 8)}\n${text.slice(8)}`
}

// 說明：依目前條件即時計算「condition Summary」內容，提供畫面顯示與決策判斷使用。
const conditionSummary = computed(() => {
  // 計算每個條件的設定程度和評分
  const acceptanceCount = Array.isArray(store.acceptanceConditions) ? store.acceptanceConditions.length : 0
  const acceptanceScore = acceptanceCount > 0 ? Math.min(acceptanceCount * 20, 100) : 0

  const sourceScore = (store.sourceConditions.industry && store.sourceConditions.process) ? 80 : 40

  const siteScore = (store.siteConditions.hasReuseSpace !== null || store.siteConditions.hasSecondaryWaste !== null) ? 70 : 20

  const environmentScore = store.siteConditions.hasSecondaryWaste !== null ? 75 : 30

  const businessScore = (store.businessConditions.clearanceFrequency && store.businessConditions.clearanceAmount) ? 85 : 35

  const technologyScore = 50 // 默認中等影響度

  const demandScore = 50 // 默認中等影響度
  console.log("store.businessConditions", store.businessConditions);

  return [
    {
      id: 'physical',
      label: '物化特性',
      value: acceptanceCount > 0 ? `已設定 ${acceptanceCount} 項` : '未設定',
      score: acceptanceScore,
      icon: DataAnalysis,
      ...getImpactLevel({ score: acceptanceScore })
    },
    {
      id: 'source',
      label: '料源穩定性',
      value: store.sourceConditions.industry ? `${industryLabelMap[store.sourceConditions.industry]}` : '未設定',
      score: sourceScore,
      icon: Connection,
      ...getImpactLevel({ score: sourceScore })
    },
    {
      id: 'site',
      label: '場地配置',
      value: `空間：${yesNoText(store.siteConditions.hasReuseSpace)}`,
      score: siteScore,
      icon: Location,
      ...getImpactLevel({ score: siteScore })
    },
    {
      id: 'environment',
      label: '環境影響',
      value: `衍生廢棄物：${yesNoText(store.siteConditions.hasSecondaryWaste)}`,
      score: environmentScore,
      icon: Files,
      ...getImpactLevel({ score: environmentScore })
    },
    {
      id: 'business',
      label: '經濟效益',
      value: toClearanceFrequencyLabel(store.businessConditions.clearanceFrequency),
      score: businessScore,
      icon: Money,
      ...getImpactLevel({ score: businessScore })
    },
    {
      id: 'technology',
      label: '技術成熟度',
      value: '已設定',
      score: technologyScore,
      icon: Operation,
      ...getImpactLevel({ score: technologyScore })
    },
    {
      id: 'demand',
      label: '再生產品使用者製程需求',
      value: '已設定',
      score: demandScore,
      icon: Goods,
      ...getImpactLevel({ score: demandScore })
    }
  ]
})

// 說明：依目前條件即時計算「radar Series Values」內容，提供畫面顯示與決策判斷使用。
const radarSeriesValues = computed(() => conditionSummary.value.map((item) => toRadarScore(item.level)))

// 說明：依目前條件即時計算「radar Responsive Config」內容，提供畫面顯示與決策判斷使用。
const radarResponsiveConfig = computed(() => {
  const width = viewportWidth.value

  if (width <= 576) {
    return {
      centerX: '48%',
      centerY: '54%',
      radius: '46%',
      nameGap: 6,
      axisNameFontSize: 12,
      axisNameLineHeight: 14,
      symbolSize: { high: 7, medium: 6, low: 4 }
    }
  }

  if (width <= 992) {
    return {
      centerX: '47%',
      centerY: '53%',
      radius: '52%',
      nameGap: 7,
      axisNameFontSize: 13,
      axisNameLineHeight: 15,
      symbolSize: { high: 9, medium: 7, low: 5 }
    }
  }

  return {
    centerX: '47%',
    centerY: '52%',
    radius: '56%',
    nameGap: 8,
    axisNameFontSize: 14,
    axisNameLineHeight: 16,
    symbolSize: { high: 10, medium: 7, low: 5 }
  }
})

// ★ 新增：ECharts 雷達圖 option（替換原本的 radarPoints computed）
// 說明：依目前條件即時計算「radar Option」內容，提供畫面顯示與決策判斷使用。
const radarOption = computed(() => ({
  // tooltip: {
  //   trigger: 'item',
  //   formatter: () => {
  //     return conditionSummary.value
  //       .map((item) => {
  //         const dot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${item.color};margin-right:6px;"></span>`
  //         return `${dot}<span style="color:#2d554a;font-weight:600">${item.label}</span>：<span style="color:${item.color};font-weight:700">${item.levelLabel}影響</span>`
  //       })
  //       .join('<br/>')
  //   },
  //   backgroundColor: 'rgba(255,255,255,0.95)',
  //   borderColor: '#e4ecea',
  //   borderWidth: 1,
  //   textStyle: {
  //     // tooltip 內文文字大小
  //     fontSize: 12,
  //     fontFamily: "-apple-system, BlinkMacSystemFont, 'Microsoft JhengHei', sans-serif"
  //   },
  //   padding: [10, 14]
  // },
  radar: {
    // indicator.name 決定雷達圖外圈標籤文字內容
    indicator: conditionSummary.value.map(item => ({
      name: formatRadarIndicatorName(item.label),
      max: 100
    })),
    center: [radarResponsiveConfig.value.centerX, radarResponsiveConfig.value.centerY],
    // radius 控制雷達圖本體大小（越大越靠近外圈文字）
    radius: radarResponsiveConfig.value.radius,
    // nameGap 控制「外圈文字」與「雷達圖」的距離
    nameGap: radarResponsiveConfig.value.nameGap,
    axisName: {
      color: '#5d7772',
      // 外圈標籤字級
      fontSize: radarResponsiveConfig.value.axisNameFontSize,
      fontWeight: 600,
      // 外圈標籤行距（多行文字可讀性）
      lineHeight: radarResponsiveConfig.value.axisNameLineHeight,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Microsoft JhengHei', sans-serif"
    },
    splitLine: {
      lineStyle: { color: '#e4ecea', width: 1 }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['#f4fbf7', '#edf7f3', '#f4fbf7', '#edf7f3']
      }
    },
    axisLine: {
      lineStyle: { color: '#d0d7d3', width: 1 }
    }
  },
  series: [
    // ★ 主體面積線（不顯示頂點，只畫面積和邊線）
    {
      type: 'radar',
      data: [{
        value: radarSeriesValues.value,
        name: '影響程度',
        areaStyle: { color: 'rgba(76, 175, 80, 0.15)' },
        lineStyle: { color: '#22c55e', width: 2 },
        symbol: 'none' // 頂點由下面的 scatter 系列接管
      }]
    },
    // ★ 每個頂點獨立一個 series，各自設定顏色與大小
    ...conditionSummary.value.map((item, index) => {
      // 只在該頂點位置放值，其餘補 null
      // 說明：封裝「value」商業邏輯，供目前流程重複使用。
      const value = conditionSummary.value.map((_, i) => i === index ? toRadarScore(item.level) : null)
      const size = item.level === 'high'
        ? radarResponsiveConfig.value.symbolSize.high
        : item.level === 'medium'
          ? radarResponsiveConfig.value.symbolSize.medium
          : radarResponsiveConfig.value.symbolSize.low
      return {
        type: 'radar',
        data: [{
          value,
          symbol: 'circle',
          symbolSize: size,
          itemStyle: { color: item.color },
          lineStyle: { width: 0 },      // 不畫連線
          areaStyle: { opacity: 0 }     // 不畫填色
        }],
        tooltip: { show: false }         // tooltip 由第一個 series 統一處理
      }
    })
  ]
}))
const baseExternalPaths = [
  {
    modeName: '廠外模式 4',
    summary: '原料購入使用後，送至受產源實質自主管理之公司純化（再製）、調整成分與濃度，再返回原廠原製程循環使用。',
    gradient: 'linear-gradient(160deg,#3dc35a,#1e8c3e)',
    accentColor: '#2da84a',
    matchRate: 3,
    steps: [
      { label: '原料購入', icon: Goods },
      { label: '純化(再製)', icon: Operation },
      { label: '調整成分', icon: SetUp },
      { label: '返回原製程', icon: Promotion }
    ]
  },
  {
    modeName: '廠外模式 6',
    summary: '送至同一法人前處理，再送至其他公司純化（再製）、調整成分與濃度，再返回原廠使用。',
    gradient: 'linear-gradient(160deg,#22b9ae,#0d7a73)',
    accentColor: '#18a89f',
    matchRate: 9,
    steps: [
      { label: '原料購入', icon: Goods },
      { label: '前處理', icon: Files },
      { label: '純化(再製)', icon: Operation },
      { label: '調整成分', icon: SetUp },
      { label: '返回原製程', icon: Promotion }
    ]
  },
  {
    modeName: '廠外模式 2',
    title: '跨產業再利用',
    summary: '送至同一法人不同廠區處理及再利用。',
    gradient: 'linear-gradient(160deg,#a67fff,#6d3fd6)',
    accentColor: '#8b55f5',
    matchRate: 5,
    steps: [
      { label: '原料購入', icon: Goods },
      { label: '異業處理', icon: Connection },
      { label: '再利用', icon: Finished }
    ]
  }
]

const baseInternalPath = {
  modeName: '廠內模式 1',
  title: '廠內處理回原製程',
  summary: '利用廠內再利用空間完成前處理與純化再製後，直接回到原製程，縮短運輸與處理鏈。',
  gradient: 'linear-gradient(160deg,#f29f3a,#e27400)',
  accentColor: '#2da84a',
  score: 94,
  steps: [
    { label: '原料購入', icon: Goods },
    { label: '廠內前處理', icon: Files },
    { label: '純化(再製)', icon: Operation },
    { label: '返回原製程', icon: Promotion }
  ]
}

// 說明：封裝「with Rank」商業邏輯，供目前流程重複使用。
const withRank = (paths) => paths.map((path, index) => ({ ...path, id: `r${index + 1}`, rank: index + 1 }))

// 說明：依目前條件即時計算「recommended Paths」內容，提供畫面顯示與決策判斷使用。
const recommendedPaths = computed(() => {
  const hasReuseSpace = store.siteConditions.hasReuseSpace === true
  if (hasReuseSpace) {
    return withRank([baseInternalPath, ...baseExternalPaths.slice(0, 2)])
  }
  return withRank(baseExternalPaths)
})

// 說明：將輸入資料標準化為系統格式，供媒合與查詢流程使用。
const normalizeModeName = (value = '') => String(value).replace(/\s+/g, '').trim()

// 說明：依目前條件即時計算「all Circulation Modes」內容，提供畫面顯示與決策判斷使用。
const allCirculationModes = computed(() => circulationModes)

// 說明：依目前條件即時計算「preferred Mode Id」內容，提供畫面顯示與決策判斷使用。
const preferredModeId = computed(() => {
  const currentModeName = normalizeModeName(recommendedPaths.value?.[0]?.modeName)
  // 說明：封裝「matched」商業邏輯，供目前流程重複使用。
  const matched = allCirculationModes.value.find((mode) => normalizeModeName(mode.name) === currentModeName)
  return matched?.id || allCirculationModes.value?.[0]?.id || 1
})

// 說明：依目前條件即時計算「active Mode」內容，提供畫面顯示與決策判斷使用。
const activeMode = computed(() => {
  return allCirculationModes.value.find((mode) => mode.id === activeModeId.value) || allCirculationModes.value[0] || null
})

// 說明：依目前條件即時計算「active Mode Steps」內容，提供畫面顯示與決策判斷使用。
const activeModeSteps = computed(() => activeMode.value?.steps || activeMode.value?.step || [])

// 說明：由「查看十大循環模式說明」按鈕觸發；切換對話框為開啟狀態。
const openModesDialog = () => {
  activeModeId.value = preferredModeId.value
  modesDialogVisible.value = true
}

// 說明：由導覽按鈕觸發；切換路由或流程步驟狀態。
const goPrevious = () => router.push('/standard-input')
// 說明：由導覽按鈕觸發；切換路由或流程步驟狀態。
const goBackHome = () => {
  store.resetAll()
  router.push('/')
}
// 說明：由導覽按鈕觸發；切換路由或流程步驟狀態。
const goNext = (path) => {
  store.setSelectedRecommendedPath(path)
  router.push('/technology-match')
}

onMounted(() => {
  window.addEventListener('resize', updateViewportWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportWidth)
})
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.company-match-page {
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  background:
    radial-gradient(circle at 10% 20%, rgba(143, 178, 224, 0.1), transparent 50%),
    radial-gradient(circle at 70% 20%, rgba(33, 150, 243, 0.2), transparent 40%),
    radial-gradient(circle at 10% 100%, rgba(143, 178, 224, 0.3), transparent 50%);
  padding: 24px 20px 96px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft JhengHei', sans-serif;

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: min(400px, 54vh);
    background: url('../assets/Bg_v4_850.png') center center / 100% auto no-repeat;
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

.progress-top {
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

/* ─── 頁頭 ─── */
.page-header {
  padding: 24px 24px;

  .header-row {
    text-align: left;

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

.back-btn {
  color: $text-secondary;
  font-size: 14px;
}

.header-title {
  text-align: left;
}

/* ─── Analysis Banner ─── */
.analysis-banner {
  // max-width: 1360px;
  // margin: 24px 18px;
  padding: 28px 32px;
  background: rgba($bg-primary, 0.8);
  border-radius: $card-radius;
  border: 1px solid rgba($bg-primary, 0.82);
  box-shadow: $shadow-card, inset 0 1px 0 rgba($bg-primary, 0.78);
  backdrop-filter: blur(16px);
  // display: grid;
  // grid-template-columns: 300px 1fr 220px;
  gap: 24px;
  align-items: start;

  .banner-row {
    display: flex;
    align-items: flex-start;

    .banner-left {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;

      .banner-title-row {
        display: flex;
        gap: 14px;
        align-items: flex-start;
        margin-bottom: 18px;
        font-weight: 600;

        .hero-title-accent {
          color: $primary-green;
        }

        .hero-title-accent-secondary {
          color: $secondary-cyan;
        }

        h2 {
          margin: 0 0 5px;
          font-size: 21px;
          font-weight: 700;
          color: $text-primary;
        }

        p {
          margin: 0;
          font-size: 15px;
          line-height: 1.6;
          color: $text-secondary;

          &.reminder-text {
            font-size: 15px;
            color: $error;
            line-height: 1.4;
            margin-top: 10px;
          }
        }

      }

    }
  }


}




.ai-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4caf50, #26a69a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  flex-shrink: 0;
}



.score-card {
  background: linear-gradient(145deg, #f4fbf7, #edf7f3);
  border: 1px solid rgba(76, 175, 80, .18);
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.score-label {
  font-size: 11px;
  font-weight: 700;
  color: #5a8075;
  letter-spacing: .04em;
}

.score-number {
  font-size: 44px;
  font-weight: 900;
  color: #1a2e2b;
  line-height: 1;

  span {
    font-size: 18px;
    font-weight: 500;
    color: #7a9490;
  }
}

.score-stars {
  display: flex;
  gap: 3px;

  .star {
    color: #4caf50;
    font-size: 16px;
  }

  .star.half {
    color: #c8e6c9;
  }
}

.score-tag {
  display: inline-flex;
  padding: 5px 12px;
  border-radius: 999px;
  background: #4caf50;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  align-self: flex-start;
}

.banner-summary {
  border-left: 1px solid #e4ecea;
  border-right: 1px solid #e4ecea;
  padding: 0 24px;

  .summary-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a2e2b;
    margin-bottom: 14px;
  }

  .summary-list {
    display: flex;
    flex-direction: column;
    gap: 13px;
  }

  .summary-row {
    align-items: center;
    gap: 10px;

    .summary-item-grid {
      display: grid;
      grid-template-columns: 26px minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .summary-main {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .summary-icon {
      width: 26px;
      height: 26px;
      border-radius: 7px;
      background: rgba(76, 175, 80, .08);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }



    .summary-label {
      font-size: clamp(15px, 0.898rem + 0.49vw, 16px);
      color: #1a2e2b;
      font-weight: 700;
    }

    .summary-value {
      font-size: clamp(15px, 0.898rem + 0.49vw, 16px);
      color: #4caf50;
      font-weight: 600;

      &.muted {
        color: #b0bec5;
      }
    }

    .summary-impact-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid;
      font-size: 12px;
      font-weight: 600;

      .impact-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
      }

      .impact-label {
        color: currentColor;
      }
    }
  }
}




/* 雷達圖 */
.banner-radar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  padding: 0 clamp(10px, 1.6vw, 22px);

  .radar-chart {
    width: 100%;
    height: clamp(320px, 36vw, 520px);
    overflow: visible;
  }
}



@keyframes spin-slow {
  to {
    transform: rotate(360deg);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

/* ─── Section Header ─── */
.section-header-row {
  margin: 24px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-bar {
  width: 4px;
  height: 22px;
  border-radius: 2px;
  background: linear-gradient(180deg, #4caf50, #26a69a);
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d554a;
  margin-right: 10px;
}

.section-desc {
  font-size: 15px;
  color: #7a9490;
  font-weight: 500;
}

.modes-link {
  font-size: 15px;
  font-weight: 600;
}

.path-list {
  width: 100%;

  :deep(.el-row) {
    align-items: stretch;
  }
}

.path-col {
  display: flex;
}

.path-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 頂部漸層色塊 */
.path-header {
  padding: 10px 20px 5px;
  color: #fff;
  background: #FFF;

  .path-rank-badge {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 2px;
    padding: 4px 30px;
    border-radius: 20px 0px;
  }


}


/* 卡片主體 */
.path-body {
  padding: 16px 20px 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  flex: 1;

  .path-intro {
    min-height: 50px;
  }


  .path-mode-name {
    display: inline-block;
    font-size: 28px;
    font-weight: 700;
    margin-right: 10px;
    // padding: 2px 8px;
    // border-radius: 20px;
  }



  .path-summary {
    font-size: 16px;
    font-weight: 600;
    opacity: 0.9;
    margin: 0;
    line-height: 1.6;
    margin-top: 10px;
    min-height: 3.2em;
    max-height: 7.2em;
    overflow: hidden;
    display: -webkit-box;
    line-clamp: 4;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }


  /* 方案標籤 */
  .best-tag,
  .alt-tag,
  .new-tag {
    font-size: 15px;
    font-weight: 700;
    padding: 2px 10px;
    border-radius: 20px;
    background: rgba(255, 226, 192, 0.726);
    color: #ff9c2c;
    white-space: nowrap;
  }
}

/* 流程圖 */
.flow-diagram {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  margin: 16px 0px;
  min-height: 82px;

  .flow-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    .flow-icon {
      width: 44px;
      height: 44px;
      border: 1.5px solid;
      border-radius: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      // background: #fff;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }

    .flow-label {
      font-size: 15px;
      font-weight: 500;
      color: #666;
      white-space: nowrap;
    }
  }

  .flow-arrow {
    font-size: 16px;
    margin-bottom: 18px;
    flex-shrink: 0;
  }
}

/* 統計數字 */
.path-stats {
  display: flex;
  gap: 0;
  margin-top: auto;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-bottom: 12px;

  .stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;

    .stat-label {
      font-size: 15px;
      font-weight: 600;
      color: #999;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
    }

    .stat-unit {
      font-size: 16px;
      font-weight: 700;

    }
  }
}

.detail-btn {
  align-self: flex-end;
  margin-top: auto;
  font-size: 15px;
  font-weight: 700;
  border: none;
  background: linear-gradient(135deg, #4caf50, #26a69a);
  color: #fff;

  &:hover,
  &:focus {
    background: linear-gradient(135deg, #58b85c, #30b3a8);
    color: #fff;
  }
}

/* ─── Analysis Basis ─── */
.analysis-basis {
  margin: 0 auto 28px;
}

.basis-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.basis-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.basis-card {
  background: #ffffffa6;
  border-radius: 14px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 10px 24px rgba(53, 93, 83, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(10px);
}

.basis-icon-row {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 9px;
}

.basis-label {
  font-size: 14px;
  font-weight: 700;
}

.basis-score {
  font-size: 26px;
  font-weight: 900;
  margin-bottom: 7px;
}

.basis-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: #7a9490;
  white-space: pre-line;
}

/* ─── Footer Nav ─── */
.page-footer-nav {
  margin: 20px 18px 0;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  position: sticky;
  bottom: 14px;
  z-index: 9;
  border: 1px solid rgba(255, 255, 255, 0.82);
  background: #ffffff62;
  box-shadow: 0 14px 34px rgba(53, 93, 83, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(16px);
  border-radius: 20px;
}

.footer-hint {
  font-size: 14px;
  font-weight: 600;
  color: #3f5f59;
  line-height: 1.5;
  margin-left: auto;
  text-align: right;
}

.footer-prev-btn {
  color: #4a6a65;
  border-color: #c8d8d5;
  font-weight: 600;
}

.top-modes-dialog {
  :deep(.el-dialog) {
    border-radius: 22px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.82);
    background: linear-gradient(160deg, rgba(255, 255, 255, 0.96), rgba(239, 248, 255, 0.9));
    box-shadow: 0 20px 52px rgba(53, 93, 83, 0.2);
  }

  :deep(.el-dialog__header) {
    margin: 0;
    padding: 18px 20px 12px;
    border-bottom: 1px solid rgba(193, 214, 210, 0.5);
  }

  :deep(.el-dialog__body) {
    padding: 16px;
  }
}

.modes-dialog-header {
  h3 {
    margin: 0;
    font-size: 24px;
    color: #214a43;
  }

  p {
    margin: 6px 0 0;
    font-size: 14px;
    color: #5e7a75;
  }
}

.modes-dialog-body {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 14px;
  min-height: 62vh;
}

.modes-dialog-list {
  border: 1px solid rgba(194, 216, 212, 0.6);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  padding: 8px;
  overflow: auto;
}

.mode-list-item {
  width: 100%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  color: #2b4e47;
  font-size: 15px;
  font-weight: 600;

  &:hover {
    background: rgba(76, 175, 80, 0.1);
  }

  &.active {
    background: rgba(76, 175, 80, 0.14);
    color: #1f6e46;
  }
}

.mode-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.modes-dialog-detail {
  border: 1px solid rgba(194, 216, 212, 0.6);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.84);
  padding: 14px 16px;
  overflow: auto;
}

.detail-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}

.detail-mode-name {
  font-size: 24px;
  font-weight: 700;
  color: #1f4f49;
}

.detail-mode-chip {
  border: 1px solid;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 700;
}

.detail-section {
  margin-top: 12px;

  h4 {
    margin: 0 0 8px;
    font-size: 16px;
    color: #2a5a52;
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.7;
    color: #3f625d;
  }
}

.flowchart-box {
  border-radius: 12px;
  border: 1px dashed rgba(168, 200, 192, 0.8);
  background: #fff;
  padding: 10px;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
}

.steps-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.step-tag {
  font-size: 13px;
  font-weight: 700;
  color: #2d655d;
  border: 1px solid rgba(102, 169, 155, 0.4);
  border-radius: 999px;
  padding: 4px 10px;
  background: rgba(213, 244, 236, 0.65);
}

.notices-text {
  white-space: pre-line;
}

.footer-next-btn {
  background: linear-gradient(135deg, rgb(78, 76, 99), rgb(34, 13, 109));
  border: none;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 15px;

  &:hover {
    background: linear-gradient(135deg, rgb(98, 95, 122), rgb(54, 33, 129));
  }
}

@media (max-width: 768px) {
  .company-match-page {
    padding: 18px 12px 88px;
    min-height: auto;

    &::before {
      height: min(850px, 150vh);
      background: url('../assets/Bg_mobile.png') center top / 100% auto no-repeat;
      mask-image: linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.35) 16% #000 60%);
      -webkit-mask-image: linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.35) 16%, #000 20%);
    }
  }

  .header-title {
    text-align: center;
  }

  .analysis-banner {
    padding: 14px 12px;
  }

  .banner-summary {
    border-left: none;
    border-right: none;
    border-top: 1px solid #e4ecea;
    border-bottom: 1px solid #e4ecea;
    margin-top: 8px;
    padding: 12px 0;

    .summary-title {
      font-size: 15px;
      margin-bottom: 10px;
    }

    .summary-list {
      gap: 10px;
    }

    .summary-row {
      padding: 10px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.78);
      border: 1px solid rgba(217, 231, 227, 0.9);

      .summary-item-grid {
        grid-template-columns: 22px minmax(0, 1fr) auto;
        gap: 8px;
      }

      .summary-main {
        gap: 4px;
      }

      .summary-icon {
        width: 22px;
        height: 22px;
        font-size: 12px;
      }

      .summary-label {
        font-size: 13px;
      }

      .summary-value {
        font-size: 14px;
        line-height: 1.35;
      }

      .summary-impact-tag {
        grid-column: auto;
        justify-self: end;
        align-self: center;
        margin-left: 4px;
        margin-top: 0;
        font-size: 11px;
        padding: 3px 9px;
      }
    }
  }

  .section-header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .section-title-group {
    display: flex;
    align-items: flex-start;
    gap: 6px;

    .section-title,
    .section-desc {
      white-space: nowrap;
    }
  }

  .modes-link {
    align-self: flex-start;
    padding-left: 0;
  }

  .path-col {
    margin-bottom: 12px;
  }

  .page-footer-nav {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .footer-hint {
    font-size: 13px;
    margin-left: 0;
    text-align: left;
  }

  .footer-prev-btn {
    width: 100%;
  }

  .modes-dialog-body {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .modes-dialog-list {
    max-height: 220px;
  }

  .detail-title-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-mode-name {
    font-size: 20px;
  }
}
</style>