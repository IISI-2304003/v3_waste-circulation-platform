<template>
	<div class="acceptance-standard-form">
		<!-- 表單說明 -->
		<div class="form-description">
			<p>請依照廢棄物特性設定允收標準參數，以進行匹配查詢。</p>
		</div>

		<!-- 標準列清單 -->
		<div class="standards-list">
			<div v-for="(standard, index) in standards" :key="standard.id" class="standard-row">
				<!-- 參數 -->
				<el-select v-model="standard.parameter" placeholder="選擇參數" filterable allow-create class="param-select">
					<el-option v-for="param in parameterOptions" :key="param" :label="param" :value="param" />
				</el-select>

				<!-- 操作符 -->
				<el-select v-model="standard.operator" placeholder="選擇條件" class="operator-select">
					<el-option v-for="op in operatorOptions" :key="op.value" :label="op.label" :value="op.value" />
				</el-select>

				<!-- 數值輸入（單值） -->
				<el-input v-if="standard.operator !== '範圍'" v-model.number="standard.value" placeholder="輸入數值" type="number" class="value-input" />

				<!-- 數值輸入（範圍） -->
				<template v-else>
					<el-input v-model.number="standard.valueMin" placeholder="最小值" type="number" class="value-input-min" />
					<span class="range-separator">~</span>
					<el-input v-model.number="standard.valueMax" placeholder="最大值" type="number" class="value-input-max" />
				</template>

				<!-- 單位 -->
				<el-select v-model="standard.unit" placeholder="單位" class="unit-select">
					<el-option v-for="unit in unitOptions" :key="unit" :label="unit || '無單位'" :value="unit" />
				</el-select>

				<!-- 刪除按鈕 -->
				<el-button type="danger" :icon="Delete" circle @click="removeStandard(index)" :disabled="standards.length === 1" />
			</div>
		</div>

		<!-- 操作按鈕 -->
		<div class="form-actions">
			<el-button type="success" :icon="Plus" @click="addStandard">
				新增條件
			</el-button>

			<el-button type="primary" :icon="Search" @click="handleSearch" :loading="searching">
				搜尋匹配
			</el-button>

			<el-button @click="resetForm">
				重設
			</el-button>
		</div>

		<!-- 搜尋結果 -->
		<div v-if="searchResults.length > 0" class="search-results">
			<h3>匹配結果（{{ searchResults.length }}）</h3>
			<el-table :data="searchResults" border stripe>
				<el-table-column prop="code" label="代碼" width="120">
					<template #default="{ row }">
						<el-tag>{{ row.code }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="名稱" />
				<el-table-column label="操作" width="120" align="center">
					<template #default="{ row }">
						<el-button type="primary" size="small" @click="viewDetail(row.code)">
							查看
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!-- 無結果提示 -->
		<div v-else-if="hasSearched" class="no-results">
			<el-empty description="找不到符合條件的廢棄物代碼" />
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Delete, Search } from '@element-plus/icons-vue'
import {
	getParameterOptions,
	getOperatorOptions,
	getUnitOptions,
	searchByStandards
} from '@/api/wasteCode'

const router = useRouter()

// Props
const props = defineProps({
	initialStandards: {
		type: Array,
		default: () => []
	}
})

// 產生唯一 ID
let idCounter = 0
function generateId() {
	return `std-${Date.now()}-${idCounter++}`
}

// 建立空白標準列
function createEmptyStandard() {
	return {
		id: generateId(),
		parameter: '',
		operator: '等於',
		value: null,
		valueMin: null,
		valueMax: null,
		unit: '%',
		condition: '需'
	}
}

// 狀態
const standards = ref([
	createEmptyStandard()
])
const searchResults = ref([])
const searching = ref(false)
const hasSearched = ref(false)

// 選項資料
const parameterOptions = getParameterOptions()
const operatorOptions = getOperatorOptions()
const unitOptions = getUnitOptions()

