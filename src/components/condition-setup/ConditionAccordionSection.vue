<template>
	<section class="condition-section" :class="theme" :id="`section-${id}`">
		<button class="section-head" type="button" @click="$emit('toggle', id)">
			<div class="head-main">
				<span class="dot"></span>
				<h3>{{ title }}</h3>
			</div>
			<el-icon class="arrow" :class="{ expanded }">
				<ArrowDown />
			</el-icon>
		</button>

		<transition name="accordion-fade">
			<div v-show="expanded" class="section-body">
				<slot />
			</div>
		</transition>
	</section>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'

defineProps({
	id: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	theme: {
		type: String,
		default: 'green'
	},
	expanded: {
		type: Boolean,
		default: true
	}
})

defineEmits(['toggle'])
</script>

<style scoped lang="scss">
.condition-section {
	border-radius: 18px;
	border: 1px solid rgba(255, 255, 255, 0.78);
	background: linear-gradient(145deg, rgba(255, 255, 255, 0.86), rgba(242, 250, 246, 0.66));
	box-shadow: 0 10px 28px rgba(55, 89, 79, 0.12);
	overflow: hidden;
}

.section-head {
	width: 100%;
	border: none;
	background: rgba(255, 255, 255, 0.45);
	padding: 16px 18px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.head-main {
	display: flex;
	align-items: center;
	gap: 10px;

	h3 {
		margin: 0;
		font-size: 17px;
		color: #2e4a45;
	}
}

.dot {
	width: 12px;
	height: 12px;
	border-radius: 50%;
}

.arrow {
	font-size: 18px;
	color: #617a74;
	transition: transform 0.2s ease;

	&.expanded {
		transform: rotate(180deg);
	}
}

.section-body {
	border-top: 1px solid rgba(133, 166, 158, 0.26);
	padding: 18px;
}

.condition-section.green {
	background: linear-gradient(145deg, rgba(250, 255, 251, 0.95), rgba(216, 250, 226, 0.88));
	border-color: rgba(76, 175, 80, 0.22);

	.section-head {
		background: rgba(76, 175, 80, 0.09);
	}

	.section-body {
		background: rgba(255, 255, 255, 0.64);
	}
}

.condition-section.cyan {
	background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(233, 248, 253, 0.9));
	border-color: rgba(38, 166, 154, 0.24);

	.section-head {
		background: rgba(38, 166, 154, 0.1);
	}

	.section-body {
		background: rgba(255, 255, 255, 0.66);
	}
}

.condition-section.violet {
	background: linear-gradient(145deg, rgb(255, 255, 255), rgba(241, 244, 255, 0.9));
	border-color: rgba(155, 109, 255, 0.24);

	.section-head {
		background: rgba(155, 109, 255, 0.1);
	}

	.section-body {
		background: rgba(255, 255, 255, 0.68);
	}
}

.condition-section.orange {
	background: linear-gradient(145deg, rgb(255, 255, 255), rgba(255, 245, 232, 0.9));
	border-color: rgba(255, 184, 77, 0.24);

	.section-head {
		background: rgba(255, 184, 77, 0.13);
	}

	.section-body {
		background: rgba(255, 255, 255, 0.68);
	}
}

.condition-section.green .dot {
	background: #4caf50;
	box-shadow: 0 0 10px rgba(76, 175, 80, 0.45);
}

.condition-section.cyan .dot {
	background: #26a69a;
	box-shadow: 0 0 10px rgba(38, 166, 154, 0.42);
}

.condition-section.violet .dot {
	background: #9b6dff;
	box-shadow: 0 0 10px rgba(155, 109, 255, 0.45);
}

.condition-section.orange .dot {
	background: #ffb84d;
	box-shadow: 0 0 10px rgba(255, 184, 77, 0.42);
}

.accordion-fade-enter-active,
.accordion-fade-leave-active {
	transition: all 0.24s ease;
}

.accordion-fade-enter-from,
.accordion-fade-leave-to {
	opacity: 0;
	transform: translateY(-8px);
}
</style>
