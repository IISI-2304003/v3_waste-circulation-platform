import { defineStore } from 'pinia';

// 說明：封裝「default Source」商業邏輯，供目前流程重複使用。
const defaultSource = () => ({
    industry: '',
    industryLabel: '',
    process: '',
    outputAmount: null,
    frequency: '',
});

// 說明：封裝「default Site」商業邏輯，供目前流程重複使用。
const defaultSite = () => ({
    region: [],
    hasReuseSpace: null,
    hasSecondaryWaste: null,
});

// 說明：封裝「default Business」商業邏輯，供目前流程重複使用。
const defaultBusiness = () => ({
    businessName: '',
    businessAddress: '',
    clearanceFrequency: '',
    clearanceAmount: null,
    technologyMaturity: 5,
    recycledProductDemand: '',
});

// 說明：封裝「default Selected Path」商業邏輯，供目前流程重複使用。
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
        technologySelections: [],
        demandSelections: [],
        recommendedPaths: [],
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
        setTechnologySelections(selections) {
            this.technologySelections = Array.isArray(selections) ? selections : [];
        },
        setDemandSelections(selections) {
            this.demandSelections = Array.isArray(selections) ? selections : [];
        },
        setRecommendedPaths(paths) {
            this.recommendedPaths = Array.isArray(paths) ? paths : [];
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
            this.technologySelections = [];
            this.demandSelections = [];
            this.recommendedPaths = [];
            this.selectedRecommendedPath = defaultSelectedPath();
        },
    },
});
