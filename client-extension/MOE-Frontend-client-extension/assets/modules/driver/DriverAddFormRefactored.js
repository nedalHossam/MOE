import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "@clayui/core";
import ClayButton from "@clayui/button";
import ClayIcon from "@clayui/icon";
import "@clayui/css/lib/css/atlas.css";
import "./driver-add-form/style.css";

import moment from "moment";
import { useTranslation } from "../../utils/translations";
import { useFormValidation } from "./hooks/useFormValidation";
import { useFileUpload } from "./hooks/useFileUpload";
import { useApiData } from "./hooks/useApiData";

// Import section components
import BasicInfoSection from "./components/sections/BasicInfoSection";
import ContactInfoSection from "./components/sections/ContactInfoSection";
import LicenseInfoSection from "./components/sections/LicenseInfoSection";
import OperationalInfoSection from "./components/sections/OperationalInfoSection";
import AttachmentSection from "./components/sections/AttachmentSection";

const locales = [
    { label: "en-US", symbol: "en-us" },
    { label: "ar-SA", symbol: "ar-sa" },
];

const DriverAddFormRefactored = () => {
    const { t, currentLanguage, direction } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    // Use custom hooks
    const { errors, formTouched, validateField, validateAllSections, setFieldTouched, clearErrors, clearFormTouched, setErrors } =
        useFormValidation();

    const { isUploading, handleFileUpload } = useFileUpload();
    const { picklistData, currentUser, optionsLoading } = useApiData();

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
    });

    // Initialize form data with all localized fields
    const initialFormData = {
        // Section A: Basic Information
        status: "Active",
        driverStatus_i18n: locales.reduce((acc, locale) => {
            acc[locale.symbol] = "Active";
            return acc;
        }, {}),
        statusChangeReason: "",
        statusChangeReason_i18n: locales.reduce((acc, locale) => {
            acc[locale.symbol] = "";
            return acc;
        }, {}),
        fullName: "",
        fullName_i18n: locales.reduce((acc, locale) => {
            acc[locale.symbol] = "";
            return acc;
        }, {}),
        dateOfBirth: "",
        nationality: "",
        nationality_i18n: locales.reduce((acc, locale) => {
            acc[locale.symbol] = "";
            return acc;
        }, {}),
        residencyOrIDNumber: "",
        employerType: "",
        employerType_i18n: locales.reduce((acc, locale) => {
            acc[locale.symbol] = "";
            return acc;
        }, {}),
        employeeMOEID: "",
        primaryVehicleId: "",

        // Section B: Contact Information
        phoneNumber: "",
        email: "",
        address: "",
        address_i18n: locales.reduce((acc, locale) => {
            acc[locale.symbol] = "";
            return acc;
        }, {}),
        emergencyContactName: "",
        emergencyContactName_i18n: locales.reduce((acc, locale) => {
            acc[locale.symbol] = "";
            return acc;
        }, {}),
        emergencyContactPhone: "",
        emergencyContactEmail: "",
        emergencyContactAddress: "",
        emergencyContactAddress_i18n: locales.reduce((acc, locale) => {
            acc[locale.symbol] = "";
            return acc;
        }, {}),

        // Section C: License Information
        licenseNumber: "",
        licenseClass: "",
        licenseClass_i18n: locales.reduce((acc, locale) => {
            acc[locale.symbol] = "";
            return acc;
        }, {}),
        licenseExpiry: "",
        licenseStatus: "",
        licenseStatus_i18n: locales.reduce((acc, locale) => {
            acc[locale.symbol] = "";
            return acc;
        }, {}),

        // Section D: Operational Info
        leaves: "",
        preferredAdministrations: [],
        preferredMoePassengers: [],
        notes: "",
        notes_i18n: locales.reduce((acc, locale) => {
            acc[locale.symbol] = "";
            return acc;
        }, {}),

        // Attachment
        attachmentFile: null,
        attachmentDescription: "",
        attachmentDescription_i18n: locales.reduce((acc, locale) => {
            acc[locale.symbol] = "";
            return acc;
        }, {}),

        // Additional fields for API payload
        r_preferredAdministration_userId: "",
        r_preferredMOEPassenger_userId: "",
        r_primaryVehicleVehicleID_c_primaryVehicleId: "",
        r_updateCircleID_userId: "",
    };

    const [formData, setFormData] = useState(initialFormData);

    const sections = useMemo(
        () => [
            { title: "Basic Information", id: "basic-info" },
            { title: "Contact Information", id: "contact-info" },
            { title: "License Information", id: "license-info" },
            { title: "Operational Info", id: "operational-info" },
            { title: "Attachment", id: "attachment" },
        ],
        []
    );

    // Check if current user has Manager Transport officer role
    const hasManagerTransportOfficerRole = useMemo(() => {
        if (!currentUser || !currentUser.roleBriefs) return false;
        return currentUser.roleBriefs.some((role) => role.name === "Manager Transport officer" || role.key === "Manager Transport officer");
    }, [currentUser]);

    const computeLicenseStatus = (expiry) => {
        if (!expiry) return "Valid";
        const today = moment().startOf("day");
        const exp = moment(expiry, "YYYY-MM-DD");
        if (exp.isBefore(today)) return "expired";
        if (exp.diff(today, "days") <= 30) return "About to expire";
        return "Valid";
    };

    const setField = (field, value) => {
        setFieldTouched(field);
        setFormData((prev) => {
            const updated = { ...prev, [field]: value };
            if (field === "licenseExpiry") {
                updated.licenseStatus = computeLicenseStatus(value);
                updated.licenseStatus_i18n = {
                    ...updated.licenseStatus_i18n,
                    [localizedInputLocales.licenseStatus]: computeLicenseStatus(value),
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
        setLocalizedInputLocales((prev) => ({
            ...prev,
            [fieldName]: newLocale.symbol,
        }));
    };

    // Helper function to get locale object by symbol
    const getLocaleObject = (symbol) => {
        return locales.find((loc) => loc.symbol === symbol) || locales[0];
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            if (!validateAllSections(formData)) {
                toast.error("Please fix all validation errors before submitting.");
                setIsLoading(false);
                return;
            }

            // Helper function to transform i18n keys from 'en-us' to 'en_US' format
            const transformI18nKeys = (i18nObject) => {
                if (!i18nObject || typeof i18nObject !== "object") return {};

                const transformed = {};
                Object.keys(i18nObject).forEach((key) => {
                    const value = i18nObject[key];
                    if (value && value.trim && value.trim().length > 0) {
                        const newKey = key.replace(/-/g, "_").replace(/([a-z]{2})_([a-z]{2})/i, (match, p1, p2) => {
                            return `${p1}_${p2.toUpperCase()}`;
                        });
                        transformed[newKey] = value;
                    }
                });
                return transformed;
            };

            // Transform form data for API submission
            const apiData = {};

            if (formData.dateOfBirth) apiData.dateOfBirth = formData.dateOfBirth;
            if (formData.email) apiData.email = formData.email;
            if (formData.phoneNumber) apiData.phoneNumber = formData.phoneNumber;
            if (formData.licenseNumber) apiData.licenseNumber = formData.licenseNumber;
            if (formData.licenseExpiry) apiData.licenseExpiry = formData.licenseExpiry;
            if (formData.residencyOrIDNumber) apiData.residencyOrIDNumber = formData.residencyOrIDNumber;

            if (formData.emergencyContactPhone) apiData.emergencyContactPhone = formData.emergencyContactPhone;
            if (formData.emergencyContactEmail) apiData.emergencyContactEmail = formData.emergencyContactEmail;
            if (formData.employeeMOEID) apiData.employeeMOEID = formData.employeeMOEID;

            // i18n fields
            const fullName_i18n = transformI18nKeys(formData.fullName_i18n);
            if (Object.keys(fullName_i18n).length > 0) apiData.fullName_i18n = fullName_i18n;

            const driverStatus_i18n = transformI18nKeys(formData.driverStatus_i18n);
            if (Object.keys(driverStatus_i18n).length > 0) apiData.driverStatus_i18n = driverStatus_i18n;

            const employerType_i18n = transformI18nKeys(formData.employerType_i18n);
            if (Object.keys(employerType_i18n).length > 0) apiData.employerType_i18n = employerType_i18n;

            const nationality_i18n = transformI18nKeys(formData.nationality_i18n);
            if (Object.keys(nationality_i18n).length > 0) apiData.nationality_i18n = nationality_i18n;

            const licenseClass_i18n = transformI18nKeys(formData.licenseClass_i18n);
            if (Object.keys(licenseClass_i18n).length > 0) apiData.licenseClass_i18n = licenseClass_i18n;

            const licenseStatus_i18n = transformI18nKeys(formData.licenseStatus_i18n);
            if (Object.keys(licenseStatus_i18n).length > 0) apiData.licenseStatus_i18n = licenseStatus_i18n;

            // Optional i18n fields
            const address_i18n = transformI18nKeys(formData.address_i18n);
            if (Object.keys(address_i18n).length > 0) apiData.address_i18n = address_i18n;

            const emergencyContactName_i18n = transformI18nKeys(formData.emergencyContactName_i18n);
            if (Object.keys(emergencyContactName_i18n).length > 0) apiData.emergencyContactName_i18n = emergencyContactName_i18n;

            const emergencyContactAddress_i18n = transformI18nKeys(formData.emergencyContactAddress_i18n);
            if (Object.keys(emergencyContactAddress_i18n).length > 0) apiData.emergencyContactAddress_i18n = emergencyContactAddress_i18n;

            const notes_i18n = transformI18nKeys(formData.notes_i18n);
            if (Object.keys(notes_i18n).length > 0) apiData.notes_i18n = notes_i18n;

            const attachmentDescription_i18n = transformI18nKeys(formData.attachmentDescription_i18n);
            if (Object.keys(attachmentDescription_i18n).length > 0) apiData.attachmentDescription_i18n = attachmentDescription_i18n;

            const statusChangeReason_i18n = transformI18nKeys(formData.statusChangeReason_i18n);
            if (Object.keys(statusChangeReason_i18n).length > 0) apiData.statusChangeReason_i18n = statusChangeReason_i18n;

            // Relationship fields
            if (formData.preferredAdministrations && formData.preferredAdministrations.length > 0) {
                apiData.r_preferredAdministration_userId = formData.preferredAdministrations[0].value;
            }
            if (formData.preferredMoePassengers && formData.preferredMoePassengers.length > 0) {
                apiData.r_preferredMOEPassenger_userId = formData.preferredMoePassengers[0].value;
            }
            if (formData.primaryVehicleId) {
                apiData.r_primaryVehicleVehicleID_c_primaryVehicleId = formData.primaryVehicleId;
            }
            if (formData.circleId) {
                apiData.r_updateCircleID_userId = formData.circleId;
            }

            // File attachment
            if (formData.attachmentFile && formData.attachmentFile.id) {
                apiData.attachmentFile = formData.attachmentFile.id;
            }

            const response = await fetch(window.location.origin + "/o/c/drivers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": Liferay.authToken,
                },
                body: JSON.stringify(apiData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.type === "ObjectValidationRuleEngineException") {
                    const validationErrors = JSON.parse(errorData.detail);
                    validationErrors.forEach((error) => {
                        toast.error(`${error.objectFieldName}: ${error.errorMessage}`);
                    });
                }
                throw new Error("Failed to create Driver");
            }

            toast.success(t("driverCreatedSuccess"));
            setFormData(initialFormData);
            clearErrors();
            clearFormTouched();
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(t("failedToCreateDriver"));
        } finally {
            setIsLoading(false);
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

    return (
        <Provider spritemap={spritemap}>
            <div id="driver-add-form" className="driver-add-form">
                <div className="form-header">
                    <h1>
                        <ClayIcon symbol="user-plus" style={{ color: "#007bff" }} />
                        Add New Driver
                    </h1>
                    <p>Complete the form below to register a new driver in the system</p>
                </div>

                <div className="back-button-container">
                    <ClayButton displayType="secondary" onClick={() => window.history.back()} disabled={isLoading}>
                        <ClayIcon
                            symbol="angle-left"
                            style={{
                                transform: direction === "rtl" ? "rotate(180deg)" : "none",
                                transition: "transform 0.2s ease",
                            }}
                        />
                        {t("back")}
                    </ClayButton>
                </div>

                {/* Current User Information */}
                {currentUser && (
                    <div
                        className="current-user-info"
                        style={{
                            marginBottom: "20px",
                            padding: "15px",
                            backgroundColor: "#f8f9fa",
                            border: "1px solid #dee2e6",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}>
                        <ClayIcon symbol="user" style={{ fontSize: "24px", color: "#6c757d" }} />
                        <div>
                            <div style={{ fontWeight: "bold", fontSize: "16px", color: "#495057" }}>{currentUser.fullName}</div>
                            <div style={{ fontSize: "14px", color: "#6c757d" }}>{currentUser.emailAddress}</div>
                            <div style={{ fontSize: "12px", color: "#868e96" }}>User ID: {currentUser.id}</div>
                        </div>
                    </div>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                    <div className="form-sections-container">
                        <BasicInfoSection
                            formData={formData}
                            errors={errors}
                            setField={setField}
                            validateField={validateField}
                            formTouched={formTouched}
                            setFormTouched={setFieldTouched}
                            picklistData={picklistData}
                            optionsLoading={optionsLoading}
                            isLoading={isLoading}
                            locales={locales}
                            localizedInputLocales={localizedInputLocales}
                            handleLocalizedInputLocaleChange={handleLocalizedInputLocaleChange}
                            handleLocalizedInputChange={handleLocalizedInputChange}
                            getLocaleObject={getLocaleObject}
                        />

                        <ContactInfoSection
                            formData={formData}
                            errors={errors}
                            setField={setField}
                            validateField={validateField}
                            formTouched={formTouched}
                            setFormTouched={setFieldTouched}
                            isLoading={isLoading}
                            locales={locales}
                            localizedInputLocales={localizedInputLocales}
                            handleLocalizedInputLocaleChange={handleLocalizedInputLocaleChange}
                            handleLocalizedInputChange={handleLocalizedInputChange}
                            getLocaleObject={getLocaleObject}
                        />

                        <LicenseInfoSection
                            formData={formData}
                            errors={errors}
                            setField={setField}
                            picklistData={picklistData}
                            optionsLoading={optionsLoading}
                            isLoading={isLoading}
                        />

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
                        />

                        <AttachmentSection
                            formData={formData}
                            errors={errors}
                            setField={setField}
                            handleFileUpload={handleFileUpload}
                            validateField={validateField}
                            isLoading={isLoading}
                            locales={locales}
                            localizedInputLocales={localizedInputLocales}
                            handleLocalizedInputLocaleChange={handleLocalizedInputLocaleChange}
                            handleLocalizedInputChange={handleLocalizedInputChange}
                            getLocaleObject={getLocaleObject}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="form-submit-container">
                        <ClayButton displayType="primary" type="submit" disabled={isLoading || optionsLoading} className="submit-button">
                            {isLoading ? (
                                <>
                                    <ClayIcon symbol="spinner" className="spinning" />
                                    Submitting...
                                </>
                            ) : optionsLoading ? (
                                <>
                                    <ClayIcon symbol="spinner" className="spinning" />
                                    Loading options...
                                </>
                            ) : (
                                <>
                                    Submit Driver Information
                                    <ClayIcon symbol="check" />
                                </>
                            )}
                        </ClayButton>
                    </div>
                </form>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            </div>
        </Provider>
    );
};

export default DriverAddFormRefactored;
