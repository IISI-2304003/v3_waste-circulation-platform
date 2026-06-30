import request from './index';
import circulationModesData from '../data/circulationModes.json';

/**
 * 取得所有循環模式列表
 */
// 說明：回傳「get Circulation Modes」資料供畫面渲染或後續商業規則使用。
export const getCirculationModes = () => {
    // 判斷是否使用 Mock 數據
    if (import.meta.env.VITE_MOCK_API === 'true') {
        return Promise.resolve({ data: circulationModesData });
    }
    return request.get('/circulation-modes');
};

/**
 * 根據 ID 取得單一循環模式詳情
 * @param {number} id - 循環模式 ID
 */
// 說明：回傳「get Circulation Mode By Id」資料供畫面渲染或後續商業規則使用。
export const getCirculationModeById = (id) => {
    // 判斷是否使用 Mock 數據
    if (import.meta.env.VITE_MOCK_API === 'true') {
        // 說明：封裝「mode」商業邏輯，供目前流程重複使用。
        const mode = circulationModesData.find((item) => item.id === id);
        return Promise.resolve({ data: mode });
    }
    return request.get(`/circulation-modes/${id}`);
};
