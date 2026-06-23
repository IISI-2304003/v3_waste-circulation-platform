<template>
  <div class="home-page ">
    <section class="hero-section">
      <ParticleBackground />
      <div class="container hero-content">
        <div class="hero-left">
          <div class="logo-section">
            <img src="../assets/logo.png" alt="環境部資源循環署" class="hero-logo" />
          </div>

          <h1 class="hero-title">產業廢棄物循環利用<br><span style="color: #4CAF50;">智慧媒合平台</span></h1>
          <p class="hero-description">連結資源循環供需，推動產業共生，實現永續循環經濟</p>

          <div class="hero-actions">
            <el-button type="primary" size="large" round @click="scrollToSearch">
              廢棄物搜尋
              <el-icon class="el-icon--right">
                <Search />
              </el-icon>
            </el-button>
          </div>
        </div>

        <div v-if="modes.length > 0" class="hero-right">
          <CirculationModesGrid :modes="modes" @mode-click="showModeDetail" />
        </div>
      </div>
    </section>

    <section id="search-section" class="search-section">
      <div class="container">
        <div class="search-header">
          <h2 class="section-title">廢棄物類別搜尋</h2>
          <p class="section-description">
            直接在此頁面切換六大類、搜尋子項代碼，並即時預覽主要允收資訊。
          </p>
        </div>
        <el-row :gutter="20" class="tabsLabel">
          <el-col :span="24" id="wasteCodeRef">
            <el-row :gutter="10">
              <el-col :span="5">
                <el-button plain :class="['tab-btn', { 'tab-btn--active': activeTab === 'wasteCodeRef' }]" @click="activeTab = 'wasteCodeRef'">
                  <el-icon style="vertical-align: middle">
                    <Management />
                  </el-icon>
                  <span>廢棄物代碼搜尋</span>
                </el-button>
              </el-col>
              <el-col :span="6">
                <el-select v-model="selectedCategory" placeholder="請選擇廢棄物類別" :class="{ 'select-control': activeTab === 'wasteCodeRef' }">
                  <el-option v-for="item in wasteCategories" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-col>
              <el-col :span="13">
                <el-input v-model="searchKeyword" clearable placeholder="關鍵字搜尋" :class="{ 'select-control': activeTab === 'wasteCodeRef' }" />
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-divider />
        <el-row>


          <el-col :span="24">
            <div v-if="displayCodes.length > 0" class="codes-panel">
              <div class="codes-panel-header">
                <h3 class="list-title">{{ getCategoryShortName(currentCategory) }}</h3>
                <span class="list-count">共 {{ displayCodes.length }} 項</span>
              </div>

              <div v-if="currentPageCodes.length > 0" class="codes-grid">
                <button v-for="code in currentPageCodes" :key="code.id" type="button" class="code-card" @click="handleCardClick(code.code)">
                  <div class="code-card-top">
                    <span class="code-chip" :style="{ background: getCodeColor(code) }">{{ code.code }}</span>
                  </div>
                  <h4 class="code-card-title">{{ code.name }}</h4>
                  <p class="code-card-description">{{ code.description }}</p>
                </button>
              </div>

              <div v-else class="empty-state">
                <el-empty description="目前此類別暫無資料" />
              </div>

              <div v-if="displayCodes.length > pageSize" class="pagination-wrapper">
                <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="displayCodes.length" layout="prev, pager, next" background />
              </div>
            </div>
            <div v-else class="empty-state-main">
              <el-empty description="請選擇類別以查看廢棄物代碼" />
            </div>
          </el-col>
        </el-row>

      </div>
    </section>

    <CirculationModal v-model="dialogVisible" :mode="selectedMode" @search="handleModeSearch" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, Management } from '@element-plus/icons-vue'
import { useCirculationModes } from '../composables/useCirculationModes'
import ParticleBackground from '../components/ParticleBackground.vue'
import CirculationModesGrid from '../components/CirculationModesGrid.vue'
import CirculationModal from '../components/CirculationModal.vue'
import { wasteCategories, getCategoryById, getCategoryByCode, getAllWasteCodes } from '@/data/wasteCategories'
import { getWasteSpeciesCardsLocal, buildSpeciesFallbackImage } from '@/data/wasteSpecies'

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
const activeTab = ref('wasteSpeciesRef')
const speciesSearchKeyword = ref('')
const speciesCurrentPage = ref(1)
const speciesPageSize = 10

const wasteSpeciesCards = getWasteSpeciesCardsLocal()
const fallbackSpeciesImage = buildSpeciesFallbackImage()

const handleSpeciesImageError = (event) => {
  const target = event?.target
  if (!target || target.dataset.fallbackApplied === 'true') return
  target.dataset.fallbackApplied = 'true'
  target.src = fallbackSpeciesImage
}

const handleSpeciesClick = (species) => {
  router.push({
    path: `/waste-species/${species.id}`,
    query: {
      from: 'home',
      tab: 'wasteSpeciesRef'
    }
  })
}

