<template>
	<div ref="gridRef" class="circulation-modes-grid" :style="gridStyle">
		<div class="circle-container">
			<!-- 中央地球循環圖 -->
			<div class="center-earth">
				<img class="earth-image" src="../assets/earth.png" alt="Earth" />
			</div>

			<!-- 連接線動畫 -->
			<svg class="connection-lines" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stop-color="rgba(76, 175, 80, 0.4)" />
						<stop offset="50%" stop-color="rgba(76, 175, 80, 0.2)" />
						<stop offset="100%" stop-color="rgba(76, 175, 80, 0)" />
					</radialGradient>
				</defs>
				<circle class="pulse-circle" cx="250" cy="250" r="180" fill="none" stroke="#FFF" stroke-width="2" stroke-dasharray="10,5" />
				<!-- 外層光暈 -->
				<circle class="pulse-circle-2-glow" cx="250" cy="250" r="120" fill="none" stroke="rgba(76, 175, 80, 0.4)" stroke-width="8" />

			</svg>

			<!-- 環繞的循環模式圖標 -->
			<div class="modes-circle">
				<div v-for="(mode, index) in modes" :key="mode.id" class="mode-item" :style="getModePosition(index)" @click="handleModeClick(mode)">
					<div class="mode-circle" :style="{
						borderColor: mode.color,
						animationDelay: `${index * 0.1}s`,
						'--glow-color': mode.color
					}">
						<div class="icon-glow" :style="{ backgroundColor: mode.color }"></div>
						<el-icon :size="28" :style="{ color: mode.color }">
							<component :is="getIcon(mode.icon)" />
						</el-icon>
					</div>
					<span class="mode-name" :style="{ animationDelay: `${index * 0.1}s` }">
						{{ getShortName(mode.name) }}
					</span>
				</div>
			</div>

			<!-- 點選後顯示的卡片區塊內容 -->
			<div v-if="selectedMode" class="mode-detail-card">
				<h3>{{ selectedMode.name }}</h3>
				<p>{{ selectedMode.description || '尚未提供模式說明。' }}</p>
				<el-button type="primary" round class="explore-btn" @click="handleExploreMode">
					探索此模式
				</el-button>
			</div>

		</div>
	</div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
	Operation,
	Connection,
	OfficeBuilding,
	Link,
	Share,
	Lightning,
	Coin,
	House,
	Apple,
	Star
} from '@element-plus/icons-vue'

const props = defineProps({
	modes: {
		type: Array,
		required: true
	}
})

const emit = defineEmits(['mode-click'])
const selectedMode = ref(null)
const gridRef = ref(null)
const gridMetrics = ref({
	width: 0,
	viewportWidth: 0,
	viewportHeight: 0
})

let gridResizeObserver = null

// 說明：將輸入資料標準化為系統格式，供媒合與查詢流程使用。
const normalizeModeName = (name = '') => String(name).replace(/\s+/g, '').trim()

// 說明：初始化模式卡片時優先選擇「廠內模式1」，若不存在則退回第一筆模式。
const getDefaultMode = (modes = []) => {
	const targetName = normalizeModeName('廠內模式1')
	// 說明：封裝「matched Mode」商業邏輯，供目前流程重複使用。
	const matchedMode = modes.find((mode) => normalizeModeName(mode?.name) === targetName)
	return matchedMode || modes[0] || null
}

// 基準畫布尺寸（所有縮放的基準值）。
// 想讓整體更大/更小可先調這個數字，再搭配 gridScale 的上下限微調。
const BASE_GRID_SIZE = 700

// 取得容器寬度與 viewport 尺寸。
// 這些數值會影響：整體縮放比例、最小高度、圓周半徑。
// 說明：在尺寸或資料變動時觸發；更新畫面計算所需的 state。
const updateGridMetrics = () => {
	gridMetrics.value = {
		width: gridRef.value?.clientWidth || 0,
		viewportWidth: window.innerWidth || 0,
		viewportHeight: window.innerHeight || 0
	}
}

