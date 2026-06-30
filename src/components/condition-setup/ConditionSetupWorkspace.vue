<template>
	<div class="condition-setup-shell" :class="{ embedded: embeddedMode }">

		<FlowStepProgress v-if="showProgress" :active-step="1" class="progress-top" />
		<div class="layout-grid">
			<el-row :gutter="20">
				<!-- 左側 Step Nav -->
				<el-col :xs="24" :sm="24" :md="7" :lg="6" :xl="5" class="nav-col">
					<VerticalConditionNav :active-section="store.activeSection" :configured-sections="configuredSections" @select="handleSectionSelect" />
				</el-col>

				<!-- 右側表單內容 -->
				<el-col :xs="24" :sm="24" :md="17" :lg="18" :xl="19">
					<div class="content-col-inner">
						<div class="content-panel glass-panel">
							<div class="business-info-form">
								<el-form label-position="top">
									<el-row :gutter="24">
										<el-col :xs="24" :sm="24" :md="12">
											<el-form-item>
												<template #label>
													<div class="label-with-icon">
														<el-icon>
															<House />
														</el-icon>
														<span>事業名稱</span>
													</div>
												</template>
												<el-input v-model="businessName" placeholder="輸入事業名稱" />
											</el-form-item>
										</el-col>

										<el-col :xs="24" :sm="24" :md="12">
											<el-form-item>
												<template #label>
													<div class="label-with-icon">
														<span class="required-mark">*</span>
														<el-icon>
															<Location />
														</el-icon>
														<span>事業地址</span>
													</div>
												</template>

												<div class="address-input-row">
													<el-input v-model="businessAddress" :class="{ 'is-invalid': shouldMarkInvalid('businessAddress') }" placeholder="輸入地址或點擊按鈕自動定位" />
													<el-button :icon="Location" @click="getGeolocation" :loading="geoLoading">
														定位
													</el-button>
												</div>
											</el-form-item>
										</el-col>
									</el-row>
								</el-form>
							</div>


							<ConditionAccordionSection id="physical" ref="physicalRef" title="物化特性" theme="green" :expanded="expandedMap.physical" @toggle="toggleSection">
								<div class="section-subtitle-row">
									<div class="section-subtitle">
										依據檢測數據設定允收條件，支援自由新增條件組合。
									</div>
									<el-button class="semantic-button" type="primary" plain :icon="Search" @click="openSemanticModal">
										語意化搜尋
									</el-button>
								</div>

								<AcceptanceStandardForm ref="acceptanceRef" :initial-standards="initialStandards" @change="handleStandardsChange" />

								<!-- <div class="report-upload">
									<h4>檢測報告上傳區</h4>
									<el-upload drag multiple :auto-upload="false" :file-list="uploadFiles" :on-change="onFileChange" :on-remove="onFileRemove">
										<el-icon class="upload-icon">
											<UploadFilled />
										</el-icon>
										<div class="el-upload__text">拖曳檔案到此或 <em>點擊上傳</em></div>
										<template #tip>
											<div class="el-upload__tip">支援 PDF / XLSX / CSV，最多 20 MB</div>
										</template>
									</el-upload>
								</div> -->
							</ConditionAccordionSection>

							<ConditionAccordionSection id="source" ref="sourceRef" title="料源穩定性" theme="cyan" :expanded="expandedMap.source" @toggle="toggleSection">
								<el-form label-position="top">
									<el-row :gutter="24" class="form-row">
										<el-col :xs="24" :sm="24" :md="12" class="form-col">
											<el-form-item>
												<template #label>
													<span><span class="required-mark">*</span>來源產業</span>
												</template>
												<el-select v-model="store.sourceConditions.industry" :class="{ 'is-invalid': shouldMarkInvalid('sourceIndustry') }" placeholder="選擇來源產業">
													<el-option label="電子與半導體" value="semiconductor" />
													<el-option label="鋼鐵冶金" value="steel" />
													<el-option label="化工製程" value="chemical" />
													<el-option label="食品加工" value="food" />
												</el-select>
											</el-form-item>
										</el-col>

										<el-col :xs="24" :sm="24" :md="12">
											<el-form-item>
												<template #label>
													<span><span class="required-mark">*</span>廢棄物來源製程</span>
												</template>
												<el-select v-model="store.sourceConditions.process" :class="{ 'is-invalid': shouldMarkInvalid('sourceProcess') }" placeholder="選擇來源製程" filterable>
													<el-option v-for="item in sourceProcessOptions" :key="item.value" :label="item.label" :value="item.value" />
												</el-select>
											</el-form-item>
										</el-col>

										<el-col :xs="24" :sm="24" :md="12">
											<el-form-item label="月產出量 (公噸)">
												<el-input-number v-model="store.sourceConditions.outputAmount" :min="0" :max="100000" :step="1" controls-position="right" />
											</el-form-item>
										</el-col>

										<el-col :xs="24" :sm="24" :md="12">
											<el-form-item label="產出頻率">
												<el-select v-model="store.sourceConditions.frequency" placeholder="選擇產出頻率" filterable>
													<el-option v-for="item in sourceFrequencyOptions" :key="item.value" :label="item.label" :value="item.value" />
												</el-select>
											</el-form-item>
										</el-col>
									</el-row>
								</el-form>
							</ConditionAccordionSection>

							<ConditionAccordionSection id="site" ref="siteRef" title="場地配置" theme="violet" :expanded="expandedMap.site" @toggle="toggleSection">
								<el-form label-position="top" class="form-grid">
									<el-form-item label="是否有再利用空間">
										<el-switch v-model="store.siteConditions.hasReuseSpace" active-text="有" inactive-text="無" inline-prompt />
									</el-form-item>
								</el-form>

							</ConditionAccordionSection>

							<ConditionAccordionSection id="environment" ref="environmentRef" title="環境影響" theme="orange" :expanded="expandedMap.environment" @toggle="toggleSection">
								<el-form label-position="top" class="form-grid">
									<el-form-item label="是否有產生衍生廢棄物">
										<el-switch v-model="store.siteConditions.hasSecondaryWaste" active-text="有" inactive-text="無" inline-prompt />
									</el-form-item>
								</el-form>
							</ConditionAccordionSection>

							<ConditionAccordionSection id="business" ref="businessRef" title="經濟效益" theme="violet" :expanded="expandedMap.business" @toggle="toggleSection">
								<el-form label-position="top">
									<el-row :gutter="24" class="form-row">
										<el-col :xs="24" :sm="24" :md="12" class="form-col">
											<el-form-item>
												<template #label>
													<span><span class="required-mark">*</span>資本額(元)</span>
												</template>
												<el-select v-model="store.businessConditions.capitalAmount" :class="{ 'is-invalid': shouldMarkInvalid('capitalAmount') }" placeholder="選擇資本額">
													<el-option v-for="item in capitalAmountOptions" :key="item.value" :label="item.label" :value="item.value" />
												</el-select>
											</el-form-item>
										</el-col>
										<el-col :xs="24" :sm="24" :md="12" class="form-col">
											<el-form-item>
												<template #label>
													<span><span class="required-mark">*</span>清除頻率</span>
												</template>
												<el-select v-model="store.businessConditions.clearanceFrequency" :class="{ 'is-invalid': shouldMarkInvalid('clearanceFrequency') }" placeholder="選擇清除頻率">
													<el-option v-for="item in clearanceFrequencyOptions" :key="item.value" :label="item.label" :value="item.value" />
												</el-select>
											</el-form-item>
										</el-col>
										<el-col :xs="24" :sm="24" :md="12">
											<el-form-item>
												<template #label>
													<span>清除量（公噸）</span>
												</template>
												<el-input-number v-model="store.businessConditions.clearanceAmount" :min="0" :max="100000" :step="1" controls-position="right" />
											</el-form-item>
										</el-col>
										<el-col :xs="24" :sm="24" :md="12">
											<el-form-item>
												<template #label>
													<span>清除費用（元/公噸）</span>
												</template>
												<el-input-number v-model="store.businessConditions.clearanceCost" :min="0" :max="100000" :step="1" controls-position="right" />
											</el-form-item>
										</el-col>
										<el-col :xs="24" :sm="24" :md="12">
											<el-form-item>
												<template #label>
													<span>處理量（公噸）</span>
												</template>
												<el-input-number v-model="store.businessConditions.processingAmount" :min="0" :max="100000" :step="1" controls-position="right" />
											</el-form-item>
										</el-col>
										<el-col :xs="24" :sm="24" :md="12">
											<el-form-item>
												<template #label>
													<span>處理費用（元/公噸）</span>
												</template>
												<el-input-number v-model="store.businessConditions.processingCost" :min="0" :max="100000" :step="1" controls-position="right" />
											</el-form-item>
										</el-col>
									</el-row>
								</el-form>
							</ConditionAccordionSection>

							<ConditionAccordionSection id="technology" ref="technologyRef" title="技術成熟度" theme="violet" :expanded="expandedMap.technology" @toggle="toggleSection">
								<el-form label-position="top">
									<el-row :gutter="24" class="form-row">
										<el-col :xs="24" :sm="24" :md="24" class="form-col">
											<el-form-item>
												<template #label>
													<span>請選擇符合之技術成熟度類型（可複選）</span>
												</template>

												<el-checkbox-group v-model="technologySelections" class="option-checkbox-group">
													<el-checkbox v-for="item in technologyOptions" :key="item.value" :value="item.value">
														{{ item.label }}
													</el-checkbox>
												</el-checkbox-group>
											</el-form-item>
										</el-col>
									</el-row>
								</el-form>
							</ConditionAccordionSection>
							<ConditionAccordionSection id="demand" ref="demandRef" title="再生產品使用者製程需求" theme="cyan" :expanded="expandedMap.demand" @toggle="toggleSection">
								<el-form label-position="top">
									<el-row :gutter="24" class="form-row">
										<el-col :xs="24" :sm="24" :md="24" class="form-col">
											<el-form-item>
												<template #label>
													<span>請選擇符合之使用者需求（可複選）</span>
												</template>

												<el-checkbox-group v-model="demandSelections" class="option-checkbox-group">
													<el-checkbox v-for="item in demandOptions" :key="item.value" :value="item.value">
														{{ item.label }}
													</el-checkbox>
												</el-checkbox-group>
											</el-form-item>
										</el-col>
									</el-row>
								</el-form>
							</ConditionAccordionSection>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>

		<div class="floating-actions glass-panel">
			<!-- Help card -->
			<div class="help-card">
				<div class="help-icon">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10" />
						<path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
						<line x1="12" y1="17" x2="12.01" y2="17" stroke-width="3" />
					</svg>
				</div>
				<div class="help-text">
					<p class="help-title">貼心提醒</p>
					<p class="help-sub">各項條件設定將影響分析結果，請務必確實填寫，已獲得最佳建議循環路徑!</p>
				</div>
			</div>
			<div class="action-buttons">
				<el-button @click="resetAll">重設條件</el-button>
				<el-button type="primary" @click="handleNext" class="detail-btn">下一步 : 媒合分析
					<el-icon class="el-icon--right">
						<ArrowRight />
					</el-icon>
				</el-button>
			</div>
		</div>

		<SemanticInputModal v-model="showSemanticModal" @confirm="handleSemanticConfirm" />
	</div>