const currentCategory = computed(() => getCategoryById(selectedCategory.value) || wasteCategories[0])
const currentCategoryCodes = computed(() => {
  if (selectedCategory.value === 'ALL') {
    return getAllWasteCodes()
  }
  return currentCategory.value?.codes || []
})
const currentCategoryColor = computed(() => currentCategory.value?.color || '#7bbf8a')
const allWasteCodes = computed(() => getAllWasteCodes())
const filteredCategoryCodes = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return currentCategoryCodes.value

  return currentCategoryCodes.value.filter((code) => {
    const targetText = `${code.code} ${code.name} ${code.description || ''}`.toLowerCase()
    return targetText.includes(keyword)
  })
})
const displayCodes = computed(() => (activeTab.value === 'wasteCodeRef' ? filteredCategoryCodes.value : currentCategoryCodes.value))
const currentPageCodes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return displayCodes.value.slice(start, end)
})
const speciesDisplayCards = computed(() => {
  const keyword = speciesSearchKeyword.value.trim().toLowerCase()
  if (!keyword) return wasteSpeciesCards

  return wasteSpeciesCards.filter((species) => {
    const targetText = `${species.id} ${species.name} ${species.representativeItems.join(' ')}`.toLowerCase()
    return targetText.includes(keyword)
  })
})
const speciesCurrentPageCards = computed(() => {
  const start = (speciesCurrentPage.value - 1) * speciesPageSize
  const end = start + speciesPageSize
  return speciesDisplayCards.value.slice(start, end)
})

const getCategoryShortName = (category) => category?.name?.split(' - ')[1] || category?.name || ''

const getCodeColor = (code) => {
  if (selectedCategory.value === 'ALL') {
    return getCategoryById(code.categoryId)?.color || currentCategoryColor.value
  }
  return currentCategoryColor.value
}

const categoryIconMap = {
  A: '⚗️',
  B: '☣️',
  C: '🧪',
  D: '🏭',
  E: '🔩',
  R: '♻️'
}

const getCategoryIcon = (category) => categoryIconMap[category?.id] || '🗂️'

const getCategoryShellStyle = (category, isActive) => {
  if (isActive) {
    return {
      background: 'rgba(255, 255, 255, 0.18)',
      color: '#ffffff',
      boxShadow: '0 14px 30px rgba(20, 89, 62, 0.22)'
    }
  }

  return {
    background: `${category.color}18`,
    color: category.color,
    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.48)'
  }
}

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  selectedCode.value = defaultCodeMap[categoryId] || getCategoryById(categoryId)?.codes?.[0]?.code || ''
  currentPage.value = 1
}

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

const handleCodeSelect = (code) => {
  if (!code) return

  const category = getCategoryByCode(code)
  if (category) {
    selectedCategory.value = category.id
  }
  selectedCode.value = code
}

watch([activeTab, selectedCategory, searchKeyword], () => {
  currentPage.value = 1
})

watch([activeTab, speciesSearchKeyword], () => {
  speciesCurrentPage.value = 1
})

const showModeDetail = (mode) => {
  selectedMode.value = mode
  dialogVisible.value = true
}

const handleModeSearch = () => {
  scrollToSearch()
}

const scrollToSearch = () => {
  document.getElementById('search-section')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

onMounted(() => {
  if (route.query.tab) {
    activeTab.value = route.query.tab
  }
  if (route.query.category) {
    selectedCategory.value = route.query.category
  }
  if (route.query.page) {
    currentPage.value = Number(route.query.page) || 1
  }
})
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.home-page {
  min-height: 100vh;
  width: 100%;
  background:
    radial-gradient(circle at 10% 20%, rgba(143, 178, 224, 0.1), transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(33, 150, 243, 0.3), transparent 40%),
    radial-gradient(circle at 10% 100%, rgba(143, 178, 224, 0.3), transparent 50%);
}

.container {
  max-width: min(92vw, 1600px);
  margin: 0 auto;
  padding: 0 24px;

  @media (min-width: 1400px) {
    max-width: min(92vw, 1720px);
  }
}

.hero-section {
  position: relative;
  background:
    url('../assets/Bg.png');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  padding: clamp(20px, 2vw, 36px) clamp(24px, 3vw, 52px);
  overflow: hidden;
  min-height: clamp(640px, 82vh, 900px);
  isolation: isolate;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 120px;
    // background:
    //   radial-gradient(circle at 0% 100%, rgba(232, 244, 255, 0.95) 0%, rgba(232, 244, 255, 0.35) 36%, transparent 72%),
    //   linear-gradient(180deg, rgba(232, 244, 255, 0) 0%, rgba(232, 244, 255, 0.78) 82%, rgba(232, 244, 255, 1) 100%);
    z-index: 0;
    pointer-events: none;
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
}

.hero-left {
  flex: 1;
  text-align: left;
  max-width: 620px;
}

.hero-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 450px;
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
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 16px;
  line-height: 1.3;
  animation: fadeInUp 0.8s ease-out 0.1s backwards;
}

