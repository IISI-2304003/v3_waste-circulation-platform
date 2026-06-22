<template>
	<div class="waste-code-detail">
		<!-- 返回按鈕與操作列 -->
		<div class="back-nav">
			<el-button @click="goBack" text>
				<el-icon>
					<ArrowLeft />
				</el-icon>
				返回搜尋
			</el-button>
			<div class="action-buttons no-print">
				<el-button @click="handlePrint" :icon="Printer">
					列印
				</el-button>
				<el-button type="primary" @click="handleExport" :icon="Download">
					匯出 PDF
				</el-button>
			</div>
		</div>

		<!-- 載入狀態 -->
		<div v-if="loading" class="loading-container">
			<el-icon class="is-loading">
				<Loading />
			</el-icon>
			<p>載入中...</p>
		</div>

		<!-- 詳情內容 -->
		<div v-else-if="wasteCode" class="detail-content" :data-print-time="currentDateTime">
			<!-- 帶數字的步驟進度條 -->
			<div v-if="currentStep !== 1" class="step-progress no-print">
				<div class="step-item" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
					<div class="step-circle">1</div>
					<div class="step-label">允收標準查詢</div>
				</div>
				<div class="step-line" :class="{ active: currentStep > 1 }"></div>
				<div class="step-item" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
					<div class="step-circle">2</div>
					<div class="step-label">適用循環模式</div>
				</div>
				<div class="step-line" :class="{ active: currentStep > 2 }"></div>
				<div class="step-item" :class="{ active: currentStep === 3, completed: currentStep > 3 }">
					<div class="step-circle">3</div>
					<div class="step-label">最終詳情</div>
				</div>
			</div>

			<!-- 標頭資訊 - 左右分欄 -->
			<el-row class="detail-header">
				<el-col :span="12" class="header-left">
					<el-tag size="large" class="code-tag">
						{{ wasteCode.code }}
					</el-tag>
					<h1 class="code-title">{{ wasteCode.name }}</h1>
					<p class="code-description">{{ wasteCode.description }}</p>

					<div class="code-tags">
						<el-tag v-for="tag in wasteCode.tags" :key="tag" type="info" size="small">
							{{ tag }}
						</el-tag>
					</div>
				</el-col>

				<el-col :span="12">
					<!-- 詳細資訊表格 -->
					<div class="info-table">
						<div class="info-row">
							<div class="info-label">類別代碼</div>
							<div class="info-value">{{ wasteCode.categoryId }} 類</div>
						</div>
						<div class="info-row">
							<div class="info-label">廢棄物代碼</div>
							<div class="info-value">{{ wasteCode.code }}</div>
						</div>
						<div class="info-row">
							<div class="info-label">主要成分</div>
							<div class="info-value">{{ wasteCode.mainComponent || '酸性水溶液' }}</div>
						</div>
					</div>
				</el-col>
			</el-row>

			<!-- 步驟 1: 允收標準表單 -->
			<div v-if="currentStep === 1" class="step-content">
				<div class="section-title-bar">
					<div class="step-number">1</div>
					<h2>條件設定</h2>
					<span class="subtitle">（輸入條件後進行 AI 媒合分析）</span>
				</div>

				<ConditionSetupWorkspace ref="standardFormRef" :initial-standards="wasteCode.standards" :embedded-mode="true" @next="nextStep" />
			</div>

			<!-- 步驟 2: 適用循環模式 -->
			<div v-if="currentStep === 2" class="step-content">
				<div class="section-title-bar">
					<div class="step-number">2</div>
					<h2>適用循環模式</h2>
					<span class="subtitle">（符合條件之循環利用模式列表）</span>
				</div>

				<div v-if="wasteCode.circulationModes?.length" class="modes-section">
					<div class="modes-grid">
						<el-card v-for="mode in availableModes" :key="mode.id" class="mode-card" shadow="hover">
							<div class="mode-content">
								<div class="mode-header">
									<div class="mode-icon">{{ mode.icon }}</div>
									<div class="mode-code">模式 R-{{ String(availableModes.indexOf(mode) + 1).padStart(2, '0') }}</div>
								</div>
								<h4>{{ mode.name }}</h4>
								<p class="mode-description">{{ mode.description }}</p>
								<div class="mode-stats">
									<div class="stat-item">
										<span class="stat-icon">👁</span>
										<span class="stat-value">{{ Math.floor(Math.random() * 100) }}</span>
									</div>
									<div class="stat-item">
										<span class="stat-label">適用度</span>
										<div class="progress-bar">
											<div class="progress-fill" :style="{ width: (60 + Math.random() * 40) + '%' }"></div>
										</div>
										<span class="stat-value">{{ Math.floor(60 + Math.random() * 40) }}%</span>
									</div>
								</div>
								<el-button type="primary" text class="view-detail-btn">
									查看詳情 →
								</el-button>
							</div>
						</el-card>
					</div>
				</div>

				<!-- 步驟導航按鈕 -->
				<div class="step-navigation">
					<el-button size="large" @click="prevStep">
						<el-icon class="el-icon--left">
							<ArrowLeft />
						</el-icon>
						上一步
					</el-button>
					<el-button type="primary" size="large" @click="nextStep">
						下一步：最終詳情
						<el-icon class="el-icon--right">
							<ArrowRight />
						</el-icon>
					</el-button>
				</div>
			</div>

			<!-- 步驟 3: 最終詳情 -->
			<div v-if="currentStep === 3" class="step-content">
				<div class="section-title-bar">
					<div class="step-number">3</div>
					<h2>最終詳情</h2>
					<span class="subtitle">（您需要知道之允收條件）</span>
					<el-button type="primary" plain :icon="Document" @click="openLeachingDialog">
						查看溶出試驗標準
					</el-button>
				</div>

				<el-row :gutter="20" class="criteria-cards-grid">
					<!-- 物理狀態卡片 -->
					<el-col :span="24" v-if="wasteCode.acceptanceCriteria?.physicalState?.length" class="criteria-card physical-card">
						<div class="card-header">
							<div class="card-icon">
								<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
									<defs>
										<linearGradient id="dropGradient" x1="0%" y1="0%" x2="0%" y2="100%">
											<stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
											<stop offset="100%" style="stop-color:#2e7d5f;stop-opacity:1" />
										</linearGradient>
									</defs>
									<path d="M 50 20 Q 35 35 35 50 Q 35 70 50 70 Q 65 70 65 50 Q 65 35 50 20 Z" fill="url(#dropGradient)" />
								</svg>
							</div>
							<h3>物理狀態</h3>
						</div>
						<div class="card-content">
							<div class="state-tags">
								<el-tag v-for="state in wasteCode.acceptanceCriteria.physicalState" :key="state" type="success" size="large">
									{{ state }}
								</el-tag>
							</div>
						</div>
					</el-col>
				</el-row>

				<!-- 步驟導航按鈕 -->
				<div class="step-navigation">
					<el-button size="large" @click="prevStep">
						<el-icon class="el-icon--left">
							<ArrowLeft />
						</el-icon>
						上一步
					</el-button>
					<el-button type="success" size="large" @click="handleComplete">
						完成查詢
						<el-icon class="el-icon--right">
							<Check />
						</el-icon>
					</el-button>
				</div>
			</div>
		</div>

		<!-- 錯誤狀態 -->
		<div v-else class="error-container">
			<el-result icon="warning" title="找不到該廢棄物代碼" sub-title="請確認代碼是否正確，或返回搜尋頁重新選擇。">
				<template #extra>
					<el-button type="primary" @click="goBack">返回搜尋</el-button>
				</template>
			</el-result>
		</div>

		<!-- 溶出試驗標準彈窗 -->
		<el-dialog v-model="showLeachingDialog" title="溶出試驗標準" width="760px" class="leaching-dialog">
			<div class="standards-table">
				<div class="table-header">
					<div class="table-cell header-cell">分析項目</div>
					<div class="table-cell header-cell">溶出試驗標準<br /><span class="unit">(毫克/公升)</span></div>
				</div>
				<div class="table-row">
					<div class="table-cell">汞及其化合物(總汞)</div>
					<div class="table-cell value-cell">0.2</div>
				</div>
				<div class="table-row">
					<div class="table-cell">鎘及其化合物(總鎘)</div>
					<div class="table-cell value-cell">1.0</div>
				</div>
				<div class="table-row">
					<div class="table-cell">鉛及其化合物(總鉛)</div>
					<div class="table-cell value-cell">1.0</div>
				</div>
				<div class="table-row">
					<div class="table-cell">六價鉻化物</div>
					<div class="table-cell value-cell">2.5</div>
				</div>
				<div class="table-row">
					<div class="table-cell">鈹及其他合物(總鈹)</div>
					<div class="table-cell value-cell">5.0</div>
				</div>
				<div class="table-row">
					<div class="table-cell">鎂及其化合物(總鎂)<br /><span class="note">(不包含製造或使用動物皮革程序所產生之廢皮屑、皮屑及皮渣)</span></div>
					<div class="table-cell value-cell">5.0</div>
				</div>
				<div class="table-row">
					<div class="table-cell">砷及其化合物(總砷)</div>
					<div class="table-cell value-cell">5.0</div>
				</div>
				<div class="table-row">
					<div class="table-cell">銀及其化合物(總銀)<br /><span class="note">(僅限環影沖洗及顯相製程產生之廢液)</span></div>
					<div class="table-cell value-cell">5.0</div>
				</div>
				<div class="table-row">
					<div class="table-cell">銅及其化合物(總銅)<br /><span class="note">(僅限廢觸媒、集塵灰、廢酸液、污泥、濾材、其化飛灰或底渣)</span></div>
					<div class="table-cell value-cell">15.0</div>
				</div>
				<div class="table-row">
					<div class="table-cell">鎳及其化合物(總鎳)</div>
					<div class="table-cell value-cell">100.0</div>
				</div>
			</div>
			<template #footer>
				<el-button @click="showLeachingDialog = false">關閉</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight, Loading, Document, Printer, Download, Check } from '@element-plus/icons-vue'