</template>

<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, Search, Location, House } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import AcceptanceStandardForm from '@/components/AcceptanceStandardForm.vue'
import SemanticInputModal from '@/components/SemanticInputModal.vue'
import { useConditionSetupStore } from '@/stores/conditionSetup'
import FlowStepProgress from './FlowStepProgress.vue'
import VerticalConditionNav from './VerticalConditionNav.vue'
import ConditionAccordionSection from './ConditionAccordionSection.vue'

const props = defineProps({
	initialStandards: {
		type: Array,
		default: () => []
	},
	showProgress: {
		type: Boolean,
		default: true
	},
	embeddedMode: {
		type: Boolean,
		default: false
	}
})

const emits = defineEmits(['next'])

const store = useConditionSetupStore()
const { uploadedReports } = storeToRefs(store)
const showSemanticModal = ref(false)

const acceptanceRef = ref(null)
const physicalRef = ref(null)
const sourceRef = ref(null)
const siteRef = ref(null)
const businessRef = ref(null)
const environmentRef = ref(null)
const technologyRef = ref(null)
const demandRef = ref(null)
const businessName = computed({
	get: () => store.businessConditions.businessName || '',
	set: (value) => {
		store.businessConditions.businessName = value
	}
})
const businessAddress = computed({
	get: () => store.businessConditions.businessAddress || '',
	set: (value) => {
		store.businessConditions.businessAddress = value
	}
})
const geoLoading = ref(false)

