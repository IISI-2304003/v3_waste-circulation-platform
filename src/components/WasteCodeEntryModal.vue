<template>
	<el-dialog v-model="visible" width="640px" class="waste-entry-dialog" modal-class="waste-entry-overlay" :modal="true" append-to-body align-center :show-close="true" @close="handleCancel">
		<div class="entry-header">
			<div class="entry-header-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="11" cy="11" r="7" />
					<path d="M21 21l-4.35-4.35" />
				</svg>
			</div>
			<h3 class="entry-title">已選擇廢棄物</h3>
			<span class="entry-code-chip" :style="chipStyle">{{ code }}</span>
			<p class="entry-code-name">{{ list.name }}</p>
			<p class="entry-code-description">{{ list.description }}</p>
			<p class="entry-subtitle">請選擇您要進行的操作</p>
		</div>

		<div class="entry-options">
			<button type="button" class="entry-option entry-option--lookup" @click="choose('lookup')">
				<div class="entry-option-icon entry-option-icon--blue">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
						<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7" />
						<path d="M14 3l5 5h-5V3z" />
						<path d="M7 11h4" />
						<path d="M7 15h3" />
						<circle cx="17" cy="16" r="3" />
						<path d="M19.5 18.5L22 21" />
					</svg>
				</div>
				<h4 class="entry-option-title">快速代碼查詢</h4>
				<p class="entry-option-desc">僅依廢棄物代碼查詢<br />相關資訊，不需填寫條件</p>
				<span class="entry-option-btn entry-option-btn--blue">
					開始查詢
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M9 6l6 6-6 6" />
					</svg>
				</span>
				<!-- <p class="entry-option-hint">可查詢再利用機構、處理方式等資訊</p> -->
			</button>

			<button type="button" class="entry-option entry-option--analysis" @click="choose('analysis')">
				<div class="entry-option-icon entry-option-icon--green">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
						<path d="M3 3v18h18" />
						<path d="M7 15l4-4 3 3 5-6" />
						<path d="M16 8h3v3" />
					</svg>
				</div>
				<h4 class="entry-option-title">精準循環分析</h4>
				<p class="entry-option-desc">填寫事業與處理條件<br />取得循環模式與路徑推薦</p>
				<span class="entry-option-btn entry-option-btn--green">
					開始分析
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M9 6l6 6-6 6" />
					</svg>
				</span>
				<!-- <p class="entry-option-hint">需填寫條件系統提供更精準的推薦結果</p> -->
			</button>
		</div>

		<div class="entry-footer">
			<el-button class="entry-cancel-btn" @click="handleCancel">取消</el-button>
		</div>
	</el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
	modelValue: { type: Boolean, default: false },
	code: { type: String, default: '' },
	list: { type: [String, Object], default: '' },
	color: { type: String, default: '#22c55e' }
})

const emit = defineEmits(['update:modelValue', 'lookup', 'analysis', 'cancel'])

const visible = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val)
})


const chipStyle = computed(() => ({
	background: `${props.color}15`,
	color: props.color,
	border: `1px solid ${props.color}30`,
}))


const handleCancel = () => {
	visible.value = false
	emit('cancel')
}
const choose = (type) => {
	visible.value = false
	emit(type) // type 是 'lookup' 或 'analysis'
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

:deep(.waste-entry-dialog) {
	border-radius: 28px;
	padding: 40px 44px 32px;

	.el-dialog__header {
		padding: 0;
		margin: 0;
	}

	.el-dialog__headerbtn {
		top: 20px;
		right: 20px;
		width: 32px;
		height: 32px;

		.el-dialog__close {
			font-size: 18px;
			color: $text-secondary;
		}
	}

	.el-dialog__body {
		padding: 0;
	}
}

.entry-header {
	text-align: center;
	margin-bottom: 28px;
}

.entry-header-icon {
	width: 64px;
	height: 64px;
	margin: 0 auto 16px;
	border-radius: 999px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: rgba($secondary-cyan, 0.12);
	color: $secondary-cyan;

	svg {
		width: 30px;
		height: 30px;
	}
}

.entry-title {
	margin: 0 0 14px;
	font-size: 24px;
	font-weight: 800;
	color: $text-primary;
}



.entry-code-chip {
	font-size: 15px;
	font-weight: 700;
	padding: 4px 12px;
	border-radius: 8px;

}

.entry-code-name {
	font-size: 18px;
	font-weight: 700;
	color: $text-primary;
	margin-top: 10px;
}

.entry-code-description {
	font-size: 15px;
	font-weight: 600;
	color: #8d8d8d;
}

.entry-subtitle {
	margin: 0;
	font-size: 15px;
	color: $text-secondary;
	font-weight: 600;
}

.entry-options {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 20px;
	margin-bottom: 24px;
}

.entry-option {
	border: 1px solid $border-color;
	border-radius: 20px;
	padding: 26px 20px 22px;
	background: $bg-section;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: 10px;
	cursor: pointer;
	font-family: inherit;
	transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

	&:hover {
		transform: translateY(-3px);
		box-shadow: $shadow-card;
	}
}

.entry-option--lookup {
	background: rgba(#3b82f6, 0.06);
}

.entry-option--analysis {
	background: rgba($primary-green, 0.06);
}

.entry-option-icon {
	width: 56px;
	height: 56px;
	border-radius: 999px;
	display: inline-flex;
	align-items: center;
	justify-content: center;

	svg {
		width: 26px;
		height: 26px;
	}
}

.entry-option-icon--blue {
	background: rgba(#3b82f6, 0.14);
	color: #3b82f6;
}

.entry-option-icon--green {
	background: rgba($primary-green, 0.14);
	color: $primary-green;
}

.entry-option-title {
	margin: 4px 0 0;
	font-size: 18px;
	font-weight: 800;
	color: $text-primary;
}

.entry-option-desc {
	margin: 0;
	font-size: 14px;
	line-height: 1.6;
	color: $text-secondary;
	font-weight: 600;
	min-height: 44px;
}

.entry-option-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	width: 100%;
	padding: 10px 0;
	border-radius: 10px;
	font-size: 15px;
	font-weight: 700;
	color: #fff;
	margin-top: 4px;

	svg {
		width: 16px;
		height: 16px;
	}
}

.entry-option-btn--blue {
	background: #3b82f6;
}

.entry-option-btn--green {
	background: $primary-green;
}

.entry-option-hint {
	margin: 4px 0 0;
	font-size: 15px;
	color: $text-secondary;
	font-weight: 500;
}

.entry-footer {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16px;
}

.entry-remember {
	font-size: 14px;
	color: $text-secondary;

	:deep(.el-checkbox__label) {
		font-weight: 600;
	}
}

.entry-cancel-btn {
	min-width: 88px;
	border-radius: 10px;
	font-weight: 700;
	background: $bg-section;
	border: 1px solid $border-color;
	color: $text-secondary;
}

@media (max-width: 576px) {
	:deep(.waste-entry-dialog) {
		padding: 28px 20px 24px;
		width: 92vw !important;
	}

	.entry-options {
		grid-template-columns: 1fr;
	}

	.entry-footer {
		flex-direction: column;
		align-items: flex-start;
		gap: 14px;
	}

	.entry-cancel-btn {
		width: 100%;
	}
}
</style>
