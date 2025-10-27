import { useState, useCallback } from "react";
import moment from "moment";

export const useFormValidation = () => {
    const [errors, setErrors] = useState({});
    const [formTouched, setFormTouched] = useState({});

    const validateField = useCallback((field, value, formData = {}) => {
        let fieldError = "";

        switch (field) {
            case "fullName":
                // For localized fields, validate that at least one locale has a value
                const fullNameTranslations = formData.fullName_i18n || {};
                const hasAnyValue = Object.values(fullNameTranslations).some((value) => value && value.trim().length > 0);

                if (!hasAnyValue) {
                    fieldError = "This field is required.";
                } else {
                    // Check the current locale's value for length validation
                    const currentFullName = fullNameTranslations[formData.localizedInputLocales?.fullName] || "";
                    if (currentFullName && (currentFullName.trim().length < 2 || currentFullName.trim().length > 100)) {
                        fieldError = "Enter a valid name.";
                    }
                }
                break;

            case "dateOfBirth":
                if (!value || value.trim().length === 0) {
                    fieldError = "This field is required.";
                } else {
                    const dob = moment(value, "YYYY-MM-DD", true);
                    const today = moment();
                    const age = today.diff(dob, "years");

                    if (!dob.isValid() || dob.isAfter(today)) {
                        fieldError = "The Date of Birth Must be a past date and must be >=18 years";
                    } else if (age < 18) {
                        fieldError = "The Date of Birth Must be a past date and must be >=18 years";
                    }
                }
                break;

            case "nationality":
                if (!value) {
                    fieldError = "This field is required.";
                }
                break;

            case "residencyOrIDNumber":
                if (!value || value.trim().length === 0) {
                    fieldError = "This field is required.";
                }
                break;

            case "employerType":
                if (!value) {
                    fieldError = "This field is required.";
                }
                break;

            case "employeeMOEID":
                if (formData.employerType === "MOE") {
                    if (!value || value.trim().length === 0) {
                        fieldError = "This field is required.";
                    }
                }
                break;

            case "primaryVehicleId":
                if (formData.employerType === "Vehicle Owner") {
                    if (!value || value.trim().length === 0) {
                        fieldError = "This field is required.";
                    }
                }
                break;

            case "phoneNumber":
                if (!value || value.trim().length === 0) {
                    fieldError = "This field is required.";
                } else if (!/^(\+968)?[79]\d{7}$/.test(value.replace(/\s/g, ""))) {
                    fieldError = "Please enter a valid Oman phone number (e.g., +96891234567 or 91234567).";
                }
                break;

            case "email":
                if (!value || value.trim().length === 0) {
                    fieldError = "This field is required.";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    fieldError = "Enter a valid email.";
                }
                break;

            case "licenseNumber":
                if (!value || value.trim().length === 0) {
                    fieldError = "This field is required.";
                }
                break;

            case "licenseClass":
                if (!value) {
                    fieldError = "This field is required.";
                }
                break;

            case "licenseExpiry":
                if (!value || value.trim().length === 0) {
                    fieldError = "This field is required.";
                } else if (!moment(value, "YYYY-MM-DD", true).isValid() || moment(value).isBefore(moment(), "day")) {
                    fieldError = "License expiry must be in the future.";
                }
                break;

            case "attachmentDescription":
                if (formData.attachmentFile) {
                    const attachmentDescTranslations = formData.attachmentDescription_i18n || {};
                    const hasAnyValue = Object.values(attachmentDescTranslations).some((value) => value && value.trim().length > 0);

                    if (!hasAnyValue) {
                        fieldError = "Enter a description up to 200 chars.";
                    } else {
                        const currentAttachmentDesc = attachmentDescTranslations[formData.localizedInputLocales?.attachmentDescription] || "";
                        if (currentAttachmentDesc && currentAttachmentDesc.length > 200) {
                            fieldError = "Enter a description up to 200 chars.";
                        }
                    }
                }
                break;

            default:
                break;
        }

        setErrors((prev) => ({
            ...prev,
            [field]: fieldError,
        }));

        return fieldError;
    }, []);

    const validateAllSections = useCallback((formData) => {
        const allErrors = {};

        // Basic Info validation
        if (!formData.fullName_i18n || Object.values(formData.fullName_i18n).every((v) => !v || v.trim() === "")) {
            allErrors.fullName = "This field is required.";
        }

        if (!formData.dateOfBirth) {
            allErrors.dateOfBirth = "This field is required.";
        }

        if (!formData.nationality) {
            allErrors.nationality = "This field is required.";
        }

        if (!formData.residencyOrIDNumber) {
            allErrors.residencyOrIDNumber = "This field is required.";
        }

        if (!formData.employerType) {
            allErrors.employerType = "This field is required.";
        }

        if (formData.employerType === "MOE" && !formData.employeeMOEID) {
            allErrors.employeeMOEID = "This field is required.";
        }

        if (formData.employerType === "Vehicle Owner" && !formData.primaryVehicleId) {
            allErrors.primaryVehicleId = "This field is required.";
        }

        // Contact Info validation
        if (!formData.phoneNumber) {
            allErrors.phoneNumber = "This field is required.";
        }

        if (!formData.email) {
            allErrors.email = "This field is required.";
        }

        // License validation
        if (!formData.licenseNumber) {
            allErrors.licenseNumber = "This field is required.";
        }

        if (!formData.licenseClass) {
            allErrors.licenseClass = "This field is required.";
        }

        if (!formData.licenseExpiry) {
            allErrors.licenseExpiry = "This field is required.";
        }

        setErrors(allErrors);
        return Object.keys(allErrors).length === 0;
    }, []);

    const setFieldTouched = useCallback((field) => {
        setFormTouched((prev) => ({ ...prev, [field]: true }));
    }, []);

    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    const clearFormTouched = useCallback(() => {
        setFormTouched({});
    }, []);

    return {
        errors,
        formTouched,
        validateField,
        validateAllSections,
        setFieldTouched,
        clearErrors,
        clearFormTouched,
        setErrors,
    };
};