// 控制「十大循環圖整體大小」的核心函式。
// 可調整重點：
// 1) horizontalReserve / verticalReserve：預留空間（避免被頁面上下左右擠壓）
// 2) widthScale / heightScale 下限 0.56：最小縮放
// 3) laptopBoost：不同螢幕額外放大倍率
// 4) 最後回傳的上限 1.42：最大縮放
// 說明：依目前條件即時計算「grid Scale」內容，提供畫面顯示與決策判斷使用。
const gridScale = computed(() => {
	const availableWidth = gridMetrics.value.width || 720
	const viewportWidth = gridMetrics.value.viewportWidth || 1366
	const viewportHeight = gridMetrics.value.viewportHeight || 900
	const horizontalReserve = availableWidth < 420 ? 24 : availableWidth < 560 ? 28 : 36
	const verticalReserve = availableWidth < 969 ? 250 : 210
	const widthScale = Math.max((availableWidth - horizontalReserve) / BASE_GRID_SIZE, 0.56)
	const heightScale = Math.max((viewportHeight - verticalReserve) / BASE_GRID_SIZE, 0.56)
	const laptopBoost = viewportWidth >= 1800 ? 0.03 : viewportWidth >= 1200 && viewportWidth < 1800 ? 0.2 : viewportWidth >= 992 ? 0.08 : 0.2
	return Math.min(Math.max(Math.min(widthScale, heightScale) + laptopBoost, 0.56), 1.42)
})

// 將縮放結果寫入 CSS 變數，並同步控制區塊最小高度。
// minHeight 的 56 / 380 可用來調整下方留白與最小可視高度。
// 說明：依目前條件即時計算「grid Style」內容，提供畫面顯示與決策判斷使用。
const gridStyle = computed(() => ({
	'--grid-scale': gridScale.value.toFixed(3),
	minHeight: `${Math.max(Math.round(BASE_GRID_SIZE * gridScale.value) + 56, 380)}px`
}))

// 控制「外圈模式點離中心多遠」：數值越大越發散。
// 若要調整十大模式的圓周擴散程度，改這裡最直接。
// 說明：依目前條件即時計算「orbit Radius」內容，提供畫面顯示與決策判斷使用。
const orbitRadius = computed(() => {
	const viewportWidth = gridMetrics.value.viewportWidth || 1366
	if (viewportWidth <= 576) return 200
	if (viewportWidth <= 968) return 215
	if (viewportWidth >= 1600) return 250
	return 225
})

// 圖標映射
const iconMap = {
	'cycle-internal': Operation,
	'cycle-cross-process': Connection,
	'cycle-park': OfficeBuilding,
	'cycle-supply-chain': Link,
	'cycle-cross-industry': Share,
	'cycle-energy': Lightning,
	'cycle-extraction': Coin,
	'cycle-construction': House,
	'cycle-compost': Apple,
	'cycle-innovation': Star
}

// 說明：回傳「get Icon」資料供畫面渲染或後續商業規則使用。
const getIcon = (iconName) => {
	return iconMap[iconName] || Operation
}

// 縮短名稱顯示
// 說明：回傳「get Short Name」資料供畫面渲染或後續商業規則使用。
const getShortName = (name) => {
	const shortNames = {
		'內部循環利用': '內循環',
		'跨製程循環': '跨製程',
		'園區聯合利用': '園區聯合',
		'供應鏈整合': '供應鏈',
		'跨產業共生': '跨產業',
		'能源回收': '能源回收',
		'原物料提取': '原料提取',
		'營建剩餘土石方': '營建土石',
		'有機資材製作': '有機資材',
		'創新技術應用': '創新技術'
	}
	return shortNames[name] || name
}