const expandedMap = reactive({
	physical: true,
	source: true,
	site: true,
	environment: true,
	business: true,
	technology: true,
	demand: true
})

const regionOptions = [
	{
		value: 'north',
		label: '北部',
		children: [
			{ value: 'taipei', label: '台北市' },
			{ value: 'new-taipei', label: '新北市' },
			{ value: 'taoyuan', label: '桃園市' }
		]
	},
	{
		value: 'center',
		label: '中部',
		children: [
			{ value: 'taichung', label: '台中市' },
			{ value: 'changhua', label: '彰化縣' },
			{ value: 'nantou', label: '南投縣' }
		]
	},
	{
		value: 'south',
		label: '南部',
		children: [
			{ value: 'tainan', label: '台南市' },
			{ value: 'kaohsiung', label: '高雄市' },
			{ value: 'pingtung', label: '屏東縣' }
		]
	}
]

const cascaderProps = {
	expandTrigger: 'hover',
	checkStrictly: true
}

const maturityMarks = {
	1: 'TRL1',
	5: 'TRL5',
	9: 'TRL9'
}

const sourceProcessOptions = [
	{ value: '260001', label: '260001 積體電路製造程序' },
	{ value: '260003', label: '260003 記憶體製造程序' },
	{ value: '260004', label: '260004 二極體製造程序' },
	{ value: '260005', label: '260005 發光二極體製造程序' },
	{ value: '260006', label: '260006 電晶體製造程序' },
	{ value: '260009', label: '260009 其他分離式元件製造程序' },
	{ value: '260011', label: '260011 晶片製造程序' },
	{ value: '260012', label: '260012 晶圓製造程序' },
	{ value: '260013', label: '260013 晶圓包裝程序' }
]

