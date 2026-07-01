<template>
	<div class="waste-search-page">
		<div class="page-header">
			<h1 class="page-title">廢棄物代碼查詢</h1>
			<p class="page-description">選擇類別或直接搜尋廢棄物代碼，查看詳細的允收條件與標準</p>
		</div>

		<!-- 合併式搜尋選擇器 -->
		<div class="search-section">
			<el-select v-model="selectedCode" filterable clearable placeholder="選擇類別或輸入代碼搜尋（如：C-0202）" size="large" class="waste-selector" @change="handleCodeSelect">
				<el-option-group v-for="category in categories" :key="category.id" :label="category.name">
					<el-option v-for="code in category.codes" :key="code.id" :label="`${code.code} | ${code.name}`" :value="code.code">
						<div class="option-content">
							<el-tag :color="category.color" size="small" class="code-badge">
								{{ code.code }}
							</el-tag>
							<span class="code-name">{{ code.name }}</span>
						</div>
					</el-option>
				</el-option-group>
			</el-select>

			<el-button v-if="selectedCode" type="primary" size="large" class="detail-button" @click="goToDetail">
				查看詳細資訊
				<el-icon class="el-icon--right">
					<ArrowRight />
				</el-icon>
			</el-button>
		</div>

		<!-- 目前選中代碼的快速資訊 -->
		<div v-if="currentCodeInfo" class="quick-info-card">
			<div class="info-header">
				<el-tag :color="currentCodeInfo.categoryColor" size="large">
					{{ currentCodeInfo.code }}
				</el-tag>
				<h3>{{ currentCodeInfo.name }}</h3>
			</div>
			<p class="info-description">{{ currentCodeInfo.description }}</p>

			<div class="info-tags">
				<el-tag v-for="tag in currentCodeInfo.tags" :key="tag" type="info" size="small">
					{{ tag }}
				</el-tag>
			</div>
		</div>

		<!-- 快速瀏覽 -->
		<div v-if="!selectedCode" class="recent-section">
			<h3 class="section-title">快速存取</h3>
			<el-row :gutter="16">
				<el-col :xs="24" :sm="12" :md="8" v-for="code in quickAccessCodes" :key="code.code">
					<el-card class="code-card" shadow="hover" @click="handleQuickAccess(code.code)">
						<div class="card-header">
							<el-tag size="small">{{ code.code }}</el-tag>
						</div>
						<div class="card-content">
							<h4>{{ code.name }}</h4>
							<p class="card-description">{{ code.description }}</p>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>

		<!-- 載入狀態 -->
		<div v-if="loading" class="loading-container">
			<el-icon class="is-loading">
				<Loading />
			</el-icon>
			<p>載入中...</p>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowRight, Loading } from '@element-plus/icons-vue'
import { getCategories, getWasteCodeDetail } from '@/api/wasteCode'

const router = useRouter()

// 狀態
const categories = ref([])
const selectedCode = ref('C-0202')
const currentCodeInfo = ref(null)
const loading = ref(false)

// 快速存取代碼
// 說明：依目前條件即時計算「quick Access Codes」內容，提供畫面顯示與決策判斷使用。
const quickAccessCodes = computed(() => {
	if (categories.value.length === 0) return []

	return [
		...(categories.value[2]?.codes.slice(0, 3) || []),
		...(categories.value[0]?.codes.slice(0, 3) || [])
	]
})

// 載入類別資料
onMounted(async () => {
	loading.value = true
	try {
		categories.value = await getCategories()

		// 載入預設選中代碼資訊
		if (selectedCode.value) {
			await loadCodeInfo(selectedCode.value)
		}
	} catch (error) {
		ElMessage.error('載入資料失敗')
		console.error(error)
	} finally {
		loading.value = false
	}
})

// 載入代碼詳細資訊
// 說明：封裝「load Code Info」商業邏輯，供目前流程重複使用。
const loadCodeInfo = async (code) => {
	try {
		const detail = await getWasteCodeDetail(code)
		// 說明：封裝「category」商業邏輯，供目前流程重複使用。
		const category = categories.value.find(cat => cat.id === detail.categoryId)

		currentCodeInfo.value = {
			...detail,
			categoryColor: category?.color || '#999'
		}
	} catch (error) {
		console.error('載入代碼資訊失敗：', error)
		currentCodeInfo.value = null
	}
}

