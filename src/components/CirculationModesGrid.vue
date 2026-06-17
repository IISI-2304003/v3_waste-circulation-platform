<template>
	<div class="circulation-modes-grid">
		<div class="circle-container">
			<!-- 中央地球循環圖 -->
			<div class="center-earth">
				<!-- <div class="earth-glow"></div> -->
				<!-- <div class="recycle-icon">

				</div> -->
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
			<img class="earth-image" src="../assets/earth.png" alt="Earth" />

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
import { ref } from 'vue'
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

const getIcon = (iconName) => {
	return iconMap[iconName] || Operation
}

// 縮短名稱顯示
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
const getModePosition = (index) => {
	const totalModes = 10
	const angle = (index * 360 / totalModes) - 90 // -90度使第一個圖標在頂部
	const radius = 180 // 圓形半徑（像素）

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

const handleModeClick = (mode) => {
	selectedMode.value = mode
}

const handleExploreMode = () => {
	if (!selectedMode.value) return
	emit('mode-click', selectedMode.value)
}
</script>

<style scoped lang="scss">
.circulation-modes-grid {
	width: 100%;
	padding: 0;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 550px;
}

.circle-container {
	position: relative;
	width: 500px;
	height: 500px;
	display: flex;
	align-items: center;
	justify-content: center;

	/* 中央地球循環圖 */
	.center-earth {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 120px;
		height: 120px;
		z-index: 5;
		display: flex;
		align-items: center;
		justify-content: center;
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
		position: relative;
		top: -3%;
		left: -35%;
		width: 100%;
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
		width: 65px;
		height: 65px;
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
	font-size: 11px;
	color: #2C3E50;
	font-weight: 500;
	text-align: center;
	white-space: nowrap;
	transition: all 0.3s;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(8px);
	padding: 5px 10px;
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
	right: -40px;
	top: 10%;
	width: 200px;
	min-height: 250px;
	background: #fffff990;
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
		padding: 20px 0;
		min-height: 420px;
	}

	.circle-container {
		width: 500px;
		height: 500px;
		transform: scale(0.75);
	}

	.center-earth {
		width: 90px;
		height: 90px;
	}

	.earth-glow {
		width: 130px;
		height: 130px;
	}



	.mode-circle {
		width: 55px;
		height: 55px;

		.el-icon {
			font-size: 24px !important;
		}
	}

	.mode-name {
		font-size: 10px;
		padding: 4px 8px;
	}
}

/* 平板版 */
@media (min-width: 969px) and (max-width: 1200px) {
	.circle-container {
		width: 500px;
		height: 500px;
		transform: scale(0.88);
	}

	.center-earth {
		width: 105px;
		height: 105px;
	}

	.recycle-icon {
		width: 90px;
		height: 90px;
	}
}
</style>
