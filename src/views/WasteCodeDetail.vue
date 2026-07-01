<template>
	<div class="waste-code-detail">
		<div class="back-nav">
			<el-button text @click="goBack">
				<el-icon>
					<ArrowLeft />
				</el-icon>
				返回搜尋
			</el-button>
			<div class="action-buttons">
				<el-button @click="handlePrint">
					<el-icon>
						<Document />
					</el-icon>
					列印
				</el-button>
			</div>
		</div>

		<div v-if="loading" class="loading-container">
			<el-icon class="is-loading">
				<Loading />
			</el-icon>
			<p>載入中...</p>
		</div>

		<div v-else-if="wasteCode" class="detail-content">
			<section class="detail-header">
				<div class="header-left">
					<el-tag size="large" class="code-tag">{{ wasteCode.code }}</el-tag>
					<h1 class="code-title">{{ wasteCode.name }}</h1>
					<p class="code-description">{{ wasteCode.description }}</p>
					<div class="code-tags">
						<el-tag v-for="tag in wasteCode.tags || []" :key="tag" type="info" size="small">
							{{ tag }}
						</el-tag>
					</div>
				</div>

				<div class="header-right">
					<div class="info-table">
						<div class="info-row">
							<div class="info-label">類別</div>
							<div class="info-value">{{ category?.name || '未分類' }}</div>
						</div>
						<div class="info-row">
							<div class="info-label">主要成分</div>
							<div class="info-value">{{ wasteCode.mainComponent || '未設定' }}</div>
						</div>
						<div class="info-row">
							<div class="info-label">循環模式</div>
							<div class="info-value">{{ availableModes.length }} 項</div>
						</div>
					</div>
				</div>
			</section>

			<section class="content-card">
				<div class="section-title-bar">
					<div class="step-number">1</div>
					<h2>允收標準</h2>
				</div>
				<div v-if="standards.length" class="standards-list">
					<div v-for="standard in standards" :key="standard.parameter + standard.operator + standard.value" class="standard-item">
						<div class="standard-name">{{ standard.parameter }}</div>
						<div class="standard-meta">
							<span>{{ standard.operator || '備註' }}</span>
							<span v-if="standard.value !== ''">{{ standard.value }}{{ standard.unit || '' }}</span>
							<span v-else>{{ standard.condition || '備註' }}</span>
						</div>
					</div>
				</div>
				<p v-else class="empty-text">目前沒有可顯示的允收標準。</p>
			</section>

			<section class="content-card">
				<div class="section-title-bar">
					<div class="step-number">2</div>
					<h2>適用循環模式</h2>
				</div>
				<div v-if="availableModes.length" class="modes-grid">
					<article v-for="mode in availableModes" :key="mode.id" class="mode-card">
						<div class="mode-icon">{{ mode.icon }}</div>
						<h3>{{ mode.name }}</h3>
						<p>{{ mode.description }}</p>
					</article>
				</div>
				<p v-else class="empty-text">目前沒有對應的循環模式。</p>
			</section>
		</div>

		<div v-else class="error-container">
			<el-result icon="warning" title="找不到該廢棄物代碼" sub-title="請確認代碼是否正確，或返回搜尋頁重新選擇。">
				<template #extra>
					<el-button type="primary" @click="goBack">返回搜尋</el-button>
				</template>
			</el-result>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Document, Loading } from '@element-plus/icons-vue'
import { getWasteCodeDetail } from '@/api/wasteCode'
import { getCategoryById } from '@/data/wasteCategories'
import circulationModes from '@/data/circulationModes.json'

const route = useRoute()
const router = useRouter()
const wasteCode = ref(null)
const loading = ref(true)

const category = computed(() => {
	if (!wasteCode.value) return null
	return getCategoryById(wasteCode.value.categoryId)
})

const standards = computed(() => wasteCode.value?.standards || [])

const availableModes = computed(() => {
	const modeIds = wasteCode.value?.circulationModes || []
	if (!modeIds.length) return []
	return circulationModes.filter((mode) => modeIds.includes(mode.id))
})

