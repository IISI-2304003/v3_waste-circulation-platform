const BASE_WASTE_SPECIES = [
    { id: '01', name: '動植物性類', imageLabel: '農作與有機殘渣', representativeItems: ['果菜殘渣', '禽畜糞渣', '植物纖維'], description: '指農業、畜牧業、食品製造等行業所產生之有機性廢棄物' },
    { id: '02', name: '塑膠類', imageLabel: '塑膠容器與塑料', representativeItems: ['塑膠瓶罐', '塑膠薄膜', '塑膠碎片'], description: '各類塑膠製品及其邊角料、廢棄物' },
    { id: '03', name: '橡膠類', imageLabel: '輪胎與橡膠製品', representativeItems: ['廢輪胎', '橡膠墊片', '橡膠邊角料'], description: '橡膠製品及廢棄物，包含廢輪胎等' },
    { id: '04', name: '玻璃類', imageLabel: '玻璃瓶與玻璃料', representativeItems: ['玻璃瓶罐', '平板玻璃', '玻璃碎屑'], description: '玻璃製品及其廢棄物' },
    { id: '05', name: '土石料及水泥類', imageLabel: '土石與水泥材', representativeItems: ['混凝土塊', '土石料', '水泥殘料'], description: '土石及水泥等建築相關廢棄物' },
    { id: '06', name: '紙類', imageLabel: '紙製包材', representativeItems: ['廢紙箱', '紙漿料', '紙邊角料'], description: '各類紙製品及其廢棄物' },
    { id: '07', name: '木材類', imageLabel: '木材與木板', representativeItems: ['木棧板', '木屑', '廢木板'], description: '木材及其製品廢棄物' },
    { id: '08', name: '紡織類', imageLabel: '紡織纖維與布料', representativeItems: ['布料邊料', '纖維絲束', '廢布'], description: '紡織品及纖維類廢棄物' },
    { id: '09', name: '污泥', imageLabel: '處理污泥', representativeItems: ['有機性污泥', '無機性污泥', '脫水污泥'], description: '各類處理污泥及水處理污泥' },
    { id: '10', name: '焚化爐飛灰及底灰（渣）', imageLabel: '焚化爐灰渣', representativeItems: ['飛灰', '底渣', '灰渣混合物'], description: '焚化爐產生的飛灰與底灰' },
    { id: '11', name: '爐石（碴）或礦碴', imageLabel: '冶煉爐石與礦碴', representativeItems: ['高爐石', '轉爐石', '礦碴'], description: '冶煉過程產生的爐石與礦碴' },
    { id: '12', name: '空污設備集塵灰', imageLabel: '集塵灰粉塵', representativeItems: ['袋濾灰', '旋風集塵灰', '靜電集塵灰'], description: '空氣污染控制設備產生之集塵灰' },
    { id: '13', name: '燃料灰渣', imageLabel: '燃燒後灰渣', representativeItems: ['鍋爐灰渣', '燃煤飛灰', '燃料底渣'], description: '燃料燃燒後產生之灰渣' },
    { id: '14', name: '觸媒', imageLabel: '失效觸媒', representativeItems: ['廢觸媒顆粒', '觸媒載體', '觸媒粉末'], description: '失效或廢棄之工業觸媒' },
    { id: '15', name: '金屬類', imageLabel: '金屬料件', representativeItems: ['鐵屑', '鋁屑', '銅料'], description: '各類金屬及其廢棄物' },
    { id: '16', name: '皮革類', imageLabel: '皮革邊角料', representativeItems: ['皮革碎片', '合成皮革', '皮革粉屑'], description: '皮革製品及其邊角料、廢棄物' },
    { id: '17', name: '油類', imageLabel: '廢油與油泥', representativeItems: ['廢潤滑油', '油泥', '切削油'], description: '廢油及油泥等油性廢棄物' },
    { id: '18', name: '一般廢棄物', imageLabel: '一般混合廢棄物', representativeItems: ['生活垃圾', '清掃廢棄物', '混合可燃物'], description: '一般生活垃圾及混合廢棄物' },
    { id: '19', name: '陶瓷、磚、瓦（粉、塊、屑）類', imageLabel: '陶瓷與磚瓦料', representativeItems: ['陶瓷碎片', '廢磚塊', '瓦片屑'], description: '陶瓷及磚瓦類建築廢棄物' },
    { id: '20', name: '中間處理後產物', imageLabel: '中間處理產物', representativeItems: ['固化產物', '分選後混料', '穩定化產物'], description: '經過中間處理後之廢棄物產物' },
    { id: '21', name: '醫療廢棄物', imageLabel: '醫療相關廢棄物', representativeItems: ['感染性廢棄物', '針具', '醫療塑膠'], description: '醫療機構產生之醫療相關廢棄物' },
    { id: '22', name: '攝影膠片（卷）（含X光膠片）', imageLabel: '膠片與X光片', representativeItems: ['攝影膠卷', 'X光片', '銀鹽膠片'], description: '攝影膠片及X光膠片廢棄物' },
    { id: '23', name: '化學物品（殘渣）', imageLabel: '化學殘渣', representativeItems: ['反應殘渣', '藥劑殘留', '化學沉渣'], description: '化學物品使用後之殘渣廢棄物' },
    { id: '24', name: '廢液', imageLabel: '廢液體', representativeItems: ['顯影液', '定影液及其他攝影沖洗或照相製版廢液', '食用飲料、酒類及調味料', '含鹵有機廢液（溶劑）', '不含鹵有機廢液（溶劑）', '廢鹼液', '廢酸液', '廢（污）水pH值小於6.0', '廢（污）水pH值介於6.0-9.0', '廢（污）水pH值大於9.0', '廢光阻剝離液', '廢電解溶液', '電鍍廢液', '廢剝錫液', '酸性蝕刻液', '鹼性蝕刻液', '硫酸', '鹽酸', '氫氟酸', '磷酸', '氫氧化鈉', '異丙醇', '光阻稀釋劑', '甲醇', '甲苯', '丙酮', '硫酸銨廢液', '其他廢液或其混合物'], description: '各類廢棄液體廢棄物' },
    { id: '25', name: '機械電子類廢棄物（廢料、廢品）及混合五金廢料', imageLabel: '機械電子與五金', representativeItems: ['電子零件', '機械廢料', '混合五金'], description: '機械、電子及五金類廢棄物' },
    { id: '26', name: '廢照明光源類', imageLabel: '照明器材', representativeItems: ['日光燈管', 'LED燈具', '高壓燈'], description: '廢棄燈管及照明設備' },
    { id: '27', name: '廢電池類', imageLabel: '電池與電芯', representativeItems: ['鋰電池', '鉛酸電池', '乾電池'], description: '各類廢棄電池及電芯' },
    { id: '28', name: '廢機動車輛類', imageLabel: '報廢車輛', representativeItems: ['報廢汽車', '報廢機車', '車體零件'], description: '報廢車輛及汽機車廢棄物' },
    { id: '29', name: '廢電器類', imageLabel: '廢家電', representativeItems: ['冰箱', '洗衣機', '冷氣機'], description: '廢棄家電及電器設備' },
    { id: '30', name: '廢資訊物品類', imageLabel: '資訊設備', representativeItems: ['電腦主機', '螢幕', '印表機'], description: '廢棄資訊及電腦設備' },
];

