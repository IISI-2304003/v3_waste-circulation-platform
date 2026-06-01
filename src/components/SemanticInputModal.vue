<template>
	<el-dialog v-model="visible" title="語意化搜尋" width="700px" :close-on-click-modal="false" @close="handleClose">
		<div class="semantic-modal-content">
			<!-- 說明 -->
			<div class="modal-description">
				<el-alert title="使用說明" type="info" :closable="false" show-icon>
					<p>輸入廢棄物特性參數後，系統會自動解析為查詢條件。</p>
					<p class="example-text">
						例如：水分 45%、硫酸 < 5%、氯離子 1-6%、pH 6-9 </p>
				</el-alert>
			</div>

			<!-- 輸入區域 -->
			<div class="input-area">
				<el-input v-model="inputText" type="textarea" :rows="8" placeholder="請輸入廢棄物特性參數，每行一個條件&#10;例如：&#10;水分 45%&#10;硫酸含量 < 5%&#10;重金屬含量 < 100 mg/kg&#10;pH 值 6-9&#10;氯離子 1-6%" class="semantic-input" />

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

			<!-- 預覽解析結果 -->
			<div v-if="parsedPreview.length > 0" class="preview-section">
				<h4>解析預覽</h4>
				<el-table :data="parsedPreview" border size="small">
					<el-table-column prop="parameter" label="參數" width="150" />
					<el-table-column prop="operator" label="操作符" width="100" />
					<el-table-column label="數值" width="150">
						<template #default="{ row }">
							<span v-if="row.operator === '範圍'">
								{{ row.valueMin }} ~ {{ row.valueMax }}
							</span>
							<span v-else>
								{{ row.value }}
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="unit" label="單位" width="80" />
					<el-table-column label="狀態" width="100">
						<template #default="{ row }">
							<el-tag v-if="row.isText" type="warning" size="small">
								未識別
							</el-tag>
							<el-tag v-else type="success" size="small">
								已識別
							</el-tag>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="info" @click="handlePreview" :loading="parsing">
					預覽解析
				</el-button>
				<el-button type="primary" @click="handleConfirm" :disabled="!inputText.trim() || parsedPreview.length === 0">
					確認填入
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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
const parsedPreview = ref([])
const parsing = ref(false)

// 範例資料
const examples = [
	{
		label: '化學品類',
		text: '水分45%\n硫酸含量<5%\n氯離子1-6%\npH 值 6-9'
	},
	{
		label: '重金屬類',
		text: '重金屬含量<100 mg/kg\n鉻含量<500 mg/kg\n含水率<50%'
	},
	{
		label: '有機物類',
		text: '有機物含量>70%\n含水率<5%\n閃點>60°C'
	}
]

// 監聽輸入變化
watch(inputText, () => {
	// 清空預覽
	parsedPreview.value = []
})

// 帶入範例
const fillExample = (text) => {
	inputText.value = text
	// 自動解析
	handlePreview()
}

// 預覽解析結果
const handlePreview = () => {
	if (!inputText.value.trim()) {
		ElMessage.warning('請先輸入內容')
		return
	}

	parsing.value = true

	try {
		const result = parseSemanticInput(inputText.value)
		parsedPreview.value = result

		const unrecognizedCount = result.filter(r => r.isText).length
		if (unrecognizedCount > 0) {
			ElMessage.warning(`已解析 ${result.length} 筆，其中 ${unrecognizedCount} 筆尚未識別`)
		} else {
			ElMessage.success(`成功解析 ${result.length} 筆參數`)
		}
	} catch (error) {
		console.error('解析失敗：', error)
		ElMessage.error('解析失敗')
	} finally {
		parsing.value = false
	}
}

// 確認填入
const handleConfirm = () => {
	if (parsedPreview.value.length === 0) {
		ElMessage.warning('請先預覽解析結果')
		return
	}

	// 過濾未識別的項目
	const validItems = parsedPreview.value.filter(item => !item.isText)

	if (validItems.length === 0) {
		ElMessage.error('沒有可用的參數條件')
		return
	}

	emit('confirm', validItems)
	handleClose()
}

// 關閉彈窗
const handleClose = () => {
	inputText.value = ''
	parsedPreview.value = []
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

.preview-section {
	padding: 16px;
	background: linear-gradient(135deg, rgba(236, 246, 239, 0.82), rgba(245, 250, 248, 0.92));
	border-radius: 8px;

	h4 {
		font-size: 16px;
		font-weight: 600;
		color: #2C3E50;
		margin: 0 0 12px 0;
	}
}

.dialog-footer {
	display: flex;
	justify-content: flex-end;
	gap: 8px;
}

/* 响应式 */
@media (max-width: 768px) {
	:deep(.el-dialog) {
		width: 95% !important;
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
}
</style>