const loadWasteCode = async () => {
	const code = route.params.code
	if (!code) {
		loading.value = false
		return
	}

	try {
		loading.value = true
		wasteCode.value = await getWasteCodeDetail(code)
	} catch (error) {
		ElMessage.error(`無法載入廢棄物代碼：${code}`)
		wasteCode.value = null
	} finally {
		loading.value = false
	}
}

const goBack = () => {
	router.push('/waste')
}

const handlePrint = () => {
	window.print()
}

onMounted(loadWasteCode)
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.waste-code-detail {
	max-width: min(92vw, 1320px);
	margin: 0 auto;
	padding: 24px 20px 96px;
	min-height: 80vh;
	background: linear-gradient(180deg, rgba($primary-green, 0.05), rgba($bg-primary, 1));
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

.loading-container,
.error-container {
	min-height: 420px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	color: $text-tertiary;
}

.loading-container .el-icon {
	font-size: 40px;
	margin-bottom: 12px;
}

.detail-content {
	display: grid;
	gap: 24px;
}

.detail-header,
.content-card {
	background: $bg-card;
	border: 1px solid $border-color;
	border-radius: $card-radius;
	box-shadow: $shadow-card;
}

.detail-header {
	display: grid;
	grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.9fr);
	gap: 24px;
	padding: 28px;
}

.header-left {
	min-width: 0;
}

.code-tag {
	margin-bottom: 14px;
}

.code-title {
	margin: 0 0 12px;
	font-size: clamp(28px, 2.4vw, 42px);
	font-weight: $font-weight-bold;
	color: $text-primary;
}

.code-description {
	margin: 0 0 16px;
	color: $text-secondary;
	line-height: 1.8;
}

.code-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.info-table {
	display: grid;
	gap: 10px;
	padding: 18px;
	border-radius: $input-radius;
	background: $bg-section;
	border: 1px solid $border-light;
}

.info-row {
	display: flex;
	justify-content: space-between;
	gap: 12px;
	padding-bottom: 10px;
	border-bottom: 1px solid $border-light;
}

.info-row:last-child {
	border-bottom: none;
	padding-bottom: 0;
}

.info-label {
	color: $text-tertiary;
	font-size: $font-size-small;
}

.info-value {
	color: $text-primary;
	font-weight: $font-weight-semibold;
	text-align: right;
}

.content-card {
	padding: 24px;
}

.section-title-bar {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 18px;
}

.step-number {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: $primary-green;
	color: $bg-primary;
	font-weight: $font-weight-bold;
}

.section-title-bar h2 {
	font-size: 20px;
	color: $text-primary;
}

.standards-list,
.modes-grid {
	display: grid;
	gap: 12px;
}

.standard-item,
.mode-card {
	border: 1px solid $border-color;
	border-radius: $input-radius;
	background: $bg-primary;
}

.standard-item {
	padding: 14px 16px;
}

.standard-name {
	font-weight: $font-weight-semibold;
	color: $text-primary;
	margin-bottom: 6px;
}

.standard-meta {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	color: $text-secondary;
	font-size: $font-size-small;
}

.modes-grid {
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.mode-card {
	padding: 16px;
}

.mode-icon {
	width: 44px;
	height: 44px;
	border-radius: $radius-button;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: rgba($primary-green, 0.1);
	color: $primary-green;
	margin-bottom: 12px;
	font-weight: $font-weight-bold;
}

.mode-card h3 {
	margin: 0 0 8px;
	color: $text-primary;
	font-size: 16px;
}

.mode-card p,
.empty-text {
	margin: 0;
	color: $text-secondary;
	line-height: 1.7;
}

.empty-text {
	padding: 12px 0 0;
}

@media (max-width: 1024px) {
	.detail-header {
		grid-template-columns: 1fr;
	}
}

@media (max-width: 768px) {
	.waste-code-detail {
		padding: 18px 12px 88px;
	}

	.back-nav {
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
	}

	.content-card,
	.detail-header {
		padding: 18px;
	}

	.section-title-bar {
		align-items: flex-start;
		flex-wrap: wrap;
	}
}
</style>