.hero-description {
  font-size: clamp(17px, 1.1vw, 24px);
  color: #607d8b;
  margin-bottom: 28px;
  line-height: 1.8;
  animation: fadeInUp 0.8s ease-out 0.3s backwards;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-start;
  animation: fadeInUp 0.8s ease-out 0.4s backwards;
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

.search-section {
  position: relative;
  z-index: 3;
  margin-top: -54px;
  padding: 0 60px 50px;

  .container {
    background: #f9fdff7c;
    border-radius: 32px;
    padding: 50px 24px;
    box-shadow: 0 24px 80px rgba(53, 92, 72, 0.12);
    min-height: 600px;

    .search-header {
      text-align: center;
      margin-bottom: 36px;

      .section-title {
        font-size: 40px;
        font-weight: 700;
        color: #2c3e50;
        text-align: center;
        margin-bottom: 16px;
      }

      .section-description {
        font-size: 16px;
        color: #607d8b;
        text-align: center;
        max-width: 720px;
        margin: 0 auto;
        line-height: 1.85;
      }
    }

    .tabsLabel {
      --el-tabs-header-height: 50px;

      /* 維持原本高度不變 */
      .tab-btn {
        background-color: #ffffff;
        color: $primary-green;
        border-color: $primary-green-light;
        width: 100%;
      }

      .tab-btn--active {
        background-color: $primary-green;
        color: #ffffff;
        border-color: $primary-green;
      }

      .colGap {
        border-right: #ccc solid 1.5px;
        height: 30px;
        padding-left: 30px;
      }

      #wasteCodeRef {
        .select-control {
          /* 1. 預設狀態下的邊框顏色 */
          --el-border-color: #{$primary-green};

        }
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
  font-size: 13px;
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
  font-size: 14px;
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
  font-size: 13px;
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
  font-size: 24px;
  font-weight: 700;
  color: #28414f;
}

.list-count {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(76, 175, 80, 0.08);
  color: #4b7f64;
  font-size: 13px;
  font-weight: 700;
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
  border: 1px solid rgba(110, 155, 130, 0.12);
  background: rgba(255, 255, 255, 0.96);
  border-radius: 22px;
  padding: 16px;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 10px 24px rgba(88, 120, 103, 0.08);
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  width: 100%;
}

.species-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 34px rgba(88, 120, 103, 0.14);
  border-color: rgba(55, 138, 101, 0.28);
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
  border-radius: 999px;
  background: #ecf5ef;
  color: #2e6e4f;
  font-size: 13px;
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
  font-size: 13px;
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
  border: 1px solid rgba(110, 155, 130, 0.12);
  background: rgba(255, 255, 255, 0.96);
  border-radius: 22px;
  padding: 18px;
  min-height: 160px;
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease, background 0.24s ease;
  box-shadow: 0 10px 24px rgba(88, 120, 103, 0.08);
  cursor: pointer;
}

.code-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 34px rgba(88, 120, 103, 0.14);
  border-color: rgba(55, 138, 101, 0.28);
}

.code-card-top {
  margin-bottom: 12px;
}

.code-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  padding: 8px 14px;
  border-radius: 999px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
}

.code-card-title {
  margin: 0 0 10px;
  font-size: 15px;
  color: #2e4754;
  line-height: 1.5;
  font-weight: 600;
}

.code-card-description {
  margin: 0;
  font-size: 13px;
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
  .codes-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .species-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 968px) {

  .search-section {
    margin-top: -24px;
    padding-top: 0;
  }

  .search-section .container :deep(.tabsLabel .el-tabs__nav),
  .search-section .container .tab-label-right,
  .search-section .container .query-controls {
    grid-template-columns: 1fr;
    row-gap: 10px;
  }

  .search-section .container .tab-label-left {
    justify-content: flex-start;
  }

  .hero-content {
    flex-direction: column;
    gap: 40px;
    text-align: center;
  }

  .hero-left {
    text-align: center;
    max-width: 100%;
  }

  .hero-right {
    min-width: auto;
  }

  .hero-title {
    font-size: 36px;
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
}

@media (max-width: 576px) {
  .hero-section {
    padding: 24px 20px;
    min-height: auto;
  }

  .search-section {
    margin-top: 0;
    padding: 24px 18px 42px;
  }

  .container {
    padding: 0 16px;
  }

  .section-title {
    font-size: 32px;
  }

  .codes-grid {
    grid-template-columns: 1fr;
  }

  .species-grid {
    grid-template-columns: repeat(2, 1fr);
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

  .search-section .container {
    padding: 60px 36px;
  }

  .search-section .container .search-header .section-title {
    font-size: clamp(44px, 2.1vw, 56px);
  }

  .search-section .container .search-header .section-description {
    font-size: clamp(18px, 1vw, 22px);
    max-width: 980px;
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