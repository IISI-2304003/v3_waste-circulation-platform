<template>
	<aside class="step-nav">
		<div class="nav-card">
			<!-- Header -->
			<div class="nav-header">
				<div class="nav-header-icon">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M9 11l3 3L22 4" />
						<path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
					</svg>
				</div>
				<div>
					<p class="nav-header-title">條件設定流程</p>
					<p class="nav-header-sub">{{ completedCount }} / {{ items.length }} 已完成</p>
				</div>
			</div>

			<!-- Progress bar -->
			<div class="progress-track">
				<div class="progress-fill" :style="{ width: `${(completedCount / items.length) * 100}%` }"></div>
			</div>

			<!-- Steps -->
			<ul class="steps-list">
				<li v-for="(item, index) in items" :key="item.id" class="step-item" :class="getStepStatus(item.id)">

					<button class="step-btn" @click="$emit('select', item.id)" type="button">
						<!-- Icon circle -->
						<div class="step-icon-wrap">
							<!-- Dashed connector above (except first) -->
							<div v-if="index > 0" class="step-connector"></div>
							<div class="step-icon-bg">
								<component :is="item.svgIcon" class="step-svg-icon" />
							</div>
							<!-- Completed check overlay -->
							<div v-if="getStepStatus(item.id) === 'configured'" class="check-overlay">
								<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
									<path d="M3 8l3.5 3.5L13 4.5" />
								</svg>
							</div>
						</div>

						<!-- Text -->
						<div class="step-text">
							<span class="step-number">STEP {{ index + 1 }}</span>
							<span class="step-title">{{ item.label }}</span>
						</div>

						<!-- Status badge -->
						<div class="step-badge" :class="getStepStatus(item.id)">
							<span v-if="getStepStatus(item.id) === 'configuring'">設定中</span>
							<span v-else-if="getStepStatus(item.id) === 'configured'">已設定</span>
							<span v-else>未設定</span>
						</div>
					</button>
				</li>
			</ul>

			<!-- Help card -->
			<div class="help-card">
				<div class="help-icon">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10" />
						<path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
						<line x1="12" y1="17" x2="12.01" y2="17" stroke-width="3" />
					</svg>
				</div>
				<div class="help-text">
					<p class="help-title">貼心提醒</p>
					<p class="help-sub">各項條件設定將影響分析結果，請務必確實填寫，已獲得最佳建議循環路徑!</p>
				</div>
			</div>
		</div>
	</aside>
</template>

<script setup>
import { computed, defineComponent, h } from 'vue'

const props = defineProps({
	activeSection: {
		type: String,
		required: true
	},
	configuredSections: {
		type: Array,
		default: () => []
	}
})

defineEmits(['select'])

// Inline SVG icon components (Outline / Lucide-style)
const IconFlask = defineComponent({
	render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
		h('path', { d: 'M9 3h6' }),
		h('path', { d: 'M10 3v6l-4.5 8.5A2 2 0 007.3 21h9.4a2 2 0 001.8-3.5L14 9V3' }),
	])
})

const IconBuilding = defineComponent({
	render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
		h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2' }),
		h('path', { d: 'M9 3v18M15 3v18M3 9h18M3 15h18' }),
	])
})

const IconMap = defineComponent({
	render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
		h('polygon', { points: '3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21' }),
		h('line', { x1: '9', y1: '3', x2: '9', y2: '18' }),
		h('line', { x1: '15', y1: '6', x2: '15', y2: '21' }),
	])
})

const IconLeaf = defineComponent({
	render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
		h('path', { d: 'M2 22c0-6 4-10 10-10s10 4 10 10' }),
		h('path', { d: 'M12 12C12 7 9 3 4 2c0 5 2 9 8 10' }),
	])
})

