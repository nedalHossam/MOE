import React from "react";
import FormField from "../FormField/FormField";

const OperationalInfoSection = ({
    formData,
    errors,
    setField,
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
        <div id="operational-info" className="form-section">
            <h3 className="section-title">Section D: Operational info</h3>
            <div className="form-grid form-grid-2">
                <FormField
                    type="text"
                    label="Leaves"
                    name="leaves"
                    value={formData.leaves}
                    onChange={() => {}} // Read-only
                    disabled={true}
                    placeholder="Retrieved from Mawred System"
                />

                <FormField
                    type="select"
                    label="Preferred Administration"
                    name="preferredAdministrations"
                    value={formData.preferredAdministrations}
                    onChange={(value) => setField("preferredAdministrations", value)}
                    options={picklistData.administrations}
                    isLoading={optionsLoading}
                    disabled={optionsLoading}
                    placeholder="Select from MOE list of administrations..."
                    isMulti={true}
                    isClearable={true}
                />

                <FormField
                    type="select"
                    label="Preferred MOE Passenger"
                    name="preferredMoePassengers"
                    value={formData.preferredMoePassengers}
                    onChange={(value) => setField("preferredMoePassengers", value)}
                    options={picklistData.passengers}
                    isLoading={optionsLoading}
                    disabled={optionsLoading}
                    placeholder="Select from MOE list of employees..."
                    isMulti={true}
                    isClearable={true}
                />

                <div className="full-row">
                    <FormField
                        type="localized"
                        name="notes_i18n"
                        label="Notes"
                        component="textarea"
                        rows={4}
                        locales={locales}
                        selectedLocale={getLocaleObject(localizedInputLocales.notes)}
                        onSelectedLocaleChange={(newLocale) => handleLocalizedInputLocaleChange("notes", newLocale)}
                        onTranslationsChange={(translations) => handleLocalizedInputChange("notes_i18n", translations)}
                        translations={formData.notes_i18n}
                        disabled={isLoading}
                        error={errors.notes}
                        placeholder="Enter additional notes (optional)"
                        symbol="document-text"
                    />
                </div>
            </div>
        </div>
    );
};

export default OperationalInfoSection;
