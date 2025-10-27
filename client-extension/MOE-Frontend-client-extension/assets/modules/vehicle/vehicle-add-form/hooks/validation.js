import moment from "moment";

export const computeLicenseStatus = (expiry, t) => {
    if (!expiry) return t("valid");
    const today = moment().startOf("day");
    const exp = moment(expiry, "YYYY-MM-DD");
    if (exp.isBefore(today)) return t("expired");
    if (exp.diff(today, "days") <= 30) return t("aboutToExpire");
    return t("valid");
};

export const computeInsuranceStatus = (expiry, t) => {
    if (!expiry) return t("valid");
    const today = moment().startOf("day");
    const exp = moment(expiry, "YYYY-MM-DD");
    if (exp.isBefore(today)) return t("expired");
    if (exp.diff(today, "days") <= 30) return t("aboutToExpire");
    return t("valid");
};

export const validateField = (field, value, formData, picklistData, isDirector, t) => {
    let fieldError = "";

    switch (field) {
        case "plateNumber":
            if (!value || value.trim().length === 0) {
                fieldError = t("plateNumberRequired");
            }
            break;
        case "vin":
            if (!value || value.trim().length === 0) {
                fieldError = t("vinRequired");
            } else if (value.length !== 17) {
                fieldError = t("vinLength");
            }
            break;
        case "carBrand":
            if (!value) {
                fieldError = t("carBrandRequired");
            }
            break;
        case "carModel":
            if (!value) {
                fieldError = t("carModelRequired");
            }
            break;
        case "carYear":
            const currentYear = new Date().getFullYear();
            if (!value || value.trim().length === 0) {
                fieldError = t("carYearRequired");
            } else if (parseInt(value) < 1990 || parseInt(value) > currentYear) {
                fieldError = t("carYearInvalid");
            }
            break;
        case "color":
            if (!value) {
                fieldError = t("colorRequired");
            }
            break;
        case "carCategory":
            if (!value) {
                fieldError = t("carCategoryRequired");
            }
            break;
        case "carClassification":
            if (!value) {
                fieldError = t("carClassificationRequired");
            }
            break;
        case "licensedCapacitySeats":
            if (!value || value.trim().length === 0) {
                fieldError = t("licensedCapacitySeatsRequired");
            } else if (parseInt(value) < 1 || parseInt(value) > 60) {
                fieldError = t("licensedCapacitySeatsRange");
            }
            break;
        case "licensedCapacityKg":
            if (!value || value.trim().length === 0) {
                fieldError = t("licensedCapacityKgRequired");
            } else if (parseInt(value) > 5000) {
                fieldError = t("licensedCapacityKgMax");
            }
            break;
        case "registrationNumber":
            if (!value || value.trim().length === 0) {
                fieldError = t("registrationNumberRequired");
            }
            break;
        case "registrationExpiryDate":
            if (!value || value.trim().length === 0) {
                fieldError = t("registrationExpiryDateRequired");
            } else if (!moment(value).isValid() || moment(value).isBefore(moment().startOf("day"))) {
                fieldError = t("registrationExpiryDateFuture");
            }
            break;
        case "insurancePolicyType":
            if (!value) {
                fieldError = t("insurancePolicyTypeRequired");
            }
            break;
        case "insurancePolicyNumber":
            if (!value || value.trim().length === 0) {
                fieldError = t("insurancePolicyNumberRequired");
            }
            break;
        case "insuranceCompany":
            if (!value) {
                fieldError = t("insuranceCompanyRequired");
            }
            break;
        case "insuranceExpiryDate":
            if (!value || value.trim().length === 0) {
                fieldError = t("insuranceExpiryDateRequired");
            } else {
                const momentValue = moment(value);
                const today = moment().startOf("day");

                if (!momentValue.isValid() || momentValue.isBefore(today)) {
                    fieldError = t("insuranceExpiryDateFuture");
                }
            }
            break;
        case "ownershipType":
            if (!value) {
                fieldError = t("ownershipTypeRequired");
            }
            break;
        case "moeContractNumber":
            const isMOE = formData.ownershipType && picklistData.ownershipType.find((opt) => opt.value === formData.ownershipType)?.name === "MOE";
            if (isMOE && (!value || value.trim().length === 0)) {
                fieldError = t("moeContractNumberRequired");
            }
            break;
        case "carValueMOE":
            const isMOEForValue =
                formData.ownershipType && picklistData.ownershipType.find((opt) => opt.value === formData.ownershipType)?.name === "MOE";
            if (isMOEForValue && (!value || value.trim().length === 0)) {
                fieldError = t("carValueMOERequired");
            } else if (isMOEForValue && parseFloat(value) <= 0) {
                fieldError = t("carValueMOERequired");
            }
            break;
        case "vendorContractNumber":
            const isExternalVendor =
                formData.ownershipType && picklistData.ownershipType.find((opt) => opt.value === formData.ownershipType)?.name === "External vendor";
            if (isExternalVendor && (!value || value.trim().length === 0)) {
                fieldError = t("vendorContractNumberRequired");
            }
            break;
        case "vendorsContactPerson":
            const isExternalVendorForPerson =
                formData.ownershipType && picklistData.ownershipType.find((opt) => opt.value === formData.ownershipType)?.name === "External vendor";
            if (isExternalVendorForPerson && (!value || value.trim().length === 0)) {
                fieldError = t("vendorsContactPersonRequired");
            }
            break;
        case "vendorsContactDetails":
            const isExternalVendorForDetails =
                formData.ownershipType && picklistData.ownershipType.find((opt) => opt.value === formData.ownershipType)?.name === "External vendor";
            if (isExternalVendorForDetails) {
                if (!value || value.trim().length === 0) {
                    fieldError = t("vendorsContactDetailsRequired");
                } else {
                    const isPhone = /^(\+968)?[79]\d{7}$/.test(value.replace(/\s/g, ""));
                    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                    if (!isPhone && !isEmail) {
                        fieldError = t("vendorsContactDetailsRequired");
                    }
                }
            }
            break;
        case "vendorYearlyValue":
            const isExternalVendorForValue =
                formData.ownershipType && picklistData.ownershipType.find((opt) => opt.value === formData.ownershipType)?.name === "External vendor";
            if (isExternalVendorForValue && (!value || value.trim().length === 0)) {
                fieldError = t("vendorYearlyValueRequired");
            } else if (isExternalVendorForValue && parseFloat(value) <= 0) {
                fieldError = t("vendorYearlyValueRequired");
            }
            break;
        case "contractIncludesGas":
            const isExternalVendorForGas =
                formData.ownershipType && picklistData.ownershipType.find((opt) => opt.value === formData.ownershipType)?.name === "External vendor";
            if (isExternalVendorForGas && !value) {
                fieldError = t("contractIncludesGasRequired");
            }
            break;
        case "fuelType":
            if (!value) {
                fieldError = t("fuelTypeRequired");
            }
            break;
        case "carLocationHome":
            if (!value) {
                fieldError = t("carLocationHomeRequired");
            }
            break;
        case "startingKM":
            if (!value || value.trim().length === 0) {
                fieldError = t("startingKMRequired");
            } else if (parseInt(value) < 0 || parseInt(value) > 1000000) {
                fieldError = t("startingKMInvalid");
            }
            break;
        case "monthlyKMLimit":
            if (value && parseFloat(value) <= 0) {
                fieldError = t("monthlyKMLimitInvalid");
            }
            break;
        case "monthlyGasLimit":
            if (value && parseFloat(value) <= 0) {
                fieldError = t("monthlyGasLimitInvalid");
            }
            break;
        case "department":
            if (isDirector && !value) {
                fieldError = t("departmentRequired");
            }
            break;
    }

    return fieldError;
};

