import React, { useState, useRef, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "@clayui/core";
import "@clayui/css/lib/css/atlas.css";
import "./style.css";

import moment from "moment";
import { useTranslation } from "../../../utils/translations";
import { SuccessPopup } from "../../../components/ui";
import vectorImage from "../../../static/images/Vector.svg";

// Import utilities
import { api, fetchPicklistOptions, getPicklistOptions, fetchAllUsers, fetchDriverDataList, fetchCurrentUser, fetchUserRoles, getVehicleById } from "./hooks/api";

import {
    validateField,
    validateIdentity,
    validateLicenseInsurance,
    validateOwnership,
    validateOperationalInfo,
    validateAttachment,
    validateAllSections,
    computeLicenseStatus,
    computeInsuranceStatus,
} from "./hooks/validation";

import { locales } from "./constants";
import { buildApiPayload } from "./hooks/formSubmission";
import { createInitialFormData } from "./hooks/initialData";
import { useFileUpload } from "../../../hooks/useFileUpload";

// Import components
import MultiStepNav from "./components/MultiStepNav";
import IdentityStep from "./components/IdentityStep";
import LicenseAndInsuranceStep from "./components/LicenseAndInsuranceStep";
import OwnershipStep from "./components/OwnershipStep";
import OperationalInfoStep from "./components/OperationalInfoStep";
import AttachmentsStep from "./components/AttachmentsStep";

// Helper function to get locale object by symbol
const getLocaleObject = (symbol) => {
    return locales.find((loc) => loc.symbol === symbol) || locales[0];
};

/**
 * Maps API vehicle data to form data structure
 * @param {Object} vehicleData - The vehicle data from API
 * @returns {Object} Form data object
 */
const mapVehicleDataToFormData = (vehicleData, defaultDepartment) => {
    const formData = {};

    // Helper to extract key from object or i18n structure
    const getKey = (fieldName) => {
        if (vehicleData[fieldName]?.key) {
            return vehicleData[fieldName].key;
        }
        if (vehicleData[`${fieldName}_i18n`]) {
            const i18n = vehicleData[`${fieldName}_i18n`];
            const firstLocale = Object.keys(i18n)[0];
            return i18n[firstLocale]?.key || i18n[firstLocale];
        }
        return vehicleData[fieldName] || "";
    };

    // Helper to get i18n object
    const getI18n = (fieldName) => {
        return vehicleData[`${fieldName}_i18n`] || {};
    };

    // Helper to format date from ISO string to YYYY-MM-DD format
    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            // If it's already in YYYY-MM-DD format, return as is
            if (typeof dateString === "string" && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return dateString;
            }
            // Parse ISO string and extract date part
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "";
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return "";
        }
    };

    // Section A: Identity
    formData.vehicleStatus = getKey("vehicleStatus");
    formData.vehicleStatus_i18n = getI18n("vehicleStatus");
    formData.plateNumber = vehicleData.plateNumber || "";
    formData.vin = vehicleData.vin || "";
    formData.carBrand = getKey("carBrand");
    formData.carBrand_i18n = getI18n("carBrand");
    formData.carModel = vehicleData.carModel?.key || "";
    formData.carModel_i18n = vehicleData.carModel_i18n || {};
    // Convert carYear to string (API returns number, form expects string)
    formData.carYear = vehicleData.carYear != null ? String(vehicleData.carYear) : "";
    formData.color = getKey("carColor");
    formData.color_i18n = getI18n("carColor");
    formData.carCategory = getKey("carCategory");
    formData.carCategory_i18n = getI18n("carCategory");
    formData.carClassification = vehicleData.carClassification?.key || "";
    formData.carClassification_i18n = vehicleData.carClassification_i18n || {};

    // Section B: License and insurance
    // Convert numeric fields to strings (API returns numbers, form expects strings)
    formData.licensedCapacitySeats = vehicleData.licensedCapacitySeats != null ? String(vehicleData.licensedCapacitySeats) : "";
    formData.licensedCapacityKg = vehicleData.licensedCapacityKg != null ? String(vehicleData.licensedCapacityKg) : "";
    formData.licenseStatus = vehicleData.licenseStatus?.key || "";
    formData.licenseStatus_i18n = getI18n("licenseStatus");
    formData.insuranceStatus = vehicleData.insuranceStatus?.key || "";
    formData.insuranceStatus_i18n = getI18n("insuranceStatus");
    // Registration number might be in i18n format
    if (vehicleData.registrationNumber_i18n) {
        const firstLocale = Object.keys(vehicleData.registrationNumber_i18n)[0];
        formData.registrationNumber = vehicleData.registrationNumber_i18n[firstLocale] || vehicleData.registrationNumber || "";
    } else {
        formData.registrationNumber = vehicleData.registrationNumber || "";
    }
    // Format dates to YYYY-MM-DD (remove time portion)
    formData.registrationExpiryDate = formatDate(vehicleData.registrationExpiryDate);
    formData.insurancePolicyType = getKey("insurancePolicyType");
    formData.insurancePolicyType_i18n = getI18n("insurancePolicyType");
    formData.insurancePolicyNumber = vehicleData.insurancePolicyNumber || "";
    formData.insuranceCompany = getKey("insuranceCompany");
    formData.insuranceCompany_i18n = getI18n("insuranceCompany");
    formData.insuranceExpiryDate = formatDate(vehicleData.insuranceExpiryDate);

    // Section C: Ownership
    formData.ownershipType = vehicleData.ownershipType?.key || "";
    formData.ownershipType_i18n = getI18n("ownershipType");
    formData.moeContractNumber = vehicleData.moeContractNumber || "";
    // Convert numeric fields to strings (API returns numbers, form expects strings)
    formData.carValueMOE = vehicleData.carValueMoe != null ? String(vehicleData.carValueMoe) : "";
    formData.vendorContractNumber = vehicleData.vendorContractNumber || "";
    formData.vendorsContactPerson = vehicleData.vendorsContactPerson || "";
    formData.vendorsContactDetails = vehicleData.vendorsContactDetails || "";
    formData.vendorYearlyValue = vehicleData.vendorYearlyValue != null ? String(vehicleData.vendorYearlyValue) : "";
    formData.contractIncludesGas = vehicleData.contractIncludesGas ? "Yes" : "No";
    formData.contractIncludesGas_i18n = vehicleData.contractIncludesGas_i18n || {};

    // Section D: Operational info
    formData.fuelType = getKey("fuelType");
    formData.fuelType_i18n = getI18n("fuelType");
    formData.telemetryID = vehicleData.telemetryID || "";
    formData.fuelCardDeviceNumber = vehicleData.fuelCardDeviceNumber || "";
    formData.carLocationHome = getKey("carLocationHome");
    formData.carLocationHome_i18n = getI18n("carLocationHome");
    formData.currentLocation = getKey("currentLocation");
    formData.currentLocation_i18n = getI18n("currentLocation");
    // Convert numeric fields to strings (API returns numbers, form expects strings)
    formData.startingKM = vehicleData.startingKM != null ? String(vehicleData.startingKM) : "";
    formData.currentKM = vehicleData.currentKM != null ? String(vehicleData.currentKM) : "";
    formData.monthlyKMLimit = vehicleData.monthlyKMLimit != null ? String(vehicleData.monthlyKMLimit) : "";
    formData.monthlyGasLimit = vehicleData.monthlyGasLimit != null ? String(vehicleData.monthlyGasLimit) : "";
    
    // Drivers - convert ID to array format matching form structure
    if (vehicleData.r_drivers_c_driverId) {
        formData.r_drivers_c_driverId = [{ value: vehicleData.r_drivers_c_driverId }];
    } else {
        formData.r_drivers_c_driverId = [];
    }
    
    // Keep as number to match select option values (administrations have numeric value: user.id)
    formData.preferredAdministration = vehicleData.r_preferredAdministration_userId != null ? vehicleData.r_preferredAdministration_userId : "";
    formData.preferredMOEEmployee = vehicleData.r_preferredMoeEmployee_userId != null ? vehicleData.r_preferredMoeEmployee_userId : "";
    
    // Department: use vehicle value if present, otherwise fallback to provided defaultDepartment
    const mappedDepartment = getKey("department") || defaultDepartment || "";
    formData.department = mappedDepartment;
    formData.department_i18n = getI18n("department");
    if (!formData.department_i18n || Object.keys(formData.department_i18n).length === 0) {
        if (mappedDepartment) {
            formData.department_i18n = {
                en_US: mappedDepartment,
                ar_SA: mappedDepartment,
            };
        }
    }

    // Attachments
    formData.attachments = vehicleData.attachments || null;
    formData.attachmentDescription = vehicleData.attachmentDescription || "";
    formData.attachmentDescription_i18n = getI18n("attachmentDescription");

    return formData;
};

