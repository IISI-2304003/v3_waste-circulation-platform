/**
 * 廢棄物代碼 API
 * 提供廢棄物代碼的查詢與搜尋功能
 */
import request from './index'
import { wasteCategories, getCategoryById, getAllWasteCodes, searchWasteCodes } from '../data/wasteCategories';

// DB 遷移說明：本檔目前同時存在「真實 API 呼叫」與「本地資料模擬」。
// 後續建議以後端端點為主，逐步移除 setTimeout + 本地資料邏輯。

export function getWasteDetailList() {
    return request({
        url: '/wastedetail',
        method: 'get'
    })
}


/**
 * 取得所有類別
 */
// 說明：回傳「get Categories」資料供畫面渲染或後續商業規則使用。
export async function getCategories() {
    // 模擬非同步操作
    // DB 遷移說明：改為直接呼叫後端類別端點（可沿用 getWasteCategoryList 模式）。
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(wasteCategories);
        }, 100);
    });
}

/**
 * 根據類別 ID 取得該類別的所有廢棄物代碼
 */
// 說明：回傳「get Waste Codes By Category」資料供畫面渲染或後續商業規則使用。
export async function getWasteCodesByCategory(categoryId) {
    // DB 遷移說明：改為呼叫 /waste-codes?categoryId=...，避免前端依賴本地 codes。
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
// 說明：回傳「get Waste Code Detail」資料供畫面渲染或後續商業規則使用。
export async function getWasteCodeDetail(code) {
    // DB 遷移說明：此處是 C-0201~C-0215 單筆詳情的主要替換點，
    // 未來改成直接請求後端 detail 端點。
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const allCodes = getAllWasteCodes();
            // 說明：封裝「code Detail」商業邏輯，供目前流程重複使用。
            const codeDetail = allCodes.find((c) => (c.code || c.waste_code) === code);

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
// 說明：依條件執行搜尋/篩選，回傳符合的目標資料。
export async function searchWasteCodeAPI(keyword, categoryId = null) {
    // DB 遷移說明：資料量增加後建議改為後端搜尋，前端僅處理輸入與結果顯示。
    return new Promise((resolve) => {
        setTimeout(() => {
            let results = searchWasteCodes(keyword);

            // 如果指定類別，進一步過濾
            if (categoryId) {
                results = results.filter((code) => {
                    const codeValue = code.code || code.waste_code || ''
                    return code.categoryId === categoryId || codeValue.startsWith(`${categoryId}-`)
                });
            }

            resolve(results);
        }, 200);
    });
}

/**
 * 根據允收標準搜尋廢棄物
 * @param {Array} standards - 允收標準陣列
 */
// 說明：依條件執行搜尋/篩選，回傳符合的目標資料。
export async function searchByStandards(standards) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const allCodes = getAllWasteCodes();

            // 這裡是簡化後的匹配邏輯
            // 實際上應依照 standards 條件做更完整的比對
            // 說明：封裝「results」商業邏輯，供目前流程重複使用。
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
// 說明：將輸入資料標準化為系統格式，供媒合與查詢流程使用。
export function parseSemanticInput(text) {
    // 說明：封裝「lines」商業邏輯，供目前流程重複使用。
    const lines = text.split('\n').filter((line) => line.trim());
    const results = [];

    // 說明：將輸入資料標準化為系統格式，供媒合與查詢流程使用。
    const normalizeUnit = (unit = '') => unit.replace(/\s+/g, '').toLowerCase();

    const unitMap = {
        '%': '%',
        'mg/kg': 'mg/kg',
        mgkg: 'mg/kg',
        ppm: 'ppm',
        '°c': '°C',
        c: '°C',
        'g/l': 'g/L',
        gl: 'g/L',
    };

    // 說明：將輸入資料標準化為系統格式，供媒合與查詢流程使用。
    const normalizeOperator = (op = '') => {
        const source = op.replace(/\s+/g, '');
        if (source === '<' || source === '＜') return '小於(<)';
        if (source === '>' || source === '＞') return '大於(>)';
        if (source === '<=' || source === '≤' || source === '≦' || source === '≶' || source === '=<') return '小於等於(<=)';
        if (source === '>=' || source === '≥' || source === '≧' || source === '=>') return '大於等於(>=)';
        if (source === '=' || source === '＝') return '等於';
        return '';
    };

    // 說明：將輸入資料標準化為系統格式，供媒合與查詢流程使用。
    const normalizeUnitOutput = (unit = '') => {
        if (!unit) return '';
        const normalized = normalizeUnit(unit);
        return unitMap[normalized] || unit;
    };

    for (const line of lines) {
        const trimmedLine = line.trim();
        const normalizedLine = trimmedLine.replace(/～/g, '~').replace(/−/g, '-').replace(/\s+/g, ' ').trim();

        const rangeMatch = normalizedLine.match(/^(.+?)\s*([<>]=?|[＜＞]=?|[≤≥≦≧＝=])?\s*(-?\d+(?:\.\d+)?)\s*~\s*(-?\d+(?:\.\d+)?)\s*([%a-zA-Z°/]+)?$/u);
        if (rangeMatch) {
            const [, parameterRaw, , valueMinRaw, valueMaxRaw, unitRaw = ''] = rangeMatch;
            const valueMin = parseFloat(valueMinRaw);
            const valueMax = parseFloat(valueMaxRaw);

            results.push({
                parameter: parameterRaw.trim(),
                operator: '範圍',
                valueMin,
                valueMax,
                unit: normalizeUnitOutput(unitRaw),
                condition: '需',
            });
            continue;
        }

        const compareMatch = normalizedLine.match(/^(.+?)\s*(<=|>=|<|>|=|＜|＞|＝|≤|≥|≦|≧)\s*(-?\d+(?:\.\d+)?)\s*([%a-zA-Z°/]+)?$/u);
        if (compareMatch) {
            const [, parameterRaw, operatorRaw, valueRaw, unitRaw = ''] = compareMatch;
            const operator = normalizeOperator(operatorRaw);

            results.push({
                parameter: parameterRaw.trim(),
                operator: operator || '等於',
                value: parseFloat(valueRaw),
                unit: normalizeUnitOutput(unitRaw),
                condition: '需',
            });
            continue;
        }

        const equalMatch = normalizedLine.match(/^(.+?)\s*(-?\d+(?:\.\d+)?)\s*([%a-zA-Z°/]+)?$/u);
        if (equalMatch) {
            const [, parameterRaw, valueRaw, unitRaw = ''] = equalMatch;

            results.push({
                parameter: parameterRaw.trim(),
                operator: '等於',
                value: parseFloat(valueRaw),
                unit: normalizeUnitOutput(unitRaw),
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
// 說明：回傳「get Parameter Options」資料供畫面渲染或後續商業規則使用。
export function getParameterOptions() {
    return ['pH', '含水率', '硫酸濃度', '比重', '外觀', '雙氧水', 'HF濃度', '鐵', '灼熱殘渣', '總汞', '六價鉻', '總砷', '總鉛', '總鎘', '總鉻', '總銅', '總硒','總鋇','總銀'];
}

/**
 * 取得操作符選項清單
 */
// 說明：回傳「get Operator Options」資料供畫面渲染或後續商業規則使用。
export function getOperatorOptions() {
    return [
        { value: '等於', label: '等於 (=)' },
        { value: '小於(<)', label: '小於 (<)' },
        { value: '大於(>)', label: '大於 (>)' },
        { value: '小於等於(<=)', label: '小於等於 (<=)' },
        { value: '大於等於(>=)', label: '大於等於 (>=)' },
        { value: '範圍', label: '範圍 (~)' },
    ];
}

/**
 * 取得單位選項清單
 */
// 說明：回傳「get Unit Options」資料供畫面渲染或後續商業規則使用。
export function getUnitOptions() {
    return ['%', 'mg/kg', 'ppm', '°C', 'g/L', ''];
}
