<template>
	<div class="technology-match-page">
		<div class="page-header">
			<el-button text class="back-btn" @click="goBackHome">
				<el-icon>
					<ArrowLeft />
				</el-icon>
				返回首頁
			</el-button>
			<div class="header-title">
				<h1>產業廢棄物循環利用智慧媒合平台</h1>
				<p>技術媒合推薦</p>
			</div>
		</div>

		<div class="page-shell">
			<FlowStepProgress :active-step="3" />

			<section class="panel-card summary-panel">
				<div class="section-header">
					<div class="ai-icon">
						<el-icon>
							<Monitor />
						</el-icon>
					</div>
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

			<section class="panel-card mode-panel">
				<div class="section-header">
					<div class="ai-icon mode-ai-icon">
						<el-icon>
							<Orange />
						</el-icon>
					</div>
					<h2>推薦循環模式</h2>
				</div>
				<div class="mode-title-row">
					<span class="mode-badge">{{ selectedMode.modeName }}</span>
					<h3>{{ selectedMode.title }}</h3>
				</div>
				<p class="mode-desc">{{ selectedMode.summary }}</p>
				<div class="mode-flow">
					<div v-for="(node, index) in modeFlow" :key="node.title" class="flow-node">
						<div class="node-icon">
							<el-icon>
								<component :is="node.icon" />
							</el-icon>
						</div>
						<p class="node-title">{{ node.title }}</p>
						<p class="node-sub">{{ node.sub }}</p>
						<span v-if="index < modeFlow.length - 1" class="flow-arrow">→</span>
					</div>
				</div>
				<div class="mode-tags">
					<span v-for="tag in modeTags" :key="tag">{{ tag }}</span>
				</div>
			</section>

			<section class="panel-card suppliers-panel">
				<div class="suppliers-header">
					<div class="section-header suppliers-title">
						<div class="ai-icon">
							<el-icon>
								<Opportunity />
							</el-icon>
						</div>
						<h2>整體推薦最佳技術供應商</h2>
					</div>
					<el-select v-model="sortType" class="sort-select" placeholder="排序條件">
						<el-option label="綜合排序" value="overall" />
						<el-option label="依距離" value="distance" />
						<el-option label="依再利用量" value="capacity" />
					</el-select>
				</div>

				<div class="supplier-list">
					<article v-for="(vendor, index) in pagedVendors" :key="vendor.id" class="supplier-card" role="button" tabindex="0" @click="openVendorDetail(vendor)" @keydown.enter.prevent="openVendorDetail(vendor)">
						<div class="rank-badge">{{ (currentPage - 1) * pageSize + index + 1 }}</div>
						<img class="supplier-photo" :src="vendor.image" :alt="vendor.name" />
						<div class="supplier-main">
							<div class="card-meta">
								<span class="meta-chip ann_category">{{ vendor.category }}</span>
								<span class="meta-chip ann_reuse">{{ vendor.isReuseOrg ? '再利用機構' : '處理機構' }}</span>
							</div>
							<h3>{{ vendor.name }}</h3>
							<el-row>
								<el-col :span="16">
									<div class="supplier-meta">
										<div>
											<p class="meta-title"><span class="ai-icon small"><el-icon>
														<Opportunity />
													</el-icon></span>再利用廢棄物</p>
											<p class="meta-text">{{ vendor.wasteReuse }}</p>
										</div>
										<div>
											<p class="meta-title"><span class="ai-icon small"><el-icon>
														<Location />
													</el-icon></span>所在地</p>
											<p class="meta-text">{{ vendor.location }}</p>
										</div>
										<div>
											<p class="meta-title"><span class="ai-icon small"><el-icon>
														<Location />
													</el-icon></span>距離</p>
											<p class="meta-text">{{ vendor.distance }} km</p>
										</div>
										<div>
											<p class="meta-title"><span class="ai-icon small"><el-icon>
														<Location />
													</el-icon></span>再生產品</p>
											<p class="meta-text">{{ vendor.product }}</p>
										</div>
										<div>
											<p class="meta-title"><span class="ai-icon small"><el-icon>
														<Location />
													</el-icon></span>最大再利用量</p>
											<p class="meta-text">{{ vendor.capacity }} 噸/月</p>
										</div>
										<div>
											<p class="meta-title"><span class="ai-icon small"><el-icon>
														<House />
													</el-icon></span>事業管制編號</p>
											<p class="meta-text">{{ vendor.controlNo }}</p>
										</div>
									</div>
								</el-col>
								<el-col :span="8" class="score-col">
									<div class="reason-block">
										<p>適合原因</p>
										<ul>
											<li v-for="reason in vendor.reasons" :key="reason">{{ reason }}</li>
										</ul>
									</div>
								</el-col>
							</el-row>
						</div>
					</article>
				</div>

				<div v-if="totalPages > 1" class="pagination-wrap">
					<el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="sortedVendors.length" layout="prev, pager, next" />
				</div>
			</section>

			<el-dialog v-model="detailDialogVisible" class="vendor-detail-dialog " width="min(1120px, 94vw)" align-center destroy-on-close :close-on-click-modal="true" :close-on-press-escape="true" append-to-body @closed="closeVendorDetail">
				<template #header>
					<div v-if="activeVendor" class="dialog-header">
						<div>
							<h3>{{ activeVendor.name }}</h3>
						</div>
						<div class="dialog-chips">
							<span class="meta-chip ann_category">{{ activeVendor.category }}</span>
							<span class="meta-chip ann_reuse">{{ activeVendor.isReuseOrg ? '再利用機構' : '處理機構' }}</span>

						</div>
					</div>
				</template>

				<div v-if="activeVendor" class="dialog-body">
					<div class="dialog-hero">
						<img class="dialog-hero-image" :src="activeVendor.image" :alt="activeVendor.name" />
						<div class="dialog-hero-copy">
							<div class="hero-stat-grid">
								<div class="hero-stat"><span>再利用廢棄物</span><strong>{{ activeVendor.wasteReuse }}</strong></div>
								<div class="hero-stat"><span>距離</span><strong>{{ activeVendor.distance }} km</strong></div>
								<div class="hero-stat"><span>再生產品</span><strong>{{ activeVendor.product }}</strong></div>
								<div class="hero-stat"><span>最大再利用量</span><strong>{{ activeVendor.capacity }} 噸/月</strong></div>
							</div>
							<p class="dialog-note">{{ activeVendor.reasonText }}</p>
						</div>
					</div>

					<div class="detail-grid ">
						<section class="detail-card wide-card">
							<p class="detail-title">六項概要</p>
							<div class="detail-chip-grid">
								<div class="detail-chip"><span>公告類別</span><strong>{{ activeVendor.category }}</strong></div>
								<div class="detail-chip"><span>再利用機構</span><strong>{{ activeVendor.isReuseOrg ? '是' : '否' }}</strong></div>
								<div class="detail-chip"><span>距離</span><strong>{{ activeVendor.distance }} km</strong></div>
								<div class="detail-chip"><span>再生產品</span><strong>{{ activeVendor.product }}</strong></div>
								<div class="detail-chip"><span>最大再利用量</span><strong>{{ activeVendor.capacity }} 噸/月</strong></div>
								<div class="detail-chip"><span>事業管制編號</span><strong>{{ activeVendor.controlNo }}</strong></div>
							</div>
						</section>

						<section class="detail-card">
							<p class="detail-title">再利用技術</p>
							<p class="detail-text">{{ activeVendor.reuseTech }}</p>
						</section>

						<section class="detail-card">
							<p class="detail-title">允收標準</p>
							<div class="tag-wrap">
								<span v-for="item in activeVendor.acceptanceStandards" :key="item" class="detail-tag">{{ item }}</span>
							</div>
						</section>

						<section class="detail-card">
							<p class="detail-title">製程單元</p>
							<div class="tag-wrap">
								<span v-for="item in activeVendor.processUnits" :key="item" class="detail-tag blue">{{ item }}</span>
							</div>
						</section>

						<section class="detail-card">
							<p class="detail-title">品質標準</p>
							<div class="tag-wrap">
								<span v-for="item in activeVendor.qualityStandards" :key="item" class="detail-tag purple">{{ item }}</span>
							</div>
						</section>

						<section class="detail-card">
							<p class="detail-title">產品銷售對象產業類別</p>
							<div class="tag-wrap">
								<span v-for="item in activeVendor.salesTargetIndustries" :key="item" class="detail-tag green">{{ item }}</span>
							</div>
						</section>

						<section class="detail-card contact-card">
							<p class="detail-title">聯絡資訊</p>
							<div class="contact-item"><span>連絡電話</span><strong>{{ activeVendor.contactPhone }}</strong></div>
							<div class="contact-item"><span>工廠地址</span><strong>{{ activeVendor.factoryAddress }}</strong></div>
						</section>
					</div>

					<div class="dialog-actions">
						<el-button type="primary" class="pdf-export-btn" @click="exportVendorPdf">
							<el-icon class="el-icon--left">
								<Download />
							</el-icon>
							匯出 PDF
						</el-button>
					</div>
				</div>
			</el-dialog>

			<div class="actions panel-card">
				<el-button size="large" @click="goPrevious">
					<el-icon class="el-icon--left">
						<ArrowLeft />
					</el-icon>
					上一步 : 循環路徑推薦
				</el-button>
				<!-- //下載完整報告 -->
				<el-button size="large" type="primary" @click="exportFullReportPdf">
					<el-icon class="el-icon--left">
						<Download />
					</el-icon>
					下載完整報告
				</el-button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Close, Download } from '@element-plus/icons-vue'
