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
						<p>技術媒合</p>
					</div>
				</el-col>
			</el-row>
		</div>

		<div class="page-shell" style="padding: 24px;">
			<FlowStepProgress :active-step="3" />

			<div v-if="!isQuickMode" class="summary-mode-row panel-card">
				<!-- 左：媒合需求摘要 -->
				<section class="summary-panel-inner">
					<div class="section-header">
						<div class="ai-icon"><el-icon>
								<Monitor />
							</el-icon></div>
						<h2>媒合需求摘要</h2>
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
					<!-- <div class="mode-flow">
						<div v-for="(node, index) in modeFlow" :key="node.title" class="flow-node">
							<div class="node-icon">
								<el-icon>
									<component :is="node.icon" />
								</el-icon></div>
							<p class="node-title">{{ node.title }}</p>
							<span v-if="index < modeFlow.length - 1" class="flow-arrow">→</span>
						</div>
					</div> -->
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
						<h2>媒合結果推薦</h2>
					</div>
					<el-select v-model="sortType" class="sort-select" placeholder="排序條件">
						<el-option label="綜合排序" value="overall" />
						<el-option label="依距離" value="distance" />
						<el-option label="依再利用量" value="capacity" />
					</el-select>
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
										<span class="meta-chip ann_category">{{ vendor.category }}</span>
										<span v-if="vendor.isReuseOrg && vendor.category !== '再利用機構'" class="meta-chip ann_reuse">再利用機構</span>
									</div>

									<!-- 名稱 +  前月收受能力 -->
									<div class="card-header-row">
										<div class="name-match">
											<h3>{{ vendor.name }}</h3>

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
												<p class="meta-text">{{ vendor.wasteReuse }}</p>
											</div>
										</div>
										<div class="meta-item">
											<span class="meta-icon"><el-icon>
													<Location />
												</el-icon></span>
											<div>
												<p class="meta-title">所在地</p>
												<p class="meta-text">{{ vendor.location }}</p>
											</div>
										</div>
										<div class="meta-item">
											<span class="meta-icon"><el-icon>
													<Position />
												</el-icon></span>
											<div>
												<p class="meta-title">距離</p>
												<p class="meta-text">{{ vendor.distance }} km</p>
											</div>
										</div>
										<div class="meta-item">
											<span class="meta-icon"><el-icon>
													<Box />
												</el-icon></span>
											<div>
												<p class="meta-title">再生產品</p>
												<p class="meta-text">{{ vendor.product }}</p>
											</div>
										</div>
										<div class="meta-item">
											<span class="meta-icon"><el-icon>
													<Box />
												</el-icon></span>
											<div>
												<p class="meta-title">許可總量</p>
												<p class="meta-text">{{ vendor.capacity }} 噸/月</p>
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
													<span class="capacity-text">{{ vendor.capacityLevelText }}</span>
												</div>

											</div>
										</div>
										<div class="meta-item">
											<span class="meta-icon"><el-icon>
													<Box />
												</el-icon></span>
											<div>
												<p class="meta-title">事業管制編號</p>
												<p class="meta-text">{{ vendor.controlNo }}</p>
											</div>
										</div>
										<div class="meta-item">
											<span class="meta-icon"><el-icon>
													<Box />
												</el-icon></span>
											<div>
												<p class="meta-title">有效許可期限</p>
												<p class="meta-text">{{ vendor.validityPeriod }}</p>
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
							<span class="alternative-vendor-count">推薦廠商數<span class="vendor-count">{{ getRecommendedVendorCount(path.modeName) }} </span>家</span>
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
								<h3>{{ activeVendor.name }}</h3>
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
								<strong>{{ activeVendor.location }}</strong>
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
								<strong>{{ activeVendor.product }}</strong>
							</div>
						</el-col>
						<el-col :xs="12" :sm="8" :md="4" :lg="4" :xl="4">
							<div class="hero-stat">
								<div class="hero-stat-head"><el-icon class="stat-icon">
										<DataAnalysis />
									</el-icon><span>許可總量</span></div>
								<strong>{{ activeVendor.capacity }} 噸/月</strong>
							</div>
						</el-col>
						<el-col :xs="12" :sm="8" :md="4" :lg="4" :xl="4">
							<div class="hero-stat">
								<div class="hero-stat-head"><el-icon class="stat-icon">
										<Finished />
									</el-icon><span>有效許可期限</span></div>
								<strong>{{ activeVendor.validityPeriod }}</strong>
							</div>
						</el-col>
						<el-col :xs="12" :sm="8" :md="4" :lg="4" :xl="4">
							<div class="hero-stat">
								<div class="hero-stat-head"><el-icon class="stat-icon">
										<Files />
									</el-icon><span>事業管制編號</span></div>
								<strong>{{ activeVendor.controlNo }}</strong>
							</div>
						</el-col>
					</el-row>

					<div class="detail-grid-v2">
						<section class="detail-card">
							<p class="detail-title">允收條件</p>
							<el-divider />
							<ul class="condition-list">
								<li v-for="item in activeVendor.acceptanceStandards" :key="item">{{ item }}</li>
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
									<span class="capacity-text">{{ activeVendor.capacityLevelText }}</span>
								</div>
								<p class="capacity-note">（{{ activeVendor.capacityLevelText }}）收受能力充足，可立即媒合合作。</p>
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
							<p class="detail-text">綜合評估各项條件與技術可行性,建議優先採用「{{ selectedMode.modeName }}」,並與「{{ activeVendor.name }}」合作,可兼顧資源再利用效益、處理量能與環境價值,具備良好執行可行性。</p>
						</section>



						<section class="detail-card contact-card wide-card">
							<p class="detail-title">聯絡資訊</p>
							<div class="contact-row">
								<div class="contact-item"><span>聯絡電話</span><strong>{{ activeVendor.contactPhone }}</strong></div>
								<div class="contact-item"><span>工廠地址</span><strong>{{ activeVendor.factoryAddress }}</strong></div>
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
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import CirculationModal from '@/components/CirculationModal.vue'
import circulationModesData from '@/data/circulationModes.json'
import {
	ArrowLeft, ArrowRight, Monitor,
	Connection, DataAnalysis, Files, Finished,
	Goods, Location, Money, Operation, Promotion, SetUp
} from '@element-plus/icons-vue'
import FlowStepProgress from '@/components/condition-setup/FlowStepProgress.vue'
import { useConditionSetupStore } from '@/stores/conditionSetup'