// 計算圓形位置（10個點均勻分布在圓周上）
// 說明：回傳「get Mode Position」資料供畫面渲染或後續商業規則使用。
const getModePosition = (index) => {
	const totalModes = 10
	const angle = (index * 360 / totalModes) - 90 // -90 度：第一個模式顯示在正上方
	const radius = orbitRadius.value // 半徑來源：orbitRadius（控制發散距離）

	const radian = (angle * Math.PI) / 180
	const x = radius * Math.cos(radian)
	const y = radius * Math.sin(radian)

	return {
		'--x': `${x}px`,
		'--y': `${y}px`,
		transform: `translate(${x}px, ${y}px)`,
		animationDelay: `${index * 0.1}s`
	}
}

// 說明：由圓環模式節點點擊觸發；更新 selectedMode 顯示對應模式卡片。
const handleModeClick = (mode) => {
	selectedMode.value = mode
}

// 說明：由「探索此模式」按鈕觸發；送出 mode-click 事件給父層進行後續流程。
const handleExploreMode = () => {
	if (!selectedMode.value) return
	emit('mode-click', selectedMode.value)
}

watch(
	() => props.modes,
	(modes) => {
		if (!Array.isArray(modes) || modes.length === 0) return
		if (selectedMode.value) return
		selectedMode.value = getDefaultMode(modes)
	},
	{ immediate: true }
)

onMounted(() => {
	updateGridMetrics()
	window.addEventListener('resize', updateGridMetrics)

	if (typeof ResizeObserver !== 'undefined') {
		gridResizeObserver = new ResizeObserver(() => {
			updateGridMetrics()
		})

		if (gridRef.value) {
			gridResizeObserver.observe(gridRef.value)
		}
	}
})

onBeforeUnmount(() => {
	window.removeEventListener('resize', updateGridMetrics)
	gridResizeObserver?.disconnect()
})
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.circulation-modes-grid {
	--grid-scale: 1;
	/* 控制整個圓圖左右位移：負值往左，正值往右 */
	--grid-offset-x: -70px;
	width: 100%;
	padding: 0;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 430px;
}

.circle-container {
	position: relative;
	width: 500px;
	height: 500px;
	display: flex;
	align-items: center;
	justify-content: center;
	transform: translateX(var(--grid-offset-x)) scale(var(--grid-scale));
	transform-origin: center center;

	/* 中央地球循環圖 */
	.center-earth {
		position: relative;
		width: 500px;
		height: 500px;
		z-index: 5;
		display: flex;
		align-items: center;
		justify-content: center;
		left: -160px;
	}

	.earth-glow {
		position: absolute;
		width: 180px;
		height: 180px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(76, 175, 80, 0.3) 0%, rgba(76, 175, 80, 0.1) 40%, transparent 70%);
		animation: pulse-glow 3s ease-in-out infinite;
	}

	.earth-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
		opacity: 0.7;
	}
}


.recycle-icon {
	position: relative;
	width: 100px;
	height: 100px;
	background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(240, 255, 245, 0.9) 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 30px rgba(76, 175, 80, 0.4), 0 0 60px rgba(76, 175, 80, 0.2), inset 0 0 20px rgba(76, 175, 80, 0.1);
	animation: float-rotate 6s ease-in-out infinite;
	z-index: 6;

	svg {
		width: 70px;
		height: 70px;
		filter: drop-shadow(0 2px 8px rgba(76, 175, 80, 0.3));
	}
}

.rotating-circle {
	animation: rotate 10s linear infinite;
}

/* 連接線 */
.connection-lines {
	position: absolute;
	top: -9%;
	left: -37%;
	width: 105%;
	height: 105%;
	z-index: 1;
	pointer-events: none;
}

.glow-circle {
	animation: glow-pulse 3s ease-in-out infinite;
}