// 選擇代碼後的處理
// 說明：由使用者互動觸發；執行「handle Code Select」流程並同步更新相關狀態。
const handleCodeSelect = async (code) => {
	if (!code) {
		currentCodeInfo.value = null
		return
	}

	await loadCodeInfo(code)
}

// 前往詳情頁
// 說明：由導覽按鈕觸發；切換路由或流程步驟狀態。
const goToDetail = () => {
	if (selectedCode.value) {
		router.push(`/waste/${selectedCode.value}`)
	}
}

// 點擊快速卡片
// 說明：由使用者互動觸發；執行「handle Quick Access」流程並同步更新相關狀態。
const handleQuickAccess = (code) => {
	router.push(`/waste/${code}`)
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.waste-search-page {
	max-width: 1200px;
	margin: 0 auto;
	padding: 24px 20px 96px;
	min-height: 80vh;
	background: linear-gradient(180deg, rgba($primary-green, 0.08), rgba($bg-primary, 0.98));
	border-radius: $card-radius;
}

.page-header {
	text-align: center;
	margin-bottom: 48px;
}

.page-title {
	font-size: 36px;
	font-weight: $font-weight-bold;
	color: $text-primary;
	margin-bottom: 16px;
}

.page-description {
	font-size: 16px;
	color: $text-secondary;
	max-width: 600px;
	margin: 0 auto;
}

/* 搜尋區塊 */
.search-section {
	max-width: 800px;
	margin: 0 auto 40px;
	display: flex;
	gap: 16px;
	align-items: center;
	padding: 18px;
	background: rgba($bg-primary, 0.86);
	border: 1px solid $border-color;
	border-radius: $card-radius;
	backdrop-filter: blur(10px);
	box-shadow: $shadow-card;
}

.waste-selector {
	flex: 1;
}

.detail-button {
	flex-shrink: 0;
}

/* 自定义选项样式 */
:deep(.el-select-dropdown__item) {
	.option-content {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;

		.code-badge {
			flex-shrink: 0;
			font-weight: 600;
			font-size: 12px;
		}

		.code-name {
			flex: 1;
			color: $text-secondary;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}

/* 快速信息卡片 */
.quick-info-card {
	max-width: 800px;
	margin: 0 auto 40px;
	padding: 24px;
	background: linear-gradient(145deg, rgba($primary-green, 0.12), rgba($bg-section, 0.98));
	border-radius: $card-radius;
	border: 1px solid rgba($primary-green, 0.22);
	box-shadow: $shadow-card;
	animation: fadeIn 0.3s ease-out;
}

.info-header {
	display: flex;
	align-items: center;
	gap: 16px;
	margin-bottom: 16px;

	h3 {
		font-size: 20px;
		font-weight: $font-weight-semibold;
		color: $text-primary;
		margin: 0;
	}
}

.info-description {
	color: $text-secondary;
	line-height: 1.6;
	margin-bottom: 16px;
}

.info-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

/* 快速访问区域 */
.recent-section {
	margin-top: 48px;
}

.section-title {
	font-size: 24px;
	font-weight: $font-weight-semibold;
	color: $text-primary;
	margin-bottom: 24px;
	text-align: center;
}

.code-card {
	cursor: pointer;
	transition: all 0.3s ease;
	margin-bottom: 16px;

	&:hover {
		transform: translateY(-4px);
		box-shadow: $shadow-hover;
	}
}

.card-header {
	margin-bottom: 12px;
}

.card-content {
	h4 {
		font-size: 16px;
		font-weight: $font-weight-semibold;
		color: $text-primary;
		margin-bottom: 8px;
	}
}

.card-description {
	font-size: 14px;
	color: $text-secondary;
	line-height: 1.5;
	display: -webkit-box;
	line-clamp: 2;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

/* Loading */
.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60px 0;
	color: $text-tertiary;

	.el-icon {
		font-size: 48px;
		margin-bottom: 16px;
	}
}

/* 动画 */
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(20px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* 响应式 */
@media (max-width: 768px) {
	.waste-search-page {
		padding: 18px 12px 88px;
	}

	.page-title {
		font-size: 28px;
	}

	.search-section {
		flex-direction: column;

		.detail-button {
			width: 100%;
		}
	}

	.quick-info-card {
		padding: 16px;
	}
}
</style>
