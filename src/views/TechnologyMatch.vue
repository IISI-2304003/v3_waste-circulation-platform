<template>
	<div class="technology-match-page">
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
						<p>技術決策</p>
					</div>
				</el-col>
			</el-row>
		</div>

		<div class="page-shell" style="padding: 24px;">
			<FlowStepProgress :active-step="3" />

			<div v-if="!isQuickMode" class="summary-mode-row panel-card">
				<!-- 左：決策需求摘要 -->
				<section class="summary-panel-inner">
					<div class="section-header">
						<div class="ai-icon"><el-icon>
								<Monitor />
							</el-icon></div>
						<h2>決策需求摘要</h2>
					</div>
					<div class="summary-grid">
						<div v-for="item in visibleDemandSummary" :key="item.label" class="summary-item">
							<span class="summary-icon">
								<el-icon>
									<component :is="item.icon" />
								</el-icon>
							</span>
							<div>
								<p class="summary-label">{{ item.label }}</p>
								<p class="summary-value">{{ item.value }}</p>
							</div>
						</div>
					</div>
				</section>

				<!-- 分隔線 -->
				<div class="panel-divider" />

				<!-- 右：推薦循環模式 -->
				<section class="mode-panel-inner">
					<div class="section-header">
						<div class="ai-icon mode-ai-icon"><el-icon>
								<Orange />
							</el-icon></div>
						<h2>推薦循環模式</h2>
						<a class="mode-explain-link" @click.prevent="openModeExplainDialog">查看模式說明 ›</a>
					</div>
					<div class="mode-title-row">
						<span class="mode-badge">{{ selectedMode.modeName }}</span>
						<h3>{{ selectedMode.title }}</h3>
					</div>
					<div class="flow-diagram">
						<template v-for="(node, index) in selectedMode.steps" :key="node.label">
							<div class="flow-step">
								<div class="flow-icon" :style="{
									borderColor: selectedMode.accentColor + '60',
									color: selectedMode.accentColor,

								}">
									<el-icon :size="22">
										<component :is="node.icon" />
									</el-icon>
								</div>
								<span class="flow-label">{{ node.label }}</span>
							</div>
							<div v-if="index < selectedMode.steps.length - 1" class="flow-arrow" :style="{ color: selectedMode.accentColor }">
								<el-icon>
									<ArrowRight />
								</el-icon>
							</div>
						</template>
					</div>
					<div class="matching-method" v-if="!['廠內模式1', '廠內模式2', '廠內模式3'].includes(normalizeModeName(selectedMode.modeName))">
						<span>媒合方式：外部技術單位協作</span>
						<span class="match-description">實際合作對象須依允收條件及合作關係進一步確認</span>
					</div>
					<div class="matching-method" v-else>
						<span>執行主體：產源事業</span>
						<span class="match-description">須確認廠內設備、製程及操作條件</span>
					</div>
				</section>
			</div>

			<section class="panel-card suppliers-panel">
				<div class="suppliers-header">
					<div class="section-header suppliers-title">
						<div class="ai-icon">
							<el-icon>
								<Opportunity />
							</el-icon>
						</div>
						<h2>決策結果推薦</h2>
					</div>
					<div class="sort-controls">
						<el-select v-model="sortType" class="sort-select" placeholder="排序條件">
							<el-option label="綜合排序" value="overall" />
							<el-option label="依地區" value="distance" />
							<el-option label="依再利用量" value="capacity" />
						</el-select>
						<el-select v-if="sortType === 'distance'" v-model="selectedRegions" multiple collapse-tags collapse-tags-tooltip placeholder="篩選縣市" class="sort-select region-select">
							<el-option v-for="city in taiwanCities" :key="city" :label="city" :value="city">
								<el-checkbox :model-value="selectedRegions.includes(city)" style="pointer-events:none" />
								<span style="margin-left:8px">{{ city }}</span>
							</el-option>
						</el-select>
					</div>
				</div>

				<div class="supplier-list">
					<el-row :gutter="16">
						<el-col v-for="(vendor, index) in pagedVendors" :key="vendor.id" style="margin-bottom: 16px" :xs="24" :sm="24">
							<article class="supplier-card" role="button" tabindex="0">
								<!-- 左側：排名 + 圖片 -->
								<div class="card-left">
									<div class="rank-badge">{{ (currentPage - 1) * pageSize + index + 1 }}</div>
									<img class="supplier-photo" :src="vendor.image" :alt="vendor.name" />
								</div>

								<!-- 右側：內容 -->
								<div class="supplier-main">
									<!-- 頂部：標籤列 -->
									<div class="card-tags">
										<span class="meta-chip ann_category">{{ vendor.announcement_category_name }}</span>
										<span v-if="vendor.is_reuse_company && vendor.announcement_category_name !== '再利用機構'" class="meta-chip ann_reuse">再利用機構</span>
									</div>

									<!-- 名稱 +  前月收受能力 -->
									<div class="card-header-row">
										<div class="name-match">
											<h3>{{ vendor.company_name }}</h3>

										</div>
									</div>

									<!-- Meta 資訊：3欄 grid -->
									<div class="meta-grid">
										<div class="meta-item">
											<span class="meta-icon"><el-icon>
													<Location />
												</el-icon></span>
											<div>
												<p class="meta-title">再利用廢棄物</p>
												<p class="meta-text">{{ vendor.waste_name }}</p>
											</div>
										</div>
										<div class="meta-item">
											<span class="meta-icon"><el-icon>
													<Location />
												</el-icon></span>
											<div>
												<p class="meta-title">所在地</p>
												<p class="meta-text">{{ vendor.region }}</p>
											</div>
										</div>
										<!-- <div class="meta-item">
											<span class="meta-icon"><el-icon>
													<Position />
												</el-icon></span>
											<div>
												<p class="meta-title">距離</p>
												<p class="meta-text">{{ vendor.distance }} km</p>
											</div>
										</div> -->
										<div class="meta-item">
											<span class="meta-icon"><el-icon>
													<Box />
												</el-icon></span>
											<div>
												<p class="meta-title">再生產品</p>
												<p class="meta-text"><span v-for="(item, idx) in vendor.product" :key="idx">{{ item }}<template v-if="idx < vendor.product.length - 1">、</template></span></p>
											</div>
										</div>
										<div class="meta-item">
											<span class="meta-icon"><el-icon>
													<Box />
												</el-icon></span>
											<div>
												<p class="meta-title">許可總量</p>
												<p class="meta-text">{{ vendor.permitted_quantity }} 噸/月</p>
											</div>
										</div>
										<div class="meta-item">
											<span class="meta-icon"><el-icon>
													<Box />
												</el-icon></span>
											<div>
												<p class="meta-title">前月收受總量</p>
												<div class="capacity-dots">
													<div class="dots-container">
														<span class="dot" :class="getDotClass(vendor.capacityLevel, 1)"></span>
														<span class="dot" :class="getDotClass(vendor.capacityLevel, 2)"></span>
														<span class="dot" :class="getDotClass(vendor.capacityLevel, 3)"></span>
													</div>
													<span class="capacity-text">{{ vendor.capacityLevel === 1 ? '低' : vendor.capacityLevel === 2 ? '中' : '高' }} </span>
												</div>

											</div>
										</div>
										<div class="meta-item">
											<span class="meta-icon"><el-icon>
													<Box />
												</el-icon></span>
											<div>
												<p class="meta-title">事業管制編號</p>
												<p class="meta-text">{{ vendor.control_number }}</p>
											</div>
										</div>
										<div class="meta-item">
											<span class="meta-icon"><el-icon>
													<Box />
												</el-icon></span>
											<div>
												<p class="meta-title">有效許可期限</p>
												<p class="meta-text">{{ vendor.permit_end_date }}</p>
											</div>
										</div>
									</div>

									<!-- 底部：適合原因 + 查看詳情 -->
									<div class="card-footer">
										<span class="reason-label">適合原因</span>
										<div class="footer-row">
											<div class="reason-block">
												<span v-for="reason in vendor.reasons" :key="reason" class="detail-tag yellow">{{ reason }}</span>
											</div>
											<button class="detail-btn" @click.stop="openVendorDetail(vendor)">查看詳情</button>
										</div>
									</div>
								</div>
							</article>
						</el-col>
					</el-row>
				</div>

				<div v-if="totalPages > 1" class="pagination-wrap">
					<el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="sortedVendors.length" layout="prev, pager, next" />
				</div>
			</section>

			<section v-if="!isQuickMode" class="panel-card suppliers-panel">
				<div class="suppliers-header">
					<div class="section-header suppliers-title">
						<div class="ai-icon">
							<el-icon>
								<Opportunity />
							</el-icon>
						</div>
						<h2>其他替代方案</h2>
					</div>
					<div v-if="alternativeTotalPages > 1" class="alt-nav-actions">
						<el-button circle :disabled="alternativePage === 0" @click="goPrevAlternative">
							<el-icon>
								<ArrowLeft />
							</el-icon>
						</el-button>
						<span class="alt-nav-page">{{ alternativePage + 1 }} / {{ alternativeTotalPages }}</span>
						<el-button circle :disabled="alternativePage >= alternativeTotalPages - 1" @click="goNextAlternative">
							<el-icon>
								<ArrowRight />
							</el-icon>
						</el-button>
					</div>
				</div>
				<div v-if="visibleAlternativePaths.length" class="alternative-grid">
					<article v-for="path in visibleAlternativePaths" :key="path.modeName" class="alternative-card">
						<div class="alternative-top">
							<span class="alternative-badge" :style="{ background: path.gradient }">{{ path.modeName }}</span>
							<h3>{{ path.title }}</h3>
						</div>
						<p class="alternative-summary">{{ path.summary }}</p>

						<div class="flow-diagram alt-flow-diagram">
							<template v-for="(step, index) in path.steps" :key="`${path.modeName}-${step.label}`">
								<div class="flow-step">
									<div class="flow-icon" :style="{ borderColor: path.accentColor + '60', color: path.accentColor }">
										<el-icon :size="20">
											<component :is="step.icon" />
										</el-icon>
									</div>
									<span class="flow-label">{{ step.label }}</span>
								</div>
								<div v-if="index < path.steps.length - 1" class="flow-arrow" :style="{ color: path.accentColor }">
									<el-icon>
										<ArrowRight />
									</el-icon>
								</div>
							</template>
						</div>
						<div class="alternative-meta-row">
							<!-- <span class="alternative-vendor-count">推薦廠商數<span class="vendor-count">{{ getRecommendedVendorCount(path.modeName) }} </span>家</span> -->
							<el-button type="primary" class="detail-btn" @click="switchToAlternativePath(path)">
								查看此方案
								<el-icon class="el-icon--right">
									<ArrowRight />
								</el-icon>
							</el-button>
						</div>
					</article>
				</div>
				<div v-else class="alternative-empty">目前無其他替代方案。</div>
			</section>

			<el-dialog v-model="detailDialogVisible" class="vendor-detail-dialog " width="min(1120px, 94vw)" align-center destroy-on-close :modal="true" :close-on-click-modal="true" :close-on-press-escape="true" append-to-body @closed="closeVendorDetail">
				<template #header>
					<div v-if="activeVendor" class="dialog-top-header">
						<div class="top-header-main">
							<div class="top-left-copy">
								<span class="vendor-tag">{{ activeVendor.isReuseOrg ? '再利用廠商' : '處理機構' }}</span>
								<h3>{{ activeVendor.company_name }}</h3>
								<!-- <p class="dialog-specialty">專長：{{ activeVendor.reuseTech }}</p> -->
								<div class="mode-title-row">
									<span class="mode-badge">{{ selectedMode.modeName }}</span>
								</div>
								<div class="flow-diagram">
									<template v-for="(node, index) in selectedMode.steps" :key="node.label">
										<div class="flow-step">
											<div class="flow-icon" :style="{
												borderColor: selectedMode.accentColor + '60',
												color: selectedMode.accentColor,

											}">
												<el-icon :size="22">
													<component :is="node.icon" />
												</el-icon>
											</div>
											<span class="flow-label">{{ node.label }}</span>
										</div>
										<div v-if="index < selectedMode.steps.length - 1" class="flow-arrow" :style="{ color: selectedMode.accentColor }">
											<el-icon>
												<ArrowRight />
											</el-icon>
										</div>
									</template>
								</div>
							</div>

							<div class="top-right-media">
								<img class="dialog-hero-image" :src="activeVendor.image" :alt="activeVendor.name" />
							</div>
						</div>
					</div>
				</template>

				<div v-if="activeVendor" class="dialog-body-v2">
					<el-row :gutter="12" class="top-metrics-row">
						<el-col :xs="12" :sm="8" :md="4" :lg="4" :xl="4">
							<div class="hero-stat">
								<div class="hero-stat-head"><el-icon class="stat-icon">
										<Location />
									</el-icon><span>所在地</span></div>
								<strong>{{ activeVendor.region }}</strong>
							</div>
						</el-col>
						<el-col :xs="12" :sm="8" :md="4" :lg="4" :xl="4">
							<div class="hero-stat">
								<div class="hero-stat-head"><el-icon class="stat-icon">
										<Promotion />
									</el-icon><span>距離</span></div>
								<strong>{{ activeVendor.distance }} km</strong>
							</div>
						</el-col>
						<el-col :xs="12" :sm="8" :md="4" :lg="4" :xl="4">
							<div class="hero-stat">
								<div class="hero-stat-head"><el-icon class="stat-icon">
										<Goods />
									</el-icon><span>再生產品</span></div>
								<strong><span v-for="(item, idx) in activeVendor.product" :key="idx">{{ item }}<template v-if="idx < activeVendor.product.length - 1">、</template></span></strong>
							</div>
						</el-col>
						<el-col :xs="12" :sm="8" :md="4" :lg="4" :xl="4">
							<div class="hero-stat">
								<div class="hero-stat-head"><el-icon class="stat-icon">
										<DataAnalysis />
									</el-icon><span>許可總量</span></div>
								<strong>{{ activeVendor.permitted_quantity }}噸/月</strong>
							</div>
						</el-col>
						<el-col :xs="12" :sm="8" :md="4" :lg="4" :xl="4">
							<div class="hero-stat">
								<div class="hero-stat-head"><el-icon class="stat-icon">
										<Finished />
									</el-icon><span>有效許可期限</span></div>
								<strong>{{ activeVendor.permit_end_date }}</strong>
							</div>
						</el-col>
						<el-col :xs="12" :sm="8" :md="4" :lg="4" :xl="4">
							<div class="hero-stat">
								<div class="hero-stat-head"><el-icon class="stat-icon">
										<Files />
									</el-icon><span>事業管制編號</span></div>
								<strong>{{ activeVendor.control_number }}</strong>
							</div>
						</el-col>
					</el-row>

					<div class="detail-grid-v2">
						<section class="detail-card">
							<p class="detail-title">允收條件</p>
							<el-divider />
							<ul class="condition-list">
								<li v-for="(item, idx) in activeVendor.acceptance_standard" :key="idx">{{ item.source_text }}</li>
							</ul>
						</section>

						<section class="detail-card">
							<p class="detail-title">前月收受總量</p>
							<el-divider />
							<div class="capacity-panel">
								<div class="capacity-dots">
									<div class="dots-container">
										<span class="dot" :class="getDotClass(activeVendor.capacityLevel, 1)"></span>
										<span class="dot" :class="getDotClass(activeVendor.capacityLevel, 2)"></span>
										<span class="dot" :class="getDotClass(activeVendor.capacityLevel, 3)"></span>
									</div>
									<span class="capacity-text">{{ activeVendor.capacityLevel === 1 ? '低' : activeVendor.capacityLevel === 2 ? '中' : '高' }}</span>
								</div>
								<p class="capacity-note" v-if="activeVendor.capacityLevel === 1">收受能力充足，可立即決策合作。</p>
							</div>
						</section>

						<!-- <section class="detail-card">
							<p class="detail-title">再利用技術</p>
							<el-divider />
							<p class="detail-text">{{ activeVendor.reuseTech }}</p>
						</section> -->
						<!-- <section class="detail-card">
							<p class="detail-title">製程單元</p>
							<el-divider />
							<div class="tag-wrap">
								<span v-for="item in activeVendor.processUnits" :key="item" class="detail-tag green">{{ item }}</span>
							</div>
						</section>

						<section class="detail-card">
							<p class="detail-title">再生產品應用領域</p>
							<el-divider />
							<div class="tag-wrap">
								<span v-for="item in activeVendor.salesTargetIndustries" :key="item" class="detail-tag green">{{ item }}</span>
							</div>
						</section> -->
						<section class="detail-card">
							<p class="detail-title">適合原因</p>
							<el-divider />
							<div class="tag-wrap">
								<span v-for="item in activeVendor.reasons" :key="item" class="detail-tag yellow">{{ item }}</span>
							</div>
						</section>
						<section class="detail-card " style="background: rgba(225, 250, 232, 0.84);;">
							<p class="detail-title">決策結論</p>
							<p class="detail-text">綜合評估各项條件與技術可行性,建議優先採用「{{ selectedMode.modeName }}」,並與「{{ activeVendor.company_name }}」合作,可兼顧資源再利用效益、處理量能與環境價值,具備良好執行可行性。</p>
						</section>



						<section class="detail-card contact-card wide-card">
							<p class="detail-title">聯絡資訊</p>
							<div class="contact-row">
								<div class="contact-item"><span>聯絡電話</span><strong>{{ activeVendor.phone }}</strong></div>
								<div class="contact-item"><span>工廠地址</span><strong>{{ activeVendor.address }}</strong></div>
							</div>
						</section>
					</div>

					<div class="dialog-actions">
						<el-button type="primary" class="pdf-export-btn" @click="exportVendorPdf">
							<el-icon class="el-icon--left">
								<Download />
							</el-icon>
							下載綜合報告
						</el-button>
						<el-button class="contact-vendor-btn" type="success" @click="contactVendor">
							<el-icon class="el-icon--left">
								<Promotion />
							</el-icon>
							聯絡廠商
						</el-button>
					</div>
				</div>
			</el-dialog>

			<div class="actions panel-card">
				<el-button v-if="!isQuickMode" size="large" @click="goPrevious">
					<el-icon class="el-icon--left">
						<ArrowLeft />
					</el-icon>
					上一步 : 循環路徑推薦
				</el-button>
				<!-- //下載完整報告 -->
				<el-button size="large" type="primary" class="export-btn" @click="exportFullReportPdf">
					<el-icon class="el-icon--left">
						<Download />
					</el-icon>
					下載完整報告
				</el-button>
			</div>

			<CirculationModal v-model="modeDialogVisible" :mode="selectedModeDetail" />
		</div>
	</div>
