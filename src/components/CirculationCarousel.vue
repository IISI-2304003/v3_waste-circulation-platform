<template>
  <div class="circulation-carousel">
    <swiper :modules="modules" :effect="'coverflow'" :grabCursor="true" :centeredSlides="true" :slidesPerView="'auto'" :coverflowEffect="{
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }" :autoplay="{
      delay: 3000,
      disableOnInteraction: false,
    }" :pagination="{ clickable: true }" :loop="true" class="mySwiper" @slideChange="onSlideChange">
      <swiper-slide v-for="mode in modes" :key="mode.id" @click="handleModeClick(mode)">
        <div class="mode-card" :style="{ borderColor: mode.color }">
          <div class="mode-icon" :style="{ color: mode.color }">
            <el-icon :size="64">
              <component :is="getIcon(mode.icon)" />
            </el-icon>
          </div>
          <h3 class="mode-name">{{ mode.name }}</h3>
          <div class="mode-badge" :style="{ background: mode.color }">
            點擊查看詳情
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import {
  Operation,
  Connection,
  OfficeBuilding,
  Link,
  Share,
  Lightning,
  Coin,
  House,
  Apple,
  Star
} from '@element-plus/icons-vue'

defineProps({
  modes: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['mode-click'])

const modules = [EffectCoverflow, Pagination, Autoplay]

// 圖標映射
const iconMap = {
  'cycle-internal': Operation,
  'cycle-cross-process': Connection,
  'cycle-park': OfficeBuilding,
  'cycle-supply-chain': Link,
  'cycle-cross-industry': Share,
  'cycle-energy': Lightning,
  'cycle-extraction': Coin,
  'cycle-construction': House,
  'cycle-compost': Apple,
  'cycle-innovation': Star
}

// 說明：回傳「get Icon」資料供畫面渲染或後續商業規則使用。
const getIcon = (iconName) => {
  return iconMap[iconName] || Operation
}

// 說明：由圓環模式節點點擊觸發；更新 selectedMode 顯示對應模式卡片。
const handleModeClick = (mode) => {
  emit('mode-click', mode)
}

// 說明：封裝「on Slide Change」商業邏輯，供目前流程重複使用。
const onSlideChange = () => {
  // 可在此處添加滑動切換時的邏輯
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.circulation-carousel {
  width: 100%;
  padding: 60px 0;
}

.mySwiper {
  width: 100%;
  padding-top: 50px;
  padding-bottom: 80px;
}

.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 280px;
  height: 350px;
}

.mode-card {
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid transparent;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 32px rgba(76, 175, 80, 0.25);
    border-color: currentColor;
  }
}

.mode-icon {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  transition: all 0.3s;

  .mode-card:hover & {
    transform: scale(1.1) rotate(360deg);
  }
}

.mode-name {
  font-size: 22px;
  font-weight: 600;
  color: #2C3E50;
  text-align: center;
  margin: 0;
}

.mode-badge {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 13px;
  color: #FFFFFF;
  font-weight: 500;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s;

  .mode-card:hover & {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Swiper 分頁器樣式覆蓋 */
:deep(.swiper-pagination-bullet) {
  background: #4CAF50;
  opacity: 0.5;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  background: #4CAF50;
}

/* 響應式 */
@media (max-width: 768px) {
  .swiper-slide {
    width: 240px;
    height: 320px;
  }

  .mode-card {
    padding: 24px 16px;
  }

  .mode-icon {
    width: 80px;
    height: 80px;

    .el-icon {
      font-size: 48px;
    }
  }

  .mode-name {
    font-size: 18px;
  }
}
</style>