/* 環繞的模式圖標 */
.modes-circle {
	position: absolute;
	top: -15%;
	left: -40%;
	width: 100%;
	height: 100%;
	z-index: 20;

	.mode-item {
		position: absolute;
		top: 50%;
		left: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		animation: fadeInScale 0.6s ease-out backwards;
		transition: all 0.3s ease;
		z-index: 21;

		&:hover {
			transform: translate(var(--x), var(--y)) scale(1.15) !important;
			z-index: 10;

			.mode-circle {
				box-shadow: 0 0 25px var(--glow-color), 0 0 40px rgba(76, 175, 80, 0.3), 0 8px 24px rgba(0, 0, 0, 0.2);
				transform: scale(1.1);
				border-color: var(--glow-color);
			}

			.icon-glow {
				opacity: 0.3;
				transform: scale(1.5);
			}

			.mode-name {
				color: #4CAF50;
				font-weight: 600;
				box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
			}
		}
	}

	.mode-circle {
		position: relative;
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: linear-gradient(145deg, #ffffff, #f0fff5);
		display: flex;
		align-items: center;
		justify-content: center;
		border: 3px solid #E0E0E0;
		transition: all 0.4s ease;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15), inset 0 1px 3px rgba(255, 255, 255, 0.8);
		animation: floating 3s ease-in-out infinite;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), transparent);
			border-radius: 50%;
			pointer-events: none;
		}
	}
}


.icon-glow {
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	opacity: 0;
	filter: blur(15px);
	transition: all 0.4s ease;
	z-index: 0;
}