import { getWasteCodeDetail } from '@/api/wasteCode'
import { getCategoryById } from '@/data/wasteCategories'
import circulationModes from '@/data/circulationModes.json'
import ConditionSetupWorkspace from '@/components/condition-setup/ConditionSetupWorkspace.vue'

const route = useRoute()
const router = useRouter()

// 狀態
const wasteCode = ref(null)
const loading = ref(true)
const showLeachingDialog = ref(false)
const standardFormRef = ref(null)
const currentStep = ref(1) // 當前步驟：1=允收條件, 2=允收標準查詢, 3=適用循環模式

// 計算屬性
const categoryColor = computed(() => {
	if (!wasteCode.value) return '#FFF'
	const category = getCategoryById(wasteCode.value.categoryId)
	return category?.color || '#FFF'
})

const availableModes = computed(() => {
	if (!wasteCode.value?.circulationModes) return []
	return circulationModes.filter(mode =>
		wasteCode.value.circulationModes.includes(mode.id)
	)
})

const currentDateTime = computed(() => {
	const now = new Date()
	return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
})

const progressPercentage = computed(() => {
	return ((currentStep.value - 1) / 2) * 100 // 3步驟：0%, 50%, 100%
})

// 生命週期
onMounted(async () => {
	console.log('WasteCodeDetail 組件已掛載')
	console.log('路由參數:', route.params)
	console.log('路由查詢:', route.query)
	await loadWasteCode()
})

