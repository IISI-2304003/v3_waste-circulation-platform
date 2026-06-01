import request from './index';
import circulationModesData from '../data/circulationModes.json';

/**
 * 取得所有循環模式列表
 */
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
export const getCirculationModeById = (id) => {
    // 判斷是否使用 Mock 數據
    if (import.meta.env.VITE_MOCK_API === 'true') {
        const mode = circulationModesData.find((item) => item.id === id);
        return Promise.resolve({ data: mode });
    }
    return request.get(`/circulation-modes/${id}`);
};
