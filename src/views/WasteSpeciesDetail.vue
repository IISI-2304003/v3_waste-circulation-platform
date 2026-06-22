<template>
	<div class="waste-species-detail">
		<!-- 頂部導航 -->
		<div class="detail-header-nav">
			<el-button text @click="goBack">
				<el-icon>
					<ArrowLeft />
				</el-icon>
				返回搜尋
			</el-button>
		</div>

		<!-- 主要內容 -->
		<div v-if="species" class="detail-container">
			<div class="detail-wrapper">
				<!-- 左側：物種信息和圖片 -->
				<el-row :gutter="40" class="species-info-section">
					<el-col :xs="24" :sm="24" :md="8" class="species-image-col">
						<div class="species-showcase">
							<div class="species-number-badge">{{ species.id }}</div>
							<div class="species-display-image">
								<img :src="species.image" :alt="species.name" @error="handleImageError" />
							</div>
						</div>
					</el-col>

					<el-col :xs="24" :sm="24" :md="16">
						<!-- 物種名稱和描述 -->
						<div class="species-header">
							<h1 class="species-title">{{ species.name }}</h1>
						</div>

						<!-- 分類說明 -->
						<div class="classification-section">
							<h3 class="section-subtitle">類別說明</h3>
							<div class="classification-content">
								<div class="classification-icon">🏷️</div>
								<p>{{ classificationText }}</p>
							</div>
						</div>

						<!-- 代表項目 -->
						<div class="items-section">
							<h3 class="section-subtitle">代表性項目</h3>
							<ul class="items-list">
								<li v-for="(item, index) in species.representativeItems" :key="index" class="item-row">
									<span class="item-bullet">●</span>
									<span class="item-text">{{ item }}</span>
								</li>
							</ul>
						</div>
					</el-col>
				</el-row>


				<!-- 下一步按鈕 -->
				<div class="action-section">
					<el-button type="primary" size="large" class="next-button" @click="handleNextStep">
						<span class="button-text">下一步：條件設定</span>
						<el-icon class="button-icon">
							<ArrowRight />
						</el-icon>
					</el-button>
				</div>
			</div>
		</div>

		<!-- 錯誤狀態 -->
		<div v-else class="error-container">
			<el-result icon="warning" title="找不到該物種類別" sub-title="請確認物種編號是否正確，或返回搜尋頁重新選擇。">
				<template #extra>
					<el-button type="primary" @click="goBack">返回搜尋</el-button>
				</template>
			</el-result>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import {
	buildSpeciesFallbackImage,
	getWasteSpeciesById,
	getWasteSpeciesCardsLocal,
	normalizeWasteSpeciesList
} from '@/data/wasteSpecies'

const route = useRoute()
const router = useRouter()
const species = ref(null)
const fallbackImage = ref('')

// 預留 API 資料來源；目前使用本地資料，未來可直接替換為 API 回傳。
const apiSpecies = ref([])
const allSpecies = computed(() => {
	if (apiSpecies.value.length > 0) {
		return normalizeWasteSpeciesList(apiSpecies.value)
	}
	return getWasteSpeciesCardsLocal()
})

const speciesItemsMap = computed(() => {
	return allSpecies.value.reduce((acc, item) => {
		acc[item.id] = item.representativeItems || []
		return acc
	}, {})
})

// 分類文本生成
const classificationText = computed(() => {
	if (!species.value) return ''
	const speciesData = allSpecies.value.find(s => s.id === species.value.id)
	return speciesData?.description || ''
})

// 頁面初始化
onMounted(() => {
	const speciesId = route.params.id
	if (!speciesId) {
		ElMessage.error('無效的物種編號')
		return
	}

	const speciesData = getWasteSpeciesById(speciesId, allSpecies.value)
	if (!speciesData) {
		ElMessage.error('找不到該物種')
		return
	}

	species.value = {
		...speciesData,
		representativeItems: speciesItemsMap.value[speciesData.id] || []
	}

	fallbackImage.value = buildSpeciesFallbackImage()
})

// 返回搜尋頁
const goBack = () => {
	router.push({
		path: '/',
		query: {
			from: route.query.from || 'home',
			tab: route.query.tab || 'wasteSpeciesRef'
		}
	})
}

