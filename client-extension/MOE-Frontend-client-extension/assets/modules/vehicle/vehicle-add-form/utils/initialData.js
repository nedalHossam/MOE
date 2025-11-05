/**
 * Creates the initial form data structure
 * @param {Function} t - Translation function
 * @returns {Object} The initial form data object
 */
export const createInitialFormData = (t) => {
    return {
        // Section A: Identity
        vehicleStatus: "Active", // Default Active on create
        vehicleStatus_i18n: {
            'en_US': 'Active',
            'ar_SA': 'نشط'
        },
        plateNumber: "",
        vin: "",
        carBrand: "",
        carBrand_i18n: {},
        carModel: "",
        carModel_i18n: {},
        carYear: "",
        color: "",
        color_i18n: {},
        carCategory: "",
        carCategory_i18n: {},
        carClassification: "",
        carClassification_i18n: {},

        // Section B: License and insurance
        licensedCapacitySeats: "",
        licensedCapacityKg: "",
        licenseStatus: "Valid", // Default: Valid, can be manually edited
        licenseStatus_i18n: {},
        insuranceStatus: "Valid", // Default: Valid, can be manually edited
        insuranceStatus_i18n: {},
        registrationNumber: "",
        registrationExpiryDate: "",
        insurancePolicyType: "",
        insurancePolicyType_i18n: {},
        insurancePolicyNumber: "",
        insuranceCompany: "",
        insuranceCompany_i18n: {},
        insuranceExpiryDate: "",

        // Section C: Ownership
        ownershipType: "", // Radio: MOE, External vendor
        ownershipType_i18n: {},
        moeContractNumber: "", // Conditional: Required when Ownership type is MOE
        carValueMOE: "", // Conditional: Required when Ownership type is MOE
        vendorContractNumber: "", // Conditional: Required when Ownership type is External vendor
        vendorsContactPerson: "", // Conditional: Required when Ownership type is External vendor
        vendorsContactDetails: "", // Conditional: Required when Ownership type is External vendor
        vendorYearlyValue: "", // Conditional: Required when Ownership type is External vendor
        contractIncludesGas: "", // Conditional: Required when Ownership type is External vendor
        contractIncludesGas_i18n: {},

        // Section D: Operational info
        fuelType: "",
        fuelType_i18n: {},
        telemetryID: "",
        fuelCardDeviceNumber: "",
        carLocationHome: "",
        carLocationHome_i18n: {},
        currentLocation: "", // Location picklist selection
        currentLocation_i18n: {},
        startingKM: "",
        currentKM: "", // Read-only, retrieved from last drop off KM
        monthlyKMLimit: "",
        monthlyGasLimit: "",
        r_drivers_c_driverId: [], // Multiple drivers
        preferredAdministration: "",
        preferredMOEEmployee: "",
        department: "",
        department_i18n: {},
        // attachments
        attachments: null,
        attachmentDescription: "",
        attachmentDescription_i18n: {},
    };
};

