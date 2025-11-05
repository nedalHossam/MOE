import { useState, useCallback } from "react";
import moment from "moment";
import * as Yup from "yup";

export const useFormValidation = () => {
    const [errors, setErrors] = useState({});
    const [formTouched, setFormTouched] = useState({});

    const validateField = (field, value, context = {}) => {
        // Build Yup schema for the single field
        const schemas = {
            fullName: Yup.string()
                .required("This field is required.")
                .min(2, "Enter a valid name.")
                .max(100, "Enter a valid name."),

            dateOfBirth: Yup.string()
                .required("This field is required.")
                .test("valid-dob", "Date must be in the past and >=18 years", (val) => {
                    if (!val) return false;
                    const dob = moment(val, "YYYY-MM-DD", true);
                    const today = moment();
                    const age = today.diff(dob, "years");
                    return dob.isValid() && dob.isBefore(today) && age >= 18;
                }),
            nationality: Yup.string().required("This field is required."),
            department: Yup.string().required("This field is required."),
            residencyOrIDNumber: Yup.string().required("This field is required."),
            employerType: Yup.string().required("This field is required."),
            employeeMOEID: Yup.string().when("employerType", {
                is: "MOE",
                then: Yup.string().required("This field is required."),
                otherwise: Yup.string().nullable(),
            }),
            primaryVehicleId: Yup.string().when("employerType", {
                is: "Vehicle Owner",
                then: Yup.string().required("This field is required."),
                otherwise: Yup.string().nullable(),
            }),


            phoneNumber: Yup.string()
                .required("This field is required.")
                .matches(/^(\+968)?[79]\d{7}$/, "Please enter a valid Oman phone number."),
            email: Yup.string().required("This field is required.").email("Enter a valid email."),
            address: Yup.string().required("This field is required.").max(200, "Max 200 characters."),


            address_i18n: Yup.object()
                .test("at-least-one", "This field is required.", (value) =>
                    value && Object.values(value).some((v) => v?.trim())
                )
                .test("length-check", t("Address too long. Free text up to 200 chars"), (value, context) => {
                    const currentLocale =
                        formData.currentLocale || Object.keys(value || {})[0];
                    const currentValue = value?.[currentLocale] || "";
                    return currentValue.length <= 200;
                }),

            emergencyContactAddress_i18n: Yup.object()
                .test("at-least-one", "This field is required.", (value) =>
                    value && Object.values(value).some((v) => v?.trim())
                )
                .test("length-check", "Address too long. Free text up to 200 chars", (value, context) => {
                    const currentLocale =
                        formData.currentLocale || Object.keys(value || {})[0];
                    const currentValue = value?.[currentLocale] || "";
                    return currentValue.length <= 200;
                }),

            emergencyContactPhone: Yup.string()
                .required("This field is required.")
                .matches(
                    /^(\+968)?[79]\d{7}$/,
                    t("Please enter a valid Oman phone number (e.g., +96891234567 or 91234567).")
                ),

            emergencyContactEmail: Yup.string()
                .required("This field is required.")
                .email(t("Enter a valid email.")),

            // emergencyContactAddress_i18n: Yup.string()
            //     .required(t("This field is required."))
            //     .max(200, t("Address too long. Free text up to 200 chars")),
            licenseNumber: Yup.string().required("This field is required."),
            licenseClass: Yup.string().required("This field is required."),
            licenseExpiry: Yup.string()
                .required("This field is required.")
                .test("future-date", "License expiry must be in the future.", (val) => {
                    if (!val) return false;
                    return moment(val, "YYYY-MM-DD", true).isValid() && moment(val).isAfter(moment(), "day");
                }),
        };

        if (!schemas[field]) return true; // ignore unknown fields

        try {
            schemas[field].validateSync(value, { context });
            setErrors((prev) => ({ ...prev, [field]: undefined }));
            return true;
        } catch (err) {
            setErrors((prev) => ({ ...prev, [field]: err.message }));
            return false;
        }
    };


    const validateBasicInfo = async (formData, t) => {
        const errs = {};

        const schema = Yup.object().shape({
            fullName: Yup.string()
                .required("This field is required.")
                .min(2, "Enter a valid name.")
                .max(100, "Enter a valid name."),

            // fullName: Yup.object()
            //     .test("at-least-one", t("This field is required."), (value) =>
            //         value && Object.values(value).some(v => v?.trim())
            //     )
            //     .test("length-check", t("Enter a valid name."), (value, context) => {
            //         const currentLocale =
            //             formData.currentLocale || Object.keys(value || {})[0];
            //         const nameValue = value?.[currentLocale]?.trim() || "";
            //         return !nameValue || (nameValue.length >= 2 && nameValue.length <= 100);
            //     }),
            dateOfBirth: Yup.string()
                .required(t("This field is required."))
                .test(
                    "valid-dob",
                    t("The Date of Birth must be a past date and must be ≥18 years."),
                    (value) => {
                        if (!value) return false;
                        const dob = moment(value, "YYYY-MM-DD", true);
                        const today = moment();
                        const age = today.diff(dob, "years");
                        return dob.isValid() && dob.isBefore(today) && age >= 18;
                    }
                ),
            nationality: Yup.string().required(t("This field is required.")),
            department: Yup.string().required(t("This field is required.")),
            residencyOrIDNumber: Yup.string().required(t("This field is required.")),
            employerType: Yup.string().required(t("This field is required.")),
            employeeMOEID: Yup.string().when("employerType", {
                is: "MOE",
                then: (schema) => schema.required(t("This field is required.")),
            }),
            primaryVehicleId: Yup.string().when("employerType", {
                is: "Vehicle Owner",
                then: (schema) => schema.required(t("This field is required.")),
            }),
        });

        try {
            await schema.validate(formData, { abortEarly: false });
        } catch (err) {
            err.inner.forEach((e) => {
                errs[e.path] = e.message;
            });
        }

        return errs;
    };

    const validateContactInfo = async (formData, t) => {
        const errs = {};

        const schema = Yup.object().shape({
            phoneNumber: Yup.string()
                .required(t("This field is required."))
                .matches(
                    /^(\+968)?[79]\d{7}$/,
                    t("Please enter a valid Oman phone number (e.g., +96891234567 or 91234567).")
                ),

            email: Yup.string()
                .required(t("This field is required."))
                .email(t("Enter a valid email.")),


            address_i18n: Yup.object()
                .test("at-least-one", t("This field is required."), (value) =>
                    value && Object.values(value).some((v) => v?.trim())
                )
                .test("length-check", t("Address too long. Free text up to 200 chars"), (value, context) => {
                    const currentLocale =
                        formData.currentLocale || Object.keys(value || {})[0];
                    const currentValue = value?.[currentLocale] || "";
                    return currentValue.length <= 200;
                }),

            emergencyContactAddress_i18n: Yup.object()
                .test("at-least-one", t("This field is required."), (value) =>
                    value && Object.values(value).some((v) => v?.trim())
                )
                .test("length-check", t("Address too long. Free text up to 200 chars"), (value, context) => {
                    const currentLocale =
                        formData.currentLocale || Object.keys(value || {})[0];
                    const currentValue = value?.[currentLocale] || "";
                    return currentValue.length <= 200;
                }),


            emergencyContactPhone: Yup.string()
                .required(t("This field is required."))
                .matches(
                    /^(\+968)?[79]\d{7}$/,
                    t("Please enter a valid Oman phone number (e.g., +96891234567 or 91234567).")
                ),

            emergencyContactEmail: Yup.string()
                .required(t("This field is required."))
                .email(t("Enter a valid email.")),

            // emergencyContactAddress_i18n: Yup.string()
            //     .required(t("This field is required."))
            //     .max(200, t("Address too long. Free text up to 200 chars")),
        });

        try {
            await schema.validate(formData, { abortEarly: false });
        } catch (err) {
            err.inner.forEach((e) => {
                errs[e.path] = e.message;
            });
        }

        return errs;
    };

    const validateLicenseInfo = async (formData, t) => {
        const errs = {};

        const schema = Yup.object().shape({
            licenseNumber: Yup.string().required(t("This field is required.")),

            licenseClass: Yup.string().required(t("This field is required.")),

            licenseExpiry: Yup.string()
                .required(t("This field is required."))
                .test(
                    "future-date",
                    t("License expiry must be in the future."),
                    (value) => {
                        if (!value) return false;
                        return (
                            moment(value, "YYYY-MM-DD", true).isValid() &&
                            moment(value).isAfter(moment(), "day")
                        );
                    }
                ),
        });

        try {
            await schema.validate(formData, { abortEarly: false });
        } catch (err) {
            err.inner.forEach((e) => {
                errs[e.path] = e.message;
            });
        }

        return errs;
    };

    const validateOperationalInfo = async (formData, t) => {
        const errs = {};

        const schema = Yup.object().shape({
            attachmentDescription_i18n: Yup.object().test(
                "attachment-desc-check",
                t("Enter a description up to 200 chars."),
                function (value) {
                    const attachmentFile = this.parent?.attachmentFile;
                    if (!attachmentFile) return true; // ignore if no file
                    const hasAny =
                        value && Object.values(value).some((v) => v?.trim());
                    if (!hasAny) return false;

                    const currentLocale =
                        formData.currentLocale ||
                        Object.keys(value || {})[0];
                    const currentValue = value?.[currentLocale] || "";
                    return currentValue.length <= 200;
                }
            ),
        });

        try {
            await schema.validate(formData, { abortEarly: false });
        } catch (err) {
            err.inner.forEach((e) => {
                errs[e.path] = e.message;
            });
        }

        return errs;
    };
    const validateAllSections = (t) => {
        const allErrors = {
            ...validateBasicInfo(t),
            ...validateContactInfo(t),
            ...validateLicenseInfo(t),
            ...validateOperationalInfo(t),
        };
        return allErrors;
    };
    const setFieldTouched = useCallback((field) => {
        //make fields true if touched
        /**
             * So if the form had:
            { fullName: false, email: false }
            and the user types in fullName, it becomes:
            { fullName: true, email: false }
             */
        setFormTouched((prev) => ({ ...prev, [field]: true }));
    }, []);
    console.log("form touced", formTouched)
    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);
    // Resets the “touched” status of all fields:
    const clearFormTouched = useCallback(() => {
        setFormTouched({});
    }, []);

    return {
        errors,
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
        setErrors,
    };
};