import FlowStepProgress from '@/components/condition-setup/FlowStepProgress.vue'
import { useConditionSetupStore } from '@/stores/conditionSetup'

const router = useRouter()
const conditionStore = useConditionSetupStore()

const sortType = ref('overall')
const currentPage = ref(1)
const pageSize = 4
const detailDialogVisible = ref(false)
const activeVendor = ref(null)

const industryLabelMap = {
	semiconductor: '電子與半導體',
	steel: '鋼鐵冶金',
	chemical: '化工製程',
	food: '食品加工'
}

const extractCountyCity = (address = '') => {
	const text = String(address || '')
	if (!text) return ''
	const match = text.match(/(基隆市|台北市|新北市|桃園市|新竹市|新竹縣|苗栗縣|台中市|彰化縣|南投縣|雲林縣|嘉義市|嘉義縣|台南市|高雄市|屏東縣|宜蘭縣|花蓮縣|台東縣|澎湖縣|金門縣|連江縣)/)
	return match ? match[1] : text
}

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
	const sourceLabel = sourceConditions.industry ? (industryLabelMap[sourceConditions.industry] || sourceConditions.industry) : '未設定'
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

const visibleDemandSummary = computed(() => demandSummary.value.filter((item) => item.value && item.value !== '未設定'))

const selectedMode = computed(() => {
	const hasStoredMode = conditionStore.selectedRecommendedPath?.modeName && conditionStore.selectedRecommendedPath?.title
	if (hasStoredMode) {
		return {
			modeName: conditionStore.selectedRecommendedPath.modeName,
			title: conditionStore.selectedRecommendedPath.title,
			summary: conditionStore.selectedRecommendedPath.summary || '依據您選擇的循環路徑，系統提供對應技術媒合建議。'
		}
	}

	if (conditionStore.siteConditions.hasReuseSpace === true) {
		return {
			modeName: '廠內模式 1',
			title: '廠內處理回原製程',
			summary: '利用廠內再利用空間完成前處理與純化再製後，直接回到原製程，縮短運輸與處理鏈。'
		}
	}

	return {
		modeName: '廠外模式 4',
		title: '純化再製後返回原製程',
		summary: '原料購入使用後，送至受產源實質自主管理之公司純化（再製）、調整成分與濃度，再返回原廠原製程循環使用。'
	}
})