// 載入廢棄物代碼詳情
const loadWasteCode = async () => {
	const code = route.params.code
	console.log('準備加載代碼:', code)

	if (!code) {
		console.log('沒有代碼參數')
		loading.value = false
		return
	}

	try {
		loading.value = true
		console.log('開始請求數據...')
		wasteCode.value = await getWasteCodeDetail(code)
		console.log('數據加載成功:', wasteCode.value)
	} catch (error) {
		console.error('載入失敗：', error)
		ElMessage.error(`無法載入廢棄物代碼：${code}`)
	} finally {
		loading.value = false
		console.log('加載狀態結束, wasteCode:', wasteCode.value)
	}
}

// 步驟切換
const nextStep = () => {
	if (currentStep.value < 3) {
		currentStep.value++
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}
}

const prevStep = () => {
	if (currentStep.value > 1) {
		currentStep.value--
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}
}

const handleComplete = () => {
	ElMessage.success('查詢完成！')
	// 可以在這裡加入完成後的邏輯，例如返回首頁或顯示摘要
}

// 返回搜尋頁
const goBack = () => {
	if (route.query.from === 'home') {
		router.push({
			path: '/',
			query: {
				category: route.query.category,
				page: route.query.page
			}
		})
	} else {
		router.push('/waste')
	}
}

