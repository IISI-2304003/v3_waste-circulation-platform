<template>
  <div class="home-page ">
    <section class="hero-section">
      <ParticleBackground />
      <div class="container hero-content">
        <div class="hero-left">
          <div class="logo-section">
            <img src="../assets/logo.png" alt="環境部資源循環署" class="hero-logo" />
          </div>

          <h1 class="hero-title">產業資源循環利用<br><span class="hero-title-accent">路徑決策</span><span class="hero-title-accent-secondary">系統</span></h1>
          <p class="hero-description">連結資源循環供需，推動產業共生，實現永續循環經濟</p>

          <div class="hero-actions">
            <el-button type="primary" size="large" round @click="scrollToSearch">
              開始探索媒合
              <el-icon class="el-icon--right">
                <Search />
              </el-icon>
            </el-button>
          </div>

          <div class="hero-bottom-left">
            <div class="insight-process-board" aria-label="循環媒合流程" :style="{ '--process-active-index': activeProcessStep }">
              <button class="process-nav process-nav--prev" type="button" aria-label="上一個流程步驟" :disabled="activeProcessStep === 0" @click="prevProcessStep">‹</button>
              <div class="process-carousel-viewport">
                <div class="process-carousel-track">
                  <div v-for="(step, index) in footerProcessSteps" :key="step.title" class="process-step-item">
                    <article class="process-step-card">
                      <span class="process-step-index">STEP {{ index + 1 }}</span>
                      <div class="process-step-icon" :style="{ color: step.color, background: `${step.color}14` }">
                        <span v-html="step.icon"></span>
                      </div>
                      <div class="process-step-copy">
                        <h4 class="process-step-title" :style="{ color: step.color }">{{ step.title }}</h4>
                        <p class="process-step-subtitle">{{ step.subtitle }}</p>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
              <button class="process-nav process-nav--next" type="button" aria-label="下一個流程步驟" :disabled="activeProcessStep === footerProcessSteps.length - 1" @click="nextProcessStep">›</button>
              <div class="process-carousel-dots" role="tablist" aria-label="流程步驟選擇">
                <button v-for="(step, index) in footerProcessSteps" :key="`dot-${step.title}`" type="button" class="process-dot" :class="{ 'is-active': activeProcessStep === index }" :aria-label="`切換到${step.title}`" @click="goProcessStep(index)"></button>
              </div>
            </div>
          </div>
        </div>

        <div class="hero-right">
          <CirculationModesGrid :modes="modes" @mode-click="showModeDetail" />
        </div>
      </div>
    </section>

    <section ref="footerInsightsRef" class="home-footer-insights" aria-label="平台效益摘要">
      <div class="container">
        <div class="insight-card-board" :style="{ '--insight-active-index': activeInsightCard }">
          <button class="insight-nav insight-nav--prev" type="button" aria-label="上一張平台效益卡" :disabled="activeInsightCard === 0" @click="prevInsightCard">‹</button>
          <div class="insight-carousel-viewport">
            <div class="insight-carousel-track">
              <article v-for="item in footerStatsForInsightCards" :key="item.title" class="insight-card insight-card--metric">
                <div class="insight-icon" :style="{ color: item.color, background: `${item.color}15` }">
                  <span v-html="item.icon"></span>
                </div>
                <div class="insight-metric-copy">
                  <p class="insight-metric-label">{{ item.title }}</p>
                  <p class="insight-metric-value" :style="{ color: item.color }">
                    <span>{{ item.value }}</span>
                    <small>{{ item.unit }}</small>
                  </p>
                </div>
              </article>
            </div>
          </div>
          <button class="insight-nav insight-nav--next" type="button" aria-label="下一張平台效益卡" :disabled="activeInsightCard === footerStatsForInsightCards.length - 1" @click="nextInsightCard">›</button>
          <div class="insight-carousel-dots" role="tablist" aria-label="平台效益卡選擇">
            <button v-for="(item, index) in footerStatsForInsightCards" :key="`insight-dot-${item.title}`" type="button" class="insight-dot" :class="{ 'is-active': activeInsightCard === index }" :aria-label="`切換到${item.title}`" @click="goInsightCard(index)"></button>
          </div>
        </div>



      </div>
    </section>

    <section id="search-section" class="search-section">
      <div class="container">
        <div class="search-header">
          <h2 class="section-title">廢棄物類別搜尋</h2>
          <p class="section-description">
            點選六大廢棄物類別快速瀏覽，或輸入關鍵字精準查詢各項廢棄物資訊。
          </p>
        </div>

        <!-- 搜尋卡片 -->
        <div class="search-card">
          <div class="search-card-input-group">
            <div class="search-card-label">
              <el-icon>
                <Search />
              </el-icon>
              <span>關鍵字搜尋</span>
            </div>
            <el-input v-model="searchKeyword" clearable placeholder="請輸入關鍵字（例如：pH值、含水率、廢酸、重金屬）" class="search-input-field" @input="currentPage = 1" @keyup.enter="currentPage = 1">
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="currentPage = 1" class="search-btn">
              搜尋
            </el-button>
            <el-button @click="searchKeyword = ''; currentPage = 1" class="clear-btn">
              清除
            </el-button>
          </div>
          <!-- 熱門關鍵字 -->
          <div class="hot-tags-section">
            <span class="hot-tags-label">熱門關鍵字：</span>
            <div class="hot-tags-list">
              <button v-for="tag in hotTags" :key="tag" class="hot-tag-item" @click="applyTag(tag)">
                {{ tag }}
              </button>
            </div>
          </div>
        </div>

        <el-divider style="margin: 24px 0" />
        <!-- 六大類分類卡片 -->
        <div class="category-card-grid">
          <button v-for="cat in categoryCards" :key="cat.id" :class="['category-card', { 'category-card--active': isActiveCategory(cat.id) }]" :style="isActiveCategory(cat.id) ? activeCardStyle(cat.color) : {}" @click="selectCategory(cat.id)">
            <span v-if="isActiveCategory(cat.id)" class="category-card-check" :style="{ backgroundColor: cat.color }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <div class="category-card-icon-wrap" :style="iconWrapStyle(cat.color)">
              <span v-html="cat.icon" class="category-svg-icon"></span>
            </div>
            <div class="category-card-label" :style="{ color: cat.color }">{{ cat.id }}類</div>
            <div class="category-card-name">{{ cat.name }}</div>
            <div class="category-card-count" :style="countStyle(cat.id, cat.color)">{{ cat.count }} 項</div>
          </button>
        </div>





        <div class="codes-area">
          <div v-if="displayCodes.length > 0" class="codes-panel">
            <div class="codes-panel-header">
              <h3 class="list-title">
                <span class="list-title-badge" :style="{ background: getCategoryColor(currentCategory) }">{{ currentCategory?.id }}類</span>
                {{ getCategoryShortName(currentCategory) }}
              </h3>
              <span class="list-count" :style="{ background: getCategoryColor(currentCategory) + '18', color: getCategoryColor(currentCategory) }">共 {{ displayCodes.length }} 項</span>
            </div>

            <transition-group v-if="currentPageCodes.length > 0" name="card-list" tag="div" class="codes-grid">
              <button v-for="(code, pageIndex) in currentPageCodes" :key="`${code.code}-${currentPage}`" type="button" class="code-card" :style="{ '--card-color': getCategoryColor(currentCategory), borderLeftColor: getCategoryColor(currentCategory) }" @click="handleCardClick(code.code)">
                <div class="code-card-top">
                  <span class="code-chip" :style="{ background: getCategoryColor(currentCategory) + '15', color: getCategoryColor(currentCategory), border: `1px solid ${getCategoryColor(currentCategory)}30` }">{{ code.code }}</span>
                  <span class="code-card-top-icon" aria-hidden="true" :style="{ color: getCategoryColor(currentCategory) }">
                    <span v-html="getCodeCardTopIcon(currentCategory?.id, (currentPage - 1) * pageSize + pageIndex)"></span>
                  </span>
                </div>
                <h4 class="code-card-title">{{ code.name }}</h4>
                <p class="code-card-description">{{ code.description }}</p>
                <span class="code-card-arrow" :style="{ color: getCategoryColor(currentCategory) }">
                  <el-icon>
                    <DArrowRight />
                  </el-icon>
                </span>
              </button>
            </transition-group>

            <div v-else class="empty-state">
              <el-empty description="目前此類別暫無資料" />
            </div>

            <div v-if="displayCodes.length > pageSize" class="pagination-wrapper">
              <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="displayCodes.length" layout="prev, pager, next" background />
            </div>
          </div>
          <div v-else class="empty-state-main">
            <el-empty description="查無符合條件的廢棄物代碼" />
          </div>
        </div>

      </div>
    </section>

    <section class="home-footer-stats" aria-label="平台標語">
      <div class="insight-stats-bar">
        <div class="container insight-stats-grid">
          <article v-for="stat in footerHighlightsForStatsBar" :key="stat.label" class="insight-stat-item">
            <div class="insight-stat-icon">
              <span v-html="stat.icon"></span>
            </div>
            <div class="insight-stat-copy">
              <p class="insight-stat-label">{{ stat.label }}</p>
              <p class="insight-stat-value">
                <span>{{ stat.value }}</span>
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <CirculationModal v-model="dialogVisible" :mode="selectedMode" @search="handleModeSearch" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCirculationModes } from '../composables/useCirculationModes'
import ParticleBackground from '../components/ParticleBackground.vue'
import CirculationModesGrid from '../components/CirculationModesGrid.vue'
import CirculationModal from '../components/CirculationModal.vue'
import { getCategories, getWasteCodesByCategory } from '@/api/wasteCode'
import { categoryVisuals, fallbackVisual } from '@/data/categoryVisuals'
import { getAllWasteCodes } from '@/data/wasteCategories'

