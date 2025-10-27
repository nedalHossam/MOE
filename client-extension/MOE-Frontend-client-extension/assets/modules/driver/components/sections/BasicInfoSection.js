import React from "react";
import FormField from "../FormField/FormField";

const BasicInfoSection = ({
    formData,
    errors,
    setField,
    validateField,
    formTouched,
    setFormTouched,
    picklistData,
    optionsLoading,
    isLoading,
    locales,
    localizedInputLocales,
    handleLocalizedInputLocaleChange,
    handleLocalizedInputChange,
    getLocaleObject,
}) => {
    return (
        <div id="basic-info" className="form-section">
            <h3 className="section-title">Section A: Basic information</h3>
            <div className="form-grid form-grid-2">
                <FormField
                    type="select"
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={(value) => setField("status", value)}
                    options={picklistData.driverStatus}
                    isLoading={optionsLoading}
                    disabled={true}
                    placeholder="Select status..."
                    className="read-only-select"
                />

                <FormField
                    type="localized"
                    name="statusChangeReason_i18n"
                    label="Status Change Reason"
                    locales={locales}
                    selectedLocale={getLocaleObject(localizedInputLocales.statusChangeReason)}
                    onSelectedLocaleChange={(newLocale) => handleLocalizedInputLocaleChange("statusChangeReason", newLocale)}
                    onTranslationsChange={(translations) => handleLocalizedInputChange("statusChangeReason_i18n", translations)}
                    translations={formData.statusChangeReason_i18n}
                    disabled={isLoading}
                    error={errors.statusChangeReason}
                    placeholder="Enter status change reason (optional)"
                    symbol="info-circle"
                    required={false}
                />

                <FormField
                    type="localized"
                    name="fullName_i18n"
                    label="Full name"
                    locales={locales}
                    selectedLocale={getLocaleObject(localizedInputLocales.fullName)}
                    onSelectedLocaleChange={(newLocale) => handleLocalizedInputLocaleChange("fullName", newLocale)}
                    onTranslationsChange={(translations) => handleLocalizedInputChange("fullName_i18n", translations)}
                    translations={formData.fullName_i18n}
                    disabled={isLoading}
                    error={errors.fullName}
                    placeholder="Enter full name"
                    symbol="user"
                    required={true}
                />

                <FormField
                    type="date"
                    label="Date of birth (DoB)"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={(value) => setField("dateOfBirth", value)}
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
                    error={errors.dateOfBirth}
                    required={true}
                    placeholder="YYYY-MM-DD"
                />

                <FormField
                    type="select"
                    label="Nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={(value) => setField("nationality", value)}
                    options={picklistData.nationality}
                    error={errors.nationality}
                    isLoading={optionsLoading}
                    disabled={optionsLoading}
                    placeholder="Select nationality..."
                    required={true}
                />

                <FormField
                    type="text"
                    label="Residency or ID Number"
                    name="residencyOrIDNumber"
                    value={formData.residencyOrIDNumber}
                    onChange={(value) => setField("residencyOrIDNumber", value)}
                    error={errors.residencyOrIDNumber}
                    placeholder="Enter residency or ID number"
                    required={true}
                />

                <div className="full-row">
                    <FormField
                        type="radio"
                        label="Employer type"
                        name="employerType"
                        value={formData.employerType}
                        onChange={(value) => setField("employerType", value)}
                        options={[
                            { value: "MOE", label: "MOE" },
                            { value: "Vehicle Owner", label: "Vehicle Owner" },
                        ]}
                        error={errors.employerType}
                        required={true}
                    />
                </div>

                {formData.employerType === "MOE" && (
                    <FormField
                        type="text"
                        label="Employee MOE ID"
                        name="employeeMOEID"
                        value={formData.employeeMOEID}
                        onChange={(value) => setField("employeeMOEID", value)}
                        error={errors.employeeMOEID}
                        placeholder="Enter MOE Employee ID"
                        required={true}
                    />
                )}

                {formData.employerType === "Vehicle Owner" && (
                    <FormField
                        type="select"
                        label="Primary vehicle (Vehicle ID)"
                        name="primaryVehicleId"
                        value={formData.primaryVehicleId}
                        onChange={(value) => setField("primaryVehicleId", value)}
                        options={[]} // TODO: Add vehicle options
                        error={errors.primaryVehicleId}
                        isLoading={optionsLoading}
                        disabled={optionsLoading}
                        placeholder="Select a vehicle..."
                        required={true}
                    />
                )}
            </div>
        </div>
    );
};

export default BasicInfoSection;
