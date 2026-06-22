import { defineStore } from 'pinia';

const defaultSource = () => ({
    industry: '',
    process: '',
    outputAmount: null,
    outputFrequency: '',
});

const defaultSite = () => ({
    region: [],
    hasReuseSpace: null,
    hasSecondaryWaste: null,
});

const defaultBusiness = () => ({
    businessName: '',
    businessAddress: '',
    clearanceFrequency: '',
    clearanceAmount: null,
    technologyMaturity: 5,
    recycledProductDemand: '',
});

const defaultSelectedPath = () => ({
    modeName: '',
    title: '',
    summary: '',
});

export const useConditionSetupStore = defineStore('conditionSetup', {
    state: () => ({
        activeSection: 'physical',
        sourceConditions: defaultSource(),
        siteConditions: defaultSite(),
        businessConditions: defaultBusiness(),
        acceptanceConditions: [],
        uploadedReports: [],
        selectedRecommendedPath: defaultSelectedPath(),
    }),
    actions: {
        setActiveSection(sectionId) {
            this.activeSection = sectionId;
        },
        setUploadedReports(files) {
            this.uploadedReports = files;
        },
        setAcceptanceConditions(conditions) {
            this.acceptanceConditions = Array.isArray(conditions) ? conditions : [];
        },
        setSelectedRecommendedPath(path) {
            this.selectedRecommendedPath = path
                ? {
                      modeName: path.modeName || '',
                      title: path.title || '',
                      summary: path.summary || '',
                  }
                : defaultSelectedPath();
        },
        resetAll() {
            this.activeSection = 'physical';
            this.sourceConditions = defaultSource();
            this.siteConditions = defaultSite();
            this.businessConditions = defaultBusiness();
            this.acceptanceConditions = [];
            this.uploadedReports = [];
            this.selectedRecommendedPath = defaultSelectedPath();
        },
    },
});