const sourceFrequencyOptions = [
	{ value: 'daily', label: '每日' },
	{ value: 'weekly', label: '每週' },
	{ value: 'monthly', label: '每月' },
	{ value: 'quarterly', label: '每季' }
]

const clearanceFrequencyOptions = [
	{ value: 'daily', label: '每日' },
	{ value: 'weekly', label: '每週' },
	{ value: 'monthly', label: '每月' },
	{ value: 'quarterly', label: '每季' },
	{ value: 'yearly', label: '每年' }
]

const capitalAmountOptions = [
	{ value: '0-1000000', label: '0 ~ 1,000,000 元' },
	{ value: '1000001-5000000', label: '1,000,001 ~ 5,000,000 元' },
	{ value: '5000001-10000000', label: '5,000,001 ~ 10,000,000 元' },
	{ value: '10000001-50000000', label: '10,000,001 ~ 50,000,000 元' },
	{ value: '50000001-100000000', label: '50,000,001 ~ 100,000,000 元' },
	{ value: '100000001+', label: '100,000,001 元以上' }
]

const technologySelections = ref([])
const demandSelections = ref([])

// 各區塊「已設定」狀態判斷：不以必填為標準，而是公瓡輸入就計入
const configuredSections = computed(() => {
	const result = []
	const src = store.sourceConditions
	const site = store.siteConditions
	const biz = store.businessConditions

	// 物化特性：有允收條件或上傳檔案
	if (store.acceptanceConditions.length > 0 || store.uploadedReports.length > 0) {
		result.push('physical')
	}
	// 來源穩定性：任一欄位有內容
	if (src.industry || src.process || src.outputAmount || src.frequency) {
		result.push('source')
	}
	// 場地配置：區域已選或包含再利用空間被設定
	if ((site.region && site.region.length > 0) || site.hasReuseSpace !== null) {
		result.push('site')
	}
	// 環境影響：衍生廢棄物設定被動進
	if (site.hasSecondaryWaste !== null) {
		result.push('environment')
	}
	// 經濟效益：清除頻率或清除量
	if (biz.clearanceFrequency || biz.clearanceAmount) {
		result.push('business')
	}
	// 技術成熟度：已勾選任一選項
	if (technologySelections.value.length > 0) {
		result.push('technology')
	}
	// 再生產品使用者需求：已勾選任一選項
	if (demandSelections.value.length > 0) {
		result.push('demand')
	}

	return result
})