// 開啟溶出試驗標準彈窗
const openLeachingDialog = () => {
	showLeachingDialog.value = true
}

// 列印功能
const handlePrint = () => {
	window.print()
}

// 匯出 PDF 功能
const handleExport = () => {
	ElMessage.info('匯出 PDF 功能開發中')
	// 未來可整合 jsPDF 或 html2pdf 套件
	window.print() // 目前先使用列印功能
}
</script>

<style scoped lang="scss">
.waste-code-detail {
	max-width: min(92vw, 1640px);
	margin: 0 auto;
	padding: 24px;
	min-height: 80vh;
	background: linear-gradient(180deg, rgba(239, 248, 241, 0.3) 0%, rgba(255, 255, 255, 1) 100%);
}

.back-nav {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
}

.action-buttons {
	display: flex;
	gap: 12px;
}

/* 帶數字的步驟進度條 */
.step-progress {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 32px;
	padding: 24px;
	background: white;
	border-radius: 16px;
	box-shadow: 0 4px 12px rgba(79, 143, 111, 0.08);
}

.step-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	position: relative;

	.step-circle {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: #e8f5e9;
		border: 2px solid #ddd;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 18px;
		color: #999;
		transition: all 0.3s ease;
	}

	.step-label {
		font-size: 13px;
		color: #999;
		font-weight: 500;
		transition: all 0.3s ease;
	}

	&.active {
		.step-circle {
			background: linear-gradient(135deg, #4f8f6f 0%, #2e6f95 100%);
			border-color: #4f8f6f;
			color: white;
			box-shadow: 0 4px 12px rgba(79, 143, 111, 0.3);
		}

		.step-label {
			color: #4f8f6f;
			font-weight: 700;
		}
	}

	&.completed {
		.step-circle {
			background: #4CAF50;
			border-color: #4CAF50;
			color: white;

			&::before {
				content: '✓';
			}
		}

		.step-label {
			color: #4CAF50;
		}
	}
}

.step-line {
	flex: 1;
	height: 2px;
	background: #ddd;
	margin: 0 16px;
	max-width: 120px;
	transition: all 0.3s ease;

	&.active {
		background: linear-gradient(90deg, #4f8f6f 0%, #2e6f95 100%);
	}
}

/* Header 左右分欄 */
.detail-header {
	background: linear-gradient(135deg, #4f8f6f 0%, #2e6f95 100%);
	padding: 40px;
	border-radius: 24px;
	margin-bottom: 32px;
	box-shadow: 0 12px 32px rgba(55, 112, 92, 0.22);
	display: flex;
	align-items: flex-end;
}


.header-left {

	color: white;

	.code-tag {
		font-size: 18px;
		font-weight: bold;
	}

	.code-title {
		font-size: 28px;
		font-weight: 700;
		margin: 12px 0;
		line-height: 1.3;
	}

	.code-description {
		font-size: 15px;
		line-height: 1.6;
		opacity: 0.95;
		margin-bottom: 16px;
	}

	.code-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 20px;

		:deep(.el-tag) {
			background-color: rgba(255, 255, 255, 0.2);
			border-color: rgba(255, 255, 255, 0.3);
			color: white;
		}
	}
}

.info-table {
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10px);
	border-radius: 12px;
	padding: 16px;
	border: 1px solid rgba(255, 255, 255, 0.2);
	color: white;

	.info-row {
		display: flex;
		justify-content: space-between;
		padding: 8px 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);

		&:last-child {
			border-bottom: none;
		}
	}

	.info-label {
		font-size: 13px;
		opacity: 0.8;
	}

	.info-value {
		font-size: 13px;
		font-weight: 600;
	}
}