</template>

<script setup>
import { computed, ref, watch, onMounted, markRaw } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import CirculationModal from '@/components/CirculationModal.vue'
import circulationModesData from '@/data/circulationModes.json'
import { getCompanyList } from '@/api/wasteCode'
import {
	ArrowLeft, ArrowRight, Monitor,
	Connection, DataAnalysis, Files, Finished,
	Goods, Location, Money, Operation, Promotion, SetUp
} from '@element-plus/icons-vue'
import FlowStepProgress from '@/components/condition-setup/FlowStepProgress.vue'
import { useConditionSetupStore } from '@/stores/conditionSetup'
import factory1 from '@/assets/factory/factory-1.png'
import factory2 from '@/assets/factory/factory-2.png'
import factory3 from '@/assets/factory/factory-3.png'
import factory4 from '@/assets/factory/factory-4.png'
import factory5 from '@/assets/factory/factory-5.png'
import demoApi from '@/data/demo.json'

const factoryImages = [factory1, factory2, factory3, factory4, factory5] // 用於隨機分配廠商圖片

const router = useRouter()
const route = useRoute()
const isQuickMode = computed(() => route.query.mode === 'quick')// 模式判斷
const conditionStore = useConditionSetupStore()

const sortType = ref('overall')
const selectedRegions = ref([])