export const validateIdentity = (formData, t) => {
    const errs = {};

    if (!formData.plateNumber || formData.plateNumber.trim().length === 0) {
        errs.plateNumber = "This field is required.";
    }

    if (!formData.vin || formData.vin.trim().length === 0) {
        errs.vin = "This field is required.";
    } else if (formData.vin.length !== 17) {
        errs.vin = "VIN must be 17 characters and unique.";
    }

    if (!formData.carBrand) {
        errs.carBrand = "Select a car brand.";
    }

    if (!formData.carModel) {
        errs.carModel = "Select a car model.";
    }

    const currentYear = new Date().getFullYear();
    if (!formData.carYear || formData.carYear.trim().length === 0) {
        errs.carYear = "This field is required.";
    } else if (parseInt(formData.carYear) < 1990 || parseInt(formData.carYear) > currentYear) {
        errs.carYear = "Enter a valid car year.";
    }

    if (!formData.color) {
        errs.color = "Enter a valid color.";
    }

    if (!formData.carCategory) {
        errs.carCategory = "Select a car category.";
    }

    if (!formData.carClassification) {
        errs.carClassification = "Select a car classification.";
    }

    return errs;
};

export const validateLicenseInsurance = (formData, t) => {
    const errs = {};

    if (!formData.licensedCapacitySeats || formData.licensedCapacitySeats.trim().length === 0) {
        errs.licensedCapacitySeats = "This field is required.";
    } else if (parseInt(formData.licensedCapacitySeats) < 1 || parseInt(formData.licensedCapacitySeats) > 60) {
        errs.licensedCapacitySeats = "Seating capacity must be between 1 and 60.";
    }

    if (!formData.licensedCapacityKg || formData.licensedCapacityKg.trim().length === 0) {
        errs.licensedCapacityKg = "This field is required.";
    } else if (parseInt(formData.licensedCapacityKg) > 5000) {
        errs.licensedCapacityKg = "Licensed capacity (Kg) must not exceed 5000Kg.";
    }

    if (!formData.registrationNumber || formData.registrationNumber.trim().length === 0) {
        errs.registrationNumber = "Enter a registration number.";
    }

    if (!formData.registrationExpiryDate || formData.registrationExpiryDate.trim().length === 0) {
        errs.registrationExpiryDate = "This field is required.";
    } else if (!moment(formData.registrationExpiryDate).isValid() || moment(formData.registrationExpiryDate).isBefore(moment().startOf("day"))) {
        errs.registrationExpiryDate = "Registration expiry must be in the future.";
    }

    if (!formData.insurancePolicyType) {
        errs.insurancePolicyType = "Select an insurance policy type.";
    }

    if (!formData.insurancePolicyNumber || formData.insurancePolicyNumber.trim().length === 0) {
        errs.insurancePolicyNumber = "Enter an insurance policy number.";
    }

    if (!formData.insuranceCompany) {
        errs.insuranceCompany = "Select an insurance company.";
    }

    if (!formData.insuranceExpiryDate || formData.insuranceExpiryDate.trim().length === 0) {
        errs.insuranceExpiryDate = "This field is required.";
    } else if (!moment(formData.insuranceExpiryDate).isValid() || moment(formData.insuranceExpiryDate).isBefore(moment().startOf("day"))) {
        errs.insuranceExpiryDate = "Insurance expiry must be in the future.";
    }

    return errs;
};

