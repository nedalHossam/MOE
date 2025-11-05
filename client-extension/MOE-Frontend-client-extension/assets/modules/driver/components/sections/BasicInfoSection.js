import React from "react";
import ClayForm from "@clayui/form";
import ClayIcon from "@clayui/icon";
import SelectComponent from "../../../../components/ui/MultiSelect";
import { useTranslation } from "../../../../utils/translations";
import TextInput from "../../../../components/ui/TextInput";
import RadioButton from "../../../../components/ui/RadioButton";
import DatePicker from "../../../../components/ui/DatePicker";
// import CustomLocalizedInput from "../../../../components/ui/CustomLocalizedInput"

// import {DatePicker,RadioButton,TextInput,SelectComponent} from "../../../../components/ui/DatePicker";
const BasicInfoSection = ({
    formData,
    setFormData,
    errors,
    setField,
    validateField,
    formTouched,
    setFormTouched,
    picklistData,
    spritemap,
    optionsLoading,
    t,
    isLoading,
    locales,
    localizedInputLocales,
    handleLocalizedInputLocaleChange,
    handleLocalizedInputChange,
    getLocaleObject,
    hasManagerTransportOfficerRole
}) => {
    const { currentLanguage } = useTranslation();


    return (
        <div id="basic-info" className="form-section">
            <div className="form-grid form-grid-3">
                <ClayForm.Group>
                    <label className="form-label">{t("status")}</label>
                    <SelectComponent
                        options={picklistData.driverStatus}
                        value={formData.status}
                        onChange={(value) => setField("status", value)}

                        isLoading={optionsLoading}
                        isDisabled={true}
                        placeholder={t("statusPlaceholder")}
                        currentLanguage={currentLanguage}
                        className="read-only-select"
                    />
                </ClayForm.Group>
                <TextInput
                    label={t("FullName")}
                    value={formData.fullName}
                    // onChange={(e) => setField("fullName", e.target.value)}
                    onChange={(e) => {
                        const value = e.target.value;
                        setField("fullName", value);
                        setField("fullName_i18n", { ...formData.fullName_i18n, en_US: value });
                    }}

                    placeholder={t("FullNamePlaceHolder")}
                    required={true}
                    name="fullName_i18n"
                    error={errors.fullName}
                    spritemap={spritemap}
                    errorIcon="exclamation-full"
                />
                <ClayForm.Group>
                    <label className="form-label">
                        {t("dateOfBirth")} <span className="required-asterisk">*</span>
                    </label>
                    <DatePicker
                        value={formData.dateOfBirth}
                        onChange={(value) => {
                            setField("dateOfBirth", value);
                            validateField("dateOfBirth", value);
                        }}
                        placeholder={t("dateOfBirth")}
                        onBlur={() => {
                            if (!formTouched.dateOfBirth) {
                                setFormTouched((prev) => ({ ...prev, dateOfBirth: true }));
                            }
                            validateField("dateOfBirth", formData.dateOfBirth);
                        }}
                        onFocus={() => {
                            if (!formTouched.dateOfBirth) {
                                setFormTouched((prev) => ({ ...prev, dateOfBirth: true }));
                            }
                        }}
                        disabled={isLoading}
                        // placeholder="YYYY-MM-DD"
                        dateFormat="yyyy-MM-dd"
                        spritemap={`${Liferay.ThemeDisplay.getPathThemeImages()}/clay/icons.svg`}
                        years={{ start: 1990, end: 2050 }}
                    />
                    {errors.dateOfBirth && (
                        <div className="form-error">
                            <ClayIcon symbol="exclamation-full" className="error-icon" spritemap={spritemap} />
                            {errors.dateOfBirth}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group>
                    <label className="form-label">{t("nationality")}</label>
                    <SelectComponent
                        options={picklistData.nationality}
                        value={formData.nationality}
                        onChange={(value) => {
                            setField("nationality", value);
                            validateField("nationality", value);
                        }}
                        isLoading={optionsLoading}
                        placeholder={t("nationalityPlaceHolder")}
                        currentLanguage={currentLanguage}
                    />
                    {errors.nationality && <p className="error-text">{errors.nationality}</p>}
                </ClayForm.Group>
                <TextInput
                    label={t("ResidencyorIDNumber")}

                    value={formData.residencyOrIDNumber}
                    // onChange={(value) => setField("residencyOrIDNumber", value)}
                    onChange={(e) => setField("residencyOrIDNumber", e.target.value)}
                    error={errors.residencyOrIDNumber}
                    placeholder={t("ResidencyorIDNumberPlaceHolder")}
                    required={true}
                    name="residencyOrIDNumber"

                    spritemap={spritemap}
                    errorIcon="exclamation-full"
                />
                {/* DEPARTMENT */}
                {hasManagerTransportOfficerRole ? (<ClayForm.Group>
                    <label className="form-label">{t("department")}</label>
                    <SelectComponent
                        options={picklistData.department}
                        value={formData.department}
                        onChange={(value) => {
                            setField("department", value);
                            validateField("department", value);
                        }}
                        isLoading={optionsLoading}
                        placeholder={t("departmentPlaceHolder")}
                        currentLanguage={currentLanguage}
                    />
                    {errors.department && <p className="error-text">{errors.department}</p>}
                </ClayForm.Group>) : (
                    <ClayForm.Group>
                       <label className="form-label">{t("department")}</label>
                        <SelectComponent
                            options={picklistData.department}
                            value={formData.department}
                            onChange={(value) => {
                                setField("department", value);
                                validateField("department", value);
                            }}
                            isLoading={optionsLoading}
                            placeholder={t("departmentPlaceHolder")}
                            isDisabled={true}
                            currentLanguage={currentLanguage}
                            className="read-only-select"
                        />
                        {errors.department && <p className="error-text">{errors.department}</p>}
                    </ClayForm.Group>
                )
                }

                <div className="full-row">

                    <RadioButton
                        name="employerType"
                        label={t("EmployerType")}
                        required={true}
                        options={[
                            { value: "MOE", name: "MOE" },
                            { value: "Vehicle Owner", name: t("VehicleOwner") },
                        ]}
                        value={formData.employerType}
                        onChange={(value) => {
                            setField("employerType", value);
                            validateField("employerType", value);
                        }}
                        errors={errors}
                        className="mb-3"
                        ariaLabel="Employer type options"
                        spritemap="/o/classic-theme/images/lexicon/icons.svg"
                    />

                </div>

                {formData.employerType === "MOE" && (

                    <TextInput
                        label={t("EmployeeMOEID")}
                        value={formData.employeeMOEID}
                        // onChange={(value) => setField("employeeMOEID", value)}
                        onChange={(e) => setField("employeeMOEID", e.target.value)}
                        a placeholder={t("EmployeeMOEIDPlaceHolder")}
                        required={true}
                        name="employeeMOEID"
                        error={errors.employeeMOEID}
                        spritemap={spritemap}
                        errorIcon="exclamation-full"
                    />
                )}

                {formData.employerType === "Vehicle Owner" && (
                    <ClayForm.Group>
                        <label className="form-label">
                            {t("PrimaryvehicleVehicle")}
                            <span className="required-asterisk">*</span>
                        </label>
                        <SelectComponent
                            options={picklistData.vehicles || []} // your vehicle options
                            value={formData.primaryVehicleId}
                            onChange={(e) => {
                                setField("primaryVehicleId", e.target.value)
                                validateField("primaryVehicleId", e.target.value);
                            }}
                            isMulti={false}
                            currentLanguage={currentLanguage}
                            placeholder={t("PrimaryvehicleVehiclePlaceHolder")}
                            isDisabled={optionsLoading}
                        />
                        {errors.primaryVehicleId && (
                            <div className="form-error">{errors.primaryVehicleId}</div>
                        )}
                    </ClayForm.Group>


                )}
            </div>
        </div>
    );
};

export default BasicInfoSection;
