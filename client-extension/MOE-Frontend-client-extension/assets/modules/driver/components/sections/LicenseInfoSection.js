import React from "react";
import ClayForm from "@clayui/form";
import ClayIcon from "@clayui/icon";
import { useTranslation } from "../../../../utils/translations";
import SelectComponent from "../../../../components/ui/MultiSelect";
import TextInput from "../../../../components/ui/TextInput";
import DatePicker from "../../../../components/ui/DatePicker";
const LicenseInfoSection = ({
    formData,
    errors,
    setField,
    validateField,
    formTouched,
    setFormTouched,
    locales,
    t,
    optionsLoading,
    spritemap,
    picklistData,
    isLoading,
    localizedInputLocales,
    handleLocalizedInputLocaleChange,
    handleLocalizedInputChange,
    getLocaleObject,
}) => {
    const { currentLanguage } = useTranslation();
    return (
        <div id="license-info" className="form-section">
            <div className="form-grid form-grid-3">
                <TextInput
                    label={t("LicenseNumber")}
                    value={formData.licenseNumber}
                    onChange={(e) => setField("licenseNumber", e.target.value)}
                    error={errors.licenseNumber}
                    placeholder={t("LicenseNumberPlaceHolder")}
                    required={true}
                    name="licenseNumber"
                    spritemap={spritemap}
                    errorIcon="exclamation-full"
                />
                <ClayForm.Group>
                    <label className="form-label">
                        {t("LicenseClass")}
                        <span className="required-asterisk">*</span>
                    </label>
                    <SelectComponent
                        options={picklistData.licenseClass}
                        value={formData.licenseClass}
                        // isLoading={optionsLoading}
                        onChange={(value) => {
                            setField("licenseClass", value);
                            validateField("licenseClass", value);
                        }}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                        placeholder={t("LicenseClassPlaceHolder")}
                        isDisabled={optionsLoading}
                    />
                    {errors.licenseClass && (
                        <div className="form-error">{errors.licenseClass}</div>
                    )}
                </ClayForm.Group>
                <ClayForm.Group>
                    <label className="form-label">
                        {t("LicenseExpiry")} <span className="required-asterisk">*</span>
                    </label>
                    <DatePicker
                    style={{ marginBottom: '1%' }}
                        value={formData.licenseExpiry}
                        onChange={(value) => {
                            setField("licenseExpiry", value);
                            validateField("licenseExpiry", value);
                        }}
                        onBlur={() => {
                            if (!formTouched.licenseExpiry) {
                                setFormTouched((prev) => ({ ...prev, licenseExpiry: true }));
                            }
                            validateField("licenseExpiry", formData.licenseExpiry);
                        }}
                        onFocus={() => {
                            if (!formTouched.licenseExpiry) {
                                setFormTouched((prev) => ({ ...prev, licenseExpiry: true }));
                            }
                        }}
                        disabled={isLoading}
                        placeholder={t("LicenseExpiry")}
                        dateFormat="yyyy-MM-dd"
                        spritemap={`${Liferay.ThemeDisplay.getPathThemeImages()}/clay/icons.svg`}
                        years={{ start: 1990, end: 2050 }}
                    />
                    {errors.licenseExpiry && (
                        <div className="form-error">
                            <ClayIcon
                                symbol="exclamation-full"
                                className="error-icon"
                                spritemap={spritemap}
                            />
                            {errors.licenseExpiry}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group>
                    <label className="form-label">{t("licenseStatus")}</label>
                    <SelectComponent
                        options={picklistData.licenseStatus}
                        value={formData.licenseStatus}
                        onChange={(value) => {
                            setField("licenseStatus", value);
                            setField("licenseStatus_i18n", { ...formData.licenseStatus_i18n, en_US: value });
                            validateField("licenseStatus", value);
                        }}
                        className="read-only-select"
                    />
                </ClayForm.Group>

            </div>
        </div>
    );
};

export default LicenseInfoSection;
