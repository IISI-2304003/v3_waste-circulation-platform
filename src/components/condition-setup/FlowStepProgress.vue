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
	{ id: 2, label: '循環路徑推薦' },
	{ id: 3, label: '技術媒合推薦' },
	// { id: 4, label: '決策建議' },
]

const nodeClass = (id) => ({
	active: props.activeStep === id,
	completed: props.activeStep > id
})
</script>

<style scoped lang="scss">
.flow-step-progress {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 12px;
	width: 100%;
	box-sizing: border-box;
	margin: 0 auto;
	background: rgba(255, 255, 255, 0.56);
	border: 1px solid rgba(18, 150, 99, 0.4);
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
	font-size: 12px;
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
		grid-template-columns: 1fr;
		gap: 14px;
	}

	.flow-node-wrap {
		flex-direction: row;
		justify-content: flex-start;
		gap: 12px;
	}

	.flow-link {
		display: none;
	}

	.node-label {
		text-align: left;
		font-size: 13px;
	}
}
</style>
