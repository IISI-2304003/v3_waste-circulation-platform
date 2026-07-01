<template>
	<header class="app-header">
		<div class="container">
			<div class="header-content">
				<!-- Logo 區 -->
				<div class="logo-section" @click="goHome">
					<img src="../assets/logo.png" alt="環境部資源循環署" class="logo" />
					<div class="logo-text">
						<h1 class="site-title">資源循環利用智慧媒合平台</h1>
						<p class="site-subtitle">環境部資源循環署</p>
					</div>
				</div>

				<!-- 導航選單（桌面版） -->
				<nav class="nav-menu desktop-nav">
					<router-link to="/" class="nav-item">首頁</router-link>
					<a href="#about" class="nav-item">關於平台</a>
					<a href="#guide" class="nav-item">使用指南</a>
					<a href="#contact" class="nav-item">聯絡我們</a>
				</nav>

				<!-- 手機版選單按鈕 -->
				<el-button class="mobile-menu-btn" :icon="Menu" circle @click="drawerVisible = true" />
			</div>
		</div>

		<!-- 手機版抽屜選單 -->
		<el-drawer v-model="drawerVisible" title="選單" direction="rtl" size="70%">
			<nav class="mobile-nav">
				<router-link to="/" class="mobile-nav-item" @click="drawerVisible = false">
					<el-icon>
						<HomeFilled />
					</el-icon>
					<span>首頁</span>
				</router-link>
				<a href="#about" class="mobile-nav-item" @click="drawerVisible = false">
					<el-icon>
						<InfoFilled />
					</el-icon>
					<span>關於平台</span>
				</a>
				<a href="#guide" class="mobile-nav-item" @click="drawerVisible = false">
					<el-icon>
						<Reading />
					</el-icon>
					<span>使用指南</span>
				</a>
				<a href="#contact" class="mobile-nav-item" @click="drawerVisible = false">
					<el-icon>
						<Message />
					</el-icon>
					<span>聯絡我們</span>
				</a>
			</nav>
		</el-drawer>
	</header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, HomeFilled, InfoFilled, Reading, Message } from '@element-plus/icons-vue'

const router = useRouter()
const drawerVisible = ref(false)

// 說明：由導覽按鈕觸發；切換路由或流程步驟狀態。
const goHome = () => {
	router.push('/')
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.app-header {
	background: $bg-card;
	box-shadow: $shadow-small;
	position: sticky;
	top: 0;
	z-index: 1000;
	padding: 16px 0;
}

.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 24px;
}

.header-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

/* Logo 區 */
.logo-section {
	display: flex;
	align-items: center;
	gap: 16px;
	cursor: pointer;
	transition: opacity 0.3s;

	&:hover {
		opacity: 0.8;
	}
}

.logo {
	height: 50px;
	width: auto;
}

.logo-text {
	display: flex;
	flex-direction: column;
}

.site-title {
	font-size: 18px;
	font-weight: $font-weight-semibold;
	color: $text-primary;
	margin: 0;
	line-height: 1.4;
}

.site-subtitle {
	font-size: 13px;
	color: $primary-green;
	margin: 0;
	font-weight: $font-weight-medium;
}

/* 導航選單 */
.nav-menu {
	display: flex;
	gap: 32px;
	align-items: center;
}

.nav-item {
	font-size: 16px;
	color: $text-primary;
	text-decoration: none;
	font-weight: $font-weight-medium;
	transition: color 0.3s;
	position: relative;

	&:hover {
		color: $primary-green;
	}

	&.router-link-active {
		color: $primary-green;

		&::after {
			content: '';
			position: absolute;
			bottom: -4px;
			left: 0;
			right: 0;
			height: 2px;
			background: $primary-green;
		}
	}
}

/* 手機版選單按鈕 */
.mobile-menu-btn {
	display: none;
}

/* 手機版導航 */
.mobile-nav {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.mobile-nav-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 16px;
	color: $text-primary;
	text-decoration: none;
	font-size: 16px;
	font-weight: $font-weight-medium;
	border-radius: $radius-input;
	transition: all 0.3s;

	&:hover {
		background: $bg-section;
		color: $primary-green;
	}

	&.router-link-active {
		background: rgba($primary-green, 0.12);
		color: $primary-green;
	}

	.el-icon {
		font-size: 20px;
	}
}

/* 響應式 */
@media (max-width: 768px) {
	.desktop-nav {
		display: none;
	}

	.mobile-menu-btn {
		display: flex;
	}

	.logo {
		height: 40px;
	}

	.site-title {
		font-size: 14px;
	}

	.site-subtitle {
		font-size: 11px;
	}
}

@media (max-width: 480px) {
	.logo-text {
		display: none;
	}
}
</style>
