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
				<el-select v-model="standard.parameter" placeholder="選擇參數" filterable allow-create class="param-select" @change="handleParameterChange(standard)">
					<el-option v-for="param in parameterOptions" :key="param" :label="param" :value="param" />
				</el-select>

				<template v-if="standard.parameter === '外觀'">
					<el-input v-model="standard.value" placeholder="請輸入外觀描述" class="appearance-input" />
				</template>

				<template v-else>
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
				</template>

				<!-- 刪除按鈕 -->
				<el-button type="danger" :icon="Delete" circle @click="removeStandard(index)" :disabled="standards.length === 1" />
			</div>
		</div>

		<!-- 操作按鈕 -->
		<div class="form-actions">
			<el-button type="success" :icon="Plus" @click="addStandard">
				新增條件
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

const emit = defineEmits(['change'])

// 產生唯一 ID
let idCounter = 0
// 說明：建立初始化資料或執行初始化流程，供後續操作使用。
function generateId() {
	return `std-${Date.now()}-${idCounter++}`
}

// 建立空白標準列
// 說明：建立初始化資料或執行初始化流程，供後續操作使用。
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
const hasSearched = ref(false)

// 選項資料
const parameterOptions = Array.from(new Set([...getParameterOptions(), '外觀']))
const operatorOptions = getOperatorOptions()
const unitOptions = getUnitOptions()

// 說明：由使用者互動觸發；執行「handle Parameter Change」流程並同步更新相關狀態。
const handleParameterChange = (standard) => {
	if (standard.parameter === '外觀') {
		standard.operator = '等於'
		standard.unit = ''
		standard.valueMin = null
		standard.valueMax = null
		if (standard.value === null || standard.value === undefined) {
			standard.value = ''
		}
		return
	}

	if (typeof standard.value === 'string') {
		standard.value = null
	}
}

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
// 說明：封裝「add Standard」商業邏輯，供目前流程重複使用。
const addStandard = () => {
	standards.value.push(createEmptyStandard())
}

// 刪除標準列
// 說明：封裝「remove Standard」商業邏輯，供目前流程重複使用。
const removeStandard = (index) => {
	if (standards.value.length > 1) {
		standards.value.splice(index, 1)
	}
}

// 重設表單
// 說明：重置該模組資料回預設值，避免前次輸入影響新流程。
const resetForm = () => {
	standards.value = [createEmptyStandard()]
	searchResults.value = []
	hasSearched.value = false
}


// 查看詳情
// 說明：封裝「view Detail」商業邏輯，供目前流程重複使用。
const viewDetail = (code) => {
	router.push(`/waste/${code}`)
}

// 設定標準（供語意化搜尋使用）
// 說明：寫入「set Standards」到狀態管理，讓後續流程可直接取用。
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

watch(standards, (value) => {
	// 說明：將輸入資料標準化為系統格式，供媒合與查詢流程使用。
	const normalized = value.map(({ id, ...rest }) => ({ ...rest }))
	emit('change', normalized)
}, { deep: true })

// 對父層暴露方法
defineExpose({
	setStandards
})
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.acceptance-standard-form {
	width: 100%;
}

.form-description {
	margin-bottom: 20px;
	padding: 16px;
	background: linear-gradient(135deg, rgba($primary-green, 0.12), rgba($bg-section, 0.96));
	border-radius: $input-radius;

	p {
		margin: 0;
		color: $text-secondary;
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
	background: $bg-card;
	border: 1px solid $border-color;
	border-radius: $card-radius;
	box-shadow: $shadow-card;
	transition: all 0.3s ease;

	&:hover {
		border-color: $primary-green-light;
		box-shadow: $shadow-hover;
	}
}

.param-select {
	flex: 0 0 220px;
	width: 220px;
	min-width: 220px;
}

.operator-select {
	flex: 1;
	min-width: 150px;
}

.value-input,
.value-input-min,
.value-input-max {
	flex: 1;
	min-width: 100px;
}

.appearance-input {
	flex: 1;
	// min-width: 150px;
}

.range-separator {
	color: $text-tertiary;
	font-weight: $font-weight-bold;
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
		font-weight: $font-weight-semibold;
		color: $text-primary;
		margin-bottom: 16px;
	}
}

.no-results {
	margin-top: 32px;
	padding: 40px 0;
}

// 按鈕
.detail-btn {
	flex-shrink: 0;
	padding: 4px 12px;
	border: 1.5px solid $primary-green;
	border-radius: $button-radius;
	background: $bg-primary;
	color: $primary-green;
	font-size: 15px;
	font-weight: $font-weight-medium;
	cursor: pointer;
	transition: background 0.2s, color 0.2s;
	margin-left: auto;

	&:hover {
		background: $primary-green-dark;
		border-color: $primary-green-dark;
		color: $bg-primary;
	}
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
		.unit-select,
		.appearance-input {
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