const technologyOptions = [
	{ value: 'mature', label: '現有成熟技術（常態化循環）' },
	{ value: 'imported', label: '導入既有循環技術（跨產業／新場域應用）' },
	{ value: 'innovative', label: '描述或創新技術（取代原生料）' }
]

const demandOptions = [
	{ value: 'replace-raw-material', label: '再生產品可回廠原製程使用' },
	{ value: 'non-original-process', label: '再生產品非原製程使用' },
	{ value: 'external-sale', label: '再生產品對外販售' }
]

const uploadFiles = uploadedReports
const hasValidationAttempted = ref(false)

const sectionRefMap = {
	physical: physicalRef,
	source: sourceRef,
	site: siteRef,
	environment: environmentRef,
	business: businessRef,
	technology: technologyRef,
	demand: demandRef
}

const toggleSection = (sectionId) => {
	expandedMap[sectionId] = !expandedMap[sectionId]
}

const handleSectionSelect = async (sectionId) => {
	store.setActiveSection(sectionId)
	expandedMap[sectionId] = true

	await nextTick()
	const sectionEl = sectionRefMap[sectionId]?.value?.$el
	if (sectionEl) {
		sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}
}

const onFileChange = (_, files) => {
	store.setUploadedReports(files)
}

const onFileRemove = (_, files) => {
	store.setUploadedReports(files)
}

const resetAll = () => {
	store.resetAll()
	hasValidationAttempted.value = false
}

const getMissingRequiredFields = () => {
	const missingFields = []

	if (!String(store.businessConditions.businessAddress || '').trim()) {
		missingFields.push({ sectionId: 'physical', label: '事業地址' })
	}

	if (!store.sourceConditions.industry) {
		missingFields.push({ sectionId: 'source', label: '來源產業' })
	}

	if (!store.sourceConditions.process) {
		missingFields.push({ sectionId: 'source', label: '廢棄物來源製程' })
	}

	if (!store.businessConditions.capitalAmount) {
		missingFields.push({ sectionId: 'business', label: '資本額(元)' })
	}

	if (!store.businessConditions.clearanceFrequency) {
		missingFields.push({ sectionId: 'business', label: '清除頻率' })
	}

	return missingFields
}

const handleNext = async () => {
	const missingFields = getMissingRequiredFields()
	if (missingFields.length === 0) {
		hasValidationAttempted.value = false
		emits('next')
		return
	}

	hasValidationAttempted.value = true

	const firstMissing = missingFields[0]
	if (firstMissing?.sectionId) {
		await handleSectionSelect(firstMissing.sectionId)
	}

	ElMessage.warning(`請先填寫必填欄位：${missingFields.map((item) => item.label).join('、')}`)
}

const shouldMarkInvalid = (fieldKey) => {
	if (!hasValidationAttempted.value) return false

	const fieldCheckMap = {
		businessAddress: () => !String(store.businessConditions.businessAddress || '').trim(),
		sourceIndustry: () => !store.sourceConditions.industry,
		sourceProcess: () => !store.sourceConditions.process,
		capitalAmount: () => !store.businessConditions.capitalAmount,
		clearanceFrequency: () => !store.businessConditions.clearanceFrequency
	}

	return fieldCheckMap[fieldKey]?.() || false
}

