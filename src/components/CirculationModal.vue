<template>
  <el-dialog v-model="visible" :title="mode?.name" width="85%" top="5vh" destroy-on-close :close-on-click-modal="true" class="circulation-modal">
    <div v-if="mode" class="mode-detail-content">
      <el-row :gutter="40">
        <!-- 左側：文字說明 -->
        <el-col :xs="24" :md="10" class="left-section">
          <div class="section-block">
            <h3 class="section-title">
              <el-icon color="#4CAF50">
                <Reading />
              </el-icon>
              模式說明
            </h3>
            <div class="mode-description">
              {{ mode.description }}
            </div>
          </div>

          <div class="section-block">
            <h3 class="section-title">
              <el-icon color="#4CAF50">
                <Document />
              </el-icon>
              廢清書填報注意事項
            </h3>
            <el-collapse v-model="activeNotices" accordion>
              <el-collapse-item v-for="(notice, index) in mode.notices" :key="index" :title="`注意事項 ${index + 1}`" :name="index">
                <div class="notice-content">
                  {{ notice }}
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-col>

        <!-- 右側：流程圖 -->
        <el-col :xs="24" :md="14" class="right-section">
          <div class="section-block">
            <h3 class="section-title">
              <el-icon color="#4CAF50">
                <TrendCharts />
              </el-icon>
              循環流程圖
            </h3>
            <div class="flowchart-container">
              <!-- 流程圖占位符 -->
              <div class="flowchart-placeholder">
                

                <!-- 簡易流程示意 -->
                <div class="simple-flow">
                  <img :src="mode.flowchartUrl" :alt="mode.flowchartAlt" style="width: 100%; height: auto; max-width: 400px;" />
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">關閉</el-button>
        <el-button type="primary" @click="handleSearch">
          搜尋相關廢棄物
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  Reading,
  Document,
  TrendCharts,
  Picture,
  Position,
  Setting,
  Box,
  Right
} from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  mode: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const visible = ref(props.modelValue)
const activeNotices = ref(0)

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})

const handleSearch = () => {
  emit('search', props.mode)
  visible.value = false
}
</script>

<style scoped lang="scss">
.circulation-modal {
  :deep(.el-dialog__header) {
    padding: 24px 32px;
    border-bottom: 1px solid #E0E0E0;
    background: linear-gradient(135deg, #E8F5E9 0%, #FFFFFF 100%);
  }

  :deep(.el-dialog__title) {
    font-size: 24px;
    font-weight: 600;
    color: #2C3E50;
  }

  :deep(.el-dialog__body) {
    padding: 32px;
    max-height: 70vh;
    overflow-y: auto;
  }

  :deep(.el-dialog__footer) {
    padding: 16px 32px;
    border-top: 1px solid #E0E0E0;
  }
}

.mode-detail-content {
  .el-row {
    margin: 0 !important;
  }
}

.left-section,
.right-section {
  padding: 0 !important;
}

.section-block {
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #2C3E50;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #E8F5E9;
}

.mode-description {
  font-size: 16px;
  line-height: 1.8;
  color: #2C3E50;
  text-align: justify;
  padding: 16px;
  background: #F9FAFB;
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
}

.notice-content {
  padding: 12px 16px;
  background: #F9FAFB;
  border-radius: 4px;
  font-size: 15px;
  line-height: 1.8;
  color: #607D8B;
}

.category-tag {
  margin-right: 12px;
  margin-bottom: 12px;
}

/* 流程圖容器 */
.flowchart-container {
  background: #F9FAFB;
  border-radius: 12px;
  padding: 24px;
  min-height: 500px;
}

.flowchart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px 20px;
  text-align: center;
}

.placeholder-text {
  font-size: 18px;
  font-weight: 600;
  color: #607D8B;
  margin: 0;
}

.placeholder-subtext {
  font-size: 14px;
  color: #90A4AE;
  margin: 0;
  word-break: break-all;
}

.placeholder-note {
  font-size: 13px;
  color: #B0BEC5;
  font-style: italic;
  margin: 8px 0 24px;
}

/* 簡易流程示意 */
.simple-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 24px;
  padding: 24px;
  background: #FFFFFF;
  border-radius: 8px;
  border: 2px dashed #E0E0E0;
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: #F9FAFB;
  border-radius: 8px;
  border: 2px solid #E8F5E9;
  transition: all 0.3s;

  &:hover {
    border-color: #4CAF50;
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  }

  span {
    font-size: 14px;
    font-weight: 500;
    color: #2C3E50;
  }
}

.flow-arrow {
  font-size: 24px;
  animation: flow-pulse 1.5s ease-in-out infinite;
}

@keyframes flow-pulse {

  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* 響應式 */
@media (max-width: 768px) {
  .circulation-modal {
    :deep(.el-dialog__body) {
      padding: 20px;
    }
  }

  .section-block {
    margin-bottom: 24px;
  }

  .simple-flow {
    flex-direction: column;
    gap: 12px;
  }

  .flow-arrow {
    transform: rotate(90deg);
  }
}
</style>
