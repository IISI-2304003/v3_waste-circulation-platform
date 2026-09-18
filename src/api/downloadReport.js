import { ElMessage } from 'element-plus';
import { exportVendorReport, exportFullReport } from '@/api/report';

const reportApiMap = {
    vendor: exportVendorReport,
    full: exportFullReport,
};

export async function downloadReport({ type, payload, filename }) {
    try {
        const res = await reportApiMap[type](payload);

        const blob = new Blob([res], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return true;
    } catch (err) {
        console.error('下載報告失敗', err);
        ElMessage.error('報告產生失敗，請稍後再試');
        return false;
    }
}
