import { defineStore } from 'pinia';
import { getCirculationModes } from '../api/circulationModes';

export const useCirculationModesStore = defineStore('circulationModes', {
    state: () => ({
        modes: [],
        loading: false,
        error: null,
    }),

    getters: {
        getModeById: (state) => (id) => {
            return state.modes.find((mode) => mode.id === id);
        },
        modesCount: (state) => state.modes.length,
    },

    actions: {
        async fetchModes() {
            this.loading = true;
            this.error = null;
            try {
                const response = await getCirculationModes();
                this.modes = response.data || response;
            } catch (err) {
                this.error = err.message || '載入失敗';
                console.error('fetchModes error:', err);
            } finally {
                this.loading = false;
            }
        },
    },
});