const taiwanCities = [
	'基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣',
	'苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義市',
	'嘉義縣', '臺南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣',
	'臺東縣', '澎湖縣', '金門縣', '連江縣'
]
const currentPage = ref(1)
const pageSize = 4
const detailDialogVisible = ref(false)
const activeVendor = ref(null)
const modeDialogVisible = ref(false)

const iconComponentMap = {
	Goods: markRaw(Goods),
	Files: markRaw(Files),
	Operation: markRaw(Operation),
	Promotion: markRaw(Promotion),
	SetUp: markRaw(SetUp),
	Connection: markRaw(Connection),
	Finished: markRaw(Finished),
	DataAnalysis: markRaw(DataAnalysis),
	Money: markRaw(Money),
	Location: markRaw(Location),
	Monitor: markRaw(Monitor)
}

const demandSelectionLabelMap = {
	'replace-raw-material': '再生產品可回廠原製程使用',
	'non-original-process': '再生產品非原製程使用',
	'external-sale': '再生產品對外販售'
}

const toRawIcon = (icon) => {
	if (typeof icon === 'string') return iconComponentMap[icon] || iconComponentMap.Goods
	return markRaw(icon || Goods)
}

const mapModeSteps = (steps = []) => {
	if (!Array.isArray(steps)) return []
	return steps.map((step) => ({
		...step,
		icon: toRawIcon(step?.icon)
	}))
}

// 說明：將輸入資料標準化為系統格式，供決策與查詢流程使用。
const extractCountyCity = (address = '') => {
	const text = String(address || '')
	if (!text) return ''
	const match = text.match(/(基隆市|台北市|新北市|桃園市|新竹市|新竹縣|苗栗縣|台中市|彰化縣|南投縣|雲林縣|嘉義市|嘉義縣|台南市|高雄市|屏東縣|宜蘭縣|花蓮縣|台東縣|澎湖縣|金門縣|連江縣)/)
	return match ? match[1] : text
}

// 說明：將輸入資料標準化為系統格式，供決策與查詢流程使用。
const formatAcceptanceCondition = (condition) => {
	if (!condition?.parameter) return ''
	if (condition.operator === '範圍' && condition.valueMin != null && condition.valueMax != null) {
		const unit = condition.unit ? ` ${condition.unit}` : ''
		return `${condition.parameter} ${condition.valueMin}~${condition.valueMax}${unit}`
	}
	if (condition.value == null || condition.value === '') return condition.parameter
	const unit = condition.unit ? ` ${condition.unit}` : ''
	return `${condition.parameter} ${condition.operator} ${condition.value}${unit}`
}

// 說明：依目前條件即時計算「demand Summary」內容，提供畫面顯示與決策判斷使用。
const demandSummary = computed(() => {
	const { sourceConditions, siteConditions, businessConditions, acceptanceConditions, uploadedReports } = conditionStore

	const regionFromAddress = extractCountyCity(businessConditions.businessAddress)
	const regionFromSite = Array.isArray(siteConditions.region) && siteConditions.region.length > 0
		? siteConditions.region.join(' / ')
		: '未設定'
	const regionText = regionFromAddress || regionFromSite

	const demandSelectionText = Array.isArray(conditionStore.demandSelections)
		? conditionStore.demandSelections.map((value) => demandSelectionLabelMap[value]).filter(Boolean).join('、')
		: ''
	const productText = sourceConditions.processLabel || sourceConditions.process || businessConditions.recycledProductDemand || demandSelectionText || '未設定'
	const amountText = sourceConditions.outputAmount ? `${sourceConditions.outputAmount} 噸 / 月` : '未設定'

	const preferenceTokens = []
	if (siteConditions.hasReuseSpace === true) preferenceTokens.push('有再利用空間')
	if (siteConditions.hasReuseSpace === false) preferenceTokens.push('無再利用空間')
	if (siteConditions.hasSecondaryWaste === true) preferenceTokens.push('有衍生廢棄物')
	if (siteConditions.hasSecondaryWaste === false) preferenceTokens.push('無衍生廢棄物')
	if (uploadedReports?.length) preferenceTokens.push(`已上傳${uploadedReports.length}份報告`)

	const priorityText = preferenceTokens.length > 0 ? preferenceTokens.join('、') : '未設定'
	const sourceLabel = sourceConditions.industry ? (sourceConditions.industryLabel || sourceConditions.industry) : '未設定'
	const acceptanceList = Array.isArray(acceptanceConditions) ? acceptanceConditions.map(formatAcceptanceCondition).filter(Boolean) : []
	const acceptanceText = acceptanceList.length > 0
		? `${acceptanceList.slice(0, 2).join('；')}${acceptanceList.length > 2 ? ` 等${acceptanceList.length}項` : ''}`
		: '未設定'

	return [
		{ icon: iconComponentMap.Location, label: '所在地區', value: regionText },
		{ icon: iconComponentMap.DataAnalysis, label: '允收條件', value: acceptanceText },
		{ icon: iconComponentMap.Goods, label: '廢棄物來源製程', value: productText },
		{ icon: iconComponentMap.Money, label: '每月需求量', value: amountText },
		{ icon: iconComponentMap.Finished, label: '來源產業', value: sourceLabel },
		{ icon: iconComponentMap.Monitor, label: '優先條件', value: priorityText }
	]
})

// 說明：依目前條件即時計算「visible Demand Summary」內容，提供畫面顯示與決策判斷使用。
const visibleDemandSummary = computed(() => demandSummary.value.filter((item) => item.value && item.value !== '未設定'))

// 說明：將輸入資料標準化為系統格式，供決策與查詢流程使用。
const normalizeModeName = (value = '') => String(value).replace(/\s+/g, '').trim()



const allRecommendedPaths = computed(() => conditionStore.recommendedPaths || [])

// 說明：依目前條件即時計算「selected Mode」內容，提供畫面顯示與決策判斷使用。
const selectedMode = computed(() => {
	const hasStoredMode = conditionStore.selectedRecommendedPath?.modeName
	const modeNameFromStore = conditionStore.selectedRecommendedPath?.modeName || ''
	const matchedRecommended = allRecommendedPaths.value.find((item) => normalizeModeName(item.modeName) === normalizeModeName(modeNameFromStore))

	if (hasStoredMode) {
		return {
			...(matchedRecommended || {}),
			modeName: conditionStore.selectedRecommendedPath.modeName,
			title: conditionStore.selectedRecommendedPath.title || matchedRecommended?.title || '',
			summary: conditionStore.selectedRecommendedPath.summary || matchedRecommended?.summary || '依據您選擇的循環路徑，系統提供對應技術決策建議。',
			accentColor: matchedRecommended?.accentColor || 'var(--ds-primary-green)',
			steps: mapModeSteps(matchedRecommended?.steps || [])
		}
	}

	if (conditionStore.siteConditions.hasReuseSpace === true) {
		return {
			modeName: '廠內模式 1',
			title: "物料製程內未排出，逕自循環使用",
			summary: '利用廠內再利用空間完成前處理與純化再製後，直接回到原製程，縮短運輸與處理鏈。',
			accentColor: 'var(--ds-primary-green)',
			steps: [
				{ label: '原料購入', icon: iconComponentMap.Goods },
				{ label: '廠內前處理', icon: iconComponentMap.Files },
				{ label: '純化(再製)', icon: iconComponentMap.Operation },
				{ label: '返回原製程', icon: iconComponentMap.Promotion }
			]
		}
	}

	return {
		modeName: '廠外模式 4',
		title: "原料購入使用後，送至受產源實質自主管理之公司純化（再製）、調整成分與濃度，再返回原廠原製程循環使用。",
		summary: '原料購入使用後，送至受產源實質自主管理之公司純化（再製）、調整成分與濃度，再返回原廠原製程循環使用。',
		accentColor: 'var(--ds-primary-green)',
		steps: [
			{ label: '原料購入', icon: iconComponentMap.Goods },
			{ label: '純化(再製)', icon: iconComponentMap.Operation },
			{ label: '調整成分', icon: iconComponentMap.SetUp },
			{ label: '返回原製程', icon: iconComponentMap.Promotion }
		]

	}
})