// 說明：建立初始化資料或執行初始化流程，供後續操作使用。
export const buildSpeciesImage = (seed) => {
    const safeSeed = String(Number(seed) || 1).padStart(2, '0');
    return `/species/${safeSeed}.jpg`;
};

// 說明：建立初始化資料或執行初始化流程，供後續操作使用。
export const buildSpeciesFallbackImage = () => '/species/fallback.jpg';

// 說明：將輸入資料標準化為系統格式，供媒合與查詢流程使用。
export const normalizeWasteSpecies = (rawItem, index = 0) => {
    const rawId = rawItem?.id ?? rawItem?.speciesId ?? `${index + 1}`;
    const id = String(rawId).padStart(2, '0');
    const representativeItems = Array.isArray(rawItem?.representativeItems) ? rawItem.representativeItems : Array.isArray(rawItem?.items) ? rawItem.items : [];

    return {
        id,
        name: rawItem?.name ?? rawItem?.speciesName ?? `未命名物種 ${id}`,
        description: rawItem?.description ?? rawItem?.summary ?? '',
        imageLabel: rawItem?.imageLabel ?? rawItem?.name ?? rawItem?.speciesName ?? `物種 ${id}`,
        representativeItems,
        image: rawItem?.image || buildSpeciesImage(Number(id)),
    };
};

// 說明：將輸入資料標準化為系統格式，供媒合與查詢流程使用。
export const normalizeWasteSpeciesList = (rawList = []) => {
    if (!Array.isArray(rawList)) return [];
    return rawList.map((item, index) => normalizeWasteSpecies(item, index));
};

// 說明：回傳「get Waste Species Cards Local」資料供畫面渲染或後續商業規則使用。
export const getWasteSpeciesCardsLocal = () => normalizeWasteSpeciesList(BASE_WASTE_SPECIES);

// 說明：回傳「get Waste Species By Id」資料供畫面渲染或後續商業規則使用。
export const getWasteSpeciesById = (id, sourceList = BASE_WASTE_SPECIES) => {
    const normalized = normalizeWasteSpeciesList(sourceList);
    return normalized.find((item) => item.id === String(id).padStart(2, '0')) || null;
};
