import request from './index';

// 說明：將條件設定表單內容送往後端保存，供後續公司媒合流程使用。
export function postCompanyData(payload) {
    return request.post('/company/data', payload);
}