const router = useRouter()
const route = useRoute()
const { modes } = useCirculationModes()

const defaultCodeMap = {
  A: 'A-0101',
  B: 'B-0101',
  C: 'C-0202',
  D: 'D-0101',
  E: 'E-0101',
  R: 'R-0101'
}

const selectedCategory = ref('C')
const selectedCode = ref('C-0202')
const searchKeyword = ref('')
const dialogVisible = ref(false)
const selectedMode = ref(null)
const currentPage = ref(1)
const pageSize = ref(9)
const footerInsightsRef = ref(null)
const hasFooterStatsAnimated = ref(false)
const animatedFooterStatValues = ref([])
const activeProcessStep = ref(0)
const activeInsightCard = ref(0)
let footerStatsObserver = null
let footerStatsAnimationFrame = null

// 六大類分類顯示信息
// 分類資料改用 getCategories() 取得（目前是模擬 API，未來換成真實 API 呼叫，這裡完全不用改）
const categories = ref([])
const categoriesLoading = ref(false)

const loadCategories = async () => {
  categoriesLoading.value = true
  try {
    const result = await getCategories()
    categories.value = Array.isArray(result)
      ? result.filter((cat) => cat.id !== 'ALL').map((cat) => ({ ...cat, codes: Array.isArray(cat.codes) ? cat.codes : [], codesLoaded: false }))
      : []

    await Promise.all(categories.value.map((cat) => loadCategoryCodes(cat.id)))
  } catch (error) {
    console.error('載入分類失敗：', error)
    categories.value = []
  } finally {
    categoriesLoading.value = false
  }
}

// 依 id 尋找分類完整資料（含 codes），取代原本從靜態資料匯入的 getCategoryById
const findCategoryById = (categoryId) => categories.value.find((cat) => cat.id === categoryId)

const loadCategoryCodes = async (categoryId) => {
  const category = findCategoryById(categoryId)
  if (!category || category.codesLoaded) return

  try {
    const codes = await getWasteCodesByCategory(categoryId)
    category.codes = Array.isArray(codes) ? codes : []
    category.codesLoaded = true
  } catch (error) {
    console.error(`載入 ${categoryId} 類別細項失敗：`, error)
    category.codes = []
    category.codesLoaded = true
  }
}

// 把 API 資料（id / name / codes）跟前端視覺設定（顏色 / icon）合併，組成卡片要用的完整資料
const categoryCards = computed(() => {
  console.log('getCategories result:', categories.value)
  return categories.value.map((cat) => {
    const visual = categoryVisuals[cat.id] || fallbackVisual
    return {
      id: cat.id,
      name: getCategoryShortName(cat),
      color: visual.color,
      icon: visual.icon,
      count: Array.isArray(cat.codes) ? cat.codes.length : 0
    }
  })
})


// 卡片是否為目前選中狀態
const isActiveCategory = (id) => selectedCategory.value === id

// 選中卡片的外框/底色樣式
const activeCardStyle = (color) => ({
  background: `linear-gradient(180deg, #ffffff 0%, ${color}10 100%)`,
  borderColor: color,
  boxShadow: `0 10px 24px ${color}2e, 0 0 0 1px ${color}30`
})

// icon 圓底樣式
const iconWrapStyle = (color) => ({
  background: `${color}14`,
  border: `1px solid ${color}28`,
  color
})

// 右下角「X 項」標籤樣式
const countStyle = (id, color) =>
  isActiveCategory(id)
    ? { color, background: `${color}18`, border: `1px solid ${color}36` }
    : { color: '#94a3b8', background: '#f1f5f9' }

const codeCardDecorIcons = {
  flask: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8"/><path d="M10 3v8l-5 9a1 1 0 0 0 .9 1.5h12.2a1 1 0 0 0 .9-1.5L14 11V3"/><line x1="7" y1="17" x2="17" y2="17"/></svg>',
  drop: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.8c2.3 3.1 5.5 6.8 5.5 10.3A5.5 5.5 0 1 1 6.5 13.1C6.5 9.6 9.7 5.9 12 2.8z"/></svg>',
  recycle: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h4l-1.5-2.5"/><path d="M7 7l2.5 4.5"/><path d="M17 7l-2.5-4.5"/><path d="M17 7h-4"/><path d="M17 17h-4l1.5 2.5"/><path d="M17 17l-2.5-4.5"/><path d="M7 17l2.5 4.5"/><path d="M7 17h4"/></svg>',
  leaf: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21c6 0 10-4 10-10 0-2.4-.5-4.5-1.2-6C9.5 5.5 5.5 9.5 5 15c-.2 2.4 0 4.1 0 6z"/><path d="M5 21c2.5-2.5 5.5-4.5 9-6"/></svg>',
  bin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 3h6l1 2H8l1-2z"/><rect x="6" y="7" width="12" height="14" rx="2"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>',
  factory: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V9l5 3V9l5 3V7l4 2v12"/><path d="M8 21v-4"/><path d="M12 21v-3"/><path d="M16 21v-5"/></svg>',
  truck: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6h13v10H1z"/><path d="M14 9h4l3 3v4h-7z"/><circle cx="5" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>'
}