const VehicleAddForm = () => {
    const { t, currentLanguage, direction } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [formTouched, setFormTouched] = useState({});
    const [optionsLoading, setOptionsLoading] = useState(true);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    // State to track selected locale for each LocalizedInput component
    const [localizedInputLocales, setLocalizedInputLocales] = useState({
        vehicleStatus: currentLanguage,
        licenseStatus: currentLanguage,
        insuranceStatus: currentLanguage,
        ownershipType: currentLanguage,
        contractIncludesGas: currentLanguage,
        carBrand: currentLanguage,
        carModel: currentLanguage,
        color: currentLanguage,
        carCategory: currentLanguage,
        carClassification: currentLanguage,
        fuelType: currentLanguage,
        carLocationHome: currentLanguage,
        currentLocation: currentLanguage,
        insurancePolicyType: currentLanguage,
        insuranceCompany: currentLanguage,
        department: currentLanguage,
        attachmentDescription: currentLanguage,
    });

    const [picklistData, setPicklistData] = useState({
        status: [],
        carClassification: [],
        colors: [],
        insurancePolicyType: [],
        insuranceStatus: [],
        licenseStatus: [],
        makerModels: [],
        fuelTypes: [],
        insuranceCompanies: [],
        locations: [],
        vehicleCategories: [],
        vehicleMakers: [],
        ownershipType: [],
        drivers: [],
        driverData: [],
        administrations: [],
        employees: [],
        departments: [],
    });

    // Initialize form data with all fields
    const initialFormData = createInitialFormData(t);

    const [formData, setFormData] = useState(initialFormData);
    const [fileList, setFileList] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [vehicleId, setVehicleId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const { isUploading: isFileUploading, handleFileUpload: uploadFile } = useFileUpload(t);

    // Check if current user has Director role
    const isDirector = useMemo(() => {
        if (!currentUser || !currentUser.roleBriefs) return false;
        return currentUser.roleBriefs.some((role) => role.name === "TO Director" || role.key === "TO Director");
    }, [currentUser]);

    // Fetch picklist data and current user on component mount
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setOptionsLoading(true);

                // Get editVehicleId from URL query parameters
                const urlParams = new URLSearchParams(window.location.search);
                const editVehicleId = urlParams.get("editVehicleId");

                // First fetch current user to get department for filtering
                const currentUserData = await fetchCurrentUser();

                const [
                    status,
                    carClassification,
                    colors,
                    insurancePolicyType,
                    insuranceStatus,
                    licenseStatus,
                    fuelTypes,
                    insuranceCompanies,
                    locations,
                    vehicleCategories,
                    vehicleMakers,
                    makerModels,
                    ownershipType,
                    allUsers,
                    driverData,
                    roles,
                    departments,
                ] = await Promise.all([
                    getPicklistOptions("Status"),
                    getPicklistOptions("Car Classification"),
                    getPicklistOptions("Colors"),
                    getPicklistOptions("Insurance Policy Type"),
                    getPicklistOptions("Insurance Status"),
                    getPicklistOptions("License Status"),
                    getPicklistOptions("MOE Fuel Types"),
                    getPicklistOptions("MOE Insurance Companies"),
                    getPicklistOptions("MOE Locations"),
                    getPicklistOptions("MOE Vehicle Categories"),
                    getPicklistOptions("MOE Vehicle Makers"),
                    getPicklistOptions("Maker – Models"),
                    getPicklistOptions("Ownership Type"),
                    fetchAllUsers(),
                    fetchDriverDataList(currentUserData?.department), // Pass department filter
                    fetchUserRoles(Liferay.ThemeDisplay.getUserId()),
                    getPicklistOptions("Departments"),
                ]);

                // Filter departments based on current user permissions (optional)
                let filteredDepartments = departments;
                if (currentUserData && currentUserData.roleBriefs) {
                    // Check if user has admin role - if so, show all departments
                    const hasAdminRole = currentUserData.roleBriefs.some((role) => role.name === "Administrator" || role.key === "Administrator");

                    // If not admin, you can add logic here to filter departments
                    // For example, only show departments the user has access to
                    if (!hasAdminRole) {
                        // Example: Filter departments based on user's department or role
                        // filteredDepartments = departments.filter(dept =>
                        //   currentUserData.department === dept.value ||
                        //   currentUserData.allowedDepartments?.includes(dept.value)
                        // );
                    }
                }

                setPicklistData({
                    status,
                    carClassification,
                    colors,
                    insurancePolicyType,
                    insuranceStatus,
                    licenseStatus,
                    fuelTypes,
                    insuranceCompanies,
                    locations,
                    vehicleCategories,
                    vehicleMakers,
                    makerModels,
                    ownershipType,
                    drivers: driverData,
                    driverData: driverData,
                    administrations: allUsers,
                    employees: allUsers,
                    departments: filteredDepartments,
                });

                // Set user roles and current user
                setUserRoles(roles);
                setCurrentUser(currentUserData);

                // Pre-populate department from current user if available
                // For non-directors, always set to their current department
                // For directors, pre-populate but allow editing
                if (currentUserData && currentUserData.department) {
                    setFormData((prev) => ({
                        ...prev,
                        department: currentUserData.department,
                        department_i18n: {
                            ...prev.department_i18n,
                            [localizedInputLocales.department]: currentUserData.department,
                        },
                    }));
                }

                // Set default Ownership Type to the first option, if not already set
                if (!formData.ownershipType && Array.isArray(ownershipType) && ownershipType.length > 0) {
                    const firstOwnership = ownershipType[0];
                    setFormData((prev) => ({
                        ...prev,
                        ownershipType: firstOwnership.value,
                        ownershipType_i18n: {
                            ...prev.ownershipType_i18n,
                            [localizedInputLocales.ownershipType]: firstOwnership.value,
                        },
                    }));
                }

                // Set default vehicleStatus to 'Active' if not already set
                if (!formData.vehicleStatus && Array.isArray(status) && status.length > 0) {
                    const activeStatus = status.find(s => s.key === "Active" || s.value === "Active");
                    if (activeStatus) {
                        const i18nData = {};
                        if (activeStatus.name_i18n) {
                            // Extract both English and Arabic translations
                            if (activeStatus.name_i18n['en_US'] || activeStatus.name_i18n['en-US']) {
                                i18nData['en_US'] = activeStatus.name_i18n['en_US'] || activeStatus.name_i18n['en-US'];
                            }
                            if (activeStatus.name_i18n['ar_SA'] || activeStatus.name_i18n['ar-SA']) {
                                i18nData['ar_SA'] = activeStatus.name_i18n['ar_SA'] || activeStatus.name_i18n['ar-SA'];
                            }
                        }
                        
                        setFormData((prev) => ({
                            ...prev,
                            vehicleStatus: activeStatus.key || activeStatus.value,
                            vehicleStatus_i18n: i18nData,
                        }));
                    }
                }

                // After picklists are loaded, fetch and populate vehicle data if editing
                if (editVehicleId) {
                    setIsEditMode(true);
                    setVehicleId(editVehicleId);
                    
                    const vehicleData = await getVehicleById(editVehicleId);
                    if (vehicleData) {
                        // Map vehicle data to form data structure
                        const mappedFormData = mapVehicleDataToFormData(vehicleData, currentUserData?.department);
                        
                        // Update form data with mapped vehicle data
                        setFormData((prev) => ({
                            ...prev,
                            ...mappedFormData,
                        }));
                        
                        console.log("Vehicle data loaded and populated:", vehicleData);
                    } else {
                        toast.error(t("vehicleIdNotFound") || "This vehicle ID was not found");
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error(t("failedToLoadData"));
            } finally {
                setOptionsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const setField = (field, value) => {
        setFormTouched((prev) => ({ ...prev, [field]: true }));
        setFormData((prev) => {
            // Convert moment object to string for date fields
            let processedValue = value;
            if (field === "registrationExpiryDate" || field === "insuranceExpiryDate") {
                if (value && typeof value === "object" && value.format) {
                    // Moment object
                    processedValue = value.format("YYYY-MM-DD");
                } else if (typeof value === "string") {
                    // String value (already formatted from datepicker)
                    processedValue = value;
                } else if (value instanceof Date) {
                    // Native Date object
                    processedValue = moment(value).format("YYYY-MM-DD");
                } else {
                    // Handle null, undefined, or empty values
                    processedValue = "";
                }
            }

            const updated = { ...prev, [field]: processedValue };

            // Compute license status when registration expiry changes
            if (field === "registrationExpiryDate") {
                const computedStatus = computeLicenseStatus(processedValue, t);
                updated.licenseStatus = computedStatus;
                // Update i18n fields for the computed status
                const statusOption = picklistData.licenseStatus.find(opt => opt.value === computedStatus);
                if (statusOption && statusOption.name_i18n) {
                    const i18nData = {};
                    if (statusOption.name_i18n['en_US'] || statusOption.name_i18n['en-US']) {
                        i18nData['en_US'] = statusOption.name_i18n['en_US'] || statusOption.name_i18n['en-US'];
                    }
                    if (statusOption.name_i18n['ar_SA'] || statusOption.name_i18n['ar-SA']) {
                        i18nData['ar_SA'] = statusOption.name_i18n['ar_SA'] || statusOption.name_i18n['ar-SA'];
                    }
                    updated.licenseStatus_i18n = i18nData;
                }
            }

            // Compute insurance status when insurance expiry changes
            if (field === "insuranceExpiryDate") {
                const computedStatus = computeInsuranceStatus(processedValue, t);
                updated.insuranceStatus = computedStatus;
                // Update i18n fields for the computed status
                const statusOption = picklistData.insuranceStatus.find(opt => opt.value === computedStatus);
                if (statusOption && statusOption.name_i18n) {
                    const i18nData = {};
                    if (statusOption.name_i18n['en_US'] || statusOption.name_i18n['en-US']) {
                        i18nData['en_US'] = statusOption.name_i18n['en_US'] || statusOption.name_i18n['en-US'];
                    }
                    if (statusOption.name_i18n['ar_SA'] || statusOption.name_i18n['ar-SA']) {
                        i18nData['ar_SA'] = statusOption.name_i18n['ar_SA'] || statusOption.name_i18n['ar-SA'];
                    }
                    updated.insuranceStatus_i18n = i18nData;
                }
            }

            // Update ownershipType_i18n when ownershipType changes
            if (field === "ownershipType") {
                updated.ownershipType_i18n = {
                    ...updated.ownershipType_i18n,
                    [localizedInputLocales.ownershipType]: value,
                };
            }

            // Update contractIncludesGas_i18n when contractIncludesGas changes
            if (field === "contractIncludesGas") {
                updated.contractIncludesGas_i18n = {
                    ...updated.contractIncludesGas_i18n,
                    [localizedInputLocales.contractIncludesGas]: value,
                };
            }

            // Update status_i18n when status changes
            if (field === "vehicleStatus") {
                updated.vehicleStatus_i18n = {
                    ...updated.vehicleStatus_i18n,
                    [localizedInputLocales.vehicleStatus]: value,
                };
            }

            // Update attachmentDescription_i18n when attachmentDescription changes
            if (field === "attachmentDescription") {
                updated.attachmentDescription_i18n = {
                    ...updated.attachmentDescription_i18n,
                    [localizedInputLocales.attachmentDescription]: value,
                };
            }

            return updated;
        });

        // Validate the field immediately
        const error = validateField(field, value, formData, picklistData, isDirector, t);
        setErrors((prev) => ({
            ...prev,
            [field]: error,
        }));
    };

    // Handlers for localized inputs
    const handleLocalizedInputChange = (name, translations) => {
        const fieldNameBase = name.replace("_i18n", "");
        const currentLocale = localizedInputLocales[fieldNameBase] || currentLanguage;
        const currentValue = translations[currentLocale] || "";

        setFormData((prev) => ({
            ...prev,
            [name]: translations,
            [fieldNameBase]: currentValue,
        }));
        setFormTouched((prev) => ({ ...prev, [fieldNameBase]: true }));

        // Clear any existing validation errors for this field when user types
        if (errors[fieldNameBase]) {
            setErrors((prev) => ({
                ...prev,
                [fieldNameBase]: "",
            }));
        }
    };

    const handleLocalizedInputLocaleChange = (fieldName, newLocale) => {
        // Update the specific LocalizedInput's locale
        setLocalizedInputLocales((prev) => ({
            ...prev,
            [fieldName]: newLocale.symbol,
        }));

        // Update the simple field value with the new locale's value
        const i18nFieldName = `${fieldName}_i18n`;
        const currentTranslations = formData[i18nFieldName] || {};
        const newValue = currentTranslations[newLocale.symbol] || "";

        // For registration number and other required fields, preserve the current value
        // if the new locale doesn't have a value, to avoid validation errors
        const currentValue = formData[fieldName] || "";
        const finalValue = newValue || currentValue;

        setFormData((prev) => ({
            ...prev,
            [fieldName]: finalValue,
        }));

        // Clear validation errors when switching languages if there's a value
        if (finalValue && errors[fieldName]) {
            setErrors((prev) => ({
                ...prev,
                [fieldName]: "",
            }));
        }
    };

    // Helper function to get locale object by symbol
    const getLocaleObject = (symbol) => {
        return locales.find((loc) => loc.symbol === symbol) || locales[0];
    };

    // Handler for localized select changes
    const handleLocalizedSelectChange = (fieldName, translations, selectedOption) => {
        // Store the key value and i18n translations
        const value = selectedOption ? selectedOption.value : "";
        setFormData((prev) => ({
            ...prev,
            [`${fieldName}_i18n`]: translations,
            [fieldName]: value,
        }));
        setFormTouched((prev) => ({ ...prev, [fieldName]: true }));

        // Validate the field
        const error = validateField(fieldName, value, formData, picklistData, isDirector, t);
        setErrors((prev) => ({
            ...prev,
            [fieldName]: error,
        }));
    };

    const handleFileUpload = async (file, type) => {
        const normalizedType = type === "attachments" ? "attachment" : type;
        const result = await uploadFile(file, normalizedType);
        if (result) {
            setFormData((prev) => ({
                ...prev,
                attachments: {
                    id: result.id,
                    name: result.name,
                    url: result.url,
                },
            }));
        }
        return result;
    };

    // Step navigation functions
    const next = () => {
        // Validate current step before proceeding
        let currentStepErrors = {};

        switch (currentStep) {
            case 0: // Identity
                currentStepErrors = validateIdentity(formData, t);
                break;
            case 1: // License and Insurance
                currentStepErrors = validateLicenseInsurance(formData, t);
                break;
            case 2: // Ownership
                currentStepErrors = validateOwnership(formData, picklistData, t);
                break;
            case 3: // Operational Info
                currentStepErrors = validateOperationalInfo(formData, t);
                break;
            case 4: // Attachment
                currentStepErrors = validateAttachment();
                break;
        }

        if (Object.keys(currentStepErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...currentStepErrors }));
            toast.error(t("pleaseFixValidationErrors"));
            return;
        }

        setCurrentStep(currentStep + 1);
    };

    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    // Function to check if current step is valid
    const isCurrentStepValid = () => {
        let currentStepErrors = {};

        switch (currentStep) {
            case 0: // Identity
                currentStepErrors = validateIdentity(formData, t);
                break;
            case 1: // License and Insurance
                currentStepErrors = validateLicenseInsurance(formData, t);
                break;
            case 2: // Ownership
                currentStepErrors = validateOwnership(formData, picklistData, t);
                break;
            case 3: // Operational Info
                currentStepErrors = validateOperationalInfo(formData, t, isDirector);
                break;
            case 4: // Attachment
                currentStepErrors = validateAttachment();
                break;
        }

        return Object.keys(currentStepErrors).length === 0;
    };

    // Function to check if a specific step has errors
    const hasStepErrors = (stepIndex) => {
        let stepErrors = {};

        switch (stepIndex) {
            case 0: // Identity
                stepErrors = validateIdentity(formData, t);
                break;
            case 1: // License and Insurance
                stepErrors = validateLicenseInsurance(formData, t);
                break;
            case 2: // Ownership
                stepErrors = validateOwnership(formData, picklistData, t);
                break;
            case 3: // Operational Info
                stepErrors = validateOperationalInfo(formData, t, isDirector);
                break;
            case 4: // Attachment
                stepErrors = validateAttachment();
                break;
        }

        return Object.keys(stepErrors).length > 0;
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            // Validate all sections
            if (!validateAllSections(formData, picklistData, t, isDirector)) {
                toast.error(t("pleaseFixAllValidationErrors"));
                setIsLoading(false);
                return;
            }

            // Build API payload using utility function
            const apiData = buildApiPayload(formData, false);
            console.log("Full API Payload:", JSON.stringify(apiData, null, 2));
            console.log("Car Brand Key being sent:", apiData.carBrand);
            console.log("Available Vehicle Makers in picklist:", picklistData.vehicleMakers);

            // Use PUT for update, POST for create
            const method = isEditMode ? "PUT" : "POST";
            const url = isEditMode ? `o/c/vehicles/${vehicleId}` : "o/c/vehicles";

            const response = await api(url, {
                method: method,
                body: JSON.stringify(apiData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log("error Data", errorData);
                
                // Handle ObjectValidationRuleEngineException
                if (errorData.type === "ObjectValidationRuleEngineException") {
                    const validationErrors = JSON.parse(errorData.detail);
                    validationErrors.forEach((error) => {
                        toast.error(`${error.objectFieldName}: ${error.errorMessage}`);
                    });
                }

                
                throw new Error(errorData.title);
            }

            toast.success(isEditMode ? t("vehicleUpdatedSuccess") : t("vehicleCreatedSuccess"));
            if (!isEditMode) {
                setFormData(initialFormData);
                setErrors({});
                setFormTouched({});
            }
            setShowSuccessPopup(true);
        } catch (error) {
            console.error("Submission error:", error.message);
            toast.error(t("submissionFailed"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveDraft = async () => {
        setIsLoading(true);

        try {
            // Build API payload (same as submit) but force status to Draft
            const apiData = buildApiPayload(formData, true);

            const response = await api("o/c/vehicles", {
                method: "POST",
                body: JSON.stringify(apiData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                
                // Handle ObjectValidationRuleEngineException
                if (errorData.type === "ObjectValidationRuleEngineException") {
                    const validationErrors = JSON.parse(errorData.detail);
                    validationErrors.forEach((error) => {
                        toast.error(`${error.objectFieldName}: ${error.errorMessage}`);
                    });
                }
                
                throw new Error(errorData.title);
            }

            toast.success(t("savedAsDraft"));
            setShowSuccessPopup(false);
            setIsLoading(false);
            // Do not reset the form so the user can continue editing if they want
        } catch (error) {
            console.error("Save draft error:", error.message);
            toast.error(t("saveDraftFailed"));
        } finally {
            setIsLoading(false);
        }
    };

    const spritemap = `${Liferay.ThemeDisplay.getPathThemeImages()}/clay/icons.svg`;

    // Define steps using component imports
    const steps = [
        {
            title: t("identity"),
            content: (
                <IdentityStep
                    formData={formData}
                    errors={errors}
                    picklistData={picklistData}
                    optionsLoading={optionsLoading}
                    isLoading={isLoading}
                    setField={setField}
                    t={t}
                    spritemap={spritemap}
                    setFormData={setFormData}
                    isEditMode={isEditMode}
                />
            ),
        },
        {
            title: t("licenseAndInsurance"),
            content: (
                <LicenseAndInsuranceStep
                    formData={formData}
                    errors={errors}
                    picklistData={picklistData}
                    optionsLoading={optionsLoading}
                    isLoading={isLoading}
                    setField={setField}
                    t={t}
                    spritemap={spritemap}
                    setFormData={setFormData}
                />
            ),
        },
        {
            title: t("ownership"),
            content: (
                <OwnershipStep
                    formData={formData}
                    errors={errors}
                    picklistData={picklistData}
                    setField={setField}
                    t={t}
                    spritemap={spritemap}
                    localizedInputLocales={localizedInputLocales}
                    setFormData={setFormData}
                />
            ),
        },
        {
            title: t("operationalInfo"),
            content: (
                <OperationalInfoStep
                    formData={formData}
                    errors={errors}
                    picklistData={picklistData}
                    optionsLoading={optionsLoading}
                    isLoading={isLoading}
                    setField={setField}
                    t={t}
                    spritemap={spritemap}
                    isDirector={isDirector}
                    setFormData={setFormData}
                />
            ),
        },
        {
            title: t("attachments"),
            content: (
                <AttachmentsStep
                    formData={formData}
                    setField={setField}
                    handleLocalizedInputLocaleChange={handleLocalizedInputLocaleChange}
                    handleLocalizedInputChange={handleLocalizedInputChange}
                    handleFileUpload={handleFileUpload}
                    setFileList={setFileList}
                    t={t}
                    toast={toast}
                    localizedInputLocales={localizedInputLocales}
                />
            ),
        },
    ];
    return (
        <Provider spritemap={`${Liferay.ThemeDisplay.getPathThemeImages()}/clay/icons.svg`}>
            <div id="form-wrapper" className="form-wrapper" dir={direction}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-container">
                        <div className="form-header">
                            <h1>{isEditMode ? t("updateVehicle") : t("addNewVehicle")}</h1>
                        </div>
                        <MultiStepNav steps={steps} currentStep={currentStep} onStepChange={(step) => setCurrentStep(step)} spritemap={spritemap} />
                        <div className="form-wrapper-steps-content mt-5">{steps[currentStep].content}</div>
                    </div>
                    {currentStep == 0 && (
                        <div className="form-wrapper-steps-next-action">
                            <button
                                onClick={() => next()}
                                disabled={!isCurrentStepValid()}
                                className={`btn-style ${isCurrentStepValid() ? "btn-main-primary" : "btn-main-primary-disabled"}`}>
                                {t("next")}
                            </button>
                        </div>
                    )}
                    <div className="form-wrapper-steps-action">
                        {currentStep > 0 && (
                            <div>
                                <button
                                    onClick={() => prev()}
                                    className="btn-style btn-main-primary-outline"
                                    style={{ width: "120px", height: "40px", marginRight: "8px" }}>
                                    {t("previous")}
                                </button>
                            </div>
                        )}
                        <div>
                            {currentStep < steps.length - 1 && currentStep !== 0 && (
                                <button
                                    onClick={() => next()}
                                    disabled={!isCurrentStepValid()}
                                    className={`btn-style ${isCurrentStepValid() ? "btn-main-primary" : "btn-main-primary-disabled"}`}>
                                    {t("next")}
                                </button>
                            )}
                            {currentStep === steps.length - 1 && (
                                <>
                                    {!isEditMode && (
                                        <button onClick={handleSaveDraft} disabled={isLoading} className="btn-style btn-main-primary-outline">
                                            {t("saveAsDraft") || "Save as Draft"}
                                        </button>
                                    )}
                                    <button onClick={handleSubmit} disabled={isLoading} className="btn-style btn-main-primary">
                                        {isLoading ? t("submitting") : t("submit")}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </form>
                <SuccessPopup
                    isVisible={showSuccessPopup}
                    onClose={() => setShowSuccessPopup(false)}
                    image={vectorImage}
                    message={t("vehicleCreatedSuccess")}
                />
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            </div>
        </Provider>
    );
};

class CustomElement extends HTMLElement {
    connectedCallback() {
        ReactDOM.render(
            <React.StrictMode>
                <VehicleAddForm />
            </React.StrictMode>,
            this
        );
    }

    disconnectedCallback() {
        ReactDOM.unmountComponentAtNode(this);
    }
}

const ELEMENT_NAME = "vehicle-add-form-reactjs";
if (!customElements.get(ELEMENT_NAME)) {
    customElements.define(ELEMENT_NAME, CustomElement);
}