const alternativesPerPage = 2
const alternativePage = ref(0)

const alternativePaths = computed(() => {
	const selectedModeName = normalizeModeName(selectedMode.value?.modeName)
	return allRecommendedPaths.value.filter((path) => normalizeModeName(path.modeName) !== selectedModeName)
})

const alternativeTotalPages = computed(() => Math.ceil(alternativePaths.value.length / alternativesPerPage))

const visibleAlternativePaths = computed(() => {
	const start = alternativePage.value * alternativesPerPage
	return alternativePaths.value.slice(start, start + alternativesPerPage)
})

const goPrevAlternative = () => {
	if (alternativePage.value <= 0) return
	alternativePage.value -= 1
}

const goNextAlternative = () => {
	if (alternativePage.value >= alternativeTotalPages.value - 1) return
	alternativePage.value += 1
}

// 說明：依目前條件即時計算「selected Mode Detail」內容，提供畫面顯示與決策判斷使用。
const selectedModeDetail = computed(() => {
	const targetModeName = normalizeModeName(selectedMode.value?.modeName)
	return circulationModesData.find((mode) => normalizeModeName(mode.name) === targetModeName) || null
})

// 說明：由模式說明入口觸發；開啟模式解說彈窗供使用者查看細節。
const openModeExplainDialog = () => {
	modeDialogVisible.value = true
}

// 根據等級與點的索引，返回對應的 CSS 類別
// 說明：回傳「get Dot Class」資料供畫面渲染或後續商業規則使用。
const getDotClass = (level, dotIndex) => {
	if (dotIndex > level) return 'inactive'
	if (level === 1) return 'active green'
	if (level === 2) return 'active yellow'
	if (level === 3) return 'active red'
}



// 廠商資料從 API 載入（舊有寫死資料保留為初始值備用）
const vendors = ref([])

onMounted(async () => {
	try {
		const data = await getCompanyList()
		if (data.length > 0) {
			vendors.value = data.map((item) => {
				const demo = demoVendorDataMap[item.control_number] || {}
				return {
					...item,
					image: factoryImages[item.id % factoryImages.length],
					// 只在後端沒給值的時候才用 demo 資料補上
					product: item.product || demo.product || '',
					acceptance_standard: item.acceptance_standard?.length ? item.acceptance_standard : (demo.acceptance_standard || []),
					capacityLevel: item.capacityLevel ?? demo.capacityLevel ?? 0,
					capacityLevelText: item.capacityLevelText || demo.capacityLevelText || '',
					reasons: item.reasons?.length ? item.reasons : (demo.reasons || [])
				}
			})
		}
	} catch {
		console.error('載入廠商資料失敗，改用 demo 資料')

	}
	vendors.value = demoApi.map((item) => {
		const demo = demoVendorDataMap[item.control_number] || {}
		return {
			...item,
			image: factoryImages[item.id % factoryImages.length],
			// 只在後端沒給值的時候才用 demo 資料補上
			product: item.product || demo.product || '',
			acceptance_standard: item.acceptance_standard?.length ? item.acceptance_standard : (demo.acceptance_standard || []),
			capacityLevel: item.capacityLevel ?? demo.capacityLevel ?? 0,
			capacityLevelText: item.capacityLevelText || demo.capacityLevelText || '',
			reasons: item.reasons?.length ? item.reasons : (demo.reasons || [])
		}
	})
})

// ⚠️ 暫時性 demo 用途：後端推薦邏輯完成後移除
// 依「事業名稱」關鍵字，指定要顯示的廠商 id 清單
const demoCompanyVendorMap = {
	'聯華電子股份有限公司': [
		'E2601186',
		'L91A2853',
		'O1703020',
		'S20A2670'
	],

	'台灣美光 (台中一廠)': [
		'D9700018',
		'O1703020',
		'R9000394',
		'H5308154',
		'E2601186',
		'H5389720',
		'E2000107',
		'K7200924',
		'H47A0463',
	]
	// 之後如果還要加其他 demo 公司，繼續往下加
}

// ⚠️ 暫時性 demo 用途：後端補齊 product / 允收條件 / 前月收受總量 / 適合原因 後移除
const demoVendorDataMap = {
	'E2601186': {
		product: ['稀硫酸'],
		acceptance_standard: ['pH ≤ 2.0', '外觀 : 無懸浮顆粒', '含水率 : <55%', '硫酸濃度 : ≧45%', '比重 : >1.345'],
		capacityLevel: 2,           // 1=綠 2=黃 3=紅
		capacityLevelText: '中等',
		reasons: ['地緣鄰近', '允收條件相符', '許可量充足']
	},
	'J5902815': {
		product: ['工業用氣矽酸鈉', 'HF+HNO,混合液', '硝酸鈣', '硝酸', '硝酸鈉', '氟矽酸'],

		capacityLevel: 2,           // 1=綠 2=黃 3=紅
		capacityLevelText: '中等',
		reasons: ['地緣鄰近', '允收條件相符', '許可量充足']
	},
	'L91A2853': {
		product: [
			'稀酸B',
			'硫酸B'
		],

		capacityLevel: 1, // 1=綠 2=黃 3=紅
		capacityLevelText: '中等',
		reasons: ['地緣鄰近', '允收條件相符', '許可量充足']
	},

	'O1703020': {
		product: [
			'發煙硫酸B',
			'硫酸B',
			'稀硫酸B',
			'稀酸B'
		],
		capacityLevel: 1, // 1=綠 2=黃 3=紅
		capacityLevelText: '中等',
		reasons: ['地緣鄰近', '允收條件相符', '許可量充足']
	},

	'S20A2670': {
		product: [
			'工業級稀硫酸（40%）',
			'工業級稀硫酸（45%）',
			'工業級稀硫酸（50%）',
			'工業級稀硫酸（60%）'
		],

		capacityLevel: 3, // 1=綠 2=黃 3=紅
		capacityLevelText: '中等',
		reasons: ['允收條件相符', '再利用產品明確', '許可量充足']
	},
	'D9700018': {
		product: ['稀硫酸'],
		capacityLevel: 2, // 1=綠 2=黃 3=紅
		capacityLevelText: '中等',
		reasons: ['允收條件相符', '許可量充足']
	},
	'R9000394': {
		product: ['稀硫酸'],
		capacityLevel: 3, // 1=綠 2=黃 3=紅
		reasons: ['允收條件相符']
	},
	'H5308154': {
		product: ['稀硫酸'],
		capacityLevel: 2, // 1=綠 2=黃 3=紅
		reasons: ['允收條件相符']
	},
	'H5389720': {
		product: ['稀硫酸'],
		capacityLevel: 1, // 1=綠 2=黃 3=紅
		reasons: ['許可量充足']
	},
	'E2000107': {
		product: ['工業級稀硫酸', '工業級稀硫酸-除雙氧水'],
		capacityLevel: 1, // 1=綠 2=黃 3=紅
		reasons: ['允收條件相符', '許可量充足']
	},
	'K7200924': {
		product: ['稀硫酸'],
		capacityLevel: 2, // 1=綠 2=黃 3=紅
		reasons: ['允收條件相符', '許可量充足']
	},
	'H47A0463': {
		product: ['硫酸銅'],
		capacityLevel: 3, // 1=綠 2=黃 3=紅
		reasons: ['允收條件相符']
	},
	// 其他公司照這個格式加下去...
}

// 說明：依目前輸入的事業名稱，找出對應的假推薦廠商 id 清單
const getDemoVendorIds = (businessName = '') => {
	const matchedKey = Object.keys(demoCompanyVendorMap).find((keyword) => businessName.includes(keyword))
	return matchedKey ? demoCompanyVendorMap[matchedKey] : null
}
// 說明：判斷目前選擇的循環模式是否為「廠內模式」(執行主體為產源事業自己)
const isInternalMode = computed(() => {
	return ['廠內模式1', '廠內模式2', '廠內模式3'].includes(normalizeModeName(selectedMode.value?.modeName))
})
// 說明：依目前條件即時計算「sorted Vendors」內容，提供畫面顯示與決策判斷使用。
const sortedVendors = computed(() => {

	let result = vendors.value;
	// ⚠️ demo 用途：若尚未設定事業名稱（例如直接進本頁測試），先假填一組公司名稱以便展示
	const businessNameForDemo = conditionStore.businessConditions.businessName || ''
	//台灣美光 (台中一廠) //聯華電子股份有限公司
	if (isInternalMode.value) {
		// ⚠️ demo 用途：廠內模式時，執行主體是產源事業自己，僅顯示自己公司的資料
		result = result.filter((v) => v.company_name === businessNameForDemo)
	} else {

		// ⚠️ demo 用途：依公司名稱做假篩選
		const demoControlNumbers = getDemoVendorIds(businessNameForDemo)
		if (demoControlNumbers) {
			const controlNumberSet = new Set(demoControlNumbers)
			result = result.filter((v) => controlNumberSet.has(v.control_number))
		}
	}

	// ⚠️ demo 用途：同一 control_number 底下若有多筆列，只保留第一筆代表該公司
	const seen = new Set()
	result = result.filter((v) => {
		if (seen.has(v.control_number)) return false
		seen.add(v.control_number)
		return true
	})

	// 依地區篩選
	if (sortType.value === 'distance' && selectedRegions.value.length > 0) {
		result = result.filter((v) => selectedRegions.value.includes(v.region))
	}

	if (sortType.value === 'distance') return result.sort((a, b) => a.distance - b.distance)
	if (sortType.value === 'capacity') {
		return [...result].sort((a, b) => b.permitted_quantity - a.permitted_quantity)
	}
	return result.sort((a, b) => b.score - a.score)
})

