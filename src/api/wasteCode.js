/**
 * 廢棄物代碼 API
 * 提供廢棄物代碼的查詢與搜尋功能
 */

import { wasteCategories, getCategoryById, getAllWasteCodes, searchWasteCodes } from '../data/wasteCategories';

/**
 * 取得所有類別
 */
export async function getCategories() {
    // 模擬非同步操作
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(wasteCategories);
        }, 100);
    });
}

/**
 * 根據類別 ID 取得該類別的所有廢棄物代碼
 */
export async function getWasteCodesByCategory(categoryId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const category = getCategoryById(categoryId);
            if (category) {
                resolve(category.codes);
            } else {
                reject(new Error(`未找到類別：${categoryId}`));
            }
        }, 100);
    });
}

/**
 * 根據廢棄物代碼取得詳細資訊
 */
export async function getWasteCodeDetail(code) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const allCodes = getAllWasteCodes();
            const codeDetail = allCodes.find((c) => c.code === code);

            if (codeDetail) {
                resolve(codeDetail);
            } else {
                reject(new Error(`未找到廢棄物代碼：${code}`));
            }
        }, 100);
    });
}

/**
 * 搜尋廢棄物代碼
 * @param {string} keyword - 搜尋關鍵字（代碼或名稱）
 * @param {string} categoryId - 可選，限定類別
 */
export async function searchWasteCodeAPI(keyword, categoryId = null) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let results = searchWasteCodes(keyword);

            // 如果指定類別，進一步過濾
            if (categoryId) {
                results = results.filter((code) => code.categoryId === categoryId);
            }

            resolve(results);
        }, 200);
    });
}

/**
 * 根據允收標準搜尋廢棄物
 * @param {Array} standards - 允收標準陣列
 */
export async function searchByStandards(standards) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const allCodes = getAllWasteCodes();

            // 這裡是簡化後的匹配邏輯
            // 實際上應依照 standards 條件做更完整的比對
            const results = allCodes.filter((code) => {
                if (!code.standards || code.standards.length === 0) return false;

                // 簡化規則：只要任一標準參數名稱相符就視為命中
                return standards.some((searchStd) => code.standards.some((codeStd) => codeStd.parameter === searchStd.parameter));
            });

            resolve(results);
        }, 300);
    });
}

/**
 * 解析語意化輸入
 * 將自然語言描述轉換為允收標準參數
 */
export function parseSemanticInput(text) {
    const lines = text.split('\n').filter((line) => line.trim());
    const results = [];

    for (const line of lines) {
        const trimmedLine = line.trim();

        // 解析「水分45%」格式
        const pattern1 = /^(.+?)(\d+\.?\d*)(%|mg\/kg|ppm|°C)?$/;
        const match1 = trimmedLine.match(pattern1);

        if (match1) {
            const [, parameter, value, unit = ''] = match1;
            results.push({
                parameter: parameter.trim(),
                operator: '等於',
                value: parseFloat(value),
                unit: unit,
                condition: '需',
            });
            continue;
        }

        // 解析「硫酸<5%」格式
        const pattern2 = /^(.+?)([<>=])(\d+\.?\d*)(%|mg\/kg|ppm|°C)?$/;
        const match2 = trimmedLine.match(pattern2);

        if (match2) {
            const [, parameter, operator, value, unit = ''] = match2;
            const operatorMap = {
                '<': '小於(<)',
                '>': '大於(>)',
                '=': '等於',
            };

            results.push({
                parameter: parameter.trim(),
                operator: operatorMap[operator] || operator,
                value: parseFloat(value),
                unit: unit,
                condition: '需',
            });
            continue;
        }

        // 解析「氯離子1-6」或「pH 6-9」的範圍格式
        const pattern3 = /^(.+?)([<>=])?(\d+\.?\d*)-(\d+\.?\d*)(%|mg\/kg|ppm|°C)?$/;
        const match3 = trimmedLine.match(pattern3);

        if (match3) {
            const [, parameter, operator = '', valueMin, valueMax, unit = ''] = match3;

            results.push({
                parameter: parameter.trim(),
                operator: '範圍',
                valueMin: parseFloat(valueMin),
                valueMax: parseFloat(valueMax),
                unit: unit,
                condition: '需',
            });
            continue;
        }

        // 如果無法解析，保留為純文字項目
        results.push({
            parameter: trimmedLine,
            operator: '',
            value: '',
            unit: '',
            condition: '備註',
            isText: true,
        });
    }

    return results;
}

/**
 * 取得參數選項清單（用於下拉選單）
 */
export function getParameterOptions() {
    return ['重金屬含量', '鉻含量', '鎳含量', '鉛含量', '汞含量', '銅含量', '含水率', '水分', 'pH 值', '硫酸含量', '氯離子', '有機物含量', '閃點', '酸度', '鹼度', '懸浮物', '重金屬總量'];
}

/**
 * 取得操作符選項清單
 */
export function getOperatorOptions() {
    return [
        { value: '等於', label: '等於 (=)' },
        { value: '小於(<)', label: '小於 (<)' },
        { value: '大於(>)', label: '大於 (>)' },
        { value: '小於等於(<=)', label: '小於等於 (<=)' },
        { value: '大於等於(>=)', label: '大於等於 (>=)' },
        { value: '範圍', label: '範圍 (min-max)' },
    ];
}

/**
 * 取得單位選項清單
 */
export function getUnitOptions() {
    return ['%', 'mg/kg', 'ppm', '°C', 'g/L', ''];
}
