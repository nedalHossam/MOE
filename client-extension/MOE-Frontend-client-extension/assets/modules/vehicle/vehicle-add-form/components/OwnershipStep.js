import React from "react";
import { RadioButton, TextInput } from "../../../../components/ui";
import { useTranslation } from "../../../../utils/translations";

// Helper function to normalize locale format
function normalizeLocaleToUnderscore(locale) {
    if (!locale) return 'en_US';
    const localeStr = String(locale);
    return localeStr.replace('-', '_');
}

// Helper function to get the localized name for an option
function getLocalizedName(option, currentLanguage) {
    if (option.name_i18n && typeof option.name_i18n === 'object') {
        const localeUnderScore = normalizeLocaleToUnderscore(currentLanguage);
        
        let translatedName = option.name_i18n[localeUnderScore] || 
                              option.name_i18n[currentLanguage];
        
        if (!translatedName) {
            const variants = [
                currentLanguage,
                localeUnderScore,
                'en-US',
                'en_US',
                'ar-SA',
                'ar_SA'
            ];
            
            for (const variant of variants) {
                if (option.name_i18n[variant]) {
                    translatedName = option.name_i18n[variant];
                    break;
                }
            }
        }
        
        return translatedName || option.name;
    }
    
    return option.name;
}

const OwnershipStep = ({ formData, errors, picklistData, setField, t, spritemap, localizedInputLocales, setFormData }) => {
    const { currentLanguage } = useTranslation();
    
    // Map ownership type options to include localized names
    const localizedOwnershipOptions = React.useMemo(() => {
        return picklistData.ownershipType.map((option) => ({
            value: option.value,
            name: getLocalizedName(option, currentLanguage),
            rawName: option.name, // Keep original name for comparison logic
            key: option.key, // Keep key for comparison logic
            name_i18n: option.name_i18n,
        }));
    }, [picklistData.ownershipType, currentLanguage]);
    return (
        <div className="step-content">
            <div className="form-grid form-grid-3">
                <RadioButton
                    name="ownershipType"
                    label={t("ownershipType")}
                    required={true}
                    options={localizedOwnershipOptions}
                    value={formData.ownershipType}
                    onChange={(value) => {
                        setField("ownershipType", value);
                        setFormData((prev) => ({
                            ...prev,
                            ownershipType_i18n: {
                                ...prev.ownershipType_i18n,
                                [localizedInputLocales.ownershipType]: value,
                            },
                        }));
                    }}
                    errors={errors}
                    spritemap={spritemap}
                    ariaLabel="Ownership Type"
                />

                {formData.ownershipType && picklistData.ownershipType.find((opt) => opt.value === formData.ownershipType)?.key === "MOE" && (
                    <>
                        <TextInput
                            label={t("moeContractNumber")}
                            name="moeContractNumber"
                            type="number"
                            value={formData.moeContractNumber}
                            onChange={(e) => {
                                // Only allow digits for contract number
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                setField("moeContractNumber", value);
                            }}
                            onKeyDown={(e) => {
                                // Prevent entering 'e', 'E', '+', '-', '.'
                                if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            error={!!errors.moeContractNumber}
                            errorMessage={errors.moeContractNumber}
                            errorIcon="exclamation-full"
                            spritemap={spritemap}
                            placeholder={t("moeContractNumberPlaceholder")}
                            required={true}
                            className="mt-2"
                        />

                        <TextInput
                            label={t("carValueMOE")}
                            name="carValueMOE"
                            type="number"
                            value={formData.carValueMOE}
                            onChange={(e) => {
                                // Allow digits and one decimal point for monetary values
                                let value = e.target.value;
                                // Remove anything that's not a digit or decimal point
                                value = value.replace(/[^0-9.]/g, '');
                                // Ensure only one decimal point
                                const parts = value.split('.');
                                if (parts.length > 2) {
                                    value = parts[0] + '.' + parts.slice(1).join('');
                                }
                                // Prevent negative numbers
                                if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
                                    setField("carValueMOE", value);
                                }
                            }}
                            onKeyDown={(e) => {
                                // Prevent entering 'e', 'E', '+', '-' (but allow '.')
                                if (['e', 'E', '+', '-'].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            error={!!errors.carValueMOE}
                            errorMessage={errors.carValueMOE}
                            errorIcon="exclamation-full"
                            spritemap={spritemap}
                            placeholder={t("carValueMOEPlaceholder")}
                            min={0}
                            step="0.01"
                            required={true}
                            className="mt-2"
                        />
                    </>
                )}

                {formData.ownershipType &&
                    picklistData.ownershipType.find((opt) => opt.value === formData.ownershipType)?.key === "ExternalVendor" && (
                        <>
                            <TextInput
                                label={t("vendorContractNumber")}
                                name="vendorContractNumber"
                                type="number"
                                value={formData.vendorContractNumber}
                                onChange={(e) => {
                                    // Only allow digits for contract number
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    setField("vendorContractNumber", value);
                                }}
                                onKeyDown={(e) => {
                                    // Prevent entering 'e', 'E', '+', '-', '.'
                                    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                error={!!errors.vendorContractNumber}
                                errorMessage={errors.vendorContractNumber}
                                errorIcon="exclamation-full"
                                spritemap={spritemap}
                                placeholder={t("vendorContractNumberPlaceholder")}
                                required={true}
                                className="mt-2"
                            />

                            <TextInput
                                label={t("vendorsContactPerson")}
                                name="vendorsContactPerson"
                                value={formData.vendorsContactPerson}
                                onChange={(e) => setField("vendorsContactPerson", e.target.value)}
                                error={!!errors.vendorsContactPerson}
                                errorMessage={errors.vendorsContactPerson}
                                errorIcon="exclamation-full"
                                spritemap={spritemap}
                                placeholder={t("vendorsContactPersonPlaceholder")}
                                required={true}
                                className="mt-2"
                            />

                            <TextInput
                                label={t("vendorsContactDetails")}
                                name="vendorsContactDetails"
                                value={formData.vendorsContactDetails}
                                onChange={(e) => setField("vendorsContactDetails", e.target.value)}
                                error={!!errors.vendorsContactDetails}
                                errorMessage={errors.vendorsContactDetails}
                                errorIcon="exclamation-full"
                                spritemap={spritemap}
                                placeholder={t("vendorsContactDetailsPlaceholder")}
                                required={true}
                            />

                            <TextInput
                                label={t("vendorYearlyValue")}
                                name="vendorYearlyValue"
                                type="number"
                                value={formData.vendorYearlyValue}
                                onChange={(e) => {
                                    // Allow digits and one decimal point for monetary values
                                    let value = e.target.value;
                                    // Remove anything that's not a digit or decimal point
                                    value = value.replace(/[^0-9.]/g, '');
                                    // Ensure only one decimal point
                                    const parts = value.split('.');
                                    if (parts.length > 2) {
                                        value = parts[0] + '.' + parts.slice(1).join('');
                                    }
                                    // Prevent negative numbers
                                    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
                                        setField("vendorYearlyValue", value);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    // Prevent entering 'e', 'E', '+', '-' (but allow '.')
                                    if (['e', 'E', '+', '-'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                error={!!errors.vendorYearlyValue}
                                errorMessage={errors.vendorYearlyValue}
                                errorIcon="exclamation-full"
                                spritemap={spritemap}
                                placeholder={t("vendorYearlyValuePlaceholder")}
                                min={0}
                                step="0.01"
                                required={true}
                            />

                            <RadioButton
                                name="contractIncludesGas"
                                label={t("contractIncludesGas")}
                                required={true}
                                options={[
                                    { value: "Yes", name: t("yes") },
                                    { value: "No", name: t("no") },
                                ]}
                                value={formData.contractIncludesGas}
                                onChange={(value) => setField("contractIncludesGas", value)}
                                errors={errors}
                                spritemap={spritemap}
                                ariaLabel="Contract Includes Gas"
                                className="full-row"
                            />
                        </>
                    )}
            </div>
        </div>
    );
};

export default OwnershipStep;