const router = useRouter()
const route = useRoute()
const isQuickMode = computed(() => route.query.mode === 'quick')// 模式判斷
console.log('isQuickMode', isQuickMode.value)
const conditionStore = useConditionSetupStore()

const sortType = ref('overall')
const currentPage = ref(1)
const pageSize = 4
const detailDialogVisible = ref(false)
const activeVendor = ref(null)
const modeDialogVisible = ref(false)

const industryLabelMap = {
	semiconductor: '電子與半導體',
	steel: '鋼鐵冶金',
	chemical: '化工製程',
	food: '食品加工'
}

// 說明：將輸入資料標準化為系統格式，供媒合與查詢流程使用。
const extractCountyCity = (address = '') => {
	const text = String(address || '')
	if (!text) return ''
	const match = text.match(/(基隆市|台北市|新北市|桃園市|新竹市|新竹縣|苗栗縣|台中市|彰化縣|南投縣|雲林縣|嘉義市|嘉義縣|台南市|高雄市|屏東縣|宜蘭縣|花蓮縣|台東縣|澎湖縣|金門縣|連江縣)/)
	return match ? match[1] : text
}

// 說明：將輸入資料標準化為系統格式，供媒合與查詢流程使用。
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

	const productText = sourceConditions.process || businessConditions.recycledProductDemand || '未設定'
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
		{ icon: 'Location', label: '所在地區', value: regionText },
		{ icon: 'DataAnalysis', label: '允收條件', value: acceptanceText },
		{ icon: 'Goods', label: '再生產品項目', value: productText },
		{ icon: 'Van', label: '每月需求量', value: amountText },
		{ icon: 'Checked', label: '來源產業', value: sourceLabel },
		{ icon: 'Checked', label: '優先條件', value: priorityText }
	]
})

