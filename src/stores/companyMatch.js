// src/stores/companyMatch.js
import { defineStore } from 'pinia';

export const useCompanyMatchStore = defineStore('companyMatch', {
    state: () => ({
        companyData: null, // API 回傳的廠商資料
        loading: false,
        error: null,
    }),
    actions: {
        setCompanyData(data) {
            this.companyData = data;
        },
        clear() {
            this.companyData = null;
            this.error = null;
        },
    },
    // 如果希望重新整理頁面後資料還在，可以搭配 persist 套件
    // persist: true,
});
