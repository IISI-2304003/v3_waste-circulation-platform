<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft JhengHei', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2C3E50;
  background: #FFFFFF;
}

#app {
  min-height: 100vh;
}

/* Element Plus 主題覆蓋 */
:root {
  --el-color-primary: #4CAF50;
  --el-color-primary-light-3: #66BB6A;
  --el-color-primary-light-5: #81C784;
  --el-color-primary-light-7: #A5D6A7;
  --el-color-primary-light-8: #C8E6C9;
  --el-color-primary-light-9: #E8F5E9;
  --el-color-primary-dark-2: #388E3C;
}
</style>