const IconCoin = defineComponent({
	render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
		h('circle', { cx: '12', cy: '12', r: '10' }),
		h('path', { d: 'M14.5 9.5a2.5 2.5 0 00-5 0c0 1.4 1 2 2.5 2.5s2.5 1.1 2.5 2.5a2.5 2.5 0 01-5 0' }),
		h('line', { x1: '12', y1: '7', x2: '12', y2: '6' }),
		h('line', { x1: '12', y1: '18', x2: '12', y2: '17' }),
	])
})

const IconCpu = defineComponent({
	render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
		h('rect', { x: '7', y: '7', width: '10', height: '10', rx: '1' }),
		h('path', { d: 'M9 7V4M12 7V4M15 7V4M9 20v-3M12 20v-3M15 20v-3M4 9h3M4 12h3M4 15h3M17 9h3M17 12h3M17 15h3' }),
	])
})

const IconUsers = defineComponent({
	render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
		h('path', { d: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' }),
		h('circle', { cx: '9', cy: '7', r: '4' }),
		h('path', { d: 'M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' }),
	])
})

const items = [
	{ id: 'physical', label: '物化特性', svgIcon: IconFlask },
	{ id: 'source', label: '來源穩定性', svgIcon: IconBuilding },
	{ id: 'site', label: '場地配置', svgIcon: IconMap },
	{ id: 'environment', label: '環境影響', svgIcon: IconLeaf },
	{ id: 'business', label: '經濟效益', svgIcon: IconCoin },
	{ id: 'technology', label: '技術成熟度', svgIcon: IconCpu },
	{ id: 'demand', label: '再生產品使用者需求', svgIcon: IconUsers },
]

const getStepStatus = (id) => {
	if (props.activeSection === id) return 'configuring'
	if (props.configuredSections.includes(id)) return 'configured'
	return 'unset'
}

const completedCount = computed(() => {
	return items.filter(item => getStepStatus(item.id) === 'configured').length
})
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.step-nav {
	width: 100%;
	position: sticky;
	top: 20px;
	align-self: flex-start;
	max-height: calc(120vh - 40px);
	overflow-y: auto;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}

	@media (max-width: 992px) {
		position: static;
		max-height: none;
	}
}

.nav-card {
	background: rgba(255, 255, 255, 1);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: 1px solid rgba(226, 232, 240, 0.8);
	border-radius: 24px;
	box-shadow:
		0 4px 6px rgba(0, 0, 0, 0.04),
		0 10px 30px rgba(0, 0, 0, 0.08),
		inset 0 1px 0 rgba(255, 255, 255, 0.9);
	padding: 20px 16px;
	display: flex;
	flex-direction: column;
}

.nav-header {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 14px;

	&-icon {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: linear-gradient(135deg, #22C55E, #16A34A);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);

		svg {
			width: 18px;
			height: 18px;
			stroke: #fff;
		}
	}

	&-title {
		font-size: 16px;
		font-weight: 700;
		color: #1a365d;
		margin: 0;
		line-height: 1.3;
	}

	&-sub {
		font-size: 15px;
		color: #94a3b8;
		margin: 0;
		line-height: 1.3;
	}
}

.progress-track {
	height: 4px;
	background: #f1f5f9;
	border-radius: 999px;
	margin-bottom: 20px;
	overflow: hidden;

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #22C55E, #16A34A);
		border-radius: 999px;
		transition: width 0.5s ease;
	}
}

.steps-list {
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 8px;

	@media (max-width: 992px) {
		flex-direction: row;
		flex-wrap: wrap;
		gap: 8px;
	}
}

.step-connector {
	width: 2px;
	height: 18px;
	margin-left: 18px;
	background: repeating-linear-gradient(to bottom,
			#cbd5e1 0px, #cbd5e1 4px,
			transparent 4px, transparent 8px);
	margin-top: -20px;

	@media (max-width: 992px) {
		display: none;
	}
}