.header-right {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;

	.illustration {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

		.beaker-icon {
			width: 200px;
			height: 200px;
			filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
		}

		.particles {
			position: absolute;
			inset: 0;
			background-image:
				radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
				radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
			background-size: 50px 50px, 80px 80px;
			background-position: 0 0, 40px 40px;
			animation: particle-float 20s linear infinite;
		}
	}
}

@keyframes particle-float {
	from {
		background-position: 0 0, 40px 40px;
	}

	to {
		background-position: 50px 50px, 90px 90px;
	}
}

/* 步驟標題欄 */
.section-title-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 24px;
	padding: 16px 24px;
	background: white;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

	.step-number {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: linear-gradient(135deg, #4f8f6f 0%, #2e6f95 100%);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 16px;
	}

	h2 {
		font-size: 20px;
		font-weight: 700;
		color: #2C3E50;
		margin: 0;
	}

	.subtitle {
		font-size: 13px;
		color: #607d8b;
	}
}

/* 步驟內容容器 */
.step-content {
	animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* 卡片式布局 */
.criteria-cards-grid {
	margin-bottom: 24px;
}

.criteria-card {
	background: white;
	border-radius: 16px;
	padding: 24px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	border: 1px solid #e0e0e0;
	transition: all 0.3s ease;

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 16px;

		.card-icon {
			width: 48px;
			height: 48px;
			border-radius: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24px;

			svg {
				width: 32px;
				height: 32px;
			}
		}

		h3 {
			font-size: 16px;
			font-weight: 600;
			color: #2C3E50;
			margin: 0;
		}
	}

	.card-content {
		.state-tags {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
		}

		.prop-list {
			list-style: none;
			padding: 0;
			margin: 0;

			li {
				display: flex;
				align-items: flex-start;
				gap: 8px;
				padding: 8px 0;
				font-size: 14px;
				color: #37474F;

				.check-icon {
					color: #4CAF50;
					font-weight: bold;
					flex-shrink: 0;
				}

				.warning-icon {
					color: #FF9800;
					font-weight: bold;
					flex-shrink: 0;
				}
			}
		}
	}
}

.physical-card {
	.card-icon {
		background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
	}
}

.chemical-card {
	.card-icon {
		background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
		color: #2196F3;
	}
}

.warning-card {
	.card-icon {
		background: linear-gradient(135deg, #FFF3E0, #FFE0B2);
		color: #FF9800;
	}
}

.requirements-section {
	background: white;
	border-radius: 16px;
	padding: 24px;
	margin-bottom: 24px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

	.requirements-title {
		font-size: 16px;
		font-weight: 600;
		color: #2C3E50;
		margin-bottom: 16px;
	}

	.requirements-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 12px;
	}

	.requirement-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px;
		background: #F5F5F5;
		border-radius: 8px;
		font-size: 14px;
		color: #37474F;
	}
}

/* 溶出試驗標準表格 */
.standards-table-card {

	.card-header .card-icon {
		svg {
			width: 32px;
			height: 32px;
		}
	}
}

.standards-table {
	width: 100%;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	overflow: hidden;

	.table-header {
		display: grid;
		grid-template-columns: 2fr 1fr;
		background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
		font-weight: 700;
		color: #1976D2;
		border-bottom: 2px solid #2196F3;

		.header-cell {
			padding: 16px;
			text-align: center;
			font-size: 14px;

			.unit {
				font-size: 12px;
				font-weight: 500;
				color: #1565C0;
			}
		}
	}

	.table-row {
		display: grid;
		grid-template-columns: 2fr 1fr;
		border-bottom: 1px solid #e0e0e0;
		transition: background-color 0.2s ease;

		&:hover {
			background-color: #f8fbff;
		}

		&:last-child {
			border-bottom: none;
		}
	}

	.table-cell {
		padding: 12px 16px;
		font-size: 13px;
		color: #37474F;
		display: flex;
		align-items: center;
		line-height: 1.5;

		&.value-cell {
			justify-content: center;
			font-weight: 600;
			color: #2196F3;
			font-size: 14px;
		}

		.note {
			display: block;
			font-size: 11px;
			color: #757575;
			font-weight: 400;
			margin-top: 4px;
			line-height: 1.4;
		}
	}
}