const codeCardTopIconPools = {
  A: [codeCardDecorIcons.flask, codeCardDecorIcons.drop, codeCardDecorIcons.bin],
  B: [codeCardDecorIcons.bin, codeCardDecorIcons.drop, codeCardDecorIcons.recycle, codeCardDecorIcons.truck],
  C: [codeCardDecorIcons.recycle, codeCardDecorIcons.leaf, codeCardDecorIcons.drop, codeCardDecorIcons.flask],
  D: [codeCardDecorIcons.factory, codeCardDecorIcons.truck, codeCardDecorIcons.bin],
  E: [codeCardDecorIcons.factory, codeCardDecorIcons.recycle],
  R: [codeCardDecorIcons.recycle, codeCardDecorIcons.leaf, codeCardDecorIcons.truck, codeCardDecorIcons.bin]
}



const hotTags = ref(['pH值', '廢液', '廢鹼', '污泥', '事業廢棄物'])

const footerHighlights = [
  {
    title: '智慧分析',
    subtitle: '智慧精準評估',
    desc: '提升媒合效率',
    color: '#22c55e',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11c0 4.4 3.6 8 8 8"/><path d="M13 3c4.4 0 8 3.6 8 8"/><path d="M8 11l8-8"/><path d="M10 3H3v7"/><path d="M14 21h7v-7"/></svg>'
  },
  {
    title: '資源再生',
    subtitle: '循環高效利用',
    desc: '掌握資源流向',
    color: '#3b82f6',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6" rx="1"/><rect x="12" y="8" width="3" height="9" rx="1"/><rect x="17" y="5" width="3" height="12" rx="1"/></svg>'
  },
  {
    title: '綠色永續',
    subtitle: '環境友善共榮',
    desc: '確保資訊可信',
    color: '#f59e0b',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4v6c0 5.2-3.4 9.5-8 10-4.6-.5-8-4.8-8-10V6z"/><path d="M8.5 12.5l2.2 2.2 4.8-4.8"/></svg>'
  },
  {
    title: '決策可靠',
    subtitle: '數據驅動共策',
    desc: '實現淨零未來',
    color: '#22c55e',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18"/><path d="M12 3a15 15 0 0 0 0 18"/></svg>'
  }
]

const footerProcessSteps = [
  {
    title: '1.輸入廢棄物',
    subtitle: '填報廢棄物特性',
    color: '#3b82f6',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8"/><path d="M10 3v8l-5 9a1 1 0 0 0 .9 1.5h12.2a1 1 0 0 0 .9-1.5L14 11V3"/><line x1="7" y1="17" x2="17" y2="17"/></svg>'
  },
  {
    title: '2.智慧分析',
    subtitle: '分析可行路徑',
    color: '#22c55e',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 3h5"/><path d="M10 3v2.5"/><path d="M14 3v2.5"/><path d="M8 8a4 4 0 0 1 8 0v3a4 4 0 0 1-8 0z"/><path d="M6 10h2"/><path d="M16 10h2"/><path d="M12 15v3"/><path d="M9 21h6"/></svg>'
  },
  {
    title: '3.推薦循環模式',
    subtitle: '最佳再利用方案',
    color: '#8b5cf6',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c1.8 2.7 3 5 3 7.5A5.5 5.5 0 1 1 4 10.5C4 8 5.2 5.7 7 3"/><path d="M13 14c2 0 3.5 1.6 3.5 3.5S15 21 13 21s-3.5-1.6-3.5-3.5S11 14 13 14Z"/><path d="m16.5 7.5 4-1.5-1.5 4"/></svg>'
  },
  {
    title: '4.媒合供應商',
    subtitle: '快速找到合作夥伴',
    color: '#f97316',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8 11 5.5 8.5a2.5 2.5 0 0 1 0-3.5v0a2.5 2.5 0 0 1 3.5 0L12 8"/><path d="m16 13 2.5 2.5a2.5 2.5 0 0 1 0 3.5v0a2.5 2.5 0 0 1-3.5 0L12 16"/><path d="m9 15 6-6"/><path d="m8 16-2 2"/><path d="m18 8 2-2"/></svg>'
  }
]

const footerStats = [
  {
    label: '媒合成功案例',
    value: '2,458+',
    unit: '',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16"/><path d="M6 20V8l4-3 4 3v12"/><path d="M10 8l-4-3"/><path d="M10 8l4-3"/></svg>'
  },
  {
    label: '合作廠商數',
    value: '1,236+',
    unit: '',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="10" width="7" height="10" rx="1"/><rect x="14" y="4" width="7" height="16" rx="1"/><path d="M6 14h1"/><path d="M6 17h1"/><path d="M17 8h1"/><path d="M17 11h1"/></svg>'
  },
  {
    label: '資源再利用量',
    value: '3.85',
    unit: '萬噸',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h4l-1.5-2.5"/><path d="M7 7l2.5 4.5"/><path d="M17 7l-2.5-4.5"/><path d="M17 7h-4"/><path d="M17 17h-4l1.5 2.5"/><path d="M17 17l-2.5-4.5"/><path d="M7 17l2.5 4.5"/><path d="M7 17h4"/></svg>'
  },
  // {
  //   label: '減碳效益',
  //   value: '12.6',
  //   unit: '萬噸 CO₂e',
  //   icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16.5A4.5 4.5 0 1 1 12 9a4.2 4.2 0 0 1 6.7 3.4A3.6 3.6 0 1 1 18 19H8.8"/><path d="M9 21h6"/><path d="M10 18h4"/></svg>'
  // }
]

// 說明：封裝「footer Stats Animation Meta」商業邏輯，供目前流程重複使用。
const footerStatsAnimationMeta = footerStats.map((item) => {
  const raw = String(item.value)
  const hasPlus = raw.includes('+')
  const cleanRaw = raw.replace(/,/g, '').replace('+', '')
  const target = Number(cleanRaw)
  const decimalPart = cleanRaw.split('.')[1]
  const decimals = decimalPart ? decimalPart.length : 0

  return {
    target: Number.isFinite(target) ? target : 0,
    decimals,
    hasPlus,
    raw
  }
})

const footerStatsCardColors = ['#57B9E8', '#22c55e', '#22c55e', '#57B9E8']

// 說明：依目前條件即時計算「footer Stats For Insight Cards」內容，提供畫面顯示與決策判斷使用。
const footerStatsForInsightCards = computed(() => footerStats.map((item, index) => ({
  title: item.label,
  value: animatedFooterStatValues.value[index] || item.value,
  unit: item.unit || (index === 0 ? '件' : index === 1 ? '家' : ''),
  color: footerStatsCardColors[index % footerStatsCardColors.length],
  icon: item.icon
})))

// 說明：封裝「footer Highlights For Stats Bar」商業邏輯，供目前流程重複使用。
const footerHighlightsForStatsBar = footerHighlights.map((item) => ({
  label: item.subtitle,
  value: item.title,
  unit: '',
  icon: item.icon
}))