const openSemanticModal = () => {
	showSemanticModal.value = true
}

const handleSemanticConfirm = (parsedData) => {
	if (acceptanceRef.value) {
		acceptanceRef.value.setStandards(parsedData)
		ElMessage.success('已將搜尋條件填入表單')
	}
}

const handleStandardsChange = (standards) => {
	store.setAcceptanceConditions(standards)
}

const getGeolocation = () => {
	if (!navigator.geolocation) {
		ElMessage.error('瀏覽器不支援地理位置定位')
		return
	}

	geoLoading.value = true
	navigator.geolocation.getCurrentPosition(
		async (position) => {
			const { latitude, longitude } = position.coords
			try {
				const response = await fetch(
					`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=zh`
				)
				const data = await response.json()
				if (data.address) {
					const city = data.address.city || data.address.county || data.address.state || ''
					const district = data.address.city_district || data.address.town || data.address.suburb || data.address.village || ''
					const road = data.address.road || data.address.pedestrian || ''
					const houseNumber = data.address.house_number || ''
					const formattedAddress = `${city}${district}${road}${houseNumber ? `${houseNumber}號` : ''}`

					const detailedAddress = formattedAddress || data.display_name || ''
					businessAddress.value = detailedAddress
					ElMessage.success('定位成功')
				} else {
					ElMessage.error('無法獲取地址資訊')
				}
			} catch (error) {
				ElMessage.error('獲取地址失敗')
				console.error(error)
			} finally {
				geoLoading.value = false
			}
		},
		(error) => {
			geoLoading.value = false
			if (error.code === error.PERMISSION_DENIED) {
				ElMessage.error('您已拒絕位置訪問權限')
			} else if (error.code === error.POSITION_UNAVAILABLE) {
				ElMessage.error('位置資訊不可用')
			} else {
				ElMessage.error('獲取位置失敗')
			}
		}
	)
}

const setStandards = (parsedStandards) => {
	acceptanceRef.value?.setStandards(parsedStandards)
}

defineExpose({
	setStandards
})
</script>

<style scoped lang="scss">
.condition-setup-shell {
	padding: 24px;
	margin-top: 50px;

	&.embedded {
		padding-top: 0;
		min-height: auto;
	}
}

.progress-top,
.layout-grid,
.floating-actions {
	position: relative;
	z-index: 1;
}

.progress-top {
	width: calc(100% - 36px);
	margin: 0 auto;
}

.layout-grid {
	margin-top: 0;
	padding: 18px;
}

.content-col-inner {
	width: 100%;
}

.nav-col {
	display: flex;
	flex-direction: column;
	position: sticky;
	top: 12px;
	align-self: flex-start;
	max-height: calc(100vh - 24px);

	:deep(.step-nav) {
		width: 100%;
		max-height: 100%;
	}
}

.glass-panel {
	border: 1px solid rgba(255, 255, 255, 0.82);
	background: rgba(255, 255, 255, 0.66);
	box-shadow:
		0 14px 34px rgba(53, 93, 83, 0.14),
		inset 0 1px 0 rgba(255, 255, 255, 0.78);
	backdrop-filter: blur(16px);
	border-radius: 20px;
}

.help-card {
	// margin-top: 20px;
	background: linear-gradient(135deg, #fdf0f0, #f8fafc);
	border: 1px solid #f7bbbb;
	border-radius: 16px;
	padding: 10px 12px;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 8px;
	margin-right: auto;

	@media (max-width: 992px) {
		display: none;
	}
}

.help-icon {
	width: 34px;
	height: 34px;
	border-radius: 50%;
	background: rgba(197, 34, 34, 0.12);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;

	svg {
		width: 18px;
		height: 18px;
		stroke: #c52222;
	}
}

.help-text {
	flex: 1;
	min-width: 0;

	.help-title {
		font-size: 16px;
		font-weight: 700;
		color: #af3737;
		margin: 0;
		line-height: 1.3;
	}

	.help-sub {
		font-size: 15px;
		color: #2e2e2e;
		margin: 0;
		line-height: 1.3;
	}
}

.content-panel {
	padding: 18px;
	display: flex;
	flex-direction: column;
	gap: 14px;
}

.business-info-form {
	padding: 14px 0 18px;
	margin-bottom: 14px;
	border-bottom: 1px solid rgba(76, 175, 80, 0.15);
}

.section-subtitle-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 14px;

	:deep(.el-button) {
		flex-shrink: 0;
	}
}

