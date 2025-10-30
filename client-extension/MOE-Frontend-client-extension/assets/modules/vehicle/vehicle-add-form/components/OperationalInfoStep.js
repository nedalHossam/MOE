import React from "react";
import ClayForm, { ClayInput } from "@clayui/form";
import ClayIcon from "@clayui/icon";
import Select from "react-select";
import { SelectComponent } from "../../../../components/ui";
import { animatedComponents } from "../constants";
import { useTranslation } from "../../../../utils/translations";

const OperationalInfoStep = ({ formData, errors, picklistData, optionsLoading, isLoading, setField, t, spritemap, isDirector, setFormData }) => {
    const { currentLanguage } = useTranslation();
    
    // Helper to find option by value and return its i18n data
    const getOptionWithI18n = (options, value) => {
        return options.find(opt => opt.value === value);
    };

    // Handler for select with i18n
    const handleSelectChangeWithI18n = (fieldName, value) => {
        let selectedOption = null;
        
        // Find the selected option in the picklist
        if (fieldName === "fuelType") {
            selectedOption = getOptionWithI18n(picklistData.fuelTypes, value);
        } else if (fieldName === "carLocationHome") {
            selectedOption = getOptionWithI18n(picklistData.locations, value);
        } else if (fieldName === "currentLocation") {
            selectedOption = getOptionWithI18n(picklistData.locations, value);
        } else if (fieldName === "department") {
            selectedOption = getOptionWithI18n(picklistData.departments, value);
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
                <ClayForm.Group>
                    <label className="form-label">
                        {t("fuelType")} <span className="required-asterisk">*</span>
                    </label>
                    <SelectComponent
                        options={picklistData.fuelTypes}
                        value={formData.fuelType}
                        onChange={(value) => handleSelectChangeWithI18n("fuelType", value)}
                        isLoading={optionsLoading}
                        isDisabled={isLoading || optionsLoading}
                        placeholder={t("fuelTypePlaceholder")}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                    {errors.fuelType && (
                        <div className="form-error">
                            <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                            {errors.fuelType}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group>
                    <label>{t("telemetryID")}</label>
                    <ClayInput
                        value={formData.telemetryID}
                        onChange={(e) => setField("telemetryID", e.target.value)}
                        placeholder={t("telemetryIDPlaceholder")}
                    />
                </ClayForm.Group>

                <ClayForm.Group>
                    <label>{t("fuelCardDeviceNumber")}</label>
                    <ClayInput
                        value={formData.fuelCardDeviceNumber}
                        onChange={(e) => setField("fuelCardDeviceNumber", e.target.value)}
                        placeholder={t("fuelCardDeviceNumberPlaceholder")}
                    />
                </ClayForm.Group>

                <ClayForm.Group>
                    <label className="form-label">
                        {t("carLocationHome")} <span className="required-asterisk">*</span>
                    </label>
                    <SelectComponent
                        options={picklistData.locations}
                        value={formData.carLocationHome}
                        onChange={(value) => handleSelectChangeWithI18n("carLocationHome", value)}
                        isLoading={optionsLoading}
                        isDisabled={isLoading || optionsLoading}
                        placeholder={t("carLocationHomePlaceholder")}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                    {errors.carLocationHome && (
                        <div className="form-error">
                            <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                            {errors.carLocationHome}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group>
                    <label className="form-label">{t("currentLocation")}</label>
                    <SelectComponent
                        options={picklistData.locations}
                        value={formData.currentLocation}
                        onChange={(value) => handleSelectChangeWithI18n("currentLocation", value)}
                        isLoading={optionsLoading}
                        isDisabled={isLoading || optionsLoading}
                        placeholder={t("currentLocationPlaceholder")}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                    {errors.currentLocation && (
                        <div className="form-error">
                            <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                            {errors.currentLocation}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group>
                    <label className="form-label">
                        {t("startingKM")} <span className="required-asterisk">*</span>
                    </label>
                    <ClayInput
                        type="number"
                        value={formData.startingKM}
                        onChange={(e) => {
                            // Only allow digits for starting KM input
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setField("startingKM", value);
                        }}
                        onKeyDown={(e) => {
                            // Prevent entering 'e', 'E', '+', '-', '.'
                            if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        className={errors.startingKM ? "has-error" : ""}
                        placeholder={t("startingKMPlaceholder")}
                        min={0}
                        max={1000000}
                    />
                    {errors.startingKM && (
                        <div className="form-error">
                            <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                            {errors.startingKM}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group>
                    <label>{t("currentKM")}</label>
                    <ClayInput value={formData.currentKM} placeholder={t("currentKMPlaceholder")} className="read-only-input" />
                </ClayForm.Group>

                <ClayForm.Group>
                    <label>{t("monthlyKMLimit")}</label>
                    <ClayInput
                        type="number"
                        value={formData.monthlyKMLimit}
                        onChange={(e) => {
                            // Only allow digits for monthly KM limit input
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setField("monthlyKMLimit", value);
                        }}
                        onKeyDown={(e) => {
                            // Prevent entering 'e', 'E', '+', '-', '.'
                            if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        className={errors.monthlyKMLimit ? "has-error" : ""}
                        placeholder={t("monthlyKMLimitPlaceholder")}
                        min={0}
                    />
                    {errors.monthlyKMLimit && (
                        <div className="form-error">
                            <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                            {errors.monthlyKMLimit}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group>
                    <label>{t("monthlyGasLimit")}</label>
                    <ClayInput
                        type="number"
                        value={formData.monthlyGasLimit}
                        onChange={(e) => {
                            // Only allow digits for monthly gas limit input
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setField("monthlyGasLimit", value);
                        }}
                        onKeyDown={(e) => {
                            // Prevent entering 'e', 'E', '+', '-', '.'
                            if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        className={errors.monthlyGasLimit ? "has-error" : ""}
                        placeholder={t("monthlyGasLimitPlaceholder")}
                        min={0}
                    />
                    {errors.monthlyGasLimit && (
                        <div className="form-error">
                            <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                            {errors.monthlyGasLimit}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group>
                    <label>{t("preferredDrivers")}</label>
                    <SelectComponent
                        options={picklistData.drivers}
                        value={formData.r_drivers_c_driverId ? formData.r_drivers_c_driverId.map((d) => d.value) : []}
                        onChange={(values) => {
                            const selectedOptions = picklistData.drivers.filter((driver) => values.includes(driver.value));
                            setField("r_drivers_c_driverId", selectedOptions);
                        }}
                        isLoading={optionsLoading}
                        placeholder={t("preferredDriversPlaceholder")}
                        isMulti={true}
                        currentLanguage={currentLanguage}
                    />
                </ClayForm.Group>

                <ClayForm.Group>
                    <label>{t("preferredAdministration")}</label>
                    <Select
                        components={animatedComponents}
                        options={picklistData.administrations}
                        value={picklistData.administrations.find((o) => o.value === formData.preferredAdministration) || null}
                        onChange={(opt) => setField("preferredAdministration", opt ? opt.value : "")}
                        isLoading={optionsLoading}
                        isDisabled={optionsLoading}
                        placeholder={t("preferredAdministrationPlaceholder")}
                        isClearable
                    />
                </ClayForm.Group>

                <ClayForm.Group>
                    <label>{t("preferredMOEEmployee")}</label>
                    <SelectComponent
                        options={picklistData.employees}
                        value={formData.preferredMOEEmployee}
                        onChange={(value) => setField("preferredMOEEmployee", value)}
                        isLoading={optionsLoading}
                        placeholder={t("preferredMOEEmployeePlaceholder")}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                </ClayForm.Group>

                {isDirector && (
                    <ClayForm.Group>
                        <label>{t("department")}</label>
                        <SelectComponent
                            options={picklistData.departments}
                            value={formData.department}
                            onChange={(value) => handleSelectChangeWithI18n("department", value)}
                            isLoading={optionsLoading}
                            isDisabled={isLoading || optionsLoading}
                            placeholder={t("departmentPlaceholder")}
                            isMulti={false}
                            currentLanguage={currentLanguage}
                        />
                        {errors.department && (
                            <div className="form-error">
                                <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                                {errors.department}
                            </div>
                        )}
                    </ClayForm.Group>
                )}
            </div>
        </div>
    );
};

export default OperationalInfoStep;
