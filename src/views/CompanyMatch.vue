<template>
  <div class="company-match-page">
    <!-- 頂部頁頭 -->
    <div class="page-header">
      <el-button text @click="goBackHome" class="back-btn">
        <el-icon>
          <ArrowLeft />
        </el-icon> 返回首頁
      </el-button>
      <div class="header-title">
        <h1>產業廢棄物循環利用智慧媒合平台</h1>
        <p>循環路徑推薦</p>
      </div>
    </div>
    <div style="padding: 24px">
      <!-- Step Progress (與條件設定頁共用元件) -->
      <FlowStepProgress :active-step="2" class="progress-top" />
      <!-- AI 分析結果橫幅 -->
      <div class="analysis-banner">
        <div class="banner-left">
          <div class="banner-title-row">
            <div class="ai-icon"><el-icon>
                <Monitor />
              </el-icon></div>
            <div>
              <h2>AI 媒合分析結果</h2>
              <p>根據您設定的條件，系統已完成循環利用可行性分析，並推薦最適合的循環路徑。</p>
            </div>
          </div>

        </div>

        <div class="banner-summary">
          <div class="summary-title">您本次的條件摘要</div>
          <div class="summary-list">
            <div class="summary-row" v-for="item in visibleConditionSummary" :key="item.label">
              <div class="summary-icon" :style="{ color: item.color }">
                <el-icon>
                  <component :is="item.icon" />
                </el-icon>
              </div>
              <div class="summary-label">{{ item.label }}</div>
              <div class="summary-value">{{ item.value }}</div>
            </div>
          </div>
        </div>

        <div class="banner-illustration">
          <div class="illustration-circle outer"></div>
          <div class="illustration-circle inner"></div>
          <div class="illustration-recycle">♻</div>
          <div class="illustration-dot" v-for="i in 6" :key="i" :style="dotStyle(i)"></div>
        </div>
      </div>

      <!-- 推薦循環路徑標頭 -->
      <div class="section-header-row">
        <div class="section-title-group">
          <div class="section-bar"></div>
          <div>
            <span class="section-title">推薦循環路徑</span>
            <span class="section-desc">依據您的條件，AI 為您推薦最適合的三種循環路徑</span>
          </div>
        </div>
        <el-button text type="primary" class="modes-link">查看十大循環模式說明</el-button>
      </div>

      <!-- 路徑卡片 -->
      <div class="path-list">
        <div v-for="path in recommendedPaths" :key="path.id" class="path-card">
          <div class="path-rank-col" :style="{ background: path.gradient }">
            <div class="rank-label">推薦路徑</div>
            <div class="rank-number">{{ path.rank }}</div>
          </div>
          <div class="path-main">
            <div class="path-top-row">
              <div class="path-mode-badge" :style="{ borderColor: path.accentColor, color: path.accentColor }">{{ path.modeName }}</div>
              <span class="path-title">{{ path.title }}</span>
              <span v-if="path.rank === 1" class="best-tag">最佳方案</span>
            </div>
            <p class="path-summary">{{ path.summary }}</p>
            <div class="flow-diagram">
              <template v-for="(step, index) in path.steps" :key="`${path.id}-s${index}`">
                <div class="flow-step">
                  <div class="flow-icon" :style="{ borderColor: path.accentColor + '60', color: path.accentColor }">
                    <el-icon :size="26">
                      <component :is="step.icon" />
                    </el-icon>
                  </div>
                  <span class="flow-label">{{ step.label }}</span>
                </div>
                <div v-if="index < path.steps.length - 1" class="flow-arrow" :style="{ color: path.accentColor }">→</div>
              </template>
            </div>
          </div>
          <div class="path-score-col">
            <el-button text type="primary" class="detail-link" @click="goNext(path)">技術媒合推薦<el-icon class="el-icon--right">
                <ArrowRight />
              </el-icon></el-button>
          </div>
        </div>
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
import {
  ArrowLeft, ArrowRight, Monitor,
  Connection, DataAnalysis, Files, Finished,
  Goods, Location, Money, Operation, Promotion, SetUp
} from '@element-plus/icons-vue'
import FlowStepProgress from '@/components/condition-setup/FlowStepProgress.vue'
import { useConditionSetupStore } from '@/stores/conditionSetup'

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

