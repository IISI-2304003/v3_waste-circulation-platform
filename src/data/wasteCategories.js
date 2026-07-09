/**
 * 廢棄物類別定義
 */

import aClassCodes from './wasteCodes/A-class.json';
import bClassCodes from './wasteCodes/B-class.json';
import cClassCodes from './wasteCodes/C-class.json';
import dClassCodes from './wasteCodes/D-class.json';
import eClassCodes from './wasteCodes/E-class.json';
import rClassCodes from './wasteCodes/R-class.json';

// DB 遷移說明：目前各類代碼仍由本地 JSON 載入。
// 當後端提供完整類別與代碼清單（如 C-0201~C-0215）後，
// 此檔可保留為 fallback，或改為僅存前端顯示用 metadata。
export const wasteCategories = [
    {
        id: 'A',
        code: 'A類',
        name: 'A類 - 製程有害',
        description: '製程中產生的有害廢棄物',
        icon: 'warning',
        color: '#4E8DF5',
        pattern: /^A-\d{4}$/,
        codes: aClassCodes,
    },
    {
        id: 'B',
        code: 'B類',
        name: 'B類 - 毒性有害',
        description: '具有毒性的有害廢棄物',
        icon: 'dangerous',
        color: '#1CCB8C',
        pattern: /^B-\d{4}$/,
        codes: bClassCodes,
    },
    {
        id: 'C',
        code: 'C類',
        name: 'C類 - 有害特性認定',
        description: '經有害特性認定的廢棄物',
        icon: 'document-checked',
        color: '#C87412',
        pattern: /^C-\d{4}$/,
        codes: cClassCodes,
    },
    {
        id: 'D',
        code: 'D類',
        name: 'D類 - 一般事業廢棄物',
        description: '一般事業產生的廢棄物',
        icon: 'office-building',
        color: '#F0645C',
        pattern: /^D-\d{4}$/,
        codes: dClassCodes,
    },
    {
        id: 'E',
        code: 'E類',
        name: 'E類 - 混合五金廢料',
        description: '混合五金類廢棄物',
        icon: 'coin',
        color: '#F28A2E',
        pattern: /^E-\d{4}$/,
        codes: eClassCodes,
    },
    {
        id: 'R',
        code: 'R類',
        name: 'R類 - 公告應回收',
        description: '公告應回收的廢棄物',
        icon: 'refresh',
        color: '#86C33A',
        pattern: /^R-\d{4}$/,
        codes: rClassCodes,
    },
    {
        id: 'ALL',
        code: '全部',
        name: '全部類別',
        description: '顯示所有廢棄物類別',
        icon: 'grid',
        color: '#3D5467',
        pattern: null,
        codes: [],
    },
];

// 說明：回傳「get Category By Id」資料供畫面渲染或後續商業規則使用。
export function getCategoryById(categoryId) {
    // DB 遷移說明：若類別改由 API 即時取得，這裡可改為查 store / API response cache。
    return wasteCategories.find((cat) => cat.id === categoryId);
}

// 說明：回傳「get Category By Code」資料供畫面渲染或後續商業規則使用。
export function getCategoryByCode(code) {
    return wasteCategories.find((cat) => cat.pattern && cat.pattern.test(code));
}

// 說明：回傳「get All Waste Codes」資料供畫面渲染或後續商業規則使用。
export function getAllWasteCodes() {
    // DB 遷移說明：目前是把本地各類 codes 合併；改 DB 後可直接用後端聚合端點。
    return wasteCategories.flatMap((cat) => cat.codes);
}

// 說明：依條件執行搜尋/篩選，回傳符合的目標資料。
export function searchWasteCodes(keyword) {
    if (!keyword) return [];

    // DB 遷移說明：資料量變大時建議改由後端搜尋（含分頁、排序），前端保留關鍵字輸入與顯示。
    const lowerKeyword = keyword.toLowerCase();
    const allCodes = getAllWasteCodes();

    return allCodes.filter((code) => code.code.toLowerCase().includes(lowerKeyword) || code.name.toLowerCase().includes(lowerKeyword));
}
