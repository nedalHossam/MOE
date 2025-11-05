import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "@clayui/core";
import "@clayui/css/lib/css/atlas.css";
import "./driver-add-form/style.css";
import MultiStepNav from "./components/MultiStepNav"
import SuccessPopup from "../../components/ui/SuccessPopup"
import moment from "moment";
import { useTranslation } from "../../utils/translations";
import { useFormValidation } from "./hooks/useFormValidation";
import { useFileUpload } from "./hooks/useFileUpload";
import { useApiData } from "./hooks/useApiData";
import { buildApiPayload } from "./hooks/formSubmission";
import api from "../../utils/apiConfig";
import { fetchAllUsers } from "../../utils/userServices"
// Import section components
import BasicInfoSection from "./components/sections/BasicInfoSection";
import ContactInfoSection from "./components/sections/ContactInfoSection";
import LicenseInfoSection from "./components/sections/LicenseInfoSection";
import OperationalInfoSection from "./components/sections/OperationalInfoSection";
import vectorImage from "../../static/images/Vector.svg";
import { createDriverInitialFormData } from "./hooks/initialData";
import { locales } from "./constants"

const DriverAddFormRefactored = () => {
    const { t, currentLanguage, direction } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    // const [fileList, setFileList] = useState([]);
    const [currentStep, setCurrentStep] = React.useState(0);
    // Use custom hooks
    const { errors,
        formTouched,
        validateField,
        validateBasicInfo,
        validateContactInfo,
        validateLicenseInfo,
        validateOperationalInfo,
        validateAllSections,
        setFieldTouched,
        clearErrors,
        clearFormTouched,
        setErrors } =
        useFormValidation();

    const { isUploading, handleFileUpload } = useFileUpload();
    // const [allUsers, setAllUsers] = useState([]);


    const { picklistData, currentUser, optionsLoading } = useApiData();
    console.log(currentUser);
    // State to track selected locale for each LocalizedInput component
    const [localizedInputLocales, setLocalizedInputLocales] = useState({
        fullName: currentLanguage,
        address: currentLanguage,
        emergencyContactName: currentLanguage,
        emergencyContactAddress: currentLanguage,
        notes: currentLanguage,
        attachmentDescription: currentLanguage,
        driverStatus: currentLanguage,
        employerType: currentLanguage,
        licenseClass: currentLanguage,
        licenseStatus: currentLanguage,
        nationality: currentLanguage,
        statusChangeReason: currentLanguage,
        department: currentLanguage,
    });



    // Initialize form data with all localized fields
    // Initialize form data with all fields
    const initialFormData = createDriverInitialFormData(t);

    const [formData, setFormData] = useState(initialFormData);

    // Check if current user has Manager Transport officer role
    const hasManagerTransportOfficerRole = useMemo(() => {
        if (!currentUser || !currentUser.roleBriefs) return false;
        return currentUser.roleBriefs.some((role) => role.name === "Manager Transport officer" || role.key === "Manager Transport officer");
    }, [currentUser]);




    const [coordinators, setCoordinators] = useState([]);
    const [administrators, setAdministrators] = useState([]);

    useEffect(() => {
        const loadUsers = async () => {
            const { coordinators, administrators } = await fetchAllUsers();
            setCoordinators(coordinators);
            setAdministrators(administrators);
        };
        loadUsers();
    }, []);

    //---------------


    useEffect(() => {
        if (currentUser && !hasManagerTransportOfficerRole) {
            setFormData((prev) => ({
                ...prev,
                department: currentUser.department,
            }));
        }
    }, [currentUser, hasManagerTransportOfficerRole]);

    const computeLicenseStatus = (expiry) => {
        const licenseStatusOptions = picklistData?.LicenseStatus || [];
        console.log(licenseStatusOptions)
        const today = moment().startOf("day");
        const exp = expiry ? moment(expiry, "YYYY-MM-DD") : null;
        let statusKey = "Valid"; // default
        if (!expiry) {
            statusKey = "Valid";
        } else if (exp.isBefore(today)) {
            statusKey = "Expired";
        } else if (exp.diff(today, "days") <= 30) {
            statusKey = "AboutToExpire";
        } else {
            statusKey = "Valid";
        }
        // Ensure it exists in picklist
        const match = licenseStatusOptions.find(opt => opt.key === statusKey);
        return match ? match.key : statusKey;
    };





    const setField = (field, value) => {
        setFieldTouched(field);//clear the fields decides when to show the validation message.
        setFormData((prev) => {
            const updated = { ...prev, [field]: value };
            if (field === "licenseExpiry") {
                updated.licenseStatus = computeLicenseStatus(value);
                updated.licenseStatus_i18n = {
                    ...updated.licenseStatus_i18n,
                    [localizedInputLocales.licenseStatus]: computeLicenseStatus(value),
                };
            }

            if (field === "department") {
                updated.department = {
                    ...updated.department,
                    [localizedInputLocales.department]: value,
                };
            }
            if (field === "licenseClass") {
                updated.primaryVehicleId = "";
                updated.licenseClass_i18n = {
                    ...updated.licenseClass_i18n,
                    [localizedInputLocales.licenseClass]: value,
                };
            }
            if (field === "employerType") {
                updated.employerType_i18n = {
                    ...updated.employerType_i18n,
                    [localizedInputLocales.employerType]: value,
                };
            }
            if (field === "nationality") {
                updated.nationality_i18n = {
                    ...updated.nationality_i18n,
                    [localizedInputLocales.nationality]: value,
                };
            }
            if (field === "status") {
                updated.driverStatus_i18n = {
                    ...updated.driverStatus_i18n,
                    [localizedInputLocales.driverStatus]: value,
                };
            }
            return updated;
        });

        validateField(field, value, { ...formData, [field]: value, localizedInputLocales });
    };

    // Handlers for localized inputs


    const handleLocalizedInputChange = (name, translations) => {
        setFormData((prev) => ({
            ...prev,
            [name]: translations,
        }));
        setFieldTouched(name);

        const fieldNameBase = name.replace("_i18n", "");
        if (
            [
                "statusChangeReason",
                "fullName",
                "address",
                "emergencyContactName",
                "emergencyContactAddress",
                "notes",
                "attachmentDescription",
            ].includes(fieldNameBase)
        ) {
            setTimeout(() => validateField(fieldNameBase, translations, { ...formData, [name]: translations, localizedInputLocales }), 0);
        }
    };
    const handleLocalizedInputLocaleChange = (fieldName, newLocale) => {
        console.log("Received translations:", translations);
        setLocalizedInputLocales((prev) => ({
            ...prev,
            [fieldName]: newLocale.symbol,
        }));
    };
    // Helper to find option by value and return its i18n data
    const getOptionWithI18n = (options, value) => {
        return options.find(opt => opt.value === value);
    };
    // Helper function to get locale object by symbol

    // Handler for select with i18n
    const handleSelectChangeWithI18n = (fieldName, value) => {
        let selectedOption = null;

        // Find the selected option in the picklist
        if (fieldName === "DriverStatus") {
            selectedOption = getOptionWithI18n(picklistData.DriverStatus, value);
        } else if (fieldName === "LicenseClass") {
            selectedOption = getOptionWithI18n(picklistData.LicenseClass, value);
        } else if (fieldName === "LicenseStatus") {
            selectedOption = getOptionWithI18n(picklistData.LicenseStatus, value);
        } else if (fieldName === "Nationality") {
            selectedOption = getOptionWithI18n(picklistData.Nationality, value);
        } else if (fieldName === "EmployeeType") {
            selectedOption = getOptionWithI18n(picklistData.EmployeeType, value);
        } else if (fieldName === "Department") {
            selectedOption = getOptionWithI18n(picklistData.Department, value);
        }

        // Set the key value
        setField(fieldName, value);

        // If we found the option with i18n data, update the _i18n field
        if (selectedOption && selectedOption.name_i18n) {
            const i18nData = {};
            // Extract both English and Arabic translations
            if (selectedOption.name_i18n['en_US'] || selectedOption.name_i18n['en-US']) {
                i18nData['en_US'] = selectedOption.name_i18n['en_US'] || selectedOption.name_i18n['en-US'];
            }
            if (selectedOption.name_i18n['ar_SA'] || selectedOption.name_i18n['ar-SA']) {
                i18nData['ar_SA'] = selectedOption.name_i18n['ar_SA'] || selectedOption.name_i18n['ar-SA'];
            }

            // Update the _i18n field with both languages
            setFormData((prev) => ({
                ...prev,
                [`${fieldName}_i18n`]: i18nData,
            }));
        }
    };

    const getLocaleObject = (symbol) => {
        return locales.find((loc) => loc.symbol === symbol) || locales[0];
    };
    // Step navigation functions
    const next = async () => {
        // Validate current step before proceeding
        let currentStepErrors = {};

        switch (currentStep) {
            case 0: // Identity
                currentStepErrors = await validateBasicInfo(formData, t);
                break;
            case 1: // License and Insurance
                currentStepErrors = await validateContactInfo(formData, t);
                break;
            case 2: // Ownership
                currentStepErrors = await validateLicenseInfo(formData, t);
                break;
            case 3: // Operational Info
                currentStepErrors = await validateOperationalInfo(formData, t);
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


    const [isStepValid, setIsStepValid] = useState(false);

    const isCurrentStepValid = useCallback(async () => {
        let validationFn;

        switch (currentStep) {
            case 0:
                validationFn = validateBasicInfo;
                break;
            case 1:
                validationFn = validateContactInfo;
                break;
            case 2:
                validationFn = validateLicenseInfo;
                break;
            case 3:
                validationFn = validateOperationalInfo;
                break;
            default:
                validationFn = null;
        }

        if (!validationFn) return false;

        const currentStepErrors = await validationFn(formData, t);
        console.log("🔍 Validation result for step", currentStep, currentStepErrors);

        const noErrors = Object.keys(currentStepErrors).length === 0;
        console.log("✅ noErrors:", noErrors);

        setIsStepValid(noErrors);
        return noErrors;
    }, [currentStep, formData, t]);

    useEffect(() => {
        isCurrentStepValid();
    }, [formData, currentStep, isCurrentStepValid]);

    // Function to check if a specific step has errors
    const hasStepErrors = (stepIndex) => {
        let stepErrors = {};

        switch (stepIndex) {
            case 0: // Identity
                currentStepErrors = validateBasicInfo(t);
                break;
            case 1: // License and Insurance
                currentStepErrors = validateContactInfo(t);
                break;
            case 2: // Ownership
                currentStepErrors = validateLicenseInfo(t);
                break;
            case 3: // Operational Info
                currentStepErrors = validateOperationalInfo(t);
                break;
        }

        return Object.keys(stepErrors).length > 0;
    };
    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            // Validate all sections
            if (!validateAllSections(t)) {
                toast.error(t("pleaseFixAllValidationErrors"));
                setIsLoading(false);
                return;
            }
            // Transform form data for API submission
            const apiData = buildApiPayload(formData)

            console.log("Full API Payload:", JSON.stringify(apiData, null, 2))

            const response = await api.post("c/drivers", apiData);
            // if (!response){
            //     const errorData = await response
            //     console.log("error Data", errorData);
            // }
            toast.success(t("driverCreatedSuccess"));
            setFormData(initialFormData);
            setShowSuccessPopup(true);
            clearErrors();
            clearFormTouched();
        }
        //  catch (error) {
        //     if (error.response?.data?.type === "ObjectValidationRuleEngineException") {
        //         const validationErrors = JSON.parse(error.response.data.detail);
        //         validationErrors.forEach((err) => {
        //             toast.error(`${err.objectFieldName}: ${err.errorMessage}`);
        //         });
        //     } else {
        //         console.error("Submission error:", error);
        //         toast.error(t("failedToCreateDriver"));
        //     }
        // } finally {
        //     setIsLoading(false);
        // }
        catch (error) {
    // Check if it’s a validation error from Liferay
    if (error.response?.data?.type === "ObjectValidationRuleEngineException") {
        try {
            const validationErrors = JSON.parse(error.response.data.detail);
            validationErrors.forEach((err) => {
                toast.error(`${err.objectFieldName}: ${err.errorMessage}`);
            });
        } catch (parseError) {
            // fallback if JSON parsing fails
            toast.error(error.response.data.detail || t("failedToCreateDriver"));
        }
    } else if (error.response?.data?.message) {
        // Show the error message returned by the API
        toast.error(error.response.data.message);
    } else {
        // Fallback for unknown errors
        console.error("Submission error:", error);
        toast.error(t("failedToCreateDriver"));
    }
}

    };

    // Add cleanup effect
    useEffect(() => {
        return () => {
            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach((input) => {
                if (input.files.length > 0) {
                    input.value = "";
                }
            });
        };
    }, []);

    const spritemap = `${Liferay.ThemeDisplay.getCDNBaseURL()}${Liferay.ThemeDisplay.getPathThemeImages()}/clay/icons.svg`;
    const steps = [
        {
            title: t("basicinformation"),
            content: (
                <BasicInfoSection
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setField={setField}
                    validateField={validateField}
                    formTouched={formTouched}
                    setFormTouched={setFieldTouched}
                    picklistData={picklistData}
                    optionsLoading={optionsLoading}
                    isLoading={isLoading}
                    spritemap={spritemap}
                    locales={locales}
                    t={t}
                    localizedInputLocales={localizedInputLocales}
                    handleLocalizedInputLocaleChange={handleLocalizedInputLocaleChange}
                    handleLocalizedInputChange={handleLocalizedInputChange}
                    getLocaleObject={getLocaleObject}
                    hasManagerTransportOfficerRole={hasManagerTransportOfficerRole} // ✅ add this
                />

            ),
        },
        {
            title: t("contactinformation"),
            content: (
                <ContactInfoSection
                    formData={formData}
                    errors={errors}
                    setField={setField}
                    validateField={validateField}
                    formTouched={formTouched}
                    setFormTouched={setFieldTouched}
                    isLoading={isLoading}
                    locales={locales}
                    t={t}
                    spritemap={spritemap}
                    localizedInputLocales={localizedInputLocales}
                    handleLocalizedInputLocaleChange={handleLocalizedInputLocaleChange}
                    handleLocalizedInputChange={handleLocalizedInputChange}
                    getLocaleObject={getLocaleObject}
                />
            ),
        },
        {
            title: t("licenseinformation"),
            content: (
                <LicenseInfoSection
                    formData={formData}
                    errors={errors}
                    setField={setField}
                    validateField={validateField}
                    formTouched={formTouched}
                    setFormTouched={setFieldTouched}
                    locales={locales}
                    t={t}
                    optionsLoading={optionsLoading}
                    spritemap={spritemap}
                    picklistData={picklistData}
                    isLoading={isLoading}
                    localizedInputLocales={localizedInputLocales}
                    handleLocalizedInputLocaleChange={handleLocalizedInputLocaleChange}
                    handleLocalizedInputChange={handleLocalizedInputChange}
                    getLocaleObject={getLocaleObject}
                />
            ),
        },
        {
            title: t("operationalInfo"),
            content: (
                <OperationalInfoSection
                    formData={formData}
                    errors={errors}
                    setField={setField}
                    picklistData={picklistData}
                    optionsLoading={optionsLoading}
                    isLoading={isLoading}
                    locales={locales}
                    localizedInputLocales={localizedInputLocales}
                    handleLocalizedInputLocaleChange={handleLocalizedInputLocaleChange}
                    handleLocalizedInputChange={handleLocalizedInputChange}
                    getLocaleObject={getLocaleObject}
                    validateField={validateField}
                    formTouched={formTouched}
                    handleFileUpload={handleFileUpload}
                    setFormTouched={setFieldTouched}
                    t={t}
                    spritemap={spritemap}
                    coordinators={coordinators}
                    administrators={administrators}
                // PreferredAdministrationOrPreferredMOEPassenger={PreferredAdministrationOrPreferredMOEPassenger}
                />
            ),
        },

    ];
    return (
        <Provider spritemap={spritemap}>
            {/* id="form-wrapper" */}
            <div id="form-wrapper" className="form-wrapper" dir={direction}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-container">
                        <div className="form-header">
                            <h1>{t("addNewDriver")}</h1>
                        </div>
                        <MultiStepNav steps={steps} currentStep={currentStep} onStepChange={(step) => setCurrentStep(step)} spritemap={spritemap} />
                        <div className="form-wrapper-steps-content mt-5">{steps[currentStep].content}</div>
                    </div>
                    {currentStep == 0 && (
                        <div className="form-wrapper-steps-next-action">
                            <button
                                onClick={() => next()}
                                disabled={!isStepValid}
                                className={`btn-style ${isStepValid ? "btn-main-primary" : "btn-main-primary-disabled"}`}>
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
                                    disabled={!isStepValid}
                                    className={`btn-style ${isStepValid ? "btn-main-primary" : "btn-main-primary-disabled"}`}>
                                    {t("next")}
                                </button>
                            )}
                            {currentStep === steps.length - 1 && (
                                <>
                                    {/* <button onClick={handleSaveDraft} disabled={isLoading} className="btn-style btn-main-primary-outline">
                                        {"Save as Draft"}
                                    </button> */}
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
                    message={t("driverCreatedSuccess")}
                />
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            </div>

        </Provider>
    );
};

export default DriverAddFormRefactored;
