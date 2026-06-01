import { ref, onMounted } from 'vue';
import { getCirculationModes, getCirculationModeById } from '../api/circulationModes';

/**
 * 循環模式相關邏輯封裝
 */
export function useCirculationModes() {
    const modes = ref([]);
    const loading = ref(false);
    const error = ref(null);

    /**
     * 取得所有循環模式
     */
    const fetchModes = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await getCirculationModes();
            modes.value = response.data || response;
        } catch (err) {
            error.value = err.message || '載入循環模式失敗';
            console.error('fetchModes error:', err);
        } finally {
            loading.value = false;
        }
    };

    /**
     * 根據 ID 取得單一模式
     */
    const getModeById = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await getCirculationModeById(id);
            return response.data || response;
        } catch (err) {
            error.value = err.message || '載入模式詳情失敗';
            console.error('getModeById error:', err);
            return null;
        } finally {
            loading.value = false;
        }
    };

    // 組件掛載時自動載入
    onMounted(() => {
        fetchModes();
    });

    return {
        modes,
        loading,
        error,
        fetchModes,
        getModeById,
    };
}
