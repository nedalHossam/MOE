import React, { useEffect, useState } from "react";
import ClayForm, { ClayInput } from "@clayui/form";
import ClayIcon from "@clayui/icon";
import { TextInput, SelectComponent } from "../../../../components/ui";
import { useTranslation } from "../../../../utils/translations";

const IdentityStep = ({ formData, errors, picklistData, optionsLoading, isLoading, setField, t, spritemap, setFormData, isEditMode }) => {
    const { currentLanguage } = useTranslation();
    
    // Helper to find option by value and return its i18n data
    const getOptionWithI18n = (options, value) => {
        return options.find(opt => opt.value === value);
    };

    // Handler for select with i18n
    const handleSelectChangeWithI18n = (fieldName, value) => {
        let selectedOption = null;
        
        // Find the selected option in the picklist
        if (fieldName === "vehicleStatus") {
            selectedOption = getOptionWithI18n(picklistData.status, value);
        } else if (fieldName === "carBrand") {
            selectedOption = getOptionWithI18n(picklistData.vehicleMakers, value);
        } else if (fieldName === "carModel") {
            selectedOption = getOptionWithI18n(picklistData.makerModels, value);
        } else if (fieldName === "color") {
            selectedOption = getOptionWithI18n(picklistData.colors, value);
        } else if (fieldName === "carCategory") {
            selectedOption = getOptionWithI18n(picklistData.vehicleCategories, value);
        } else if (fieldName === "carClassification") {
            selectedOption = getOptionWithI18n(picklistData.carClassification, value);
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

    // Status should be readonly in create mode and edit
    const isStatusReadonly = true;
    
    // Check if status is draft (for filtering options)
    const isDraftStatus = String(formData.vehicleStatus || "").toLowerCase() === "draft";

    // Compute status options: in edit mode with Draft status, hide OnTrip and InMaintenance
    const statusOptions = (() => {
        const original = Array.isArray(picklistData.status) ? picklistData.status : [];
        const isDraftEdit = isEditMode && isDraftStatus;
        if (!isDraftEdit) return original;
        const blocked = new Set(["ontrip", "inmaintenance"]);
        return original.filter((opt) => {
            const key = String(opt.key || opt.value || "").toLowerCase();
            return !blocked.has(key);
        });
    })();

    return (
        <div className="step-content">
            <div className="form-grid form-grid-3">
                <ClayForm.Group>
                    <label className="form-label">
                        {t("status")} <span className="required-asterisk">*</span>
                    </label>
                    <SelectComponent
                        options={picklistData.status}
                        value={formData.vehicleStatus}
                        onChange={(value) => handleSelectChangeWithI18n("vehicleStatus", value)}
                        isLoading={optionsLoading}
                        isDisabled={optionsLoading || isLoading || isStatusReadonly}
                        placeholder={t("statusPlaceholder")}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                    {errors.vehicleStatus && (
                        <div className="form-error">
                            <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                            {errors.vehicleStatus}
                        </div>
                    )}
                </ClayForm.Group>
                <TextInput
                    label={t("plateNumber")}
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={(e) => setField("plateNumber", e.target.value)}
                    error={!!errors.plateNumber}
                    errorMessage={errors.plateNumber}
                    errorIcon="exclamation-full"
                    spritemap={spritemap}
                    placeholder={t("plateNumberPlaceholder")}
                    required={true}
                />

                <TextInput
                    label={t("vin")}
                    name="vin"
                    value={formData.vin}
                    onChange={(e) => setField("vin", e.target.value)}
                    readOnly={!!isEditMode}
                    error={!!errors.vin}
                    errorMessage={errors.vin}
                    errorIcon="exclamation-full"
                    spritemap={spritemap}
                    placeholder={t("vinPlaceholder")}
                    maxLength={17}
                    required={true}
                />

                <ClayForm.Group>
                    <label className="form-label">
                        {t("carBrand")} <span className="required-asterisk">*</span>
                    </label>
                    <SelectComponent
                        options={picklistData.vehicleMakers}
                        value={formData.carBrand}
                        onChange={(value) => handleSelectChangeWithI18n("carBrand", value)}
                        isLoading={optionsLoading}
                        isDisabled={isLoading || optionsLoading}
                        placeholder={t("carBrandPlaceholder")}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                    {errors.carBrand && (
                        <div className="form-error">
                            <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                            {errors.carBrand}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group>
                    <label className="form-label">
                        {t("carModel")} <span className="required-asterisk">*</span>
                    </label>
                    <SelectComponent
                        options={picklistData.makerModels}
                        value={formData.carModel}
                        onChange={(value) => handleSelectChangeWithI18n("carModel", value)}
                        isLoading={optionsLoading}
                        isDisabled={isLoading || optionsLoading}
                        placeholder={t("carModelPlaceholder")}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                    {errors.carModel && (
                        <div className="form-error">
                            <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                            {errors.carModel}
                        </div>
                    )}
                </ClayForm.Group>

                <TextInput
                    label={t("carYear")}
                    name="carYear"
                    type="number"
                    value={formData.carYear}
                    onChange={(e) => {
                        // Only allow digits for year input
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setField("carYear", value);
                    }}
                    onKeyDown={(e) => {
                        // Prevent entering 'e', 'E', '+', '-', '.'
                        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    error={!!errors.carYear}
                    errorMessage={errors.carYear}
                    errorIcon="exclamation-full"
                    spritemap={spritemap}
                    placeholder={t("carYearPlaceholder")}
                    min={1990}
                    max={new Date().getFullYear()}
                    required={true}
                />

                <ClayForm.Group>
                    <label className="form-label">
                        {t("color")} <span className="required-asterisk">*</span>
                    </label>
                    <SelectComponent
                        options={picklistData.colors}
                        value={formData.color}
                        onChange={(value) => handleSelectChangeWithI18n("color", value)}
                        isLoading={optionsLoading}
                        isDisabled={isLoading || optionsLoading}
                        placeholder={t("colorPlaceholder")}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                    {errors.color && (
                        <div className="form-error">
                            <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                            {errors.color}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group>
                    <label className="form-label">
                        {t("carCategory")} <span className="required-asterisk">*</span>
                    </label>
                    <SelectComponent
                        options={picklistData.vehicleCategories}
                        value={formData.carCategory}
                        onChange={(value) => handleSelectChangeWithI18n("carCategory", value)}
                        isLoading={optionsLoading}
                        isDisabled={isLoading || optionsLoading}
                        placeholder={t("carCategoryPlaceholder")}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                    {errors.carCategory && (
                        <div className="form-error">
                            <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                            {errors.carCategory}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group>
                    <label className="form-label">
                        {t("carClassification")} <span className="required-asterisk">*</span>
                    </label>
                    <SelectComponent
                        options={picklistData.carClassification}
                        value={formData.carClassification}
                        onChange={(value) => handleSelectChangeWithI18n("carClassification", value)}
                        isLoading={optionsLoading}
                        isDisabled={isLoading || optionsLoading}
                        placeholder={t("carClassificationPlaceholder")}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                    {errors.carClassification && (
                        <div className="form-error">
                            <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                            {errors.carClassification}
                        </div>
                    )}
                </ClayForm.Group>
            </div>
        </div>
    );
};

export default IdentityStep;