// 說明：依目前條件即時計算「current Category」內容，提供畫面顯示與決策判斷使用。
const currentCategory = computed(() => findCategoryById(selectedCategory.value) || categories.value[0])
// 說明：依目前條件即時計算「current Category Codes」內容，提供畫面顯示與決策判斷使用。
const currentCategoryCodes = computed(() => {
  if (selectedCategory.value === 'ALL') {
    return getAllWasteCodes()
  }
  return currentCategory.value?.codes || []
})
// 說明：依目前條件即時計算「filtered Category Codes」內容，提供畫面顯示與決策判斷使用。
const filteredCategoryCodes = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return currentCategoryCodes.value

  // 移除連字號，讓 C-0202 與 C0202 都能比對到
  const normalizedKeyword = keyword.replace(/-/g, '')

  return currentCategoryCodes.value.filter((code) => {
    const targetText = `${code.code} ${code.name} ${code.description || ''}`.toLowerCase()
    const normalizedTargetText = targetText.replace(/-/g, '')
    return targetText.includes(keyword) || normalizedTargetText.includes(normalizedKeyword)
  })
})
// 說明：依目前條件即時計算「display Codes」內容，提供畫面顯示與決策判斷使用。
const displayCodes = computed(() => filteredCategoryCodes.value)
// 說明：依目前條件即時計算「current Page Codes」內容，提供畫面顯示與決策判斷使用。
const currentPageCodes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return displayCodes.value.slice(start, end)
})
// 說明：回傳「get Category Short Name」資料供畫面渲染或後續商業規則使用。
const getCategoryShortName = (category) => category?.name?.split(' - ')[1] || category?.name || ''

// 說明：回傳「get Category Color」資料供畫面渲染或後續商業規則使用。
const getCategoryColor = (category) => {
  const visual = categoryVisuals[category?.id] || fallbackVisual
  return visual.color
}

// 說明：回傳「get Code Card Top Icon」資料供畫面渲染或後續商業規則使用。
const getCodeCardTopIcon = (categoryId, cardIndex) => {
  const pool = codeCardTopIconPools[categoryId] || codeCardTopIconPools.C
  return pool[cardIndex % pool.length]
}

// 說明：封裝「apply Tag」商業邏輯，供目前流程重複使用。
const applyTag = (tag) => {
  searchKeyword.value = tag
  currentPage.value = 1
}

// 說明：封裝「select Category」商業邏輯，供目前流程重複使用。
// 改用 findCategoryById
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  loadCategoryCodes(categoryId)
  selectedCode.value = defaultCodeMap[categoryId] || findCategoryById(categoryId)?.codes?.[0]?.code || ''
  currentPage.value = 1
}

// 說明：由使用者互動觸發；執行「handle Card Click」流程並同步更新相關狀態。
const handleCardClick = (code) => {
  router.push({
    path: '/standard-input',
    query: {
      from: 'home',
      entry: 'wasteCode',
      code,
      category: selectedCategory.value,
      page: currentPage.value
    }
  })
}

watch([selectedCategory, searchKeyword], () => {
  currentPage.value = 1
})

// 說明：封裝「show Mode Detail」商業邏輯，供目前流程重複使用。
const showModeDetail = (mode) => {
  selectedMode.value = mode
  dialogVisible.value = true
}

// 說明：封裝「prev Process Step」商業邏輯，供目前流程重複使用。
const prevProcessStep = () => {
  if (activeProcessStep.value <= 0) return
  activeProcessStep.value -= 1
}

// 說明：封裝「next Process Step」商業邏輯，供目前流程重複使用。
const nextProcessStep = () => {
  if (activeProcessStep.value >= footerProcessSteps.length - 1) return
  activeProcessStep.value += 1
}

// 說明：由導覽按鈕觸發；切換路由或流程步驟狀態。
const goProcessStep = (index) => {
  activeProcessStep.value = index
}

// 說明：封裝「prev Insight Card」商業邏輯，供目前流程重複使用。
const prevInsightCard = () => {
  if (activeInsightCard.value <= 0) return
  activeInsightCard.value -= 1
}

// 說明：封裝「next Insight Card」商業邏輯，供目前流程重複使用。
const nextInsightCard = () => {
  if (activeInsightCard.value >= footerStatsForInsightCards.value.length - 1) return
  activeInsightCard.value += 1
}

// 說明：由導覽按鈕觸發；切換路由或流程步驟狀態。
const goInsightCard = (index) => {
  activeInsightCard.value = index
}

// 說明：由使用者互動觸發；執行「handle Mode Search」流程並同步更新相關狀態。
const handleModeSearch = () => {
  scrollToSearch()
}

// 說明：封裝「scroll To Search」商業邏輯，供目前流程重複使用。
const scrollToSearch = () => {
  document.getElementById('search-section')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

// 說明：在動畫循環中逐步更新數值與畫面，呈現動態效果。
const animateFooterStats = () => {
  if (hasFooterStatsAnimated.value) return
  hasFooterStatsAnimated.value = true

  const duration = 1400
  const startTime = performance.now()
  // 說明：將輸入資料標準化為系統格式，供媒合與查詢流程使用。
  const formatters = footerStatsAnimationMeta.map((meta) => new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: meta.decimals,
    maximumFractionDigits: meta.decimals
  }))

  // 說明：封裝「step」商業邏輯，供目前流程重複使用。
  const step = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)

    animatedFooterStatValues.value = footerStatsAnimationMeta.map((meta, index) => {
      const currentValue = meta.target * eased
      const normalizedValue = meta.decimals > 0
        ? Number(currentValue.toFixed(meta.decimals))
        : Math.round(currentValue)
      const formatted = formatters[index].format(normalizedValue)
      return `${formatted}${meta.hasPlus ? '+' : ''}`
    })

    if (progress < 1) {
      footerStatsAnimationFrame = requestAnimationFrame(step)
      return
    }

    animatedFooterStatValues.value = footerStatsAnimationMeta.map((meta) => meta.raw)
    footerStatsAnimationFrame = null
  }

  footerStatsAnimationFrame = requestAnimationFrame(step)
}

onMounted(async () => {
  await loadCategories()   // ← 新增這行，等分類資料載入完再往下跑
  animatedFooterStatValues.value = footerStats.map(() => '0')

  if (typeof IntersectionObserver !== 'undefined' && footerInsightsRef.value) {
    footerStatsObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return

        animateFooterStats()
        footerStatsObserver?.disconnect()
        footerStatsObserver = null
      },
      {
        threshold: 0.25
      }
    )

    footerStatsObserver.observe(footerInsightsRef.value)
  } else {
    animateFooterStats()
  }

  if (route.query.category) {
    selectedCategory.value = route.query.category
  }
  if (route.query.page) {
    currentPage.value = Number(route.query.page) || 1
  }
})

onBeforeUnmount(() => {
  footerStatsObserver?.disconnect()
  footerStatsObserver = null

  if (footerStatsAnimationFrame) {
    cancelAnimationFrame(footerStatsAnimationFrame)
    footerStatsAnimationFrame = null
  }
})
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.home-page {
  --footer-art-height: clamp(10px, 18vw, 300px);
  min-height: 170vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
  // background:
  //   radial-gradient(circle at 10% 20%, #8fb2e01a, #0000 50%), radial-gradient(circle at 70% 20%, #2196f333, #0000 40%), radial-gradient(circle at 10% 100%, #8fb2e04d, #0000 50%);
  background-size: auto, auto, auto;
}