const dotStyle = (i) => {
  const angle = (i - 1) * 60
  const rad = (angle - 90) * Math.PI / 180
  const r = 100
  return { left: `calc(50% + ${Math.cos(rad) * r}px)`, top: `calc(50% + ${Math.sin(rad) * r}px)` }
}

const conditionSummary = computed(() => {
  const acceptanceCount = Array.isArray(store.acceptanceConditions) ? store.acceptanceConditions.length : 0
  const industry = industryLabelMap[store.sourceConditions.industry] || '未設定'
  const process = store.sourceConditions.process || '未設定'
  const outputAmount = store.sourceConditions.outputAmount ?? '未設定'

  return [
    {
      label: '物化特性條件',
      value: acceptanceCount > 0 ? `已設定 ${acceptanceCount} 項條件` : '未設定',
      color: '#4caf50',
      icon: DataAnalysis
    },
    {
      label: '來源條件',
      value: `來源產業：${industry} / 來源製程：${process} / 產出量：${outputAmount}`,
      color: '#26a69a',
      icon: Connection
    },
    {
      label: '場域條件',
      value: `再利用空間：${yesNoText(store.siteConditions.hasReuseSpace)} / 衍生廢棄物：${yesNoText(store.siteConditions.hasSecondaryWaste)}`,
      color: '#9b6dff',
      icon: Location
    },
    {
      label: '商業條件',
      value: store.businessConditions.businessName || '未設定',
      color: '#ffb84d',
      icon: Money
    }
  ]
})

const visibleConditionSummary = computed(() => conditionSummary.value.filter((item) => item.value && item.value !== '未設定'))