.section-subtitle {
	margin-bottom: 0;
	color: #5d7370;
	font-size: 16px;
}

.label-with-icon {
	display: flex;
	align-items: center;
	gap: 6px;
	color: #426b64;
	font-size: 15px;
	font-weight: 600;

	:deep(.el-icon) {
		color: #26a69a;
		font-size: 16px;
	}

	span {
		line-height: 1.3;
	}
}

.address-input-row {
	display: flex;
	width: 100%;
	gap: 8px;

	:deep(.el-input) {
		flex: 1;
	}

	:deep(.el-button) {
		flex-shrink: 0;
	}
}

.semantic-button {
	color: #ffffff;
	background: linear-gradient(135deg, rgb(78, 76, 99), rgb(34, 13, 109));

	&:hover {
		color: #ffffff;
		background: linear-gradient(135deg, rgb(98, 95, 122), rgb(54, 33, 129));
	}
}

.report-upload {
	margin-top: 18px;
	padding: 16px;
	border-radius: 14px;
	border: 1px dashed rgba(76, 175, 80, 0.35);
	background: rgba(238, 253, 244, 0.66);

	h4 {
		margin: 0 0 12px;
		color: #305a4f;
		font-size: 16px;
	}

	:deep(.el-upload-dragger) {
		border-color: rgba(52, 157, 96, 0.38);
		background: rgba(255, 255, 255, 0.84);
	}

	.upload-icon {
		color: #26a69a;
		font-size: 30px;
	}
}

.required-mark {
	margin-right: 4px;
	color: #f56c6c;
	font-weight: 700;
}

:deep(.is-invalid .el-input__wrapper),
:deep(.is-invalid .el-select__wrapper) {
	box-shadow: 0 0 0 1px #f56c6c inset !important;
	border-color: #f56c6c !important;
}

:deep(.is-invalid .el-input__wrapper:hover),
:deep(.is-invalid .el-select__wrapper:hover) {
	box-shadow: 0 0 0 1px #f56c6c inset !important;
}

/* Element Plus Row / Col 表單 Layout */
.form-row {
	width: 100%;
}

.form-col {
	margin-bottom: 18px;

	:deep(.el-form-item),
	:deep(.el-form-item__content),
	:deep(.el-select),
	:deep(.el-input),
	:deep(.el-input-number),
	:deep(.el-textarea),
	:deep(.el-cascader) {
		width: 100%;
	}
}

:deep(.el-row) {
	align-items: flex-start;
}

:deep(.el-form-item) {
	width: 100%;
	margin-bottom: 0;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 8px;
}

:deep(.el-form-item__content) {
	width: 100%;
}

:deep(.el-form-item__label) {
	color: #426b64;
	font-size: 15px;
	font-weight: 600;
	line-height: 1.3;
}

:deep(.el-input),
:deep(.el-select),
:deep(.el-cascader),
:deep(.el-input-number),
:deep(.el-textarea) {
	width: 100%;
}

:deep(.el-slider__runway) {
	margin: 12px 0;
}

:deep(.el-radio-group) {
	display: inline-flex;
	width: auto;
}

.frequency-item {
	:deep(.el-form-item__content) {
		width: auto;
	}
}

/* Checkbox 選項 RWD */
.option-checkbox-group,
.technology-option-group {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 12px 18px;

	:deep(.el-checkbox) {
		height: auto;
		margin-right: 0;
		white-space: normal;
		display: flex;
		align-items: flex-start;
		gap: 8px;
	}

	:deep(.el-checkbox__input) {
		margin-top: 2px;
		line-height: 1;
	}

	:deep(.el-checkbox__label) {
		display: block;
		padding-left: 0;
		line-height: 1.5;
		white-space: normal;
		word-break: break-word;
	}
}