.home-page::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(var(--footer-art-height) * 2);
  background: url('../assets/Footer_v3.png') center bottom / cover no-repeat;
  pointer-events: none;
  z-index: 0;
}

.home-page>* {
  position: relative;
  z-index: 1;
}

.container {
  max-width: min(92vw, 1500px);
  margin: 0 auto;
  padding: 0 24px;

  @media (min-width: 1400px) {
    max-width: min(92vw, 1720px);
  }
}

.hero-section {
  position: relative;
  padding: clamp(20px, 2vw, 36px) clamp(24px, 3vw, 52px);
  overflow: hidden;
  min-height: clamp(640px, 82vh, 900px);
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('../assets/Bg_v4_850.png') center top / 105% auto no-repeat;
    mask-image: linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.35) 16% #000 60%);
    -webkit-mask-image: linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.35) 16%, #000 20%);
    z-index: 0;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 140px;
    background: linear-gradient(180deg, rgba($bg-section, 0) 0%, rgba($bg-section, 0.08) 38%, rgba($bg-section, 0.18) 100%);
    z-index: 1;
    pointer-events: none;
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  align-items: start;
  gap: 40px 80px;
}

.hero-left {
  grid-column: 1;
  grid-row: 1;
  flex: 1;
  text-align: left;
  max-width: 620px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.hero-right {
  grid-column: 2;
  grid-row: 1 / 3;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-width: 450px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-start;
  animation: fadeInUp 0.8s ease-out 0.4s backwards;
  order: 3;
}

.hero-bottom-left {
  grid-column: 1;
  grid-row: 2;
  width: 100%;
  align-self: start;
  max-width: 550px;
  margin-top: 20px;
  order: 4;
}

.logo-section {
  margin-bottom: 24px;
  animation: fadeInUp 0.8s ease-out;
}

.hero-logo {
  height: 50px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
}

.hero-title {
  font-size: clamp(48px, 3.2vw, 68px);
  font-weight: 800;
  color: $text-primary;
  margin-bottom: 16px;
  line-height: 1.3;
  animation: fadeInUp 0.8s ease-out 0.1s backwards;
}

.hero-title-accent {
  color: $primary-green;
}

.hero-title-accent-secondary {
  color: $secondary-cyan;
}

.hero-description {
  font-size: clamp(17px, 1.1vw, 24px);
  color: $text-secondary;
  margin-bottom: 20px;
  line-height: 1.8;
  animation: fadeInUp 0.8s ease-out 0.3s backwards;
}

.hero-pillars {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0px;
  max-width: 420px;
  margin-bottom: 30px;
  animation: fadeInUp 0.8s ease-out 0.35s backwards;
}

.pillar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 06px;
}

.pillar-icon {
  width: 56px;
  height: 56px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.66);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75), 0 8px 24px rgba(15, 23, 42, 0.08);

  svg {
    width: 26px;
    height: 26px;
  }
}

.pillar-icon--green {
  color: #22c55e;
}

.pillar-icon--blue {
  color: #3b82f6;
}

.pillar-icon--orange {
  color: #f59e0b;
}

.pillar-title {
  font-size: 16px;
  font-weight: 800;
  color: #1f2937;
  line-height: 1.2;
}

.pillar-subtitle {
  font-size: 15px;
  font-weight: 700;
  color: #64748b;
  line-height: 1.3;
}



.home-footer-insights {
  position: relative;
  z-index: 4;
  margin-top: -60px;
  margin-bottom: clamp(18px, 2.4vw, 34px);
}

.home-footer-stats {
  position: relative;
  margin-top: auto;
  // padding-bottom: calc(var(--footer-art-height) * 0.7);
  z-index: 2;
}

.insight-process-board {
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.88);
  border-radius: 30px;
  box-shadow: 0 16px 36px rgba(16, 24, 40, 0.1);
  padding: 10px 20px;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 14px;
  margin-bottom: 0;
}

.process-carousel-viewport {
  width: 100%;
}

.process-carousel-track {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  justify-content: center;
  gap: 30px;
  width: 100%;
}

.process-nav,
.process-carousel-dots {
  display: none;
}

.process-title {
  margin: 0;
  font-size: 0;
  font-weight: 700;
  color: #1a365d;
  display: none;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.02em;
  flex-basis: 100%;
  width: 100%;
}

.process-step-item {
  display: flex;
  align-items: center;
  flex: 0 1 auto;
  min-width: 0;
  gap: 0;
  position: relative;
}

.process-step-item:not(:last-child)::after {
  content: '>';
  position: absolute;
  right: -18px;
  top: 50%;
  transform: translateY(-50%);
  width: auto;
  height: auto;
  background: transparent;
  font-size: 16px;
  color: #9fb0c5;
  font-weight: 300;
}

.process-step-card {
  min-width: 0;
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0;
}

.process-step-index {
  display: none;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #4b6b8f;
  background: rgba(226, 236, 248, 0.95);
  border-radius: 999px;
  padding: 3px 10px;
}

.process-step-icon {
  width: 55px;
  height: 55px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  span {
    display: inline-flex;
    width: 32px;
    height: 32px;
  }

  :deep(svg) {
    width: 32px;
    height: 32px;
  }
}

.process-step-copy {
  min-width: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.process-step-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

.process-step-subtitle {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: #64748b;
  line-height: 1.3;
  white-space: nowrap;
}

.process-step-arrow {
  width: 0;
  height: 0;
  color: transparent;
  flex-shrink: 0;
  display: none;
  align-items: center;
  justify-content: center;

  svg {
    width: 0;
    height: 0;
  }
}

.insight-card-board {
  background: rgba(255, 255, 255, 1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 24px;
  box-shadow: 0 14px 34px rgba(16, 24, 40, 0.12);
  padding: 14px 18px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  position: relative;
  z-index: 2;
  margin-bottom: 30px;
}

.insight-carousel-viewport,
.insight-carousel-track {
  display: contents;
}

.insight-nav,
.insight-carousel-dots {
  display: none;
}

.insight-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 15%;
    width: 1px;
    height: 70%;
    background: rgba(148, 163, 184, 0.2);
  }
}

.insight-card--metric {
  align-items: center;
  gap: 18px;
  padding: 18px 20px;
}

.insight-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  span {
    display: inline-flex;
    width: 26px;
    height: 26px;
  }

  :deep(svg) {
    width: 26px;
    height: 26px;
  }
}

.insight-texts {
  min-width: 0;
}

.insight-metric-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.insight-metric-label {
  margin: 0;
  font-size: 18px;
  color: #334155;
  font-weight: 800;
  line-height: 1.35;
}

.insight-metric-value {
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 40px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;

  small {
    font-size: 18px;
    font-weight: 800;
    line-height: 1.1;
    color: inherit;
  }
}

.insight-title {
  margin: 0 0 2px;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 0.01em;
}

.insight-subtitle {
  margin: 0 0 2px;
  font-size: 15px;
  color: #334155;
  font-weight: 700;
}

.insight-desc {
  margin: 0;
  font-size: 15px;
  color: #64748b;
  font-weight: 600;
}