.leaching-dialog {
	:deep(.el-dialog__body) {
		max-height: 70vh;
		overflow-y: auto;
	}
}

/* 標準查詢區塊 */
.standards-section {
	background: white;
	padding: 32px;
	border-radius: 20px;
	margin-bottom: 24px;
	box-shadow: 0 12px 28px rgba(80, 116, 96, 0.1);
	border: 1px solid rgba(79, 143, 111, 0.12);
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
}

/* 循環模式 */
.modes-section {
	background: white;
	padding: 32px;
	border-radius: 20px;
	box-shadow: 0 12px 28px rgba(80, 116, 96, 0.1);
	border: 1px solid rgba(79, 143, 111, 0.12);
	margin-bottom: 24px;
}

.modes-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
	gap: 20px;
}

.mode-card {
	cursor: pointer;
	transition: all 0.3s ease;
	border: 1px solid rgba(79, 143, 111, 0.15);

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(79, 143, 111, 0.2);
		border-color: rgba(79, 143, 111, 0.3);
	}
}

.mode-content {
	.mode-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;

		.mode-icon {
			font-size: 32px;
		}

		.mode-code {
			font-size: 12px;
			font-weight: 600;
			color: #4f8f6f;
			background: rgba(79, 143, 111, 0.1);
			padding: 4px 8px;
			border-radius: 4px;
		}
	}

	h4 {
		font-size: 16px;
		color: #2C3E50;
		margin: 0 0 8px 0;
		font-weight: 600;
		text-align: left;
	}

	.mode-description {
		font-size: 13px;
		color: #607d8b;
		line-height: 1.5;
		margin: 0 0 16px 0;
		text-align: left;
	}

	.mode-stats {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-top: 12px;
		border-top: 1px solid #e0e0e0;

		.stat-item {
			display: flex;
			align-items: center;
			gap: 8px;
			font-size: 12px;

			.stat-icon {
				font-size: 16px;
			}

			.stat-label {
				font-size: 11px;
				color: #999;
				margin-right: auto;
			}

			.stat-value {
				font-weight: 600;
				color: #4f8f6f;
			}
		}

		.progress-bar {
			flex: 1;
			height: 6px;
			background: #e0e0e0;
			border-radius: 3px;
			overflow: hidden;
			margin: 0 8px;

			.progress-fill {
				height: 100%;
				background: linear-gradient(90deg, #4f8f6f 0%, #2e6f95 100%);
				border-radius: 3px;
				transition: width 0.3s ease;
			}
		}
	}

	.view-detail-btn {
		margin-top: 12px;
		width: 100%;
	}
}

/* 步驟導航按鈕 */
.step-navigation {
	display: flex;
	justify-content: center;
	gap: 16px;
	margin-top: 32px;
	padding: 24px;

	.el-button {
		min-width: 180px;
	}
}

/* 載入與錯誤 */
.loading-container,
.error-container {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 400px;
	color: #909399;

	.el-icon {
		font-size: 48px;
		margin-bottom: 16px;
	}
}

