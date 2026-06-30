<template>
	<el-dialog v-model="visible" title="語意化搜尋" width="min(700px, 92vw)" class="semantic-input-dialog" :close-on-click-modal="false" @close="handleClose">
		<div class="semantic-modal-content">
			<!-- 說明 -->
			<div class="modal-description">
				<el-alert title="使用說明" type="info" :closable="false" show-icon>
					<p>輸入廢棄物特性參數後，系統會自動解析為查詢條件。</p>
					<p class="example-text">
						請以頓號（、）分隔條件，例如：硫酸含量 < 5%、重金屬含量 < 100 mg/kg、pH值 < 2</p>
				</el-alert>
			</div>

			<!-- 輸入區域 -->
			<div class="input-area">
				<el-input v-model="inputText" type="textarea" :rows="3" placeholder="請輸入廢棄物特性參數，以頓號（、）分隔&#10;例如：水分 45%、硫酸含量 < 5%、重金屬含量 < 100 mg/kg、pH值 6~9" class="semantic-input" />

				<div class="char-count">
					{{ inputText.length }} 字元
				</div>
			</div>

			<!-- 範例按鈕 -->
			<div class="example-buttons">
				<p class="example-label">快速帶入範例：</p>
				<el-button v-for="example in examples" :key="example.label" size="small" @click="fillExample(example.text)">
					{{ example.label }}
				</el-button>
			</div>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleConfirm" :disabled="!inputText.trim()" :loading="parsing">
					確認填入
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { parseSemanticInput } from '@/api/wasteCode'

// Props
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	}
})

// Emits
const emit = defineEmits(['update:modelValue', 'confirm'])

// 狀態
const visible = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val)
})

const inputText = ref('')
const parsing = ref(false)

// 範例資料
const examples = [
	{
		label: '化學品類',
		text: '水分45%、硫酸含量<5%、氯離子1-6%、pH值 6~9'
	},
	{
		label: '重金屬類',
		text: '重金屬含量<100 mg/kg、鉻含量<500 mg/kg、含水率<50%'
	},
	{
		label: '有機物類',
		text: '有機物含量>70%、含水率<5%、閃點>60°C'
	}
]

// 帶入範例
// 說明：封裝「fill Example」商業邏輯，供目前流程重複使用。
const fillExample = (text) => {
	inputText.value = text
}

// 確認填入
// 說明：由使用者互動觸發；執行「handle Confirm」流程並同步更新相關狀態。
const handleConfirm = () => {
	if (!inputText.value.trim()) {
		ElMessage.warning('請先輸入內容')
		return
	}

	parsing.value = true

	let parsedResult = []
	try {
		const normalizedText = inputText.value
			.replace(/，/g, '、')
			.split('、')
			.map(item => item.trim())
			.filter(Boolean)
			.join('\n')

		parsedResult = parseSemanticInput(normalizedText)
	} catch (error) {
		console.error('解析失敗：', error)
		ElMessage.error('解析失敗')
		parsing.value = false
		return
	}

	// 過濾未識別的項目
	// 說明：封裝「valid Items」商業邏輯，供目前流程重複使用。
	const validItems = parsedResult.filter(item => !item.isText)

	if (validItems.length === 0) {
		ElMessage.error('沒有可用的參數條件')
		parsing.value = false
		return
	}

	const unrecognizedCount = parsedResult.length - validItems.length
	if (unrecognizedCount > 0) {
		ElMessage.warning(`已填入 ${validItems.length} 筆，略過 ${unrecognizedCount} 筆未識別內容`)
	} else {
		ElMessage.success(`成功填入 ${validItems.length} 筆參數`)
	}

	emit('confirm', validItems)
	parsing.value = false
	handleClose()
}

// 關閉彈窗
// 說明：由使用者互動觸發；執行「handle Close」流程並同步更新相關狀態。
const handleClose = () => {
	inputText.value = ''
	visible.value = false
}
</script>

<style scoped lang="scss">
.semantic-modal-content {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.modal-description {
	:deep(.el-alert__content) {
		p {
			margin: 4px 0;
			line-height: 1.6;
		}

		.example-text {
			color: #409EFF;
			font-weight: 500;
			margin-top: 8px;
		}
	}
}

.input-area {
	position: relative;
}

.semantic-input {
	:deep(textarea) {
		font-family: 'Consolas', 'Monaco', monospace;
		font-size: 14px;
		line-height: 1.6;
		padding-bottom: 30px;
	}
}

.char-count {
	position: absolute;
	bottom: 8px;
	right: 12px;
	font-size: 12px;
	color: #909399;
}

.example-buttons {
	display: flex;
	align-items: center;
	gap: 8px;
	flex-wrap: wrap;

	.example-label {
		margin: 0;
		color: #606266;
		font-size: 14px;
	}
}

.dialog-footer {
	display: flex;
	justify-content: flex-end;
	gap: 8px;
}

/* 响应式 */
@media (max-width: 768px) {
	.semantic-modal-content {
		gap: 14px;
	}

	:deep(.el-dialog) {
		width: min(700px, 94vw) !important;
		margin: 0 auto;
	}

	:deep(.el-dialog__header) {
		padding: 14px 14px 8px;
		margin-right: 0;
	}

	:deep(.el-dialog__body) {
		padding: 10px 14px 14px;
	}

	:deep(.el-dialog__footer) {
		padding: 10px 14px 14px;
	}

	:deep(.el-alert__content p) {
		font-size: 13px;
	}

	.semantic-input {
		:deep(textarea) {
			font-size: 13px;
			min-height: 120px;
		}
	}

	.char-count {
		font-size: 11px;
		right: 10px;
		bottom: 6px;
	}

	.example-buttons {
		flex-direction: column;
		align-items: stretch;

		.example-label {
			width: 100%;
		}

		button {
			width: 100%;
		}
	}

	.dialog-footer {
		width: 100%;
		flex-direction: column-reverse;
		align-items: stretch;

		:deep(.el-button) {
			width: 100%;
			margin-left: 0;
		}
	}
}
</style>