.mode-circle .el-icon {
	position: relative;
	z-index: 1;
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.mode-name {
	/* 桌面版模式名稱字級：想放大/縮小標籤文字改這裡 */
	font-size: clamp(20px, 0.75vw, 18px);
	color: #2C3E50;
	font-weight: 600;
	text-align: center;
	white-space: nowrap;
	transition: all 0.3s;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(8px);
	padding: 6px 12px;
	border-radius: 10px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	animation: fadeInUp 0.6s ease-out backwards;
	border: 1px solid rgba(76, 175, 80, 0.1);
	pointer-events: none;
}

.pulse-circle {
	animation: pulse-ring 3s ease-in-out infinite;
}

.pulse-circle-2-glow {
	filter: blur(5px);
	animation: glow-ring 3s ease-in-out infinite 0.5s;
}

.pulse-circle-2 {
	animation: pulse-ring 3s ease-in-out infinite 0.5s;
}

/* 卡片區塊內容 */
.mode-detail-card {
	position: absolute;
	right: -120px;
	top: 20%;
	width: 200px;
	min-height: 250px;
	background: #fffff9f6;
	border-radius: 16px;
	padding: 20px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
	z-index: 5;
	animation: fadeInUp 0.5s ease-out;
	display: flex;
	flex-direction: column;
	gap: 12px;

	h3 {
		margin: 0;
		color: #4CAF50;
	}

	p {
		margin: 0;
		color: #333;
		line-height: 1.6;
		flex: 1;
		font-size: 18px;
	}

	.explore-btn {
		width: 100%;
	}
}

/* 動畫 */
@keyframes rotate {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}

@keyframes float-rotate {

	0%,
	100% {
		transform: translateY(0) rotate(0deg);
	}

	50% {
		transform: translateY(-10px) rotate(180deg);
	}
}

@keyframes pulse-glow {

	0%,
	100% {
		transform: scale(1);
		opacity: 1;
	}

	50% {
		transform: scale(1.1);
		opacity: 0.8;
	}
}

@keyframes glow-pulse {

	0%,
	100% {
		opacity: 0.5;
	}

	50% {
		opacity: 0.8;
	}
}

@keyframes pulse-ring {

	0%,
	100% {
		stroke-opacity: 0.3;
	}

	50% {
		stroke-opacity: 0.6;
	}
}

@keyframes glow-ring {

	0%,
	100% {
		stroke-opacity: 0.3;
		stroke-width: 8;
	}

	50% {
		stroke-opacity: 0.6;
		stroke-width: 10;
	}
}

@keyframes floating {

	0%,
	100% {
		transform: translateY(0);
	}

	50% {
		transform: translateY(-5px);
	}
}

@keyframes fadeInScale {
	from {
		opacity: 0;
		transform: translate(var(--x), var(--y)) scale(0.5);
	}

	to {
		opacity: 1;
		transform: translate(var(--x), var(--y)) scale(1);
	}
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(10px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* 手機版 */
@media (max-width: 968px) {
	.circulation-modes-grid {
		padding: 40px 0 16px 0;
		min-height: 800px;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		width: 100%;
		margin: 0 auto;
		--grid-scale: 1.1;
		/* 平板/手機位移校正：避免整體偏右 */
		--grid-offset-x: -12px;
	}

	.circle-container {
		width: 600px;
		height: 600px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transform-origin: center center;
		margin: 0 auto;
		position: relative;
		left: 0;
		right: 0;

		/* 中央地球循環圖 */
		.center-earth {
			position: relative;
			width: 600px;
			height: 600px;
			z-index: 5;
			display: flex;
			align-items: center;
			justify-content: center;
			left: 0px;
			top: -90px;
		}

		/* 連接線 */
		.connection-lines {
			position: absolute;
			top: -20%;
			left: 0%;
			width: 100%;
			height: 100%;
			z-index: 1;
			pointer-events: none;
		}
	}




	.mode-name {
		/* <=968px 時的模式名稱字級 */
		font-size: clamp(16px, 0.75vw, 18px);
		padding: 6px 10px;
	}

	.modes-circle {
		left: -5%;
		top: -30%;
	}

	.connection-lines {
		left: -37%;
	}

	.mode-detail-card {
		position: absolute;
		right: auto;
		top: auto;
		bottom: -220px;
		left: 50%;
		transform: translateX(-50%);
		min-width: 0%;
		max-width: 360px;
		min-height: 240px;
		z-index: 30;
		padding: 24px;
		font-size: 16px;

		h3 {
			font-size: 20px;
			margin-bottom: 8px;
		}

		p {
			font-size: 18px;
			margin-bottom: 12px;
		}
	}
}

/* 平板版 */
@media (min-width: 969px) and (max-width: 1200px) {
	.circle-container {
		width: 500px;
		height: 500px;
	}

	.center-earth {
		width: 150px;
		height: 150px;
	}

	.recycle-icon {
		width: 90px;
		height: 90px;
	}

	.mode-detail-card {
		right: -120px;
		width: 200px;
		min-height: 220px;
		padding: 16px;

		h3 {
			font-size: 22px;
		}

		p {
			font-size: 20px;
		}

		.explore-btn {
			font-size: 18px;
		}
	}

}

@media (min-width: 1600px) {
	.circulation-modes-grid {
		min-height: 620px;
	}
}

@media (max-width: 576px) {
	.circulation-modes-grid {
		min-height: 720px;
		padding: 30px 12px 20px 12px;
		width: 100%;
		margin: 0 auto;
		/* <=576px 時整體縮放（避免圖超出畫面） */
		--grid-scale: 0.95;
	}

	.circle-container {
		margin: 0 auto;
		left: 0;
		right: 0;
	}

	/* 中央地球循環圖 */
	.center-earth {
		position: relative;
		width: 500px;
		height: 500px;
		z-index: 5;
		display: flex;
		align-items: center;
		justify-content: center;
		left: 0px;
	}

	.mode-detail-card {
		bottom: -100px;
		width: 100%;
		max-width: 340px;
		padding: 20px;
		min-height: 220px;

		h3 {
			font-size: 17px;
			margin-bottom: 8px;
		}

		p {
			font-size: 13px;
			margin-bottom: 12px;
		}

		.explore-btn {
			font-size: 16px;
		}
	}
}
</style>
