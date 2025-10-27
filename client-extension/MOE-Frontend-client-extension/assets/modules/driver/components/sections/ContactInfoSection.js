import React from "react";
import FormField from "../FormField/FormField";

const ContactInfoSection = ({
    formData,
    errors,
    setField,
    validateField,
    formTouched,
    setFormTouched,
    isLoading,
    locales,
    localizedInputLocales,
    handleLocalizedInputLocaleChange,
    handleLocalizedInputChange,
    getLocaleObject,
}) => {
    return (
        <div id="contact-info" className="form-section">
            <h3 className="section-title">Section B: Contact information</h3>
            <div className="form-grid form-grid-2">
                <FormField
                    type="text"
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(value) => setField("phoneNumber", value)}
                    onBlur={() => {
                        if (!formTouched.phoneNumber) {
                            setFormTouched((prev) => ({ ...prev, phoneNumber: true }));
                        }
                        validateField("phoneNumber", formData.phoneNumber);
                    }}
                    onFocus={() => {
                        if (!formTouched.phoneNumber) {
                            setFormTouched((prev) => ({ ...prev, phoneNumber: true }));
                        }
                    }}
                    error={errors.phoneNumber}
                    placeholder="Enter phone number"
                    required={true}
                />

                <FormField
                    type="text"
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={(value) => setField("email", value)}
                    onBlur={() => {
                        if (!formTouched.email) {
                            setFormTouched((prev) => ({ ...prev, email: true }));
                        }
                        validateField("email", formData.email);
                    }}
                    onFocus={() => {
                        if (!formTouched.email) {
                            setFormTouched((prev) => ({ ...prev, email: true }));
                        }
                    }}
                    error={errors.email}
                    placeholder="Enter email address"
                    required={true}
                />

                <div className="full-row">
                    <FormField
                        type="localized"
                        name="address_i18n"
                        label="Address"
                        locales={locales}
                        selectedLocale={getLocaleObject(localizedInputLocales.address)}
                        onSelectedLocaleChange={(newLocale) => handleLocalizedInputLocaleChange("address", newLocale)}
                        onTranslationsChange={(translations) => handleLocalizedInputChange("address_i18n", translations)}
                        translations={formData.address_i18n}
                        disabled={isLoading}
                        error={errors.address}
                        placeholder="Enter address"
                        symbol="home"
                    />
                </div>
            </div>

            <h4>Emergency contact</h4>
            <div className="form-grid form-grid-2">
                <FormField
                    type="localized"
                    name="emergencyContactName_i18n"
                    label="Emergency Contact Name"
                    locales={locales}
                    selectedLocale={getLocaleObject(localizedInputLocales.emergencyContactName)}
                    onSelectedLocaleChange={(newLocale) => handleLocalizedInputLocaleChange("emergencyContactName", newLocale)}
                    onTranslationsChange={(translations) => handleLocalizedInputChange("emergencyContactName_i18n", translations)}
                    translations={formData.emergencyContactName_i18n}
                    disabled={isLoading}
                    error={errors.emergencyContactName}
                    placeholder="Enter emergency contact name"
                    symbol="user"
                />

                <FormField
                    type="text"
                    label="Emergency Contact Phone"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={(value) => setField("emergencyContactPhone", value)}
                    error={errors.emergencyContactPhone}
                    placeholder="Enter emergency contact phone"
                />

                <FormField
                    type="text"
                    label="Emergency Contact Email"
                    name="emergencyContactEmail"
                    value={formData.emergencyContactEmail}
                    onChange={(value) => setField("emergencyContactEmail", value)}
                    error={errors.emergencyContactEmail}
                    placeholder="Enter emergency contact email"
                />

                <FormField
                    type="localized"
                    name="emergencyContactAddress_i18n"
                    label="Emergency Contact Address"
                    locales={locales}
                    selectedLocale={getLocaleObject(localizedInputLocales.emergencyContactAddress)}
                    onSelectedLocaleChange={(newLocale) => handleLocalizedInputLocaleChange("emergencyContactAddress", newLocale)}
                    onTranslationsChange={(translations) => handleLocalizedInputChange("emergencyContactAddress_i18n", translations)}
                    translations={formData.emergencyContactAddress_i18n}
                    disabled={isLoading}
                    error={errors.emergencyContactAddress}
                    placeholder="Enter emergency contact address"
                    symbol="home"
                />
            </div>
        </div>
    );
};

export default ContactInfoSection;
