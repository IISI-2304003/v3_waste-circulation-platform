<template>
	<div class="flow-step-progress">
		<div v-for="(step, index) in steps" :key="step.id" class="flow-node-wrap">
			<div class="flow-node" :class="nodeClass(step.id)">
				<span>{{ index + 1 }}</span>
			</div>
			<p class="node-label" :class="nodeClass(step.id)">{{ step.label }}</p>
			<div v-if="index < steps.length - 1" class="flow-link" :class="{ active: step.id < activeStep }"></div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	activeStep: {
		type: Number,
		default: 1
	}
})

const steps = [
	{ id: 1, label: '條件設定' },
	{ id: 2, label: '路徑推薦' },
	{ id: 3, label: '技術媒合' },
	// { id: 4, label: '決策建議' },
]

// 說明：封裝「node Class」商業邏輯，供目前流程重複使用。
const nodeClass = (id) => ({
	active: props.activeStep === id,
	completed: props.activeStep > id
})
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.flow-step-progress {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 12px;
	width: 100%;
	box-sizing: border-box;
	margin: 0 auto;
	background: rgba(255, 255, 255, 1);
	// border: 1px solid rgba(18, 150, 99, 0.4);
	border-radius: 20px;
	backdrop-filter: blur(12px);
	padding: 16px;
	// box-shadow:
	// 	0 0 4px rgba(0, 255, 157, 0.4),
	// 	/* 緊貼邊框的小光暈 */
	// 	0 0 12px rgba(0, 255, 157, 0.2),
	// 	/* 向外擴散的中光暈 */
	// 	inset 0 0 8px rgba(0, 255, 157, 0.1);
	// /* 內部淡淡的科技感內發光 */
}

.flow-node-wrap {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
}

.flow-node {
	width: 44px;
	height: 44px;
	border-radius: 50%;
	border: 1px solid rgba(38, 166, 154, 0.4);
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(221, 245, 237, 0.72));
	box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	color: #42605a;
	font-weight: 700;
	transition: all 0.25s ease;

	&.active {
		background: linear-gradient(135deg, #4caf50, #26a69a);
		color: #fff;
		border-color: transparent;
		box-shadow: 0 0 14px rgba(76, 175, 80, 0.45), 0 0 24px rgba(38, 166, 154, 0.25);
	}

	&.completed {
		background: linear-gradient(135deg, #45b94a, #2e837a);
		color: #fff;
		border-color: transparent;
	}
}

.node-label {
	margin: 0;
	text-align: center;
	font-size: clamp(1rem, 0.949rem + 0.24vw, 1.25rem);
	color: #6d7e7b;
	letter-spacing: 0.2px;
	line-height: 1.4;

	&.active {
		color: #1e6f5f;
		font-weight: 700;
	}

	&.completed {
		color: #2f8d52;
		font-weight: 600;
	}
}

.flow-link {
	position: absolute;
	top: 22px;
	right: -14px;
	width: 28px;
	height: 2px;
	background: linear-gradient(90deg, rgba(145, 178, 172, 0.7), rgba(170, 198, 192, 0.35));
	overflow: hidden;

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		width: 40%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.75), transparent);
		animation: pulse-line 2.4s linear infinite;
	}

	&.active {
		background: linear-gradient(90deg, #4caf50, #26a69a);
	}
}

@keyframes pulse-line {
	from {
		transform: translateX(-120%);
	}

	to {
		transform: translateX(280%);
	}
}

@media (max-width: 1100px) {
	.flow-step-progress {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px;
		padding: 14px 12px;
	}

	.flow-node-wrap {
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}

	.flow-link {
		display: block;
		top: 20px;
		right: -12px;
		width: 24px;
	}

	.node-label {
		text-align: center;
		font-size: 13px;
		line-height: 1.3;
		font-weight: 600;
	}
}

@media (max-width: 768px) {
	.flow-step-progress {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
		padding: 12px 10px;
	}

	.flow-node-wrap {
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}

	.flow-node {
		width: 38px;
		height: 38px;
		font-size: 14px;

		&.active {
			transform: scale(1.06);
		}
	}

	.flow-link {
		display: block;
		top: 18px;
		right: -12px;
		width: 24px;
	}

	.node-label {
		text-align: center;
		font-size: 12px;
		line-height: 1.25;
		font-weight: 600;
	}
}
</style>
