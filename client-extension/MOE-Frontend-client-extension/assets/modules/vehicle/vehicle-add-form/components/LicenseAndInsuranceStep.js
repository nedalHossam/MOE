import React from "react";
import ClayForm from "@clayui/form";
import ClayDatePicker from "@clayui/date-picker";
import ClayIcon from "@clayui/icon";
import { DatePicker, SelectComponent, TextInput } from "../../../../components/ui";
import { useTranslation } from "../../../../utils/translations";

const LicenseAndInsuranceStep = ({ formData, errors, picklistData, optionsLoading, isLoading, setField, t, spritemap, setFormData }) => {
    const { currentLanguage } = useTranslation();
    
    // Helper to find option by value and return its i18n data
    const getOptionWithI18n = (options, value) => {
        return options.find(opt => opt.value === value);
    };

    // Handler for select with i18n
    const handleSelectChangeWithI18n = (fieldName, value) => {
        let selectedOption = null;
        
        // Find the selected option in the picklist
        if (fieldName === "insurancePolicyType") {
            selectedOption = getOptionWithI18n(picklistData.insurancePolicyType, value);
        } else if (fieldName === "insuranceCompany") {
            selectedOption = getOptionWithI18n(picklistData.insuranceCompanies, value);
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

    return (
        <div className="step-content">
            <div className="form-grid form-grid-3">
                <TextInput
                    label={t("licensedCapacitySeats")}
                    name="licensedCapacitySeats"
                    type="number"
                    value={formData.licensedCapacitySeats}
                    onChange={(e) => {
                        // Only allow digits for seats input
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setField("licensedCapacitySeats", value);
                    }}
                    onKeyDown={(e) => {
                        // Prevent entering 'e', 'E', '+', '-', '.'
                        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    placeholder={t("licensedCapacitySeatsPlaceholder")}
                    required={true}
                    error={!!errors.licensedCapacitySeats}
                    errorMessage={errors.licensedCapacitySeats}
                    errorIcon="exclamation-full"
                    spritemap={spritemap}
                    min={1}
                    max={60}
                />

                <TextInput
                    label={t("licensedCapacityKg")}
                    name="licensedCapacityKg"
                    type="number"
                    value={formData.licensedCapacityKg}
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        // Prevent empty unless it's a deletion
                        if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
                            setField("licensedCapacityKg", value);
                        }
                    }}
                    onKeyDown={(e) => {
                        // Prevent entering 'e', 'E', '+', '-', '.'
                        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    placeholder={t("licensedCapacityKgPlaceholder")}
                    required={true}
                    error={!!errors.licensedCapacityKg}
                    errorMessage={errors.licensedCapacityKg}
                    errorIcon="exclamation-full"
                    spritemap={spritemap}
                    max={5000}
                    min={0}
                />

                <TextInput
                    label={t("licenseStatus")}
                    name="licenseStatus"
                    value={formData.licenseStatus || t("valid")}
                    disabled={true}
                    placeholder={t("licenseStatusPlaceholder")}
                    required={true}
                />

                <TextInput
                    label={t("insuranceStatus")}
                    name="insuranceStatus"
                    value={formData.insuranceStatus || t("valid")}
                    disabled={true}
                    placeholder={t("insuranceStatusPlaceholder")}
                    required={true}
                />

                <TextInput
                    label={t("registrationNumber")}
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => setField("registrationNumber", e.target.value)}
                    placeholder={t("registrationNumberPlaceholder")}
                    required={true}
                    error={!!errors.registrationNumber}
                    errorMessage={errors.registrationNumber}
                    errorIcon="exclamation-full"
                    spritemap={spritemap}
                />

                <ClayForm.Group>
                    <label className="form-label">
                        {t("registrationExpiryDate")} <span className="required-asterisk">*</span>
                    </label>
                    <DatePicker
                        value={formData.registrationExpiryDate}
                        onChange={(date) => setField("registrationExpiryDate", date)}
                        disabled={isLoading}
                        dateFormat="yyyy-MM-dd"
                        placeholder={t("registrationExpiryDatePlaceholder")}
                        spritemap={spritemap}
                        years={{
                            end: 2050,
                            start: new Date().getFullYear(),
                        }}
                        minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                    />
                    {errors.registrationExpiryDate && (
                        <div className="form-error">
                            <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                            {errors.registrationExpiryDate}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group>
                    <label className="form-label">
                        {t("insurancePolicyType")} <span className="required-asterisk">*</span>
                    </label>
                    <SelectComponent
                        options={picklistData.insurancePolicyType}
                        value={formData.insurancePolicyType}
                        onChange={(value) => handleSelectChangeWithI18n("insurancePolicyType", value)}
                        isLoading={optionsLoading}
                        isDisabled={isLoading || optionsLoading}
                        placeholder={t("insurancePolicyTypePlaceholder")}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                    {errors.insurancePolicyType && (
                        <div className="form-error">
                            <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                            {errors.insurancePolicyType}
                        </div>
                    )}
                </ClayForm.Group>

                <TextInput
                    label={t("insurancePolicyNumber")}
                    name="insurancePolicyNumber"
                    value={formData.insurancePolicyNumber}
                    onChange={(e) => setField("insurancePolicyNumber", e.target.value)}
                    placeholder={t("insurancePolicyNumberPlaceholder")}
                    required={true}
                    error={!!errors.insurancePolicyNumber}
                    errorMessage={errors.insurancePolicyNumber}
                    errorIcon="exclamation-full"
                    spritemap={spritemap}
                />

                <ClayForm.Group>
                    <label className="form-label">
                        {t("insuranceCompany")} <span className="required-asterisk">*</span>
                    </label>
                    <SelectComponent
                        options={picklistData.insuranceCompanies}
                        value={formData.insuranceCompany}
                        onChange={(value) => handleSelectChangeWithI18n("insuranceCompany", value)}
                        isLoading={optionsLoading}
                        isDisabled={isLoading || optionsLoading}
                        placeholder={t("insuranceCompanyPlaceholder")}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                    {errors.insuranceCompany && (
                        <div className="form-error">
                            <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                            {errors.insuranceCompany}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group>
                    <label className="form-label">
                        {t("insuranceExpiryDate")} <span className="required-asterisk">*</span>
                    </label>
                     <DatePicker
                      value={formData.insuranceExpiryDate}
                       onChange={(date) => setField("insuranceExpiryDate", date)}
                      disabled={isLoading}
                      dateFormat="yyyy-MM-dd"
                      placeholder={t("insuranceExpiryDatePlaceholder")}
                        spritemap={spritemap}
                        years={{
                            end: 2050,
                            start: new Date().getFullYear(),
                        }}
                        minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                    />
                    {errors.insuranceExpiryDate && (
                        <div className="form-error">
                            <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                            {errors.insuranceExpiryDate}
                        </div>
                    )}
                </ClayForm.Group>
            </div>
        </div>
    );
};

export default LicenseAndInsuranceStep;