const modeFlow = [
	{ icon: 'Location', title: '原料入廠', sub: '供應商' },
	{ icon: 'OfficeBuilding', title: '純化處理', sub: '純化廠' },
	{ icon: 'Goods', title: '成分調整', sub: '再製廠' },
	{ icon: 'Van', title: '返回原製程', sub: '需求端' }
]

const modeTags = ['模式成熟度高', '材料價值最大化', '降低原料採購需求', '穩定供應鏈']

const vendors = [
	{ id: 1, name: '永豐化工廢液處理有限公司', category: '工業再利用', wasteReuse: 'C-0202', isReuseOrg: true, distance: 12, product: '再生硫酸(60~70%)', capacity: 3200, score: 95, controlNo: 'D2876543', location: '桃園市', reuseTech: '酸洗廢液純化、濃縮再製與循環回用', acceptanceStandards: ['pH 2.0 - 6.0', '含固量 < 15%', '金屬雜質符合批次規範'], processUnits: ['前處理槽', '蒸餾純化單元', '濃縮再製單元'], qualityStandards: ['批次檢驗報告', '出貨前抽驗', 'ISO 14001 流程管理'], salesTargetIndustries: ['化工原料', '電子材料', '金屬表面處理'], contactPhone: '03-1234-5678', factoryAddress: '桃園市觀音區工業路 88 號', image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=960&q=80', reasons: ['允收條件符合', '距離最近', '具再利用機構資格'], reasonText: '本公司具備高純化能力與穩定出貨紀錄，適合依現有允收條件直接導入。' },
	{ id: 2, name: '盈昌科技工業股份有限公司', category: '化工再生', wasteReuse: 'C-0202', isReuseOrg: true, distance: 18, product: '工業用稀硫酸(50~60%)', capacity: 2400, score: 91, controlNo: 'D3209843', location: '台南市', reuseTech: '稀硫酸回收、再生濃縮與品質調整', acceptanceStandards: ['酸鹼值符合回收規格', '含水率 < 20%', '雜質含量低於上限'], processUnits: ['收料暫存槽', '再生處理單元', '品質調整單元'], qualityStandards: ['批次分析報告', '檢驗留樣制度', '製程參數紀錄'], salesTargetIndustries: ['化工原料', '電鍍材料', '工業清洗'], contactPhone: '06-2345-6789', factoryAddress: '台南市永康區環工路 12 號', image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=960&q=80', reasons: ['允收條件符合', '距離最近'], reasonText: '具備穩定批次控制能力，適合需要持續供應與快速補貨的情境。' },
	{ id: 3, name: '貝民股份有限公司台中港廠', category: '化學材料製造業', wasteReuse: 'C-0202', isReuseOrg: true, distance: 26, product: '電子級硫酸', capacity: 3200, score: 93, controlNo: 'D3209843', location: '台中市', reuseTech: '高純度硫酸再生、分級純化與電子級製程支援', acceptanceStandards: ['低金屬離子含量', '純度符合電子級需求', '批次波動控制'], processUnits: ['精餾單元', '分子篩純化單元', '終端過濾單元'], qualityStandards: ['電子級檢測報告', '進料與出貨雙向查核', '製程 SOP 管控'], salesTargetIndustries: ['半導體', '電子材料', '精密化工'], contactPhone: '04-2468-1357', factoryAddress: '台中市梧棲區港埠路 101 號', image: 'https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?auto=format&fit=crop&w=960&q=80', reasons: ['最大再利用量', '距離最近'], reasonText: '能承接較大量且高純度需求，適合對電子級品質要求較高的製程。' },
	{ id: 4, name: '光宇應用材料股份有限公司', category: '化學品再生', wasteReuse: 'C-0202', isReuseOrg: false, distance: 34, product: '稀硫酸', capacity: 2200, score: 86, controlNo: 'D9202688', location: '高雄市', reuseTech: '稀硫酸回收與濃度微調再製', acceptanceStandards: ['濃度落在再利用範圍', '酸鹼值符合入料規格', '懸浮物低於管制值'], processUnits: ['前處理區', '濃縮回收區', '成品調整區'], qualityStandards: ['化驗報告追蹤', '批次標示管理', '出貨前複檢'], salesTargetIndustries: ['化工原料', '工業清洗', '表面處理'], contactPhone: '07-3698-2584', factoryAddress: '高雄市小港區海工一路 36 號', image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=960&q=80', reasons: ['允收條件符合', '距離最近'], reasonText: '可作為中距離備援供應來源，適合兼顧成本與供應穩定性。' },
	{ id: 5, name: '遠見循環科技有限公司', category: '材料再製', wasteReuse: 'C-0202', isReuseOrg: true, distance: 42, product: '再生鹽類原料', capacity: 700, score: 80, controlNo: 'D8801122', location: '高雄市', reuseTech: '再生鹽類回收、濃縮與再製供應', acceptanceStandards: ['鹽類純度符合再製門檻', '含水率 < 10%', '雜質需低於批次上限'], processUnits: ['蒸發濃縮單元', '結晶分離單元', '乾燥包裝單元'], qualityStandards: ['批次純度檢驗', '留樣保存制度', '出貨文件齊備'], salesTargetIndustries: ['化工原料', '電池材料', '工業製程'], contactPhone: '07-7788-9900', factoryAddress: '高雄市大社區再生路 18 號', image: 'https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=960&q=80', reasons: ['允收條件符合'], reasonText: '適合中長距離供應與多樣化客戶銷售配置，具備擴量潛力。' }
]

const sortedVendors = computed(() => {
	const result = [...vendors]
	if (sortType.value === 'distance') return result.sort((a, b) => a.distance - b.distance)
	if (sortType.value === 'capacity') return result.sort((a, b) => b.capacity - a.capacity)
	return result.sort((a, b) => b.score - a.score)
})

const totalPages = computed(() => Math.ceil(sortedVendors.value.length / pageSize))
const pagedVendors = computed(() => sortedVendors.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))

watch(sortType, () => {
	currentPage.value = 1
})

watch(detailDialogVisible, (value) => {
	if (!value) activeVendor.value = null
})

const openVendorDetail = (vendor) => {
	activeVendor.value = vendor
	detailDialogVisible.value = true
}

const closeVendorDetail = () => {
	detailDialogVisible.value = false
}

const escapeHtml = (value) => String(value ?? '')
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#39;')

const exportVendorPdf = () => {
	if (!activeVendor.value) return

	const vendor = activeVendor.value
	const printWindow = window.open('', '_blank', 'width=960,height=720')
	if (!printWindow) {
		ElMessage.warning('無法開啟匯出視窗，請確認瀏覽器未封鎖彈出視窗')
		return
	}

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

const goPrevious = () => {
	router.push('/company-match')
}
const goBackHome = () => {
	conditionStore.resetAll()
	router.push('/')
}
</script>

<style scoped lang="scss">
.technology-match-page {
	min-height: 100vh;
	padding: 20px 20px 96px;
	background:
		radial-gradient(circle at 14% 22%, rgba(87, 166, 255, 0.36), transparent 24%),
		radial-gradient(circle at 82% 14%, rgba(117, 135, 255, 0.26), transparent 12%),
		radial-gradient(circle at 70% 78%, rgba(104, 218, 255, 0.2), transparent 16%),
		linear-gradient(180deg, #e8f4ff 0%, #dceeff 46%, #f4f9ff 100%);
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft JhengHei', sans-serif;
}

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

.page-shell {
	max-width: min(94vw, 1480px);
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 18px;
}

.panel-card {
	padding: 22px;
	border-radius: 22px;
	border: 1px solid rgba(255, 255, 255, 0.86);
	background: linear-gradient(160deg, rgba(255, 255, 255, 0.86), rgba(239, 248, 255, 0.74));
	backdrop-filter: blur(16px);
	box-shadow: 0 14px 34px rgba(47, 91, 114, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.84);
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
	font-size: 12px;
	color: #5f7976;
}

.summary-value {
	margin-top: 2px;
	font-size: 14px;
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
}

.mode-badge {
	padding: 6px 14px;
	border-radius: 999px;
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 0.04em;
	color: #0f4f9f;
	background: linear-gradient(135deg, rgba(122, 206, 255, 0.4), rgba(178, 149, 255, 0.38));
	border: 1px solid rgba(118, 139, 246, 0.46);
	box-shadow: 0 6px 16px rgba(91, 124, 245, 0.18);
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

.flow-arrow {
	position: absolute;
	right: -14px;
	top: 50%;
	transform: translateY(-50%);
	font-size: 22px;
	font-weight: 700;
	color: #5683ff;
	text-shadow: 0 2px 8px rgba(86, 131, 255, 0.35);
	z-index: 2;
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

.suppliers-title {
	margin-bottom: 0;
}

.sort-select {
	width: 200px;
}

.supplier-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.supplier-card {
	display: grid;
	grid-template-columns: 260px 1fr;
	gap: 14px;
	padding: 12px;
	position: relative;
	border-radius: 16px;
	border: 1px solid rgba(180, 215, 240, 0.42);
	background: rgba(255, 255, 255, 0.75);
	cursor: pointer;
	transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;

	&:hover {
		transform: translateY(-3px);
		border-color: rgba(84, 178, 157, 0.42);
		box-shadow: 0 18px 38px rgba(53, 106, 138, 0.16);
	}
}

.rank-badge {
	position: absolute;
	top: 10px;
	left: 10px;
	padding: 4px 10px;
	border-radius: 999px;
	font-size: 12px;
	font-weight: 800;
	letter-spacing: 0.02em;
	color: #fff;
	background: linear-gradient(135deg, #2f80ed, #56ccf2);
	box-shadow: 0 8px 18px rgba(47, 128, 237, 0.28);
	z-index: 3;
}

.supplier-photo {
	width: 100%;
	height: 170px;
	object-fit: cover;
	border-radius: 12px;
}

.supplier-main h3 {
	margin: 10px 0;
	font-size: 22px;
	color: #1f4d47;
}

.card-meta {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
}

.meta-chip {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 3px 10px;
	border-radius: 12px;
	font-size: 11px;
	font-weight: 600;
}

.meta-chip.ann_category {
	color: #753007;
	background: rgb(247, 213, 102);
	border: 1px solid rgba(194, 108, 38, 0.3);
}

.meta-chip.ann_reuse {
	color: #2b6d64;
	background: rgba(203, 243, 235, 0.7);
	border: 1px solid rgba(84, 178, 157, 0.2);
}

.supplier-meta {
	margin-top: 10px;
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 12px;
}

.meta-title {
	font-size: 14px;
	font-weight: 700;
	color: #0c5cc5;
	margin: 0;
}

.meta-text {
	font-size: 14px;
	color: #4b6865;
	padding-left: 18px;
	margin: 2px 0 0;
}

.reason-block {
	padding: 10px 12px;
	border-radius: 12px;
	background: rgba(237, 249, 245, 0.78);
	border: 1px solid rgba(166, 224, 208, 0.4);

	p {
		margin: 0 0 6px;
		font-size: 14px;
		font-weight: 700;
		color: #24645b;
	}

	ul {
		margin: 0;
		padding-left: 18px;
	}

	li {
		margin: 4px 0;
		font-size: 14px;
		line-height: 1.45;
		color: #4b6865;
	}
}

.card-cta {
	margin-top: 12px;
	display: inline-flex;
	align-items: center;
	gap: 6px;
	font-size: 12px;
	font-weight: 700;
	color: #1c79d0;
	padding: 6px 10px;
	border-radius: 999px;
	background: rgba(225, 241, 255, 0.86);
	border: 1px solid rgba(76, 147, 221, 0.22);
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

.dialog-header {
	display: flex;
	justify-content: space-between;
	gap: 14px;
	padding: 22px 24px 18px;
	background:
		radial-gradient(circle at 10% 0%, rgba(87, 166, 255, 0.18), transparent 28%),
		radial-gradient(circle at 92% 16%, rgba(92, 114, 255, 0.16), transparent 30%),
		linear-gradient(135deg, rgba(248, 252, 255, 0.96), rgba(235, 246, 255, 0.92));
	border-bottom: 1px solid rgba(179, 208, 233, 0.28);

	h3 {
		margin: 6px 0 4px;
		font-size: 28px;
		color: #183e61;
	}
}

.dialog-eyebrow {
	margin: 0;
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: #3f78d8;
}

.dialog-subtitle {
	margin: 0;
	font-size: 13px;
	color: #5b7890;
}

.dialog-chips {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	align-items: flex-start;
}

.dialog-close-btn {
	color: #3f78d8;
}

.dialog-body {
	padding: 22px 24px 24px;
	display: flex;
	flex-direction: column;
}

.dialog-hero {
	display: grid;
	grid-template-columns: 320px 1fr;
	gap: 18px;
	margin-bottom: 18px;
}

.dialog-hero-image {
	width: 100%;
	height: 220px;
	object-fit: cover;
	border-radius: 18px;
	border: 1px solid rgba(136, 181, 213, 0.3);
	box-shadow: 0 12px 28px rgba(66, 122, 190, 0.12);
}

.dialog-hero-copy {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 16px;
	padding: 14px 0;
}

.hero-stat-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12px;
}

.hero-stat {
	padding: 12px 14px;
	border-radius: 16px;
	background: linear-gradient(160deg, rgba(244, 249, 255, 0.96), rgba(232, 245, 255, 0.9));
	border: 1px solid rgba(154, 196, 231, 0.35);

	span {
		display: block;
		font-size: 12px;
		color: #5f7892;
		margin-bottom: 4px;
	}

	strong {
		font-size: 16px;
		color: #193e62;
		line-height: 1.4;
	}
}

.dialog-note {
	margin: 0;
	padding: 14px 16px;
	border-radius: 16px;
	background: linear-gradient(135deg, rgba(199, 232, 255, 0.45), rgba(211, 245, 233, 0.45));
	border: 1px solid rgba(111, 173, 221, 0.24);
	color: #32526d;
	line-height: 1.7;
	font-size: 14px;
}

.dialog-scroll-area {
	max-height: calc(90vh - 290px);
	overflow-y: auto;
	padding-right: 4px;
}

.detail-grid {
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
	font-size: 13px;
	font-weight: 800;
	color: #2b5876;
	letter-spacing: 0.05em;
}

.detail-chip-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 10px;
}

.detail-chip {
	padding: 10px 12px;
	border-radius: 14px;
	background: rgba(242, 250, 255, 0.95);
	border: 1px solid rgba(158, 200, 232, 0.32);

	span {
		display: block;
		font-size: 12px;
		color: #5d7994;
		margin-bottom: 4px;
	}

	strong {
		font-size: 14px;
		color: #1c4568;
		line-height: 1.45;
	}
}

.detail-text {
	margin: 0;
	font-size: 14px;
	line-height: 1.8;
	color: #3e5e7d;
}

.tag-wrap {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.detail-tag {
	padding: 6px 10px;
	border-radius: 999px;
	font-size: 12px;
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

.contact-card {
	display: grid;
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
		font-size: 12px;
		font-weight: 700;
		color: #5d7994;
	}

	strong {
		font-size: 13px;
		color: #1e476b;
		text-align: right;
	}
}

.dialog-actions {
	margin-top: 16px;
	display: flex;
	justify-content: flex-end;
}

.pdf-export-btn {
	background: linear-gradient(135deg, #2f80ed, #56ccf2);
	border: none;
	font-weight: 700;

	&:hover {
		background: linear-gradient(135deg, #1f6fd8, #40b8e8);
	}
}

.actions {
	display: flex;
	justify-content: space-between;
}

@media (max-width: 1200px) {
	.summary-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.mode-flow {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.flow-arrow {
		display: none;
	}

	.supplier-card {
		grid-template-columns: 220px 1fr;
	}

	.dialog-hero {
		grid-template-columns: 1fr;
	}

	.detail-chip-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 768px) {
	.technology-match-page {
		padding: 16px 12px 96px;
	}

	.page-header {
		padding: 14px 16px;
		flex-direction: column;
		align-items: flex-start;
	}

	.header-title {
		text-align: left;
	}

	.panel-card {
		padding: 16px;
	}

	.section-header,
	.suppliers-header {
		flex-direction: column;
		align-items: flex-start;
	}

	.summary-grid,
	.mode-flow,
	.detail-grid,
	.detail-chip-grid {
		grid-template-columns: 1fr;
	}

	.mode-title-row {
		flex-direction: column;
		align-items: flex-start;
	}

	.sort-select {
		width: 100%;
	}

	.supplier-card {
		grid-template-columns: 1fr;
	}

	.supplier-photo {
		height: 200px;
	}

	.supplier-meta {
		grid-template-columns: 1fr;
	}

	.dialog-scroll-area {
		max-height: calc(90vh - 260px);
	}

	.contact-item {
		flex-direction: column;
		align-items: flex-start;

		strong {
			text-align: left;
		}
	}

	.actions {
		flex-direction: flex;
		justify-content: space-between;

		:deep(.el-button) {
			width: 100%;
		}
	}
}
</style>
