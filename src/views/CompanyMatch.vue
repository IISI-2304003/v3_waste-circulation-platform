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
            <h1 class="hero-title">產業廢棄物循環利用<br><span style="color: #4CAF50;">路徑決策</span><span style="color: #06B6D4;">系統</span></h1>
            <p>循環路徑推薦</p>
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
                  </el-icon></div>
                <div>
                  <h2>媒合分析結果</h2>
                  <p>根據您設定的條件，系統已完成循環利用可行性分析，並推薦最適合的循環路徑。</p>
                </div>
              </div>

            </div>
          </el-col>
          <el-col :xs="24" :md="12">

            <div class="banner-summary">
              <div class="summary-title">您本次條件分析</div>
              <div class="summary-list">
                <div class="summary-row" v-for="item in conditionSummary" :key="item.id">
                  <el-row :gutter="24">
                    <el-col xs="24" :md="2">
                      <div class="summary-icon" :style="{ color: item.color }">
                        <el-icon>
                          <component :is="item.icon" />
                        </el-icon>
                      </div>
                    </el-col>
                    <el-col xs="24" :md="7">
                      <div class="summary-label">{{ item.label }}</div>
                    </el-col>
                    <el-col xs="24" :md="12">
                      <div class="summary-value">{{ item.value }}</div>
                    </el-col>
                    <el-col xs="24" :md="3">
                      <div class="summary-impact-tag" :style="{ backgroundColor: item.color + '20', borderColor: item.color }">
                        <span class="impact-dot" :style="{ backgroundColor: item.color }"></span>
                        <span class="impact-label">{{ item.levelLabel }}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :md="7">
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
        <el-button text type="primary" class="modes-link">查看十大循環模式說明</el-button>
      </div>

      <!-- 路徑卡片 - 三格一排 -->
      <div class="path-list">
        <el-row :gutter="16">
          <el-col v-for="path in recommendedPaths" :key="path.id" :xs="24" :md="8">
            <div class="path-card">
              <!-- 頂部色塊區 -->
              <div class="path-header" :style="{ background: path.gradient }">
                <div class="path-rank-badge">推薦路徑</div>
                <div class="path-rank-number">{{ path.rank }}</div>

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
                  <el-button text type="primary" class="detail-link" @click="goNext(path)">
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

      <!-- 媒合分析依據 -->
      <!-- <div class="analysis-basis">
        <div class="basis-header">
          <div class="section-bar"></div>
          <span class="section-title">媒合分析依據</span>
          <span class="section-desc">系統依據您設定的條件進行綜合評估</span>
        </div>
        <div class="basis-grid">
          <div v-for="item in analysisItems" :key="item.label" class="basis-card">
            <div class="basis-icon-row">
              <el-icon :style="{ color: item.color }">
                <component :is="item.icon" />
              </el-icon>
              <span class="basis-label" :style="{ color: item.color }">{{ item.label }}</span>
            </div>
            <div class="basis-score" :style="{ color: item.score === '－' ? '#b0bec5' : '#1a2e2b' }">{{ item.score }}</div>
            <p class="basis-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div> -->
    </div>

    <!-- 底部導航 -->
    <div class="page-footer-nav">
      <el-button @click="goPrevious" class="footer-prev-btn">
        <el-icon class="el-icon--left">
          <ArrowLeft />
        </el-icon>
        上一步：條件設定
      </el-button>
      <!-- <el-button type="primary" @click="goNext">
        下一步：技術媒合推薦
        <el-icon class="el-icon--right">
          <ArrowRight />
        </el-icon>
      </el-button> -->
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
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
// import { b } from 'vue-router/dist/index-CzEDAlw7.js'

const router = useRouter()
const store = useConditionSetupStore()

const industryLabelMap = {
  semiconductor: '電子與半導體',
  steel: '鋼鐵冶金',
  chemical: '化工製程',
  food: '食品加工'
}

const yesNoText = (value) => {
  if (value === true) return '有'
  if (value === false) return '無'
  return '未設定'
}

const IMPACT_LEVEL_SCORE_MAP = {
  high: 100,
  medium: 65,
  low: 30
}

// 計算條件的影響度級別
const getImpactLevel = (condition) => {
  // 根據條件的設定情況評估影響度
  // 高(high): 完整設定，100-75 分
  // 中(medium): 部分設定，74-50 分
  // 低(low): 未設定或最少設定，49-0 分
  const score = condition.score || 0
  if (score >= 75) return { level: 'high', color: '#22c55e', levelLabel: '高' }
  if (score >= 50) return { level: 'medium', color: '#eab308', levelLabel: '中' }
  return { level: 'low', color: '#ef4444', levelLabel: '低' }
}

const toRadarScore = (level) => IMPACT_LEVEL_SCORE_MAP[level] || 0

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
      value: store.businessConditions.clearanceFrequency ? `${store.businessConditions.clearanceFrequency}` : '未設定',
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