// 監聽初始資料
watch(() => props.initialStandards, (newVal) => {
	if (newVal && newVal.length > 0) {
		standards.value = newVal.map(std => ({
			...std,
			id: generateId()
		}))
	}
}, { immediate: true })

// 新增標準列
const addStandard = () => {
	standards.value.push(createEmptyStandard())
}

// 刪除標準列
const removeStandard = (index) => {
	if (standards.value.length > 1) {
		standards.value.splice(index, 1)
	}
}

// 重設表單
const resetForm = () => {
	standards.value = [createEmptyStandard()]
	searchResults.value = []
	hasSearched.value = false
}

// 搜尋匹配
const handleSearch = async () => {
	// 驗證
	const valid = standards.value.every(std => {
		if (!std.parameter || !std.operator) return false
		if (std.operator === '範圍') {
			return std.valueMin != null && std.valueMax != null
		}
		return std.value != null
	})

	if (!valid) {
		ElMessage.warning('請完整填寫查詢條件')
		return
	}

	try {
		searching.value = true
		hasSearched.value = true

		// 呼叫 API 搜尋
		const results = await searchByStandards(standards.value)
		searchResults.value = results

		if (results.length === 0) {
			ElMessage.info('找不到符合條件的廢棄物代碼')
		} else {
			ElMessage.success(`找到 ${results.length} 筆匹配結果`)
		}
	} catch (error) {
		console.error('搜尋失敗：', error)
		ElMessage.error('搜尋失敗，請稍後再試')
	} finally {
		searching.value = false
	}
}

// 查看詳情
const viewDetail = (code) => {
	router.push(`/waste/${code}`)
}

// 設定標準（供語意化搜尋使用）
const setStandards = (parsedStandards) => {
	if (parsedStandards && parsedStandards.length > 0) {
		standards.value = parsedStandards.map(std => ({
			...std,
			id: generateId()
		}))
		searchResults.value = []
		hasSearched.value = false
	}
}

// 對父層暴露方法
defineExpose({
	setStandards
})
</script>

<style scoped lang="scss">
.acceptance-standard-form {
	width: 100%;
}

.form-description {
	margin-bottom: 20px;
	padding: 16px;
	background: linear-gradient(135deg, rgba(234, 245, 237, 0.86), rgba(244, 249, 247, 0.94));
	border-radius: 8px;

	p {
		margin: 0;
		color: #606266;
		line-height: 1.6;
	}
}

.standards-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-bottom: 20px;
}

.standard-row {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 16px;
	background: white;
	border: 1px solid rgba(109, 154, 128, 0.2);
	border-radius: 8px;
	transition: all 0.3s ease;

	&:hover {
		border-color: #5c9b77;
		box-shadow: 0 8px 22px rgba(74, 128, 96, 0.12);
	}
}

.param-select {
	flex: 2;
	min-width: 150px;
}

.operator-select {
	flex: 1;
	min-width: 120px;
}

.value-input,
.value-input-min,
.value-input-max {
	flex: 1;
	min-width: 100px;
}

.range-separator {
	color: #909399;
	font-weight: bold;
	padding: 0 4px;
}

.unit-select {
	flex: 0.8;
	min-width: 100px;
}

.form-actions {
	display: flex;
	gap: 12px;
	justify-content: center;
	padding: 20px 0;
}

/* 搜索结果 */
.search-results {
	margin-top: 32px;

	h3 {
		font-size: 20px;
		font-weight: 600;
		color: #2C3E50;
		margin-bottom: 16px;
	}
}

.no-results {
	margin-top: 32px;
	padding: 40px 0;
}

/* 响应式 */
@media (max-width: 968px) {
	.standard-row {
		flex-wrap: wrap;

		.param-select,
		.operator-select,
		.value-input,
		.value-input-min,
		.value-input-max,
		.unit-select {
			min-width: 100%;
			flex: 1 1 100%;
		}
	}

	.form-actions {
		flex-direction: column;

		button {
			width: 100%;
		}
	}
}
</style>