/* 響應式 */
@media (max-width: 768px) {
	.waste-code-detail {
		padding: 16px;
	}

	.detail-header {
		grid-template-columns: 1fr;
		padding: 24px;
	}

	.header-right {
		height: 200px;

		.illustration .beaker-icon {
			width: 150px;
			height: 150px;
		}
	}

	.code-title {
		font-size: 24px;
	}

	.step-progress {
		padding: 16px;

		.step-label {
			font-size: 11px;
		}

		.step-circle {
			width: 32px;
			height: 32px;
			font-size: 14px;
		}

		.step-line {
			margin: 0 8px;
			max-width: 60px;
		}
	}

	.section-title-bar {
		flex-wrap: wrap;

		.subtitle {
			margin-left: 0;
			width: 100%;
		}
	}


	.step-navigation {
		flex-direction: column;

		.el-button {
			width: 100%;
		}
	}

	.section-header {
		flex-direction: column;
		align-items: stretch;
		gap: 16px;
	}

	.modes-grid {
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	}
}

/* 列印樣式 */
@media print {
	.waste-code-detail {
		max-width: 100%;
		padding: 20px;
	}

	/* 隱藏不需要列印的元素 */
	.no-print,
	.back-nav .el-button,
	.action-buttons,
	.progress-bar-container,
	.step-navigation {
		display: none !important;
	}

	/* 顯示所有步驟內容 */
	.step-content {
		display: block !important;
	}

	/* 調整標題區域 */
	.detail-header {
		background: white !important;
		color: black !important;
		border: 2px solid #4f8f6f;
		padding: 20px;
		margin-bottom: 20px;
		box-shadow: none !important;
		page-break-inside: avoid;
	}

	.code-tag {
		background: white !important;
		color: #4f8f6f !important;
		border: 2px solid #4f8f6f !important;
		padding: 8px 16px;
	}

	.code-title {
		color: #2c3e50 !important;
		font-size: 24px;
		margin: 12px 0;
	}

	.code-description {
		color: #666 !important;
		font-size: 14px;
	}

	.code-tags .el-tag {
		background: white !important;
		color: #666 !important;
		border: 1px solid #ddd !important;
	}

	/* 調整區塊樣式 */
	.acceptance-section,
	.standards-section,
	.modes-section {
		background: white !important;
		border: 1px solid #e0e0e0;
		padding: 20px;
		margin-bottom: 20px;
		box-shadow: none !important;
		border-radius: 8px;
		page-break-inside: avoid;
	}

	.section-title {
		color: #2c3e50 !important;
		font-size: 18px;
		border-bottom: 2px solid #4f8f6f;
		padding-bottom: 8px;
		margin-bottom: 16px;
	}

	/* 允收條件樣式 */
	.criteria-item {
		margin-bottom: 16px;
		page-break-inside: avoid;
	}

	.criteria-list li {
		background: white !important;
		border: 1px solid #e0e0e0 !important;
		color: #333 !important;
	}

	/* 模式卡片 */
	.modes-grid {
		grid-template-columns: repeat(3, 1fr);
	}

	.mode-card {
		border: 1px solid #e0e0e0 !important;
		box-shadow: none !important;
	}

	/* 頁面設定 */
	@page {
		margin: 2cm;
		size: A4;
	}

	/* 防止分頁 */
	h1,
	h2,
	h3,
	h4 {
		page-break-after: avoid;
	}

	/* 添加頁首 */
	.detail-content::before {
		content: "環境部資源循環署 - 廢棄物代碼資訊表";
		display: block;
		font-size: 12px;
		color: #666;
		text-align: center;
		margin-bottom: 20px;
		padding-bottom: 10px;
		border-bottom: 1px solid #ddd;
	}

	/* 添加頁尾 */
	.detail-content::after {
		content: "查詢時間：" attr(data-print-time) " | 資料來源：環境部資源循環署";
		display: block;
		font-size: 10px;
		color: #999;
		text-align: center;
		margin-top: 30px;
		padding-top: 10px;
		border-top: 1px solid #ddd;
	}
}

@media (min-width: 1600px) {
	.waste-code-detail {
		max-width: min(92vw, 1780px);
		padding: 28px 20px;
	}

	.header-left {
		.code-title {
			font-size: clamp(32px, 2vw, 44px);
		}

		.code-description {
			font-size: clamp(16px, 1vw, 20px);
		}
	}

	.section-title-bar h2 {
		font-size: clamp(24px, 1.3vw, 30px);
	}
}
</style>