.insight-stats-bar {
  margin-top: -10px;
  background: linear-gradient(96deg, #3bb7f3 0%, #2ec8b5 52%, #35d05e 100%);
  // border-radius: 0 0 22px 22px;
  box-shadow: 0 16px 34px rgba(15, 118, 110, 0.24);
  overflow: hidden;
}

.insight-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
}

.insight-stat-item {
  padding: 18px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 26%;
    width: 1px;
    height: 48%;
    background: rgba(255, 255, 255, 0.35);
  }
}

.insight-stat-icon {
  width: 34px;
  height: 34px;
  color: #ffffff;
  opacity: 0.94;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  span {
    display: inline-flex;
    width: 32px;
    height: 32px;
  }

  :deep(svg) {
    width: 32px;
    height: 32px;
  }
}

.insight-stat-copy {
  min-width: 0;
}

.insight-stat-label {
  margin: 0;
  color: rgba(255, 255, 255, 0.88);
  font-size: 15px;
  font-weight: 600;
  font-family: "Noto Serif TC", "Microsoft JhengHei", "PingFang TC", "Times New Roman", serif;
}

.insight-stat-value {
  margin: 2px 0 0;
  color: #ffffff;
  font-size: 28px;
  font-weight: 800;
  font-family: "Noto Serif TC", "Microsoft JhengHei", "PingFang TC", "Times New Roman", serif;
  letter-spacing: 0.01em;
  display: flex;
  align-items: baseline;
  gap: 6px;

}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 卡片列表過渡動畫
.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.card-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.search-section {
  position: relative;
  z-index: 3;
  margin-top: -20px;
  padding: 0 60px clamp(40px, 4vh, 60px);
  flex: 1 0 auto;

  .container {
    background: linear-gradient(180deg, rgba(215, 238, 248, 0.87) 0%, rgba(255, 255, 255, 0.6) 60%, rgba(255, 255, 255, 0) 100%);
    // border: 1px solid rgba(255, 255, 255, 0);
    // backdrop-filter: blur(12px);
    border-radius: 28px;
    padding: 50px 36px;
    min-height: 800px;
    // box-shadow: 0 16px 48px rgba(26, 54, 93, 0.08);

    .search-header {
      text-align: center;
      margin-bottom: 36px;

      .section-title {
        font-size: 40px;
        font-weight: 800;
        color: $text-primary;
        text-align: center;
        margin-bottom: 16px;
      }

      .section-description {
        font-size: 18px;
        color: $text-secondary;
        text-align: center;
        max-width: 720px;
        margin: 0 auto;
        line-height: 1.85;
        font-weight: 600;
      }
    }

    .category-card-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 14px;
      margin-bottom: 24px;
    }

    .category-card {
      position: relative;
      border: 1.5px solid $border-color;
      border-radius: $card-radius;
      padding: 28px 14px 20px;
      min-height: 165px;
      background: $bg-card;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      font-family: inherit;
      text-align: center;
      overflow: hidden;

      &:hover {
        transform: translateY(-6px);
        box-shadow: $shadow-card;
        border-color: $primary-green-light;
      }

      &--active {
        transform: translateY(-4px);

        &:hover {
          box-shadow: $shadow-hover;
        }
      }
    }

    .category-card-check {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 24px;
      height: 24px;
      border-radius: 999px;
      color: $bg-primary;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 14px rgba(15, 23, 42, 0.16);

      svg {
        width: 14px;
        height: 14px;
      }
    }

    .category-card-icon-wrap {
      width: 54px;
      height: 54px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }

    .category-svg-icon {
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;

      :deep(svg) {
        width: 26px;
        height: 26px;
        display: block;
      }
    }

    .category-card-label {
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.08em;
      transition: color 0.3s;
      text-transform: uppercase;
    }

    .category-card-name {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.4;
      color: $text-primary;
      transition: color 0.3s;
    }

    .category-card-count {
      font-size: 15px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 100px;
      transition: all 0.3s;
      margin-top: 2px;
    }

    .search-card {
      background: rgba($bg-primary, 0.92);
      border: 1px solid $border-color;
      border-radius: $card-radius;
      padding: 22px 24px;
      margin-bottom: 8px;
      box-shadow: $shadow-small;
      backdrop-filter: blur(8px);
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .search-card-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 700;
      color: $text-primary;

      :deep(.el-icon) {
        color: $secondary-cyan;
        font-size: 20px;
      }
    }

    .search-card-input-group {
      display: flex;
      gap: 10px;
      align-items: center;

      :deep(.el-button + .el-button) {
        margin-left: 0;
      }
    }

    .search-input-field {
      flex: 1;
      min-width: 0;

      :deep(.el-input__wrapper) {
        background: rgba($bg-primary, 0.95);
        border-radius: $radius-input;
        border: 1.5px solid $border-color;
        box-shadow: none;
        transition: all 0.3s ease;
        padding: 4px 12px;

        &:hover {
          border-color: $primary-green-light;
        }

        &.is-focus {
          border-color: $primary-green;
          box-shadow: 0 0 0 3px rgba($primary-green, 0.12);
        }
      }

      :deep(.el-input__inner) {
        font-size: 15px;
        color: $text-primary;
        height: 42px;

        &::placeholder {
          color: $text-tertiary;
        }
      }

      :deep(.el-icon) {
        color: $text-tertiary;
        font-size: 16px;
      }
    }

    .search-btn {
      min-width: 100px;
      height: 42px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 15px;

      :deep(.el-button__text) {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .clear-btn {
      min-width: 100px;
      height: 42px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 15px;
      background: $bg-section;
      border: 1px solid $border-color;
      color: $text-secondary;
      transition: all 0.2s ease;

      &:hover {
        background: $border-light;
        border-color: $border-color;
        color: $text-primary;
      }
    }

    .hot-tags-section {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      margin-bottom: 4px;
    }

    .hot-tags-label {
      font-size: 15px;
      color: #4a5568;
      font-weight: 700;
      white-space: nowrap;
    }

    .hot-tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .hot-tag-item {
      font-size: 15px;
      font-weight: 600;
      color: #2c5aa0;
      background: #dbeafe;
      border: 1px solid #93c5fd;
      border-radius: 20px;
      padding: 3px 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
      line-height: 1.4;
      white-space: nowrap;

      &:hover {
        background: #bfdbfe;
        border-color: #60a5fa;
        color: #1d4ed8;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(66, 133, 244, 0.2);
      }
    }

    .hot-tags-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 14px;
      flex-wrap: wrap;
    }

    .hot-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
    }

    .hot-tag {
      font-size: 15px;
      font-weight: 500;
      color: #4a5568;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 100px;
      padding: 4px 13px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
      line-height: 1.6;

      &:hover {
        background: #dbeafe;
        border-color: #93c5fd;
        color: #1d4ed8;
        transform: translateY(-1px);
      }
    }
  }
}


.search-header,
.search-shell {
  position: relative;
  z-index: 1;
}



.search-eyebrow {
  margin: 0 0 10px;
  color: #4f8f6f;
  font-size: 15px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  font-weight: 700;
}





.search-shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: 28px;
}

.search-box {
  margin-bottom: 24px;
}

.search-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.search-label,
.search-current {
  font-size: 15px;
  color: #5f7986;
  font-weight: 600;
}

.search-current {
  color: #3d7157;
}

.waste-selector {
  width: 100%;
}

