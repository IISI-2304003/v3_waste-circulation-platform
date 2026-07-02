/**
 * 分類視覺設定（顏色、圖示）
 *
 * 這份資料「只存在前端」，未來串接真實 API 時，API 只會回傳
 * id / name / codes 這類業務資料，不會有顏色或圖示。
 *
 * 用法：畫面上任何需要「某分類長怎樣」的地方，都用 category.id
 * 來這裡查對應的顏色與圖示，跟 API 資料合併後再渲染。
 *
 * 未來如果 API 新增了這裡沒有的分類 id，也不會壞掉，
 * 會自動套用下面的 fallbackVisual（灰色 + 通用圖示）。
 */

export const categoryVisuals = {
    A: {
        color: '#4285F4',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8"/><path d="M10 3v8l-5 9a1 1 0 00.9 1.5h12.2a1 1 0 00.9-1.5L14 11V3"/><line x1="7" y1="17" x2="17" y2="17"/></svg>',
    },
    B: {
        color: '#EF4444',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r=".5" fill="currentColor" stroke="none"/></svg>',
    },
    C: {
        color: '#22C55E',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6z"/><polyline points="9 12 11 14 15 10"/></svg>',
    },
    D: {
        color: '#F97316',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><path d="M2 22V9l7-6h6l7 6v13"/><rect x="9" y="15" width="6" height="7"/><line x1="6" y1="12" x2="6" y2="14"/><line x1="18" y1="12" x2="18" y2="14"/></svg>',
    },
    E: {
        color: '#8B5CF6',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',
    },
    R: {
        color: '#06B6D4',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>',
    },
};

// 找不到對應分類時使用的預設樣式（例如 API 新增了分類但這裡還沒補上）
export const fallbackVisual = {
    color: '#64748B',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
};