export const validateOwnership = (formData, picklistData, t) => {
    const errs = {};

    if (!formData.ownershipType) {
        errs.ownershipType = "Select ownership type.";
    }

    const isMOE = formData.ownershipType && picklistData.ownershipType.find((opt) => opt.value === formData.ownershipType)?.name === "MOE";
    if (isMOE) {
        if (!formData.moeContractNumber || formData.moeContractNumber.trim().length === 0) {
            errs.moeContractNumber = "Enter a MOE contract number.";
        }

        if (!formData.carValueMOE || formData.carValueMOE.trim().length === 0) {
            errs.carValueMOE = "Enter a valid car value.";
        } else if (parseFloat(formData.carValueMOE) <= 0) {
            errs.carValueMOE = "Enter a valid car value.";
        }
    }

    const isExternalVendor =
        formData.ownershipType && picklistData.ownershipType.find((opt) => opt.value === formData.ownershipType)?.name === "External vendor";
    if (isExternalVendor) {
        if (!formData.vendorContractNumber || formData.vendorContractNumber.trim().length === 0) {
            errs.vendorContractNumber = "Enter a vendor contract number.";
        }

        if (!formData.vendorsContactPerson || formData.vendorsContactPerson.trim().length === 0) {
            errs.vendorsContactPerson = "Enter a vendor contact person.";
        }

        if (!formData.vendorsContactDetails || formData.vendorsContactDetails.trim().length === 0) {
            errs.vendorsContactDetails = "Enter valid vendor contact details.";
        } else {
            const isPhone = /^(\+968)?[79]\d{7}$/.test(formData.vendorsContactDetails.replace(/\s/g, ""));
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.vendorsContactDetails);
            if (!isPhone && !isEmail) {
                errs.vendorsContactDetails = "Enter valid vendor contact details.";
            }
        }

        if (!formData.vendorYearlyValue || formData.vendorYearlyValue.trim().length === 0) {
            errs.vendorYearlyValue = "Enter a valid yearly value.";
        } else if (parseFloat(formData.vendorYearlyValue) <= 0) {
            errs.vendorYearlyValue = "Enter a valid yearly value.";
        }

        if (!formData.contractIncludesGas) {
            errs.contractIncludesGas = "Select Yes or No.";
        }
    }

    return errs;
};

export const validateOperationalInfo = (formData, t, isDirector) => {
    const errs = {};

    if (!formData.fuelType) {
        errs.fuelType = "Select a fuel type.";
    }

    if (!formData.carLocationHome) {
        errs.carLocationHome = "Select a car location.";
    }

    if (!formData.startingKM || formData.startingKM.trim().length === 0) {
        errs.startingKM = "This field is required.";
    } else if (parseInt(formData.startingKM) < 0 || parseInt(formData.startingKM) > 1000000) {
        errs.startingKM = "Enter a valid current KM.";
    }

    if (formData.monthlyKMLimit && parseFloat(formData.monthlyKMLimit) <= 0) {
        errs.monthlyKMLimit = "Enter a valid monthly KM limit.";
    }

    if (formData.monthlyGasLimit && parseFloat(formData.monthlyGasLimit) <= 0) {
        errs.monthlyGasLimit = "Enter a valid monthly gas limit.";
    }

    if (isDirector && !formData.department) {
        errs.department = "Select a department.";
    }

    return errs;
};

export const validateAttachment = () => {
    const errs = {};
    return errs;
};

export const validateAllSections = (formData, picklistData, t, isDirector) => {
    const allErrors = {
        ...validateIdentity(formData, t),
        ...validateLicenseInsurance(formData, t),
        ...validateOwnership(formData, picklistData, t),
        ...validateOperationalInfo(formData, t, isDirector),
        ...validateAttachment(),
    };
    return allErrors;
};