const radarSeriesValues = computed(() => conditionSummary.value.map((item) => toRadarScore(item.level)))

// ★ 新增：ECharts 雷達圖 option（替換原本的 radarPoints computed）
const radarOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: () => {
      return conditionSummary.value
        .map((item) => {
          const dot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${item.color};margin-right:6px;"></span>`
          return `${dot}<span style="color:#2d554a;font-weight:600">${item.label}</span>：<span style="color:${item.color};font-weight:700">${item.levelLabel}影響</span>`
        })
        .join('<br/>')
    },
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#e4ecea',
    borderWidth: 1,
    textStyle: {
      fontSize: 12,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Microsoft JhengHei', sans-serif"
    },
    padding: [10, 14]
  },
  radar: {
    indicator: conditionSummary.value.map(item => ({
      name: item.label,
      max: 100
    })),
    center: ['50%', '50%'],
    radius: '68%',
    axisName: {
      color: '#5d7772',
      fontSize: 11,
      fontWeight: 600,
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
      const value = conditionSummary.value.map((_, i) => i === index ? toRadarScore(item.level) : null)
      const size = item.level === 'high' ? 10 : item.level === 'medium' ? 7 : 5
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
  accentColor: '#de7a10',
  score: 94,
  steps: [
    { label: '原料購入', icon: Goods },
    { label: '廠內前處理', icon: Files },
    { label: '純化(再製)', icon: Operation },
    { label: '返回原製程', icon: Promotion }
  ]
}

const withRank = (paths) => paths.map((path, index) => ({ ...path, id: `r${index + 1}`, rank: index + 1 }))

const recommendedPaths = computed(() => {
  const hasReuseSpace = store.siteConditions.hasReuseSpace === true
  if (hasReuseSpace) {
    return withRank([baseInternalPath, ...baseExternalPaths.slice(0, 2)])
  }
  return withRank(baseExternalPaths)
})

const goPrevious = () => router.push('/standard-input')
const goBackHome = () => {
  store.resetAll()
  router.push('/')
}
const goNext = (path) => {
  store.setSelectedRecommendedPath(path)
  router.push('/technology-match')
}
</script>

<style scoped lang="scss">
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
    text-align: center;
    margin-top: 50px;

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
  color: #5d7772;
  font-size: 14px;
}

/* ─── Analysis Banner ─── */
.analysis-banner {
  // max-width: 1360px;
  // margin: 24px 18px;
  padding: 28px 32px;
  background: #ffffff80;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 14px 34px rgba(53, 93, 83, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(16px);
  // display: grid;
  // grid-template-columns: 300px 1fr 220px;
  gap: 24px;
  align-items: start;
}

.banner-title-row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 18px;
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

.banner-row {
  display: flex;
  align-items: flex-start;

  .banner-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    h2 {
      margin: 0 0 5px;
      font-size: 21px;
      font-weight: 700;
      color: #2d554a;
    }

    p {
      margin: 0;
      font-size: 15px;
      line-height: 1.6;
      color: #7a9490;
    }
  }
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
      font-size: clamp(14px, 0.898rem + 0.49vw, 16px);
      color: #1a2e2b;
      font-weight: 700;
    }

    .summary-value {
      font-size: clamp(12px, 0.898rem + 0.49vw, 14px);
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

  .radar-chart {
    width: 100%;
    height: 280px;
    max-width: 320px;
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
  font-size: 13px;
  font-weight: 600;
}

.path-list {
  width: 100%;
}

.path-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 頂部漸層色塊 */
.path-header {
  padding: 10px 20px 5px;
  color: #fff;
  position: relative;

  .path-rank-badge {
    font-size: 15px;
    opacity: 1;
    margin-bottom: 2px;
  }

  .path-rank-number {
    font-size: 42px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 10px;

  }


}


/* 卡片主體 */
.path-body {
  padding: 16px 20px 12px;
  background: #fff;
  display: flex;
  flex-direction: column;

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

.detail-link {
  align-self: flex-end;
  margin-top: auto;
  font-size: 15px;
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
  justify-content: flex-start;
  align-items: center;
  position: sticky;
  bottom: 14px;
  z-index: 9;
  border: 1px solid rgba(255, 255, 255, 0.82);
  background: #ffffff62;
  box-shadow: 0 14px 34px rgba(53, 93, 83, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(16px);
  border-radius: 20px;
}

.footer-prev-btn {
  color: #4a6a65;
  border-color: #c8d8d5;
  font-weight: 600;
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
    padding: 24px 20px 80px 20px;
    min-height: auto;

    &::before {
      height: min(850px, 150vh);
      background: url('../assets/Bg_mobile.png') center top / 100% auto no-repeat;
      mask-image: linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.35) 16% #000 60%);
      -webkit-mask-image: linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.35) 16%, #000 20%);
    }
  }
}
</style>