const baseExternalPaths = [
  {
    modeName: '廠外模式 4',
    title: '純化再製後返回原製程',
    summary: '將廢棄物純化(再製)與成分調整後，重新投入原製程使用，可最大化材料價值並降低原料採購需求。',
    gradient: 'linear-gradient(160deg,#3dc35a,#1e8c3e)',
    accentColor: '#2da84a',
    score: 96,
    steps: [
      { label: '原料購入', icon: Goods },
      { label: '純化(再製)', icon: Operation },
      { label: '調整成分', icon: SetUp },
      { label: '返回原製程', icon: Promotion }
    ]
  },
  {
    modeName: '廠外模式 6',
    title: '前處理後再製回原製程',
    summary: '先進行前處理去除雜質，再經純化與成分調整後返回原廠製程使用，提升材料穩定性與純度。',
    gradient: 'linear-gradient(160deg,#22b9ae,#0d7a73)',
    accentColor: '#18a89f',
    score: 89,
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
    summary: '送至不同廠業處理後，應用於其他產業或成品，創造新的價值與市場機會。',
    gradient: 'linear-gradient(160deg,#a67fff,#6d3fd6)',
    accentColor: '#8b55f5',
    score: 83,
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
  min-height: 100vh;
  background:
    radial-gradient(circle at 14% 22%, rgba(87, 166, 255, 0.36), transparent 24%),
    radial-gradient(circle at 82% 14%, rgba(117, 135, 255, 0.26), transparent 12%),
    radial-gradient(circle at 70% 78%, rgba(104, 218, 255, 0.2), transparent 16%),
    linear-gradient(180deg, #e8f4ff 0%, #dceeff 46%, #f4f9ff 100%);
  padding: 20px 20px 96px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft JhengHei', sans-serif;
}

.progress-top {
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

/* ─── 頁頭 ─── */
.page-header {
  backdrop-filter: blur(16px);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.back-btn {
  color: #5d7772;
  font-size: 14px;
}

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
  display: grid;
  grid-template-columns: 300px 1fr 220px;
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

.banner-left {
  h2 {
    margin: 0 0 5px;
    font-size: 21px;
    font-weight: 700;
    color: #2d554a;
  }

  p {
    margin: 0;
    font-size: 12px;
    line-height: 1.6;
    color: #7a9490;
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
}

.summary-title {
  font-size: 14px;
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
  display: grid;
  grid-template-columns: 26px 1fr auto;
  align-items: center;
  gap: 10px;
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
  font-size: 13px;
  color: #4a6a65;
  font-weight: 600;
}

.summary-value {
  font-size: 12px;
  color: #4caf50;
  font-weight: 600;
  text-align: right;

  &.muted {
    color: #b0bec5;
  }
}

.banner-illustration {
  position: relative;
  height: 190px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.illustration-circle {
  position: absolute;
  border-radius: 50%;

  &.outer {
    width: 170px;
    height: 170px;
    border: 1px dashed rgba(76, 175, 80, .28);
    animation: spin-slow 24s linear infinite;
  }

  &.inner {
    width: 110px;
    height: 110px;
    background: radial-gradient(circle, rgba(76, 175, 80, .1), rgba(38, 166, 154, .04));
    border: 1px solid rgba(76, 175, 80, .12);
  }
}

.illustration-recycle {
  position: absolute;
  font-size: 48px;
  filter: drop-shadow(0 4px 10px rgba(76, 175, 80, .28));
  animation: float 4s ease-in-out infinite;
}

.illustration-dot {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(76, 175, 80, .45);
  transform: translate(-50%, -50%);
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

/* ─── Path Cards ─── */
.path-list {
  margin: 0 auto 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.path-card {
  display: grid;
  grid-template-columns: 92px 1fr 170px;
  background: #ffffffa6;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 10px 24px rgba(53, 93, 83, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: transform .2s, box-shadow .2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 26px rgba(0, 60, 40, .09);
  }
}

.path-rank-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 10px;
  gap: 4px;
  color: #fff;
}

.rank-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  opacity: .88;
}

.rank-number {
  font-size: 48px;
  font-weight: 900;
  line-height: 1;
}

.path-main {
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.path-top-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.path-mode-badge {
  display: inline-flex;
  padding: 3px 12px;
  border-radius: 999px;
  border: 1.5px solid currentColor;
  font-size: 12px;
  font-weight: 700;
}

.path-title {
  font-size: 18px;
  font-weight: 700;
  color: #2d554a;
}

.best-tag {
  display: inline-flex;
  padding: 2px 10px;
  border-radius: 999px;
  background: #fff3cd;
  color: #b5771a;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #ffd97a;
}

.path-summary {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: #6a8682;
}

/* 流程圖 */
.flow-diagram {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  padding: 4px 0 2px;
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  min-width: 72px;
}

.flow-icon {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 2px solid currentColor;
  background: #f8fcfa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flow-label {
  font-size: 11px;
  font-weight: 600;
  color: #3a5a55;
  text-align: center;
  line-height: 1.35;
}

.flow-arrow {
  font-size: 22px;
  flex-shrink: 0;
  margin-bottom: 20px;
  line-height: 1;
}

/* 右側分數欄 */
.path-score-col {
  border-left: 1px solid #f0f5f3;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  padding: 20px 16px;
  gap: 10px;
}

.donut-wrap {
  position: relative;
  width: 96px;
  height: 96px;
}

.donut-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.donut-label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
}

.donut-score {
  font-size: 20px;
  font-weight: 900;
  line-height: 1;
}

.donut-text {
  font-size: 9px;
  color: #7a9490;
  font-weight: 600;
}

.detail-link {
  font-size: 12px;
  font-weight: 700;
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
  // max-width: 1360px;
  margin: 20px 18px 0;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
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

/* ─── RWD ─── */
@media (max-width: 1100px) {
  .analysis-banner {
    grid-template-columns: 1fr 1fr;
  }

  .banner-illustration {
    display: none;
  }

  .banner-summary {
    border-right: none;
  }

  .basis-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .company-match-page {
    padding: 14px 12px 110px;
  }

  .page-header {
    padding: 12px 14px;
  }

  .analysis-banner {
    grid-template-columns: 1fr;
    padding: 18px;
    margin: 16px;
    gap: 16px;
  }

  .banner-summary {
    border: none;
    padding: 0;
  }

  .section-header-row,
  .path-list,
  .analysis-basis,
  .page-footer-nav {
    padding: 0 14px;
  }

  .path-card {
    grid-template-columns: 76px 1fr;
  }

  .path-score-col {
    display: none;
  }

  .basis-grid {
    grid-template-columns: 1fr 1fr;
  }

  .page-footer-nav {
    flex-direction: column;
    gap: 10px;
    padding: 10px;

    button {
      width: 100%;
      justify-content: center;
    }
  }
}

@media (max-width: 480px) {
  .basis-grid {
    grid-template-columns: 1fr;
  }
}
</style>