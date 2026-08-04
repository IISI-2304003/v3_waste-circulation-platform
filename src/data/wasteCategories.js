/**
 * 廢棄物類別定義
 */

export const wasteCategories = [
    {
        id: 'A',
        code: 'A類',
        name: 'A類 - 製程有害',
        shortName: '製程有害',
        description: '製程中產生的有害廢棄物',
        icon: 'warning',
        color: '#4E8DF5',
        pattern: /^A-\d{4}$/,
        // codes: aClassCodes,
    },
    {
        id: 'B',
        code: 'B類',
        name: 'B類 - 毒性有害',
        shortName: '毒性有害',
        description: '具有毒性的有害廢棄物',
        icon: 'dangerous',
        color: '#1CCB8C',
        pattern: /^B-\d{4}$/,
        codes: [],
    },
    {
        id: 'C',
        code: 'C類',
        name: 'C類 - 有害特性認定',
        shortName: '有害特性認定',
        description: '經有害特性認定的廢棄物',
        icon: 'document-checked',
        color: '#C87412',
        pattern: /^C-\d{4}$/,
        codes: [],
    },
    {
        id: 'D',
        code: 'D類',
        name: 'D類 - 一般事業廢棄物',
        shortName: '一般事業廢棄物',
        description: '一般事業產生的廢棄物',
        icon: 'office-building',
        color: '#F0645C',
        pattern: /^D-\d{4}$/,
        codes: [],
    },
    {
        id: 'E',
        code: 'E類',
        name: 'E類 - 混合五金廢料',
        shortName: '混合五金廢料',
        description: '混合五金類廢棄物',
        icon: 'coin',
        color: '#F28A2E',
        pattern: /^E-\d{4}$/,
        codes: [],
    },
    {
        id: 'R',
        code: 'R類',
        name: 'R類 - 公告應回收',
        shortName: '公告應回收',
        description: '公告應回收的廢棄物',
        icon: 'refresh',
        color: '#86C33A',
        pattern: /^R-\d{4}$/,
        codes: [],
    },
    {
        id: 'ALL',
        code: '全部',
        name: '全部類別',
        shortName: '全部類別',
        description: '顯示所有廢棄物類別',
        icon: 'grid',
        color: '#3D5467',
        pattern: null,
        codes: [],
    },
];

// 說明：回傳「get Category By Id」資料供畫面渲染或後續商業規則使用。
export function getCategoryById(categoryId) {
    return wasteCategories.find((cat) => cat.id === categoryId);
}

// 說明：回傳「get All Waste Codes」資料供畫面渲染或後續商業規則使用。
export function getAllWasteCodes() {
    return wasteCategories.flatMap((cat) => cat.codes);
}

// 說明：依條件執行搜尋/篩選，回傳符合的目標資料。
export function searchWasteCodes(keyword) {
    if (!keyword) return [];

    const lowerKeyword = keyword.toLowerCase();
    const allCodes = getAllWasteCodes();

    return allCodes.filter((code) => code.code.toLowerCase().includes(lowerKeyword) || code.name.toLowerCase().includes(lowerKeyword));
}
