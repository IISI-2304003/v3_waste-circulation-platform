<template>
	<section class="condition-section" :class="theme" :id="`section-${id}`">
		<button class="section-head" type="button" @click="$emit('toggle', id)">
			<div class="head-main">
				<span class="head-icon">
					<el-icon>
						<component :is="icon" />
					</el-icon>
				</span>

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
import { ArrowDown, Document } from '@element-plus/icons-vue'

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
	icon: {
		type: [Object, Function],
		default: Document
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
	border: 1px solid #e6eee9;
	background: #ffffff;
	box-shadow: 0 8px 24px rgba(43, 76, 68, 0.08);
	overflow: hidden;
	transition: 0.2s ease;

	&:hover {
		box-shadow: 0 12px 30px rgba(43, 76, 68, 0.12);
	}
}

.section-head {
	width: 100%;
	border: 0;
	background: #ffffff;
	padding: 16px 18px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
}

.head-main {
	min-width: 0;
	display: flex;
	align-items: center;
	gap: 12px;

	h3 {
		margin: 0;
		font-size: 20px;
		font-weight: 700;
		color: #2e4a45;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}

.head-icon {
	width: 34px;
	height: 34px;
	border-radius: 50%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;

	.el-icon {
		font-size: 18px;
	}
}

.arrow {
	font-size: 18px;
	color: #7b8f89;
	flex-shrink: 0;
	transition: transform 0.22s ease;

	&.expanded {
		transform: rotate(180deg);
	}
}

.section-body {
	padding: 18px;
	border-top: 1px solid #edf3ef;
	background: #ffffff;
}

.condition-section {
	&.green {
		.head-icon {
			color: #2eaf65;
			background: rgba(46, 175, 101, 0.12);
		}
	}

	&.cyan {
		.head-icon {
			color: #26a69a;
			background: rgba(38, 166, 154, 0.12);
		}
	}

	&.violet {
		.head-icon {
			color: #8e67e8;
			background: rgba(155, 109, 255, 0.12);
		}
	}

	&.orange {
		.head-icon {
			color: #f0a22e;
			background: rgba(255, 184, 77, 0.16);
		}
	}
}

:deep(.el-col) {
	margin-bottom: 18px;
}

:deep(.el-form-item) {
	margin-bottom: 0;
}

.accordion-fade-enter-active,
.accordion-fade-leave-active {
	transition:
		opacity 0.24s ease,
		transform 0.24s ease;
}

.accordion-fade-enter-from,
.accordion-fade-leave-to {
	opacity: 0;
	transform: translateY(-8px);
}

@media (max-width: 768px) {
	.condition-section {
		border-radius: 16px;
	}

	.section-head {
		padding: 14px 16px;
	}

	.section-body {
		padding: 16px;
	}

	.head-main {
		gap: 10px;

		h3 {
			font-size: 15px;
		}
	}

	.head-icon {
		width: 32px;
		height: 32px;

		.el-icon {
			font-size: 17px;
		}
	}
}

@media (max-width: 480px) {
	.condition-section {
		border-radius: 14px;
	}

	.section-head {
		padding: 13px 14px;
	}

	.section-body {
		padding: 14px;
	}

	.head-main h3 {
		font-size: 14px;
	}

	.head-icon {
		width: 30px;
		height: 30px;

		.el-icon {
			font-size: 16px;
		}
	}
}
</style>