// 說明：依目前條件即時計算「visible Demand Summary」內容，提供畫面顯示與決策判斷使用。
const visibleDemandSummary = computed(() => demandSummary.value.filter((item) => item.value && item.value !== '未設定'))

// 說明：將輸入資料標準化為系統格式，供媒合與查詢流程使用。
const normalizeModeName = (value = '') => String(value).replace(/\s+/g, '').trim()

const baseExternalPaths = [
	{
		modeName: '廠外模式 4',
		title: '廠外純化回原製程',
		summary: '原料購入使用後，送至受產源實質自主管理之公司純化（再製）、調整成分與濃度，再返回原廠原製程循環使用。',
		gradient: 'linear-gradient(160deg,var(--ds-primary-green),var(--ds-primary-green-dark))',
		accentColor: 'var(--ds-primary-green)',
		steps: [
			{ label: '原料購入', icon: Goods },
			{ label: '純化(再製)', icon: Operation },
			{ label: '調整成分', icon: SetUp },
			{ label: '返回原製程', icon: Promotion }
		]
	},
	{
		modeName: '廠外模式 6',
		title: '同法人體系前處理再回用',
		summary: '送至同一法人前處理，再送至其他公司純化（再製）、調整成分與濃度，再返回原廠使用。',
		gradient: 'linear-gradient(160deg,var(--ds-secondary-teal),var(--ds-secondary-cyan-dark))',
		accentColor: 'var(--ds-secondary-teal)',
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
		title: '跨廠區再利用',
		summary: '送至同一法人不同廠區處理及再利用。',
		gradient: 'linear-gradient(160deg,var(--ds-accent-orange),var(--ds-accent-orange-dark))',
		accentColor: 'var(--ds-accent-orange)',
		steps: [
			{ label: '原料購入', icon: Goods },
			{ label: '異業處理', icon: Connection },
			{ label: '再利用', icon: Finished }
		]
	}
]

const baseInternalPath = {
	modeName: '廠內模式 1',
	title: '物料製程內未排出，逕自循環使用',
	summary: '利用廠內再利用空間完成前處理與純化再製後，直接回到原製程，縮短運輸與處理鏈。',
	gradient: 'linear-gradient(160deg,var(--ds-accent-orange),var(--ds-accent-orange-dark))',
	accentColor: 'var(--ds-primary-green)',
	steps: [
		{ label: '原料購入', icon: Goods },
		{ label: '廠內前處理', icon: Files },
		{ label: '純化(再製)', icon: Operation },
		{ label: '返回原製程', icon: Promotion }
	]
}

