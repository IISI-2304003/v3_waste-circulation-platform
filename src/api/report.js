import request from './index';

export function exportVendorReport(payload) {
    return request.post('/reports/vendor', payload, {
        responseType: 'blob',
        timeout: 15000,
    });
}

export function exportFullReport(payload) {
    return request.post('/reports/full', payload, {
        responseType: 'blob',
        timeout: 15000,
    });
}