.source-theme {
	:deep(.el-radio-button__inner) {
		border-color: rgba(38, 166, 154, 0.32);
	}
}

.map-placeholder {
	position: relative;
	overflow: hidden;
	height: 200px;
	margin-top: 18px;
	border-radius: 16px;
	border: 1px solid rgba(155, 109, 255, 0.35);
	background: linear-gradient(135deg, rgba(248, 243, 255, 0.84), rgba(236, 248, 255, 0.78));
	display: flex;
	align-items: center;
	justify-content: center;

	.map-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(155, 109, 255, 0.08) 1px, transparent 1px),
			linear-gradient(90deg, rgba(155, 109, 255, 0.08) 1px, transparent 1px);
		background-size: 24px 24px;
	}

	p {
		position: relative;
		margin: 0;
		color: #5f4f8a;
		font-size: 15px;
		font-weight: 600;
	}
}

.floating-actions {
	position: sticky;
	bottom: 14px;
	margin: 20px 18px 0;
	padding: 12px 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
}

.action-buttons {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 12px;
	margin-left: 12px;
	flex-shrink: 0;

}

.detail-btn {
	align-self: flex-end;
	margin-top: auto;
	font-size: 15px;
	font-weight: 700;
	border: none;
	background: linear-gradient(135deg, #4caf50, #26a69a);
	color: #fff;

	&:hover,
	&:focus {
		background: linear-gradient(135deg, #58b85c, #30b3a8);
		color: #fff;
	}
}

@keyframes drift {
	from {
		transform: translate3d(0, 0, 0);
	}

	to {
		transform: translate3d(12%, 8%, 0);
	}
}

@media (max-width: 992px) {
	.nav-col {
		position: static;
		top: auto;
		max-height: none;
		margin-bottom: 16px;
	}

	.content-panel {
		padding: 16px;
	}

	.option-checkbox-group,
	.technology-option-group {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 768px) {
	.condition-setup-shell {
		padding: 16px 12px 110px;
		margin-top: 36px;
	}

	.progress-top {
		width: calc(100% - 28px);
	}

	.layout-grid {
		padding: 12px;
	}

	.glass-panel {
		border-radius: 18px;
	}

	.content-panel {
		padding: 14px;
		gap: 12px;
	}

	.business-info-form {
		padding: 10px 0 14px;
		margin-bottom: 12px;
	}

	.section-subtitle-row {
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;

		:deep(.el-button) {
			width: 100%;
		}
	}

	.section-subtitle {
		font-size: 15px;
		line-height: 1.6;
	}

	.address-input-row {
		flex-direction: column;

		:deep(.el-button) {
			width: 100%;
		}
	}

	.form-col {
		margin-bottom: 16px;
	}

	:deep(.el-form-item__label) {
		font-size: 14px;
	}

	.option-checkbox-group,
	.technology-option-group {
		grid-template-columns: 1fr;
		gap: 10px;
	}

	.floating-actions {
		margin: 16px 12px 0;
		padding: 12px;
		justify-content: stretch;
		gap: 10px;

		.action-buttons {
			width: 100%;
			margin-left: 0;
		}

		.action-buttons :deep(.el-button) {
			flex: 1;
		}
	}
}

@media (max-width: 480px) {
	.condition-setup-shell {
		padding: 12px 8px 110px;
		margin-top: 28px;
	}

	.layout-grid {
		padding: 8px;
	}

	.glass-panel {
		border-radius: 16px;
	}

	.content-panel {
		padding: 12px;
	}

	.section-subtitle {
		font-size: 14px;
	}

	.floating-actions {
		flex-direction: column;

		.action-buttons {
			width: 100%;
			flex-direction: column;
			justify-content: stretch;
		}

		.action-buttons :deep(.el-button) {
			width: 100%;
			margin-left: 0;
		}
	}
}
</style>