const allRecommendedPaths = computed(() => {
	const hasReuseSpace = conditionStore.siteConditions.hasReuseSpace === true
	if (hasReuseSpace) {
		return [baseInternalPath, ...baseExternalPaths.slice(0, 2)]
	}
	return baseExternalPaths
})

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
			summary: conditionStore.selectedRecommendedPath.summary || matchedRecommended?.summary || '依據您選擇的循環路徑，系統提供對應技術媒合建議。',
			accentColor: matchedRecommended?.accentColor || 'var(--ds-primary-green)',
			steps: matchedRecommended?.steps || []
		}
	}

	if (conditionStore.siteConditions.hasReuseSpace === true) {
		return {
			modeName: '廠內模式 1',
			title: "物料製程內未排出，逕自循環使用",
			summary: '利用廠內再利用空間完成前處理與純化再製後，直接回到原製程，縮短運輸與處理鏈。',
			accentColor: 'var(--ds-primary-green)',
			steps: [
				{ label: '原料購入', icon: Goods },
				{ label: '廠內前處理', icon: Files },
				{ label: '純化(再製)', icon: Operation },
				{ label: '返回原製程', icon: Promotion }
			]
		}
	}

	return {
		modeName: '廠外模式 4',
		title: "原料購入使用後，送至受產源實質自主管理之公司純化（再製）、調整成分與濃度，再返回原廠原製程循環使用。",
		summary: '原料購入使用後，送至受產源實質自主管理之公司純化（再製）、調整成分與濃度，再返回原廠原製程循環使用。',
		accentColor: 'var(--ds-primary-green)',
		steps: [
			{ label: '原料購入', icon: Goods },
			{ label: '純化(再製)', icon: Operation },
			{ label: '調整成分', icon: SetUp },
			{ label: '返回原製程', icon: Promotion }
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

const modeFlow = [
	{ icon: 'Location', title: '原料入廠', sub: '供應商' },
	{ icon: 'OfficeBuilding', title: '純化處理', sub: '純化廠' },
	{ icon: 'Goods', title: '成分調整', sub: '再製廠' },
	{ icon: 'Van', title: '返回原製程', sub: '需求端' }
]

const vendors = [
	{ id: 1, name: '鴻成科技有限公司', category: '再利用機構', wasteReuse: 'C-0202', isReuseOrg: true, distance: 12, product: '稀硫酸(65%以下)', capacity: 3200, score: 95, controlNo: 'D2876543', location: '桃園市', reuseTech: '酸洗廢液純化、濃縮再製與循環回用', acceptanceStandards: ['pH 2.0 - 6.0', '含固量 < 15%', '金屬雜質符合批次規範'], processUnits: ['前處理槽', '蒸餾純化單元', '濃縮再製單元'], qualityStandards: ['批次檢驗報告', '出貨前抽驗', 'ISO 14001 流程管理'], salesTargetIndustries: ['化學材料製造業', '化學製品製造業'], contactPhone: '03-1234-5678', factoryAddress: '桃園市觀音區工業路 88 號', image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=960&q=80', previousMonthReceived: 3000, validityPeriod: '2026-12-31', reasons: ['允收條件符合', '距離最近', '具再利用機構資格'], reasonText: '本公司具備高純化能力與穩定出貨紀錄，適合依現有允收條件直接導入。', capacityLevel: 1, capacityLevelText: '低' },
	{ id: 2, name: '盈昌科技工業股份有限公司', category: '再利用機構', wasteReuse: 'C-0202', isReuseOrg: true, distance: 18, product: '工業用稀硫酸(50~60%)', capacity: 2400, score: 91, controlNo: 'D3209843', location: '台南市', reuseTech: '稀硫酸回收、再生濃縮與品質調整', acceptanceStandards: ['酸鹼值符合回收規格', '含水率 < 20%', '雜質含量低於上限'], processUnits: ['收料暫存槽', '再生處理單元', '品質調整單元'], qualityStandards: ['批次分析報告', '檢驗留樣制度', '製程參數紀錄'], salesTargetIndustries: ['化學材料製造業', '化學製品製造業'], contactPhone: '06-2345-6789', factoryAddress: '台南市永康區環工路 12 號', image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=960&q=80', reasons: ['允收條件符合', '距離最近'], reasonText: '具備穩定批次控制能力，適合需要持續供應與快速補貨的情境。', previousMonthReceived: 2000, validityPeriod: '2028-06-30', capacityLevel: 2, capacityLevelText: '中' },
	{ id: 3, name: '貝民股份有限公司台中港廠', category: '化學材料製造業', wasteReuse: 'C-0202', isReuseOrg: true, distance: 26, product: '電子級硫酸', capacity: 3200, score: 93, controlNo: 'D3209843', location: '台中市', reuseTech: '高純度硫酸再生、分級純化與電子級製程支援', acceptanceStandards: ['水份<55', '硫酸≧45', '比重>1.3', '外觀無懸浮顆粒'], processUnits: ['精餾單元', '分子篩純化單元', '終端過濾單元'], qualityStandards: ['電子級檢測報告', '進料與出貨雙向查核', '製程 SOP 管控'], salesTargetIndustries: ['化學材料製造業', '紡織業', '化學製品製造業', '紙漿、紙及紙製品製造業'], contactPhone: '04-2468-1357', factoryAddress: '台中市梧棲區港埠路 101 號', image: 'https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?auto=format&fit=crop&w=960&q=80', reasons: ['最大再利用量', '距離最近'], reasonText: '能承接較大量且高純度需求，適合對電子級品質要求較高的製程。', previousMonthReceived: 2500, validityPeriod: '2027-03-31', capacityLevel: 1, capacityLevelText: '低' },
	{ id: 4, name: '光宇應用材料股份有限公司', category: '公民營廢棄物處理及清理機構', wasteReuse: 'C-0202', isReuseOrg: false, distance: 34, product: '稀硫酸', capacity: 2200, score: 86, controlNo: 'D9202688', location: '高雄市', reuseTech: '稀硫酸回收與濃度微調再製', acceptanceStandards: ['收受太陽能切片廠以及半導體廠等相關工廠產出之廢硫酸', 'Ph(≦2)', '廢硫酸濃度(≧25％)', '雙氧水(≦15％)'], processUnits: ['前處理區', '濃縮回收區', '成品調整區'], qualityStandards: ['化驗報告追蹤', '批次標示管理', '出貨前複檢'], salesTargetIndustries: ['化學原料批發業', '化學原料製造業'], contactPhone: '07-3698-2584', factoryAddress: '高雄市小港區海工一路 36 號', image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=960&q=80', reasons: ['允收條件符合', '距離最近'], reasonText: '可作為中距離備援供應來源，適合兼顧成本與供應穩定性。', previousMonthReceived: 1800, validityPeriod: '2028-11-30', capacityLevel: 2, capacityLevelText: '中' },
	{ id: 5, name: '佶鼎科技股份有限公司觀音廠', category: '材料再製', wasteReuse: 'C-0202', isReuseOrg: false, distance: 42, product: '再生鹽類原料', capacity: 700, score: 80, controlNo: 'D8801122', location: '桃園市', reuseTech: '再生鹽類回收、濃縮與再製供應', acceptanceStandards: ['pH值小(等)於2', 'Cu小於100pm'], processUnits: ['蒸發濃縮單元', '結晶分離單元', '乾燥包裝單元'], qualityStandards: ['批次純度檢驗', '留樣保存制度', '出貨文件齊備'], salesTargetIndustries: ['化學材料製造業'], contactPhone: '07-7788-9900', factoryAddress: '桃園市大社區再生路 18 號', image: 'https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=960&q=80', reasons: ['允收條件符合'], reasonText: '適合中長距離供應與多樣化客戶銷售配置，具備擴量潛力。', previousMonthReceived: 600, validityPeriod: '2029-05-31', capacityLevel: 3, capacityLevelText: '高' }
]

const modeVendorIdsMap = {
	'廠內模式 1': [1, 3, 5],
	'廠外模式 4': [1, 2, 3],
	'廠外模式 6': [2, 3, 4, 5],
	'廠外模式 2': [1, 4, 5]
}

const getRecommendedVendorIds = (modeName = '') => modeVendorIdsMap[modeName] || []

const getRecommendedVendorCount = (modeName = '') => getRecommendedVendorIds(modeName).length

const recommendedVendors = computed(() => {
	const ids = getRecommendedVendorIds(selectedMode.value?.modeName)
	if (!ids.length) return [...vendors]
	const idSet = new Set(ids)
	return vendors.filter((vendor) => idSet.has(vendor.id))
})

// 說明：依目前條件即時計算「sorted Vendors」內容，提供畫面顯示與決策判斷使用。
const sortedVendors = computed(() => {
	const result = [...recommendedVendors.value]
	if (sortType.value === 'distance') return result.sort((a, b) => a.distance - b.distance)
	if (sortType.value === 'capacity') return result.sort((a, b) => b.capacity - a.capacity)
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
		const allowedVendorIds = new Set(recommendedVendors.value.map((vendor) => vendor.id))
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
			<div>${tags(vendor.acceptanceStandards)}</div>

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

.mode-flow {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 10px;
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

.sort-select {
	width: 200px;
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

	:deep(.el-col) {
		margin-bottom: 12px;
	}
}

.hero-stat {
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

	.mode-flow {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	// .flow-arrow {
	// 	display: none;
	// }

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
	.mode-flow,
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
