<template>
	<el-dialog v-model="visible" class="top-modes-dialog" width="min(1080px, 94vw)" align-center destroy-on-close :modal="true" append-to-body>
		<template #header>
			<div class="modes-dialog-header">
				<h3>十大循環模式說明</h3>
			</div>
		</template>

		<div class="modes-dialog-body" v-if="activeMode">
			<aside class="modes-dialog-list">
				<button v-for="mode in allCirculationModes" :key="mode.id" type="button" class="mode-list-item" :class="{ active: mode.id === activeModeId }" @click="activeModeId = mode.id">
					<span class="mode-dot" :style="{ background: mode.color || '#26a69a' }"></span>
					<span class="mode-list-name">{{ mode.name }}</span>
				</button>
			</aside>

			<section class="modes-dialog-detail">
				<div class="detail-title-row">
					<span class="detail-mode-name">{{ activeMode.name }}</span>
				</div>

				<div class="detail-section">
					<h4>模式說明</h4>
					<p>{{ activeMode.description || '尚無說明資料。' }}</p>
				</div>

				<div class="detail-section" v-if="activeMode.flowchartUrl">
					<h4>循環流程圖</h4>
					<div class="flowchart-box">
						<img :src="activeMode.flowchartUrl" :alt="activeMode.flowchartAlt || activeMode.name" />
					</div>
				</div>

				<div class="detail-section">
					<h4>填報注意事項</h4>
					<p class="notices-text">{{ activeMode.notices || '尚無注意事項資料。' }}</p>
				</div>
			</section>
		</div>
	</el-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import circulationModes from '@/data/circulationModes.json'

const props = defineProps({
	modelValue: {
		type: Boolean,
		required: true
	},
	preferredModeName: {
		type: String,
		default: ''
	}
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)
const activeModeId = ref(1)

const normalizeModeName = (value = '') => String(value).replace(/\s+/g, '').trim()

const allCirculationModes = computed(() => circulationModes)

const preferredModeId = computed(() => {
	const currentModeName = normalizeModeName(props.preferredModeName)
	const matched = allCirculationModes.value.find((mode) => normalizeModeName(mode.name) === currentModeName)
	return matched?.id || allCirculationModes.value?.[0]?.id || 1
})

const activeMode = computed(() => {
	return allCirculationModes.value.find((mode) => mode.id === activeModeId.value) || allCirculationModes.value[0] || null
})

watch(() => props.modelValue, (newVal) => {
	visible.value = newVal
	if (newVal) activeModeId.value = preferredModeId.value
})

watch(visible, (newVal) => {
	emit('update:modelValue', newVal)
})

watch(() => props.preferredModeName, () => {
	if (visible.value) activeModeId.value = preferredModeId.value
})
</script>

<style scoped lang="scss">
.top-modes-dialog {
	:deep(.el-dialog) {
		border-radius: 22px;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.82);
		background: linear-gradient(160deg, rgba(255, 255, 255, 0.96), rgba(239, 248, 255, 0.9));
		box-shadow: 0 20px 52px rgba(53, 93, 83, 0.2);
	}

	:deep(.el-dialog__header) {
		margin: 0;
		padding: 18px 20px 12px;
		border-bottom: 1px solid rgba(193, 214, 210, 0.5);
	}

	:deep(.el-dialog__body) {
		padding: 16px;
	}
}

.modes-dialog-header {
	h3 {
		margin: 0;
		font-size: 24px;
		color: #214a43;
	}
}

.modes-dialog-body {
	display: grid;
	grid-template-columns: 280px minmax(0, 1fr);
	gap: 14px;
	min-height: 62vh;
}

.modes-dialog-list {
	border: 1px solid rgba(194, 216, 212, 0.6);
	border-radius: 16px;
	background: rgba(255, 255, 255, 0.8);
	padding: 8px;
	overflow: auto;
}

.mode-list-item {
	width: 100%;
	border: none;
	background: transparent;
	display: flex;
	align-items: center;
	gap: 10px;
	text-align: left;
	padding: 10px 12px;
	border-radius: 12px;
	cursor: pointer;
	color: #2b4e47;
	font-size: 15px;
	font-weight: 600;

	&:hover {
		background: rgba(76, 175, 80, 0.1);
	}

	&.active {
		background: rgba(76, 175, 80, 0.14);
		color: #1f6e46;
	}
}

.mode-dot {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	flex-shrink: 0;
}

.modes-dialog-detail {
	border: 1px solid rgba(194, 216, 212, 0.6);
	border-radius: 16px;
	background: rgba(255, 255, 255, 0.84);
	padding: 14px 16px;
	overflow: auto;
}

.detail-title-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
	margin-bottom: 8px;
}

.detail-mode-name {
	font-size: 24px;
	font-weight: 700;
	color: #1f4f49;
}

.detail-section {
	margin-top: 12px;

	h4 {
		margin: 0 0 8px;
		font-size: 16px;
		color: #2a5a52;
	}

	p {
		margin: 0;
		font-size: 14px;
		line-height: 1.7;
		color: #3f625d;
	}
}

.flowchart-box {
	border-radius: 12px;
	border: 1px dashed rgba(168, 200, 192, 0.8);
	background: #fff;
	padding: 10px;

	img {
		width: 100%;
		height: auto;
		display: block;
	}
}

.notices-text {
	white-space: pre-line;
}

@media (max-width: 960px) {
	.modes-dialog-body {
		grid-template-columns: 1fr;
		min-height: auto;
	}

	.modes-dialog-list {
		max-height: 32vh;
	}
}
</style>