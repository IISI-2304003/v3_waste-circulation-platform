<template>
	<aside class="condition-nav glass-panel">
		<button v-for="item in items" :key="item.id" class="nav-item" :class="[item.theme, { active: activeSection === item.id }]" @click="$emit('select', item.id)" type="button">
			<span class="icon-wrap">
				<el-icon>
					<component :is="item.icon" />
				</el-icon>
			</span>
			<span class="label">{{ item.label }}</span>
		</button>
	</aside>
</template>

<script setup>
import { Cpu, OfficeBuilding, LocationInformation, Coin } from '@element-plus/icons-vue'

defineProps({
	activeSection: {
		type: String,
		required: true
	}
})

defineEmits(['select'])

const items = [
	{ id: 'physical', label: '物化特性', icon: Cpu, theme: 'green' },
	{ id: 'source', label: '來源條件', icon: OfficeBuilding, theme: 'cyan' },
	{ id: 'site', label: '場域條件', icon: LocationInformation, theme: 'violet' },
	// { id: 'business', label: '商業條件', icon: Coin, theme: 'orange' }
]
</script>

<style scoped lang="scss">
.condition-nav {
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 16px;
	position: sticky;
	top: 16px;
	align-self: flex-start;
	max-height: calc(100vh - 32px);
	overflow-y: auto;
}

.glass-panel {
	border: 1px solid rgba(255, 255, 255, 0.85);
	background: linear-gradient(160deg, rgba(255, 255, 255, 0.72), rgba(239, 252, 246, 0.52));
	box-shadow: 0 12px 34px rgba(58, 103, 93, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.7);
	backdrop-filter: blur(18px);
	border-radius: 20px;
}

.nav-item {
	border: none;
	border-radius: 14px;
	padding: 13px 14px;
	color: #ffffff;
	font-weight: 600;
	display: flex;
	align-items: center;
	gap: 12px;
	cursor: pointer;
	text-align: left;
	transition: all 0.2s ease;


	.icon-wrap {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		box-shadow: 0 8px 18px rgba(56, 103, 95, 0.28);
	}

	&.green {
		background: linear-gradient(135deg, #4caf50, #2e7d5f);

	}

	&.cyan {
		background: linear-gradient(135deg, #26a69a, #3796d4);
	}

	&.violet {
		background: linear-gradient(135deg, #9b6dff, #6f6cf0);
	}

	&.orange {
		background: linear-gradient(135deg, #ffb84d, #ff8f4d);
	}

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 24px rgba(70, 115, 102, 0.17);
		border: 2px solid rgb(255, 255, 255);
	}

	&.active {
		// background: rgba(255, 255, 255, 0.9);
		// box-shadow: 0 0 0 1px rgba(76, 175, 80, 0.2), 0 10px 26px rgba(76, 175, 80, 0.18);
		border: 2px solid rgba(255, 255, 255, 0.671);
		box-shadow:
			0 0 4px rgba(82, 209, 160, 0.849),
			/* 緊貼邊框的小光暈 */
			0 0 12px rgba(68, 235, 174, 0.808),
			/* 向外擴散的中光暈 */
			inset 0 0 8px rgba(0, 255, 157, 0.5);
		/* 內部淡淡的科技感內發光 */
	}
}

.label {
	letter-spacing: 0.4px;
}

@media (max-width: 992px) {
	.condition-nav {
		flex-direction: row;
		flex-wrap: wrap;
		position: static;
		max-height: none;
		overflow: visible;
	}

	.nav-item {
		flex: 1 1 calc(50% - 8px);
	}
}

@media (max-width: 580px) {
	.nav-item {
		flex: 1 1 100%;
	}
}
</style>