.step-item {
	position: relative;
	display: flex;
	flex-direction: column;

	&.configured>.step-connector,
	&.configuring>.step-connector {
		background: #388e3c;
	}

	&.configuring {
		.step-btn {
			background: #f0fdf4;
			border-color: #86efac;
		}

		.step-icon-bg {
			background: linear-gradient(135deg, #22C55E, #16A34A);
			border-color: transparent;
			box-shadow:
				0 0 0 4px rgba(34, 197, 94, 0.15),
				0 4px 14px rgba(34, 197, 94, 0.35);
		}

		.step-svg-icon {
			stroke: #ffffff;
		}

		.step-number {
			color: #16A34A;
		}

		.step-title {
			color: #15803d;
			font-weight: 700;
		}
	}

	&.configured {
		.step-icon-bg {
			background: #f0fdf4;
			border-color: #86efac;
		}

		.step-svg-icon {
			stroke: #22C55E;
		}

		.step-title {
			color: #64748b;
		}
	}

	&.unset {
		.step-title {
			color: #94a3b8;
		}

		.step-number {
			color: #cbd5e1;
		}
	}

	@media (max-width: 992px) {
		flex: 1 1 calc(50% - 3px);
	}

	@media (max-width: 580px) {
		flex: 1 1 100%;
	}
}

.step-btn {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px;
	border: 1px solid transparent;
	border-radius: 14px;
	background: transparent;
	cursor: pointer;
	text-align: left;
	width: 100%;
	transition: background 0.2s ease, border-color 0.2s ease;

	&:hover {
		background: #f3fff6;
		border-color: #bbf7d0;

		.step-svg-icon {
			stroke: #16A34A;
		}

		.step-title {
			color: #16A34A;
		}
	}
}

.step-icon-wrap {
	position: relative;
	// flex-shrink: 0;
}

.step-icon-bg {
	width: 38px;
	height: 38px;
	border-radius: 50%;
	background: #f8fafc;
	border: 1.5px solid #e2e8f0;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.25s ease;
}

.step-svg-icon {
	width: 17px;
	height: 17px;
	stroke: #94a3b8;
	fill: none;
	transition: stroke 0.2s ease;
}

.check-overlay {
	position: absolute;
	bottom: -2px;
	right: -2px;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: #22C55E;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 0 2px #fff;

	svg {
		width: 10px;
		height: 10px;
		stroke: #fff;
	}
}

.step-text {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 1px;
}

.step-number {
	font-size: 15px;
	font-weight: 600;
	color: #94a3b8;
	letter-spacing: 0.7px;
	text-transform: uppercase;
	line-height: 1;
}

.step-title {
	font-size: 16px;
	font-weight: 500;
	color: #334155;
	line-height: 1.5;
	transition: color 0.2s ease;
	word-break: keep-all;
}

.step-badge {
	flex-shrink: 0;
	font-size: 14px;
	font-weight: 600;
	padding: 3px 7px;
	border-radius: 999px;
	line-height: 1.5;
	letter-spacing: 0.2px;

	&.configuring {
		background: #dcfce7;
		color: #16A34A;
	}

	&.configured {
		background: #f0fdf4;
		color: #22C55E;
	}

	&.unset {
		background: #f1f5f9;
		color: #94a3b8;
	}
}

.help-card {
	margin-top: 20px;
	background: linear-gradient(135deg, #fdf0f0, #f8fafc);
	border: 1px solid #f7bbbb;
	border-radius: 16px;
	padding: 14px 12px;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 8px;

	@media (max-width: 992px) {
		display: none;
	}
}

.help-icon {
	width: 34px;
	height: 34px;
	border-radius: 50%;
	background: rgba(197, 34, 34, 0.12);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;

	svg {
		width: 18px;
		height: 18px;
		stroke: #c52222;
	}
}

.help-text {
	flex: 1;
	min-width: 0;

	.help-title {
		font-size: 18px;
		font-weight: 700;
		color: #af3737;
		margin: 0;
		line-height: 1.3;
	}

	.help-sub {
		font-size: 15px;
		color: #2e2e2e;
		margin: 0;
		line-height: 1.3;
	}
}
</style>