// 圖像加載錯誤
const handleImageError = (event) => {
	const target = event?.target
	if (!target || target.dataset.fallbackApplied === 'true') return
	target.dataset.fallbackApplied = 'true'
	target.src = fallbackImage.value
}

// 下一步
const handleNextStep = () => {
	ElMessage.success(`已選擇 ${species.value.name}，即將進行條件設定`)
	router.push({
		path: '/standard-input',
		query: {
			speciesId: species.value.id,
			speciesName: species.value.name,
			from: 'waste-species'
		}
	})
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.waste-species-detail {
	min-height: 100vh;
	background: linear-gradient(135deg, rgba(245, 250, 248, 0.95), rgba(240, 248, 245, 0.98));
	padding: 24px 0;
}

.detail-header-nav {
	max-width: min(92vw, 1640px);
	margin: 0 auto;
	padding: 0 24px 24px;

	:deep(.el-button) {
		color: $primary-green;
		font-weight: 600;
		transition: all 0.3s ease;

		&:hover {
			color: darken($primary-green, 10%);
			transform: translateX(-4px);
		}
	}
}

.detail-container {
	max-width: min(92vw, 1640px);
	margin: 0 auto;
	padding: 0 24px;
}

.detail-wrapper {
	background: #ffffff;
	border-radius: 28px;
	box-shadow: 0 12px 48px rgba(76, 129, 99, 0.12);
	padding: 48px;
	overflow: hidden;
}

.species-info-section {
	margin-bottom: 48px;
}

.species-image-col {
	display: flex;
	justify-content: center;
	align-items: flex-start;
}

.species-showcase {
	position: relative;
	width: 100%;
	max-width: 320px;
}

.species-number-badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 60px;
	padding: 10px 16px;
	border-radius: 999px;
	background: linear-gradient(135deg, #4f8f6f 0%, #3a7a5c 100%);
	color: #ffffff;
	font-size: 16px;
	font-weight: 700;
	margin-bottom: 16px;
	box-shadow: 0 8px 20px rgba(79, 143, 111, 0.3);
}

.species-display-image {
	width: 100%;
	aspect-ratio: 3 / 2;
	border-radius: 24px;
	background: linear-gradient(160deg, rgba(231, 243, 236, 0.92), rgba(245, 250, 248, 0.96));
	border: 2px solid rgba(79, 143, 111, 0.2);
	overflow: hidden;
	box-shadow: 0 16px 40px rgba(79, 143, 111, 0.15);
	margin-bottom: 12px;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
}

.image-caption {
	margin: 0;
	text-align: center;
	font-size: 13px;
	color: #667f8d;
	font-weight: 500;
}

.species-header {
	margin-bottom: 32px;
}

.species-title {
	margin: 0 0 16px;
	font-size: 42px;
	font-weight: 700;
	color: #2c3e50;
	line-height: 1.3;
	background: linear-gradient(135deg, #2e6e4f 0%, #4f8f6f 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.species-description {
	margin: 0;
	font-size: 16px;
	color: #607d8b;
	line-height: 1.8;
}

.section-subtitle {
	margin: 0 0 16px;
	font-size: 18px;
	font-weight: 700;
	color: #2c3e50;
	display: flex;
	align-items: center;
	gap: 8px;
}

.classification-section {
	margin-bottom: 32px;
}

.classification-content {
	display: flex;
	gap: 16px;
	align-items: flex-start;
	padding: 16px;
	border-radius: 16px;
	background: linear-gradient(135deg, rgba(79, 143, 111, 0.08), rgba(51, 150, 243, 0.06));
	border: 1px solid rgba(79, 143, 111, 0.15);
}

.classification-icon {
	font-size: 24px;
	flex-shrink: 0;
}

.classification-content p {
	margin: 0;
	font-size: 15px;
	color: #445e70;
	line-height: 1.7;
	flex: 1;
}

.items-section {
	margin-bottom: 32px;
}

.items-list {
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 12px;
}

.item-row {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 12px 16px;
	border-radius: 12px;
	background: rgba(79, 143, 111, 0.06);
	border: 1px solid rgba(79, 143, 111, 0.1);
	transition: all 0.3s ease;

	&:hover {
		background: rgba(79, 143, 111, 0.12);
		border-color: rgba(79, 143, 111, 0.2);
		transform: translateX(4px);
	}
}

.item-bullet {
	color: $primary-green;
	font-weight: 700;
	font-size: 16px;
	flex-shrink: 0;
}

.item-text {
	font-size: 14px;
	color: #445e70;
	font-weight: 500;
}

.reminder-section {
	margin-bottom: 32px;

	:deep(.el-alert) {
		border-radius: 16px;
		border-width: 2px;
		padding: 16px 20px;
		background: linear-gradient(135deg, rgba(255, 193, 7, 0.08), rgba(255, 152, 0, 0.06));
		border-color: rgba(255, 193, 7, 0.3);

		.el-alert__title {
			font-weight: 700;
			color: #ff9800;
		}

		.el-alert__description {
			color: #ff6f00;
			font-size: 14px;
			line-height: 1.6;
		}
	}
}

.action-section {
	display: flex;
	justify-content: center;
	gap: 16px;
	padding-top: 32px;
	border-top: 2px solid rgba(79, 143, 111, 0.1);
}

.next-button {
	min-width: 280px;
	height: 56px;
	font-size: 16px;
	font-weight: 600;
	border-radius: 14px;
	background: linear-gradient(135deg, #4f8f6f 0%, #2e6e4f 100%);
	border: none;
	box-shadow: 0 12px 32px rgba(79, 143, 111, 0.28);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 48px rgba(79, 143, 111, 0.36);
		background: linear-gradient(135deg, #5da07d 0%, #3a7a5c 100%);
	}

	&:active {
		transform: translateY(-2px);
	}

	.button-text {
		font-weight: 700;
		letter-spacing: 0.5px;
	}

	.button-icon {
		font-size: 18px;
		transition: transform 0.3s ease;
	}

	&:hover .button-icon {
		transform: translateX(4px);
	}
}

.error-container {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 400px;
	background: #ffffff;
	border-radius: 28px;
	box-shadow: 0 12px 48px rgba(76, 129, 99, 0.12);
}

// 響應式設計
@media (max-width: 1024px) {
	.detail-wrapper {
		padding: 32px;
	}

	.species-title {
		font-size: 32px;
	}

	.items-list {
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	}
}

@media (max-width: 768px) {
	.waste-species-detail {
		padding: 16px 0;
	}

	.detail-wrapper {
		padding: 24px;
		border-radius: 20px;
	}

	.detail-header-nav {
		padding: 0 16px 16px;
	}

	.species-info-section {
		margin-bottom: 32px;
	}

	.species-title {
		font-size: 28px;
		margin-bottom: 12px;
	}

	.species-description {
		font-size: 15px;
	}

	.section-subtitle {
		font-size: 16px;
		margin-bottom: 12px;
	}

	.items-section {
		margin-bottom: 24px;
	}

	.items-list {
		gap: 8px;
	}

	.item-row {
		padding: 10px 12px;
		gap: 8px;
	}

	.item-text {
		font-size: 13px;
	}

	.action-section {
		padding-top: 24px;
	}

	.next-button {
		min-width: auto;
		width: 100%;
		height: 48px;
		font-size: 15px;
	}
}

@media (max-width: 576px) {
	.detail-wrapper {
		padding: 16px;
		border-radius: 16px;
	}

	.species-display-image {
		aspect-ratio: 4 / 3;
		border-radius: 16px;
		margin-bottom: 12px;
	}

	.species-title {
		font-size: 24px;
	}

	.species-description {
		font-size: 14px;
	}

	.classification-content {
		gap: 12px;
		padding: 12px;
	}

	.classification-icon {
		font-size: 20px;
	}

	.classification-content p {
		font-size: 14px;
	}

	.items-list {
		grid-template-columns: 1fr;
		gap: 8px;
	}

	.next-button {
		height: 44px;
		font-size: 14px;
		gap: 6px;
	}
}

@media (min-width: 1600px) {

	.detail-header-nav,
	.detail-container {
		max-width: min(92vw, 1780px);
		padding-left: 20px;
		padding-right: 20px;
	}

	.detail-wrapper {
		padding: 56px;
	}

	.species-title {
		font-size: clamp(46px, 2.1vw, 58px);
	}

	.classification-content p,
	.item-text {
		font-size: clamp(16px, 1vw, 19px);
	}
}
</style>
