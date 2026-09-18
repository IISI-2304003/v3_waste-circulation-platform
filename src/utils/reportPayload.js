// src/utils/reportPayload.js

// 說明：把單一廠商轉成「廠商報告」用的資料。
// 只送後端資料庫查不到的欄位（control_number 讓後端反查其餘廠商資料）。
export function toVendorReportData(vendor) {
  return {
    control_number: vendor.control_number,
    conditional_judgment: vendor.conditional_judgment || [],
    road_distance_km: vendor.road_distance_km
  }
}

// 說明：把單一廠商轉成「完整報告」廠商清單裡，每一筆要送的資料。
// 目前欄位跟 toVendorReportData 相同，維持獨立函式是因為
// 「單一廠商報告」跟「清單摘要」語意不同，未來各自異動不互相牽動。
export function toVendorSummaryData(vendor) {
  return {
    control_number: vendor.control_number,
    conditional_judgment: vendor.conditional_judgment || [],
    road_distance_km: vendor.road_distance_km
  }
}

// 說明：把 selectedMode 轉成兩份報告共用的資料。
// mode 是使用者在畫面上的操作選擇，跟廠商資料庫無關，
// vendor-report.hbs、full-report.hbs 都呼叫這一份，
// 各自的 .hbs 決定要不要顯示 summary 欄位，這裡照樣回傳。
export function toModeReportData(mode) {
  return {
    modeName: mode.modeName,
    title: mode.title,
    summary: mode.summary || '',
    stepsText: (mode.steps || []).map((s) => s.label).join('  →  ')
  }
}