:deep(.waste-selector .el-select__wrapper) {
  min-height: 58px;
  border-radius: 20px;
  box-shadow: 0 10px 24px rgba(76, 129, 99, 0.1);
  border: 1px solid rgba(109, 159, 128, 0.14);
}

:deep(.el-select-dropdown__item) {
  .option-content {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  }
}

.code-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  flex-shrink: 0;
}

.code-badge {
  min-width: 72px;
  font-weight: 700;
  color: #29414f;
}

.code-name {
  color: #5f7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category-buttons {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.category-btn {
  border: 1px solid rgba(111, 151, 129, 0.14);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  min-height: 148px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease, background 0.24s ease;
  box-shadow: 0 12px 28px rgba(83, 118, 98, 0.08);
}

.category-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 38px rgba(83, 118, 98, 0.14);
}

.category-btn.active {
  background: linear-gradient(160deg, #6d11d9 0%, #5d0fb8 18%, #2b6ea5 100%);
  border-color: rgba(93, 15, 184, 0.42);
  box-shadow: 0 24px 44px rgba(83, 20, 139, 0.28);
}

.category-icon-shell {
  width: 62px;
  height: 62px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.category-icon-mark {
  font-size: 28px;
  line-height: 1;
}

.category-title {
  font-size: 15px;
  font-weight: 700;
  color: #354a57;
  line-height: 1.35;
}

.category-code {
  font-size: 15px;
  color: #6f8592;
  font-weight: 600;
}

.category-btn.active .category-title,
.category-btn.active .category-code {
  color: #ffffff;
}



.codes-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.list-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a365d;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.list-title-badge {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  padding: 4px 12px;
  border-radius: 100px;
  flex-shrink: 0;
}

.list-count {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 700;
  transition: all 0.3s ease;
}

.codes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.species-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.species-search-input {
  max-width: 360px;
}

.species-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.species-card {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  width: 100%;
}

.species-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.species-card-top {
  display: flex;
}

.species-no {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  padding: 6px 10px;
  border-radius: 8px;
  background: #f0fdf4;
  color: #22c55e;
  font-size: 15px;
  font-weight: 700;
}

.species-title {
  margin: 0;
  font-size: 16px;
  line-height: 1.4;
  color: #2e4754;
  min-height: 44px;
}

.species-image {
  height: 90px;
  border-radius: 18px;
  background: linear-gradient(160deg, rgba(231, 243, 236, 0.92), rgba(245, 250, 248, 0.96));
  border: 1px solid rgba(101, 143, 120, 0.2);
  overflow: hidden;
}

.species-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.species-items {
  margin: 0;
  font-size: 16px;
  color: #667f8d;
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
}

.code-card {
  text-align: left;
  border: 1px solid #e2e8f0;
  border-left: 6px solid;
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  min-height: 160px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

.code-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.code-card-top {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.code-card-top-icon {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--card-color) 8%, #ffffff 92%);
  border: 1px solid color-mix(in srgb, var(--card-color) 20%, #ffffff 80%);
}

.code-card-top-icon span {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
}

.code-card-top-icon :deep(svg) {
  width: 18px;
  height: 18px;
}

.code-card-arrow {
  font-size: 15px;
  display: block;
  /* 確保它佔滿整行 */
  text-align: right;
  opacity: 0;
  transform: translateX(-6px);
  transition: all 0.25s ease;
}

.code-card:hover .code-card-arrow {
  opacity: 1;
  transform: translateX(0);
}

.code-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.code-card-title {
  margin: 0 0 10px;
  font-size: 18px;
  color: #2e4754;
  line-height: 1.5;
  font-weight: 600;
}

.code-card-description {
  margin: 0;
  font-size: 16px;
  color: #667f8d;
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

:deep(.el-pagination) {

  .btn-prev,
  .btn-next,
  .el-pager li {
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(110, 155, 130, 0.16);
    border-radius: 8px;
    font-weight: 600;
    color: #3d5f50;
  }

  .btn-prev:hover,
  .btn-next:hover,
  .el-pager li:hover {
    background: rgba(235, 246, 239, 0.95);
    border-color: rgba(76, 129, 99, 0.28);
    color: #2d5041;
  }

  .el-pager li.is-active {
    background: linear-gradient(135deg, #4f8f6f 0%, #3a7a5c 100%);
    border-color: #4f8f6f;
    color: #ffffff;
    box-shadow: 0 8px 16px rgba(55, 112, 92, 0.26);
  }

  .el-pagination__total {
    color: #4b7f64;
    font-weight: 600;
  }
}

.empty-state,
.empty-state-main {
  padding: 48px 24px;
  text-align: center;

  :deep(.el-empty__description) {
    color: #6b8490;
    font-size: 15px;
  }
}

.empty-state-main {
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(245, 250, 248, 0.94));
  border: 1px solid rgba(113, 155, 132, 0.16);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 18px 40px rgba(82, 116, 98, 0.1);
}

@media (max-width: 1200px) {
  .search-section {
    .container {
      .category-card-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }

  .codes-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .species-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 968px) {


  .insight-process-board {
    flex-direction: row;
    flex-wrap: wrap;
    border-radius: 26px;
    padding: 16px 12px;
  }

  .process-title {
    width: 100%;
    margin: 0 0 0;
    display: none;
  }

  .process-step-item {
    width: calc(50% - 8px);
    margin-bottom: 12px;
  }

  .process-step-item:nth-child(odd)::after {
    display: none;
  }

  .process-step-arrow {
    width: 0;
    height: 0;
    display: none;
  }

  .search-section {
    margin-top: -80px;
    padding-top: 0;
  }

  .search-section {
    .container {
      .search-card {
        padding: 18px 16px;
      }

      .search-card-input-group {
        flex-wrap: wrap;
        align-items: stretch;
        gap: 10px;
      }

      .search-card-label {
        width: 100%;
        margin-bottom: 2px;
      }

      .search-input-field {
        flex: 1 1 calc(100% - 180px);
        min-width: 220px;
      }

      .search-btn,
      .clear-btn {
        min-width: 82px;
        padding: 0 14px;
      }

      .category-card-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      :deep(.tabsLabel .el-tabs__nav),
      .tab-label-right,
      .query-controls {
        grid-template-columns: 1fr;
        row-gap: 10px;
      }

      .tab-label-left {
        justify-content: flex-start;
      }
    }
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    gap: 40px;
    text-align: center;
  }

  .hero-left {
    text-align: center;
    max-width: 100%;
    margin-top: 20px;
  }

  .hero-right {
    min-width: auto;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 800px;
  }

  .hero-bottom-left {
    max-width: 100%;
    margin-top: 0;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-pillars {
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .search-shell {
    padding: 22px;
  }

  .codes-panel-header,
  .search-label-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .codes-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .species-panel-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .species-search-input {
    max-width: 100%;
    width: 100%;
  }

  .species-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .insight-card-board {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: -100px;
  }

  .insight-card--metric {
    padding: 16px 18px;
  }

  .insight-metric-value {
    font-size: 44px;

    small {
      font-size: 16px;
    }
  }

  .insight-stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .insight-stat-item:nth-child(2)::after {
    display: none;
  }
}

@media (max-width: 576px) {
  .home-page {
    --footer-art-height: clamp(130px, 36vw, 180px);
    min-height: 100svh;
    padding-bottom: 0;
  }

  .home-page::after {
    content: none;
  }

  .hero-section {
    padding: 24px 20px 80px 20px;
    min-height: auto;

    &::before {
      background: url('../assets/Bg_mobile.png') center top / 100% auto no-repeat;
    }
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .hero-left {
    grid-column: auto;
    grid-row: auto;
    max-width: 100%;
    margin-top: 0;
    text-align: center;
    gap: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    order: 1;
  }

  .hero-right {
    grid-column: auto;
    grid-row: auto;
    width: 100%;
    min-width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    order: 2;
    min-height: 720px;
  }

  .hero-actions {
    justify-content: center;
  }

  .insight-process-board {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr) 34px;
    align-items: center;
    border-radius: 20px;
    padding: 10px;
    gap: 8px;
    justify-content: initial;
  }

  .process-carousel-viewport {
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  .process-carousel-track {
    justify-content: flex-start;
    align-items: center;
    gap: 0;
    transform: translateX(calc(var(--process-active-index, 0) * -100%));
    transition: transform 0.32s ease;
  }

  .process-nav {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 999px;
    border: 1px solid rgba(155, 176, 208, 0.8);
    background: rgba(255, 255, 255, 0.94);
    color: #486a93;
    font-size: 20px;
    font-weight: 700;
    line-height: 1;
    padding: 0;

    &:disabled {
      opacity: 0.35;
    }
  }

  .process-carousel-dots {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 4px;
  }

  .process-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    border: 0;
    background: rgba(126, 151, 183, 0.4);
    padding: 0;

    &.is-active {
      width: 16px;
      background: #4f8fdf;
    }
  }

  .process-title {
    width: 100%;
    font-size: 0;
    display: none;
  }

  .process-step-item {
    width: auto;
    min-width: 100%;
    min-height: 116px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .process-step-item::after {
    display: none;
  }

  .process-step-arrow {
    display: none;
  }

  .process-step-card {
    width: min(300px, 100%);
    min-height: 100%;
    display: grid;
    grid-template-columns: 48px auto;
    grid-template-rows: auto 1fr;
    column-gap: 12px;
    row-gap: 6px;
    align-items: center;
    justify-content: center;
    gap: 0;
    padding: 6px 0;
    border-radius: 0;
    border: none;
    background: transparent;
    box-shadow: none;
    align-content: center;
    margin: 0 auto;
  }

  .process-step-index {
    display: inline-flex;
    grid-column: 1 / -1;
    grid-row: 1;
    justify-self: center;
    font-size: 14px;
    line-height: 1;
    letter-spacing: 0.04em;
    color: #5f7694;
    background: transparent;
    border-radius: 0;
    padding: 0;
  }

  .process-step-icon {
    grid-column: 1;
    grid-row: 2;
    align-self: center;
    width: 48px;
    height: 48px;

    span {
      width: 22px;
      height: 22px;
    }

    :deep(svg) {
      width: 22px;
      height: 22px;
    }
  }

  .process-step-copy {
    grid-column: 2;
    grid-row: 2;
    align-self: center;
    display: flex;
    flex-direction: column;
    text-align: left;
    gap: 4px;
    justify-content: center;
    min-height: 0;
    width: fit-content;
    max-width: 210px;
  }

  .process-step-title {
    font-size: 16px;
    white-space: normal;
  }

  .process-step-subtitle {
    font-size: 14px;
    white-space: normal;
  }

  .home-footer-insights {
    margin-top: -10px;
  }

  .search-section {
    margin-top: -80px;
    padding: 24px 18px 76px;
  }

  .search-section {
    .container {
      .search-card {
        padding: 14px;
        border-radius: 16px;
      }

      .search-card-input-group {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
      }

      .search-card-label {
        font-size: 14px;
      }

      .search-input-field {
        width: 100%;
        min-width: 0;
      }

      .search-btn,
      .clear-btn {
        width: 100%;
        min-width: 0;
        height: 40px;
        font-size: 14px;
      }

      .hot-tags-section {
        align-items: flex-start;
        gap: 8px;
      }

      .hot-tags-label {
        font-size: 14px;
      }

      .hot-tags-list {
        gap: 8px;
      }

      .hot-tag-item {
        font-size: 14px;
        padding: 4px 12px;
      }
    }
  }

  .container {
    padding: 0 16px;
  }

  .section-title {
    font-size: 32px;
  }

  .hero-pillars {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .pillar-item {
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
    gap: 10px;
  }

  .pillar-title,
  .pillar-subtitle {
    font-size: 15px;
  }

  .codes-grid {
    grid-template-columns: 1fr;
  }

  .species-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .home-footer-stats {
    margin-top: auto;
    padding-top: 0;
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
  }

  .home-footer-stats::before {
    content: '';
    display: block;
    width: 100%;
    height: calc(var(--footer-art-height) * 1.25);
    background: url('../assets/Footer_v3.png') center bottom / cover no-repeat;
  }

  .insight-card-board {
    grid-template-columns: 34px minmax(0, 1fr) 34px;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border-radius: 20px;
    margin-bottom: 22px;
  }

  .insight-carousel-viewport {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .insight-carousel-track {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0;
    width: 100%;
    transform: translateX(calc(var(--insight-active-index, 0) * -100%));
    transition: transform 0.32s ease;
  }

  .insight-nav {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 999px;
    border: 1px solid rgba(155, 176, 208, 0.8);
    background: rgba(255, 255, 255, 0.94);
    color: #486a93;
    font-size: 20px;
    font-weight: 700;
    line-height: 1;
    padding: 0;

    &:disabled {
      opacity: 0.35;
    }
  }

  .insight-carousel-dots {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 4px;
  }

  .insight-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    border: 0;
    background: rgba(126, 151, 183, 0.4);
    padding: 0;

    &.is-active {
      width: 16px;
      background: #4f8fdf;
    }
  }

  .insight-card {
    width: 100%;
    min-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 6px;

    &:not(:last-child)::after {
      display: none;
    }
  }

  .insight-card--metric {
    width: min(300px, 100%);
    gap: 14px;
    padding: 12px 10px;
    margin: 0 auto;
    justify-content: center;
  }

  .insight-metric-copy {
    width: fit-content;
    max-width: 210px;
  }

  .insight-metric-label {
    font-size: 15px;
  }

  .insight-metric-value {
    font-size: 36px;

    small {
      font-size: 15px;
    }
  }


  .insight-stat-item {
    padding: 14px 10px;

    &:not(:last-child)::after {
      display: none;
    }
  }

  .insight-stat-value {
    font-size: 24px;
  }
}

@media (max-width: 420px) {
  .species-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1600px) {
  .hero-section {
    padding: 28px 56px;
    min-height: clamp(700px, 80vh, 860px);
  }

  .search-section {
    margin-top: -72px;
  }

  .hero-content {
    gap: 88px;
  }

  .search-section {
    padding: 64px 72px;
  }

  .search-section {
    .container {
      padding: 60px 36px;

      .search-header {
        .section-title {
          font-size: clamp(44px, 2.1vw, 56px);
        }

        .section-description {
          font-size: clamp(18px, 1vw, 22px);
          max-width: 980px;
        }
      }
    }
  }
}

@media (min-width: 2100px) {
  .hero-section {
    min-height: clamp(720px, 76vh, 840px);
  }

  .container {
    max-width: min(90vw, 1880px);
    padding: 0 20px;
  }

  .hero-content {
    gap: 110px;
  }
}
</style>