// 說明：依目前條件即時計算「total Pages」內容，提供畫面顯示與決策判斷使用。
const totalPages = computed(() => Math.ceil(sortedVendors.value.length / pageSize))
// 說明：依目前條件即時計算「paged Vendors」內容，提供畫面顯示與決策判斷使用。
const pagedVendors = computed(() => sortedVendors.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))

watch(sortType, () => {
	currentPage.value = 1
})

watch(detailDialogVisible, (value) => {
	if (!value) activeVendor.value = null
})

watch(() => selectedMode.value?.modeName, () => {
	currentPage.value = 1
	if (activeVendor.value) {
		const allowedVendorIds = new Set(sortedVendors.value.map((vendor) => vendor.id))
		if (!allowedVendorIds.has(activeVendor.value.id)) {
			detailDialogVisible.value = false
			activeVendor.value = null
		}
	}
})

watch(alternativePaths, () => {
	alternativePage.value = 0
})

const switchToAlternativePath = (path) => {
	conditionStore.setSelectedRecommendedPath(path)
}

// 說明：由廠商卡片點擊觸發；設定 activeVendor 並開啟廠商詳情視窗。
const openVendorDetail = (vendor) => {
	activeVendor.value = vendor
	detailDialogVisible.value = true
}

// 說明：由詳情視窗關閉操作觸發；關閉視窗並結束目前詳情檢視。
const closeVendorDetail = () => {
	detailDialogVisible.value = false
}

// 說明：由「聯絡廠商」操作觸發；提示目前廠商聯絡資訊。
const contactVendor = () => {
	if (!activeVendor.value) return
	ElMessage.info(`請洽 ${activeVendor.value.contactPhone} 進一步聯絡合作細節`)
}

// 說明：封裝「escape Html」商業邏輯，供目前流程重複使用。
const escapeHtml = (value) => String(value ?? '')
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#39;')

// 說明：由匯出操作觸發；將目前廠商詳情整理為可列印 PDF 視窗內容。
const exportVendorPdf = () => {
	if (!activeVendor.value) return

	const vendor = activeVendor.value
	const printWindow = window.open('', '_blank', 'width=960,height=720')
	if (!printWindow) {
		ElMessage.warning('無法開啟匯出視窗，請確認瀏覽器未封鎖彈出視窗')
		return
	}

	// 說明：封裝「tags」商業邏輯，供目前流程重複使用。
	const tags = (arr = []) => arr.map((item) => `<span style="display:inline-block;margin:0 6px 6px 0;padding:4px 10px;border-radius:999px;background:#ecf5ff;color:#2b5876;font-size:12px;">${escapeHtml(item)}</span>`).join('')

	printWindow.document.write(`
		<!doctype html>
		<html lang="zh-Hant">
		<head>
			<meta charset="UTF-8" />
			<title>${escapeHtml(vendor.name)} - 公司詳情</title>
			<style>
				body{font-family:Segoe UI,Microsoft JhengHei,sans-serif;color:#1f2d3d;margin:28px;line-height:1.6;}
				h1{margin:0 0 8px;font-size:28px;color:#1f4d47;}
				h2{margin:22px 0 10px;font-size:16px;color:#2b5876;border-bottom:1px solid #dfe9f3;padding-bottom:4px;}
				p{margin:4px 0;}
				.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px 18px;}
				.block{background:#f7fbff;border:1px solid #dbe8f3;border-radius:10px;padding:10px 12px;}
				.meta{font-size:13px;color:#5b7890;}
				.value{font-weight:600;color:#183e61;}
				@media print { body { margin: 14mm; } }
			</style>
		</head>
		<body>
			<h1>${escapeHtml(vendor.name)}</h1>
			<p class="meta">${escapeHtml(vendor.category)} ｜ ${escapeHtml(vendor.location)} ｜ ${escapeHtml(vendor.controlNo)}</p>

			<h2>六項概要</h2>
			<div class="grid">
				<div class="block"><div class="meta">公告類別</div><div class="value">${escapeHtml(vendor.category)}</div></div>
				<div class="block"><div class="meta">再利用機構</div><div class="value">${vendor.isReuseOrg ? '是' : '否'}</div></div>
				<div class="block"><div class="meta">距離</div><div class="value">${escapeHtml(vendor.distance)} km</div></div>
				<div class="block"><div class="meta">再生產品</div><div class="value">${escapeHtml(vendor.product)}</div></div>
				<div class="block"><div class="meta">最大再利用量</div><div class="value">${escapeHtml(vendor.capacity)} 噸/月</div></div>
				<div class="block"><div class="meta">事業管制編號</div><div class="value">${escapeHtml(vendor.controlNo)}</div></div>
			</div>

			<h2>再利用技術</h2>
			<p>${escapeHtml(vendor.reuseTech)}</p>

			<h2>允收標準</h2>
			<div>${tags(vendor.acceptance_standard)}</div>

			<h2>製程單元</h2>
			<div>${tags(vendor.processUnits)}</div>

			<h2>品質標準</h2>
			<div>${tags(vendor.qualityStandards)}</div>

			<h2>產品銷售對象產業類別</h2>
			<div>${tags(vendor.salesTargetIndustries)}</div>

			<h2>聯絡資訊</h2>
			<p><strong>連絡電話：</strong>${escapeHtml(vendor.contactPhone)}</p>
			<p><strong>工廠地址：</strong>${escapeHtml(vendor.factoryAddress)}</p>
		</body>
		</html>
	`)
	printWindow.document.close()
	printWindow.focus()
	setTimeout(() => {
		printWindow.print()
	}, 200)
}

// 說明：由匯出操作觸發；輸出目前模式與廠商排序的完整報告。
const exportFullReportPdf = () => {
	const printWindow = window.open('', '_blank', 'width=1080,height=760')
	if (!printWindow) {
		ElMessage.warning('無法開啟匯出視窗，請確認瀏覽器未封鎖彈出視窗')
		return
	}

	const modeName = escapeHtml(selectedMode.value?.modeName || '未設定')
	const modeTitle = escapeHtml(selectedMode.value?.title || '未設定')
	const modeSummary = escapeHtml(selectedMode.value?.summary || '未設定')
	const summaryRows = visibleDemandSummary.value
		.map((item) => `<tr><th>${escapeHtml(item.label)}</th><td>${escapeHtml(item.value)}</td></tr>`)
		.join('')

	const vendorRows = sortedVendors.value
		.map((vendor, index) => `
			<tr>
				<td>${index + 1}</td>
				<td>${escapeHtml(vendor.company_name || vendor.name || '')}</td>
				<td>${escapeHtml(vendor.region || vendor.location || '')}</td>
				<td>${escapeHtml(vendor.waste_name || '')}</td>
				<td>${escapeHtml(vendor.product || '')}</td>
				<td>${escapeHtml(vendor.permitted_quantity || vendor.capacity || '')}</td>
				<td>${escapeHtml(vendor.control_number || vendor.controlNo || '')}</td>
			</tr>
		`).join('')

	printWindow.document.write(`
		<!doctype html>
		<html lang="zh-Hant">
		<head>
			<meta charset="UTF-8" />
			<title>技術決策完整報告</title>
			<style>
				body{font-family:Segoe UI,Microsoft JhengHei,sans-serif;color:#1f2d3d;margin:24px;line-height:1.6;}
				h1{margin:0 0 6px;font-size:28px;color:#1f4d47;}
				h2{margin:20px 0 8px;font-size:18px;color:#2b5876;border-bottom:1px solid #dfe9f3;padding-bottom:4px;}
				p{margin:4px 0;}
				table{width:100%;border-collapse:collapse;table-layout:fixed;}
				th,td{border:1px solid #dbe8f3;padding:8px 10px;font-size:13px;word-break:break-word;vertical-align:top;}
				th{background:#f5f9fc;text-align:left;color:#355b78;}
				.summary th{width:170px;}
				.meta{color:#5b7890;font-size:13px;}
				@media print { body { margin: 12mm; } }
			</style>
		</head>
		<body>
			<h1>技術決策完整報告</h1>
			<p class="meta">匯出時間：${escapeHtml(new Date().toLocaleString('zh-TW'))}</p>

			<h2>推薦循環模式</h2>
			<p><strong>${modeName}</strong>｜${modeTitle}</p>
			<p>${modeSummary}</p>

			<h2>決策需求摘要</h2>
			<table class="summary">
				<tbody>${summaryRows || '<tr><th>摘要</th><td>無可匯出資料</td></tr>'}</tbody>
			</table>

			<h2>推薦廠商清單（依目前排序）</h2>
			<table>
				<thead>
					<tr>
						<th style="width:48px;">排名</th>
						<th>廠商名稱</th>
						<th style="width:110px;">所在地</th>
						<th>再利用廢棄物</th>
						<th>再生產品</th>
						<th style="width:120px;">許可總量</th>
						<th style="width:140px;">事業管制編號</th>
					</tr>
				</thead>
				<tbody>${vendorRows || '<tr><td colspan="7">目前無廠商資料</td></tr>'}</tbody>
			</table>
		</body>
		</html>
	`)

	printWindow.document.close()
	printWindow.focus()
	setTimeout(() => {
		printWindow.print()
	}, 200)
}

