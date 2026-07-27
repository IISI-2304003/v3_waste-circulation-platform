import axios from 'axios';

const apiBaseURL = import.meta.env.VITE_API_BASE_URL || '/api';

// 創建 Axios 實例
const request = axios.create({
    baseURL: apiBaseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
});

// 請求攔截器
request.interceptors.request.use(
    (config) => {
        if ((config.baseURL || '').includes('ngrok-free.dev') || (config.url || '').includes('ngrok-free.dev')) {
            config.headers['ngrok-skip-browser-warning'] = 'true';
        }

        // 可在此添加 token 等認證資訊
        // const token = localStorage.getItem('token')
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`
        // }
        return config;
    },
    (error) => {
        console.error('請求錯誤:', error);
        return Promise.reject(error);
    },
);

// 響應攔截器
request.interceptors.response.use(
    (response) => {
        // 統一處理響應數據
        return response.data;
    },
    (error) => {
        // 統一錯誤處理
        console.error('API錯誤:', error.response?.data || error.message);

        // 根據不同的錯誤狀態碼處理
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 未授權，跳轉到登入頁
                    console.error('未授權，請重新登入');
                    break;
                case 403:
                    console.error('無權限訪問');
                    break;
                case 404:
                    console.error('請求資源不存在');
                    break;
                case 500:
                    console.error('伺服器錯誤');
                    break;
                default:
                    console.error('請求失敗');
            }
        }

        return Promise.reject(error);
    },
);

export default request;
