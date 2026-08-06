/**
 * 廢棄物代碼 API
 * 提供廢棄物代碼的查詢與搜尋功能
 */

import request from './index';

// 說明：回傳來源產業選單資料（/announcementcategory）。
export async function getAnnouncementCategoryOptions() {
    const result = await request.get('/announcementcategory');
    return result;
}

// 說明：依來源產業 ID 取得對應製程清單。
export function getProcessList(announcementCategoryId) {
    return request.get('/process', {
        params: {
            announcementCategoryId,
        },
    });
}

/**
 * 取得所有類別
 */
// 說明：回傳「get Categories」資料供畫面渲染或後續商業規則使用。
export async function getCategories() {
    const ALLOWED_CATEGORY_IDS = new Set(['A', 'B', 'C', 'D', 'E', 'R']);
    const result = await request.get('/wastecategory');

    if (!Array.isArray(result)) return [];

    return result.filter((item) => ALLOWED_CATEGORY_IDS.has(item.waste_class_code)).map((item) => ({ id: item.waste_class_code, name: item.waste_class_name, codes: [] }));
}

/**
 * 一次取得所有廢棄物代碼，並依類別分組回傳
 * @returns {Object} 以 categoryId 為 key 的分組資料，例如 { A: [...], B: [...] }
 */
// 說明：一次 API 請求取得全部資料，前端依類別前綴分組，避免重複請求。
export async function getAllWasteCodesGrouped() {
    const result = await request.get('/wastedetail');

    if (!Array.isArray(result)) return {};

    return result.reduce((groups, item) => {
        const wasteCode = String(item?.waste_code || '');
        const categoryId = wasteCode.split('-')[0];
        if (!categoryId) return groups;
        if (!groups[categoryId]) groups[categoryId] = [];
        groups[categoryId].push({
            code: item.waste_code,
            name: item.waste_name,
            description: item.remark || '',
            categoryId,
        });
        return groups;
    }, {});
}

/**
 * 根據類別 ID 取得該類別的所有廢棄物代碼
 */
// 說明：複用 getAllWasteCodesGrouped，取指定類別的結果。
export async function getWasteCodesByCategory(categoryId) {
    const grouped = await getAllWasteCodesGrouped();
    return grouped[categoryId] || [];
}

/**
 * 根據廢棄物代碼取得詳細資訊
 */
// 說明：回傳「get Waste Code Detail」資料供畫面渲染或後續商業規則使用。
export async function getWasteCodeDetail(code) {
    const result = await request.get('/wastedetail');

    if (!Array.isArray(result)) throw new Error(`未找到廢棄物代碼：${code}`);

    const item = result.find((i) => i.waste_code === code);
    if (!item) throw new Error(`未找到廢棄物代碼：${code}`);

    return {
        code: item.waste_code,
        name: item.waste_name,
        description: item.remark || '',
        categoryId: String(item.waste_code || '').split('-')[0],
    };
}

/**
 * 搜尋廢棄物代碼
 * @param {string} keyword - 搜尋關鍵字（代碼或名稱）
 * @param {string} categoryId - 可選，限定類別
 */
// 說明：依條件執行搜尋/篩選，回傳符合的目標資料。
export async function searchWasteCodeAPI(keyword, categoryId = null) {
    const result = await request.get('/wastedetail');

    if (!Array.isArray(result)) return [];

    const lowerKeyword = keyword.toLowerCase();
    return result
        .filter((item) => {
            const code = String(item.waste_code || '').toLowerCase();
            const name = String(item.waste_name || '').toLowerCase();
            const matchKeyword = code.includes(lowerKeyword) || name.includes(lowerKeyword);
            const matchCategory = categoryId ? code.startsWith(`${categoryId}-`) : true;
            return matchKeyword && matchCategory;
        })
        .map((item) => ({
            code: item.waste_code,
            name: item.waste_name,
            description: item.remark || '',
            categoryId: String(item.waste_code || '').split('-')[0],
        }));
}

/**
 * 根據允收標準搜尋廢棄物
 * @param {Array} standards - 允收標準陣列
 */
// 說明：依條件執行搜尋/篩選，回傳符合的目標資料。
// 注意：後端目前無允收標準篩選端點，暫時回傳空陣列，待後端支援後再實作。
export async function searchByStandards(_standards) {
    return [];
}

/**
 * 解析語意化輸入
 * 將自然語言描述轉換為允收標準參數
 */
// 說明：將輸入資料標準化為系統格式，供決策與查詢流程使用。
export function parseSemanticInput(text) {
    // 說明：封裝「lines」商業邏輯，供目前流程重複使用。
    const lines = text.split('\n').filter((line) => line.trim());
    const results = [];

    // 說明：將輸入資料標準化為系統格式，供決策與查詢流程使用。
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

    // 說明：將輸入資料標準化為系統格式，供決策與查詢流程使用。
    const normalizeOperator = (op = '') => {
        const source = op.replace(/\s+/g, '');
        if (source === '<' || source === '＜') return '小於(<)';
        if (source === '>' || source === '＞') return '大於(>)';
        if (source === '<=' || source === '≤' || source === '≦' || source === '≶' || source === '=<') return '小於等於(<=)';
        if (source === '>=' || source === '≥' || source === '≧' || source === '=>') return '大於等於(>=)';
        if (source === '=' || source === '＝') return '等於';
        return '';
    };

    // 說明：將輸入資料標準化為系統格式，供決策與查詢流程使用。
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
 * @param {string} wastecode - 廢棄物代碼，例如 C-0202
 * @returns {Array<{test_item: string, unit: string}>}
 */
// 說明：依廢棄物代碼從 API 取得參數選項及對應單位。
export async function getParameterOptions(wastecode) {
    const result = await request.get('/wastedetail/property', {
        params: { wastecode },
    });
    if (!Array.isArray(result)) return [];
    return result.filter((item) => item.test_item);
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
 * 取得廠商清單
 */
// 說明：從 API 取得可合作的廠商資料，並轉換為前端顯示格式。
export async function getCompanyList() {
    const result = await request.get('/company');
    if (!Array.isArray(result)) return [];
    console.log('getCompanyList', result);
    return result;

    // return result.map((item) => {
    //     // 解析許可總量數字，例如 "400公噸/月" → 400
    //     const capacityNum = parseInt(String(item.permitted_quantity || '0').replace(/[^0-9]/g, ''), 10) || 0;

    //     // 格式化日期，例如 "2028/5/17 上午 12:00:00" → "2028-05-17"
    //     const formatDate = (dateStr) => {
    //         if (!dateStr) return '';
    //         const match = String(dateStr).match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
    //         if (!match) return dateStr;
    //         return `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}`;
    //     };

    //     return {
    //         id: item.id,
    //         name: item.company_name || '',
    //         category: item.case_type || '',
    //         wasteReuse: item.waste_code || '',
    //         isReuseOrg: item.is_reuse_company === '是',
    //         location: item.region || '',
    //         distance: 0,
    //         product: item.waste_name || '',
    //         capacity: capacityNum,
    //         score: 0,
    //         controlNo: item.control_number || '',
    //         validityPeriod: formatDate(item.permit_end_date),
    //         image: '',
    //         reasons: [],
    //         capacityLevel: 0,
    //         capacityLevelText: '',
    //         contactPhone: item.phone || '',
    //         factoryAddress: item.address || '',
    //         acceptanceStandards: [],
    //         permitNumber: item.permit_number || '',
    //         permitStartDate: formatDate(item.permit_start_date),
    //         contactPerson: item.contact_person || '',
    //     };
    // });
}