// 說明：由導覽按鈕觸發；切換路由或流程步驟狀態。
const goPrevious = () => {
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

.technology-match-page {
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

/* ─── 頁頭 ─── */
.page-header {
	padding: 24px 24px;

	.header-row {
		text-align: left;

		h1 {
			margin: 0;
			font-size: clamp(36px, 3.2vw, 68px);
			font-weight: 700;
			color: $text-primary;
		}

		.hero-title-accent {
			color: $primary-green;
		}

		.hero-title-accent-secondary {
			color: $secondary-cyan;
		}

		p {
			margin: 3px 0 0;
			font-size: clamp(24px, 0.898rem + 0.49vw, 36px);
			color: $text-secondary;
			font-weight: 600;
		}
	}
}

.back-btn {
	color: #5d7772;
	font-size: 14px;
}

.header-title {
	text-align: left;

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

.page-shell {
	// max-width: min(94vw, 1480px);
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 18px;
}

.suppliers-panel {
	overflow: hidden;
}

.panel-card {
	padding: 22px;
	border-radius: 22px;
	border: 1px solid rgba(255, 255, 255, 0.86);
	background: rgba($bg-primary, 0.8);
	backdrop-filter: blur(16px);
	box-shadow: 0 14px 34px rgba(47, 91, 114, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.84);
}

.summary-mode-row {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	gap: 0;
	align-items: start;
	padding: 24px 28px;
}

.panel-divider {
	width: 1px;
	align-self: stretch;
	background: linear-gradient(to bottom,
			transparent,
			rgba(120, 190, 180, 0.35) 20%,
			rgba(120, 190, 180, 0.35) 80%,
			transparent);
	margin: 0 28px;
}

.summary-panel-inner {
	.summary-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}
}

.mode-panel-inner {
	.mode-explain-link {
		margin-left: auto;
		align-self: center;
		display: inline-flex;
		margin-top: 0;
		margin-bottom: 0;
		font-size: 16px;
		color: #3a8fd8;
		cursor: pointer;
		white-space: nowrap;

		&:hover {
			text-decoration: underline;
		}
	}

	.mode-title-row {
		margin-bottom: 16px;

		h3 {
			font-size: 18px;
		}
	}



}

/* 流程圖 */
.flow-diagram {
	display: flex;
	align-items: center;
	gap: 8px;
	flex-wrap: wrap;
	margin: 16px 0px;
	min-height: 82px;

	.flow-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;

		.flow-icon {
			width: 50px;
			height: 50px;
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
		font-size: 18px;
		margin-bottom: 18px;
		flex-shrink: 0;
	}
}

// 響應式：小螢幕堆疊
@media (max-width: 900px) {
	.summary-mode-row {
		grid-template-columns: 1fr;
	}

	.panel-divider {
		width: auto;
		height: 1px;
		margin: 16px 0;
		background: linear-gradient(to right,
				transparent,
				rgba(120, 190, 180, 0.35) 20%,
				rgba(120, 190, 180, 0.35) 80%,
				transparent);
	}
}

.section-header {
	display: flex;
	align-items: flex-start;
	gap: 14px;
	margin-bottom: 18px;

	h2 {
		margin: 0;
		font-size: clamp(20px, 1.8vw, 28px);
		color: #174b45;
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

.ai-icon.small {
	width: 20px;
	height: 20px;
	font-size: 12px;
	border-radius: 8px;
	display: inline-flex;
	vertical-align: middle;
}

.summary-grid {
	display: grid;
	grid-template-columns: repeat(5, minmax(0, 1fr));
	gap: 12px;
}

.summary-item {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 10px 12px;
	border-radius: 14px;
	background: rgba(244, 251, 250, 0.9);
	border: 1px solid rgba(162, 210, 199, 0.35);
}

.summary-icon {
	width: 30px;
	height: 30px;
	border-radius: 50%;
	display: grid;
	place-items: center;
	font-size: 14px;
	font-weight: 700;
	color: #166e63;
	background: linear-gradient(145deg, rgba(58, 196, 167, 0.28), rgba(137, 226, 207, 0.2));
}

.summary-label,
.summary-value {
	margin: 0;
}

.summary-label {
	font-size: 15px;
	color: #5f7976;
}

.summary-value {
	margin-top: 2px;
	font-size: 15px;
	font-weight: 600;
	color: #244f4a;
	line-height: 1.4;
}

.mode-panel {
	position: relative;
	overflow: hidden;
	border: 1px solid rgba(120, 171, 255, 0.36);
	background:
		radial-gradient(circle at 8% 18%, rgba(99, 214, 255, 0.2), transparent 30%),
		radial-gradient(circle at 88% 10%, rgba(151, 110, 255, 0.18), transparent 30%),
		radial-gradient(circle at 70% 86%, rgba(98, 230, 170, 0.18), transparent 34%),
		linear-gradient(145deg, rgba(245, 250, 255, 0.95), rgba(236, 244, 255, 0.88));
}

.mode-ai-icon {
	background: linear-gradient(135deg, #ff9800, #ff5e7a);
}

.mode-title-row {
	display: flex;
	align-items: center;
	gap: 12px;

	h3 {
		margin: 0;
		font-size: 22px;
		color: #1f4f49;
	}

	.mode-badge {
		white-space: nowrap; // ← 加這行
		flex-shrink: 0;
		padding: 6px 14px;
		border-radius: 999px;
		font-size: 15px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: #0f4f9f;
		background: linear-gradient(135deg, rgba(122, 206, 255, 0.4), rgba(178, 149, 255, 0.38));
		border: 1px solid rgba(118, 139, 246, 0.46);
		box-shadow: 0 6px 16px rgba(91, 124, 245, 0.18);
	}
}


.mode-desc {
	margin: 10px 0 16px;
	color: #4a6784;
	font-size: 14px;
	line-height: 1.7;
}

.matching-method {
	display: flex;
	flex: 1;
	flex-direction: column;
	font-size: 22px;
	font-weight: 600;

	.match-description {
		font-size: 18px;
		color: #858585;
	}
}

.flow-node {
	position: relative;
	text-align: center;
	padding: 14px 10px;
	border-radius: 16px;
	background: linear-gradient(160deg, rgba(255, 255, 255, 0.94), rgba(240, 250, 255, 0.86));
	border: 1px solid rgba(139, 187, 255, 0.38);
	box-shadow: 0 10px 20px rgba(66, 122, 190, 0.1);
}

.node-icon {
	width: 40px;
	height: 40px;
	margin: 0 auto 8px;
	border-radius: 50%;
	display: grid;
	place-items: center;
	font-size: 14px;
	font-weight: 700;
	color: #fff;
	background: linear-gradient(135deg, #42a5f5, #5c6ef0);
	box-shadow: 0 8px 14px rgba(80, 116, 232, 0.28);
}

.flow-node:nth-child(2) .node-icon {
	background: linear-gradient(135deg, #4db6ac, #26a69a);
}

.flow-node:nth-child(3) .node-icon {
	background: linear-gradient(135deg, #66bb6a, #43a047);
}

.flow-node:nth-child(4) .node-icon {
	background: linear-gradient(135deg, #ab47bc, #7e57c2);
}

.node-title {
	margin: 0;
	font-size: 14px;
	font-weight: 700;
	color: #204f65;
}

.node-sub {
	margin: 4px 0 0;
	font-size: 12px;
	color: #5f7691;
}



.mode-tags {
	margin-top: 14px;
	display: flex;
	flex-wrap: wrap;
	gap: 8px;

	span {
		padding: 4px 10px;
		font-size: 12px;
		border-radius: 999px;
		color: #2b6d64;
		background: rgba(203, 243, 235, 0.7);
		border: 1px solid rgba(84, 178, 157, 0.2);
	}
}

.suppliers-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	gap: 12px;
	margin-bottom: 14px;
}

.alt-nav-actions {
	display: inline-flex;
	align-items: center;
	gap: 10px;
}

.alt-nav-page {
	font-size: 14px;
	font-weight: 700;
	color: #4f6f81;
	min-width: 68px;
	text-align: center;
}

.alternative-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 14px;
}

.alternative-card {
	padding: 14px;
	border-radius: 14px;
	border: 1px solid rgba(163, 206, 220, 0.35);
	background: #FFF;
	// box-shadow: 0 10px 18px rgba(66, 122, 190, 0.08);

	&:hover {
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}
}

.alternative-top {
	display: flex;
	align-items: center;
	gap: 10px;

	h3 {
		margin: 0;
		font-size: 18px;
		font-weight: 700;
		color: #1f4f49;
	}
}

.alternative-badge {
	padding: 5px 12px;
	border-radius: 999px;
	font-size: 15px;
	font-weight: 700;
	color: #fff;
	white-space: nowrap;
}

.alternative-summary {
	margin: 10px 0 6px;
	font-size: 16px;
	line-height: 1.7;
	color: #496b79;
}

.alternative-meta-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 10px;
	margin: 8px 0 2px;
}

.alternative-vendor-count {
	font-size: 16px;
	font-weight: 700;
	color: #2b6d64;

	.vendor-count {
		font-size: 36px;
		padding: 10px;
	}
}

.alternative-switch-btn {
	border: 1px solid $primary-green;
	font-weight: 700;
	background: #FFF;
	color: $primary-green;

	&:hover,
	&:focus {
		background: linear-gradient(135deg, #58b85c, #30b3a8);
		color: #fff;
	}
}

.alt-flow-diagram {
	margin: 8px 0 0;
	min-height: 64px;
}

.alternative-empty {
	padding: 18px;
	border-radius: 12px;
	text-align: center;
	font-size: 15px;
	font-weight: 600;
	color: #5d7a86;
	background: rgba(245, 251, 255, 0.9);
	border: 1px dashed rgba(156, 191, 206, 0.5);
}

.suppliers-title {
	margin-bottom: 0;
}

.sort-controls {
	display: flex;
	gap: 8px;
	align-items: center;
	flex-wrap: wrap;
}

.sort-select {
	width: 200px;
}

.region-select {
	width: 220px;
}

.supplier-list {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.supplier-card {
	display: flex;
	flex-direction: row;
	background: #fff;
	border: 1px solid #e8e8e8;
	border-radius: 12px;
	overflow: hidden;
	cursor: pointer;
	transition: box-shadow 0.2s;
	position: relative;

	// gap: 10px 10px;
	&:hover {
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	// ── 左側 ──────────────────────────────────
	.card-left {
		position: relative;
		flex-shrink: 0;
		width: 200px;

		.rank-badge {
			position: absolute;
			top: 8px;
			left: 8px;
			z-index: 1;
			width: 28px;
			height: 28px;
			border-radius: 50%;
			background: #f5a623;
			color: #fff;
			font-weight: bold;
			font-size: 14px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.supplier-photo {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
		}
	}

	// ── 右側 ──────────────────────────────────
	.supplier-main {
		flex: 1;
		padding: 14px 18px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}

	// 標籤列
	.card-tags {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;

		.meta-chip {
			padding: 2px 10px;
			border-radius: 12px;
			font-size: 15px;
			font-weight: 700;

			&.ann_category {
				background: #e8f4ff;
				color: #1a73e8;
			}

			&.ann_reuse {
				background: #e8fff0;
				color: #1aaa5c;
			}
		}
	}

	// 名稱行 + 前月收受能力
	.card-header-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;

		.name-match {
			h3 {
				font-size: 18px;
				font-weight: 600;
				margin: 0 0 4px;
				color: #1a1a1a;
			}

		}

		// 前月收受能力
		.capacity-indicator {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 4px;
			flex-shrink: 0;

			.capacity-label {
				font-size: 15px;
				font-weight: 700;
				color: #888;
				white-space: nowrap;
			}




		}
	}

	// Meta 資訊 3欄
	.meta-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0px 20px;
		min-height: 130px;

		.meta-item {
			display: flex;
			align-items: flex-start;
			gap: 6px;

			.meta-icon {
				color: #26a69a;
				margin-top: 2px;
				flex-shrink: 0;
			}

			.meta-title {
				font-size: 15px;
				font-weight: 700;
				color: #26a69a;
				margin: 0;
			}

			.meta-text {
				font-size: 16px;
				font-weight: 700;
				color: #333;
				margin: 0;
				font-weight: 500;
			}

			.capacity-dots {
				display: flex;
				align-items: center;

				.dots-container {
					gap: 4px;
					padding: 4px 10px;
					border: 1px solid #c7ccd3;
					border-radius: 50px;
					display: flex;
					align-items: center;

					.dot {
						width: 13px;
						height: 13px;
						border-radius: 50%;

						&.active {
							&.green {
								background: #2ecc71;
							}

							&.yellow {
								background: #f5a623;
							}

							&.red {
								background: #e74c3c;
							}
						}


						&.inactive {
							background: #e0e0e0;
						}
					}
				}

				.capacity-text {
					font-size: 16px;
					color: #333;
					font-weight: 500;
					margin-left: 6px;
				}
			}
		}
	}

	// 底部：適合原因 + 按鈕
	.card-footer {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: space-between;
		margin-top: auto;
		padding-top: 8px;
		border-top: 1px solid #f0f0f0;

		.reason-label {
			font-size: 15px;
			color: #888;
		}

		.footer-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			width: 100%;

			.reason-block {
				display: flex;
				flex-wrap: wrap;
				gap: 6px;

				.reason-chip {
					padding: 2px 15px;
					background: #faedb5;
					border-radius: 12px;
					font-size: 14px;
					font-weight: 700;
					color: #c78305;
					margin-right: 3px;
				}
			}
		}

	}
}

.pagination-wrap {
	margin-top: 16px;
	display: flex;
	justify-content: flex-end;
}

.vendor-detail-dialog {
	:deep(.el-dialog) {
		border-radius: 24px;
		overflow: hidden;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(242, 248, 255, 0.96));
		border: 1px solid rgba(255, 255, 255, 0.82);
		box-shadow: 0 30px 80px rgba(34, 72, 102, 0.24);
	}

	:deep(.el-dialog__header) {
		padding: 0;
		margin: 0;
	}

	:deep(.el-dialog__body) {
		padding: 0;
	}
}

.dialog-top-header {
	display: flex;
	justify-content: stretch;
	gap: 0;
	padding: 22px 24px 18px;
	background:
		radial-gradient(circle at 10% 0%, rgba(87, 166, 255, 0.18), transparent 28%),
		radial-gradient(circle at 92% 16%, rgba(92, 114, 255, 0.16), transparent 30%),
		linear-gradient(135deg, rgba(248, 252, 255, 0.96), rgba(235, 246, 255, 0.92));
	border-bottom: 1px solid rgba(179, 208, 233, 0.28);
	border-radius: 20px;


	h3 {
		margin: 6px 0 6px;
		font-size: 28px;
		color: #183e61;
	}
}

.top-header-main {
	display: grid;
	grid-template-columns: minmax(340px, 1fr) minmax(320px, 0.95fr);
	gap: 18px;
	width: 100%;
}

.top-left-copy {
	min-width: 0;
}

.vendor-tag {
	display: inline-flex;
	padding: 4px 15px;
	font-size: 16px;
	line-height: 1;
	border-radius: 999px;
	font-weight: 700;
	color: #2f9e44;
	background: rgba(199, 247, 213, 0.7);
}


.rating-row {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	margin: 0 0 8px;
}

.stars {
	font-size: 16px;
	letter-spacing: 1px;
	color: #f5b400;
	line-height: 1;
}

.ai-match-label {
	font-size: 18px;
	font-weight: 600;
	color: #5d6f85;
}

.ai-match-value {
	font-size: 34px;
	font-weight: 800;
	line-height: 1;
	color: #1aa65a;
}

.dialog-kicker {
	margin: 0;
	font-size: 13px;
	font-weight: 700;
	color: #2f9e44;
}

.dialog-specialty {
	margin: 2px 0 0;
	font-size: 14px;
	color: #536a83;
	line-height: 1.7;
}

.top-right-media {
	display: flex;
	flex-direction: column;
	gap: 10px;
}


.thumb-row {
	display: flex;
	align-items: center;
	gap: 8px;
}

.thumb-item {
	width: 52px;
	height: 36px;
	border-radius: 8px;
	overflow: hidden;
	border: 1px solid rgba(169, 188, 210, 0.5);
	opacity: 0.5;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	&.active {
		opacity: 1;
		border-color: rgba(67, 125, 201, 0.64);
		box-shadow: 0 4px 12px rgba(72, 126, 194, 0.24);
	}
}

.dialog-close-btn {
	color: #3f78d8;
}

.dialog-body-v2 {
	padding: 22px 24px 24px;
	display: flex;
	flex-direction: column;
}

.dialog-hero-image {
	width: 100%;
	height: 220px;
	object-fit: cover;
	border-radius: 18px;
	border: 1px solid rgba(136, 181, 213, 0.3);
	box-shadow: 0 12px 28px rgba(66, 122, 190, 0.12);
}

.top-metrics-row {
	margin-bottom: 14px;
	align-items: stretch; // 讓每個 el-col 等高

	:deep(.el-col) {
		margin-bottom: 12px;
		display: flex; // 讓 el-col 內部的 hero-stat 也能撐滿
	}
}

.hero-stat {
	width: 100%; // ← 補上這行,解決寬度不一致
	height: 100%; // ← 補上這行,讓卡片撐滿被拉高的 el-col
	padding: 12px 14px;
	border-radius: 16px;
	background: #FFF;
	border: 1px solid rgba(154, 196, 231, 0.35);
	display: flex;
	flex-direction: column;
	gap: 4px;
	box-shadow: 0 8px 18px rgba(70, 110, 150, 0.08);

	.hero-stat-head {
		display: flex;
		align-items: center;
		gap: 6px;

		span {
			display: block;
			font-size: 15px;
			font-weight: 600;
			color: #5f7892;
			margin-bottom: 0;
		}
	}

	.stat-icon {
		color: #26a69a;
		font-size: 18px;
		font-weight: 700;
	}

	strong {
		font-size: 16px;
		color: #193e62;
		line-height: 1.4;
	}
}

.detail-grid-v2 {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 14px;
}

.detail-card {
	padding: 14px 16px;
	border-radius: 18px;
	background: linear-gradient(160deg, rgba(255, 255, 255, 0.94), rgba(241, 248, 255, 0.9));
	border: 1px solid rgba(168, 201, 231, 0.28);
	box-shadow: 0 8px 18px rgba(70, 110, 150, 0.08);
}

.wide-card,
.contact-card {
	grid-column: 1 / -1;
}

.detail-title {
	margin: 0 0 10px;
	font-size: 17px;
	font-weight: 800;
	color: #2b5876;
	letter-spacing: 0.05em;
}

.detail-text {
	margin: 0;
	font-size: 15px;
	line-height: 1.8;
	color: #3e5e7d;
}

.condition-list {
	margin: 0;
	padding-left: 18px;
	display: grid;
	gap: 8px;

	li {
		font-size: 15px;
		font-weight: 500;
		color: #3e5e7d;
		line-height: 1.5;
	}
}

.capacity-panel {
	display: flex;
	flex-direction: column;
	gap: 10px;

	.capacity-dots {
		display: flex;
		align-items: center;

		.dots-container {
			gap: 4px;
			padding: 4px 10px;
			border: 1px solid #c7ccd3;
			border-radius: 50px;
			display: flex;
			align-items: center;

			.dot {
				width: 13px;
				height: 13px;
				border-radius: 50%;

				&.active {
					&.green {
						background: #2ecc71;
					}

					&.yellow {
						background: #f5a623;
					}

					&.red {
						background: #e74c3c;
					}
				}

				&.inactive {
					background: #e0e0e0;
				}
			}
		}

		.capacity-text {
			font-size: 16px;
			color: #333;
			font-weight: 500;
			margin-left: 6px;
		}
	}
}

.capacity-note {
	margin: 0;
	font-size: 15px;
	color: #3e7a47;
}

.tag-wrap {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.detail-tag {
	padding: 2px 10px;
	border-radius: 999px;
	font-size: 15px;
	font-weight: 700;
	color: #1d6b5d;
	background: rgba(205, 245, 236, 0.78);
	border: 1px solid rgba(101, 190, 168, 0.28);
}

.detail-tag.blue {
	color: #1f5f9a;
	background: rgba(216, 236, 255, 0.84);
	border-color: rgba(104, 162, 230, 0.28);
}

.detail-tag.purple {
	color: #6e4fb2;
	background: rgba(236, 226, 255, 0.84);
	border-color: rgba(155, 126, 220, 0.28);
}

.detail-tag.green {
	color: #2b7b4f;
	background: rgba(225, 250, 232, 0.84);
	border-color: rgba(103, 184, 129, 0.28);
}

.detail-tag.yellow {
	color: #f5a623;
	background: rgba(255, 245, 204, 0.84);
	border-color: rgba(245, 190, 72, 0.28);
}

.contact-card {
	display: grid;
	gap: 12px;
}

.contact-row {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12px;
}

.contact-item {
	display: flex;
	justify-content: space-between;
	gap: 12px;
	padding: 12px 14px;
	border-radius: 14px;
	background: rgba(246, 250, 255, 0.96);
	border: 1px solid rgba(161, 198, 229, 0.28);

	span {
		font-size: 15px;
		font-weight: 700;
		color: #5d7994;
	}

	strong {
		font-size: 15px;
		color: #1e476b;
		text-align: right;
	}
}

.dialog-actions {
	margin-top: 16px;
	display: flex;
	justify-content: flex-end;
	gap: 10px;
}

.pdf-export-btn {
	background: linear-gradient(135deg, #2f80ed, #56ccf2);
	border: none;
	font-weight: 700;

	&:hover {
		background: linear-gradient(135deg, #1f6fd8, #40b8e8);
	}
}

.contact-vendor-btn {
	font-weight: 700;
}


.detail-btn {
	flex-shrink: 0;
	padding: 5px 12px;
	border: 1.5px solid #1a73e8;
	border-radius: 8px;
	background: #fff;
	color: #1a73e8;
	font-size: 15px;
	font-weight: 500;
	cursor: pointer;
	transition: background 0.2s, color 0.2s;
	margin-left: auto;

	&:hover {
		background: #1a73e8;
		color: #fff;
	}
}

.export-btn {
	// align-self: flex-end;
	margin-top: auto;
	float: right;
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

@media (max-width: 1200px) {
	.summary-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}



	.supplier-card {
		.card-left {
			width: 170px;
		}

		.supplier-main {
			padding: 12px 14px;
		}

		.meta-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 8px 12px;
			min-height: auto;
		}
	}

	.top-header-main {
		grid-template-columns: 1fr;
	}
}

@media (max-width: 768px) {
	.technology-match-page {
		padding: 18px 12px 88px;
		min-height: auto;

		&::before {
			height: min(860px, 140vh);
			background: url('../assets/Bg_mobile.png') center top / 100% auto no-repeat;
			mask-image: linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.45) 20%, #000 44%);
			-webkit-mask-image: linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.45) 20%, #000 44%);
		}

		&::after {
			height: min(520px, 75vh);
			background-size: 180% auto;
			background-position: center bottom;
		}
	}

	.page-header {
		padding: 8px 8px 2px;

		.header-row {
			margin-top: 18px;
			text-align: left;
		}
	}

	.header-title {
		text-align: center;

		h1 {
			font-size: clamp(24px, 7.4vw, 34px);
			line-height: 1.2;
		}

		p {
			font-size: 20px;
		}
	}

	.page-shell {
		max-width: 100%;
		gap: 14px;
	}

	.panel-card {
		padding: 14px;
		border-radius: 16px;
	}

	.section-header,
	.suppliers-header {
		flex-direction: column;
	}

	.section-header {
		flex-direction: row;
		align-items: center;
		gap: 12px;

		h2 {
			white-space: nowrap;
		}
	}

	.summary-mode-row {
		padding: 14px;
	}

	.summary-grid,

	.detail-grid-v2 {
		grid-template-columns: 1fr;
	}

	.summary-item {
		padding: 10px;
	}

	.contact-row {
		grid-template-columns: 1fr;
	}

	.rating-row {
		flex-wrap: wrap;
		gap: 6px 10px;
	}

	.ai-match-value {
		font-size: 26px;
	}

	.mode-title-row {
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;

		h3 {
			font-size: 18px;
		}
	}

	.sort-select {
		width: 100%;
	}

	.alt-nav-actions {
		width: 100%;
		justify-content: flex-end;
	}

	.alternative-grid {
		grid-template-columns: 1fr;
	}

	.alternative-meta-row {
		flex-direction: column;
		align-items: stretch;

		.alternative-switch-btn {
			width: 100%;
		}
	}

	.supplier-card {
		flex-direction: column;

		.card-left {
			width: 100%;
			height: 180px;
		}

		.supplier-main {
			padding: 12px;
			gap: 10px;
		}

		.meta-grid {
			grid-template-columns: 1fr;
			gap: 8px;
			min-height: auto;
		}

		.card-footer {
			padding-top: 10px;

			.footer-row {
				flex-direction: column;
				align-items: stretch;
			}

			.detail-btn {
				width: 100%;
				margin-left: 0;
			}
		}
	}

	.supplier-photo {
		height: 180px;
	}

	.supplier-meta {
		grid-template-columns: 1fr;
	}

	.pagination-wrap {
		justify-content: center;
	}

	.vendor-detail-dialog {
		:deep(.el-dialog) {
			width: calc(100vw - 16px) !important;
			margin: 8px auto;
			max-height: calc(100vh - 16px);
		}

		:deep(.el-dialog__body) {
			max-height: calc(100vh - 112px);
			overflow-y: auto;
		}
	}

	.dialog-top-header {
		padding: 14px 12px;

		h3 {
			font-size: 24px;
			line-height: 1.3;
		}
	}

	.top-header-main {
		gap: 12px;
	}

	.top-right-media {
		order: -1;
	}

	.dialog-hero-image {
		height: 180px;
		border-radius: 14px;
	}

	.dialog-body-v2 {
		padding: 14px 12px 16px;
	}

	.top-metrics-row {
		margin-bottom: 8px;
	}

	.hero-stat {
		padding: 10px;
		border-radius: 12px;

		.hero-stat-head {
			span {
				font-size: 13px;
			}
		}

		strong {
			font-size: 14px;
		}
	}

	.detail-card {
		padding: 12px;
		border-radius: 12px;
	}

	.detail-title {
		font-size: 15px;
	}

	.detail-text,
	.condition-list li,
	.capacity-note,
	.detail-tag,
	.contact-item span,
	.contact-item strong {
		font-size: 13px;
	}

	.dialog-actions {
		position: sticky;
		bottom: 0;
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(6px);
		padding-top: 10px;
		padding-bottom: 2px;
		justify-content: stretch;
		gap: 8px;

		:deep(.el-button) {
			flex: 1;
			margin: 0;
		}
	}

	.contact-item {
		flex-direction: column;
		align-items: flex-start;

		strong {
			text-align: left;
		}
	}

	.actions {
		flex-direction: column;
		gap: 10px;
		justify-content: flex-start;

		:deep(.el-button) {
			width: 100%;
			margin: 0;
		}
	}
}
</style>
