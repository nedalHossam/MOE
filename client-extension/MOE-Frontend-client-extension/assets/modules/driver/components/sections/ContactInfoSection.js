import React from "react";
import TextInput from "../../../../components/ui/TextInput"
import CustomLocalizedInput from "../../../../components/ui/CustomLocalizedInput"

const ContactInfoSection = ({
    formData,
    errors,
    setField,
    validateField,
    formTouched,
    setFormTouched,
    t,
    spritemap,
    isLoading,
    locales,
    localizedInputLocales,
    handleLocalizedInputLocaleChange,
    handleLocalizedInputChange,
    getLocaleObject,
}) => {
    return (
        <div id="contact-info" className="form-section">
            <div className="form-grid form-grid-3">
                {/* <div className="full-row"> */}
                <TextInput
                    label={t("PhoneNumber")}
                    value={formData.phoneNumber}
                    onChange={(e) => setField("phoneNumber", e.target.value)}
                    error={errors.phoneNumber}
                    placeholder={t("PhoneNumberPlaceHolder")}
                    required={true}
                    name="phoneNumber"
                    spritemap={spritemap}
                    errorIcon="exclamation-full"
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
                />
                <TextInput
                    label={t("email")}
                    value={formData.email}
                    onChange={(e) => setField("email", e.target.value)}
                    error={errors.email}
                    placeholder={t("email")}
                    required={true}
                    name="email"
                    spritemap={spritemap}
                    errorIcon="exclamation-full"
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
                />
                <CustomLocalizedInput
                    className="address-test"
                    name="address_i18n"
                    label={t("address")}
                    locales={locales}
                    selectedLocale={getLocaleObject(localizedInputLocales.address_i18n)}
                    onSelectedLocaleChange={(newLocale) =>
                        handleLocalizedInputLocaleChange("address_i18n", newLocale)
                    }
                    onTranslationsChange={(translations) =>
                        handleLocalizedInputChange("address_i18n", translations)
                    }
                    onBlur={() => {
                        if (!formTouched.address_i18n) {
                            setFormTouched((prev) => ({ ...prev, address_i18n: true }));
                        }
                        validateField("address_i18n", formData.address_i18n);
                    }}
                    onFocus={() => {
                        if (!formTouched.address_i18n) {
                            setFormTouched((prev) => ({ ...prev, address_i18n: true }));
                        }
                    }}
                    translations={formData.address_i18n}
                    disabled={isLoading}
                    placeholder={t("address")}
                    symbol="home"
                    // rows={3}
                    // component="textarea"
                    required
                    error={errors.address_i18n}
                />

                <CustomLocalizedInput
                    name="emergencyContactName_i18n"
                    label={t("emergencyContactName")}
                    locales={locales}
                    selectedLocale={getLocaleObject(localizedInputLocales.emergencyContactName_i18n)}
                    onSelectedLocaleChange={(newLocale) =>
                        handleLocalizedInputLocaleChange("emergencyContactName_i18n", newLocale)
                    }
                    onTranslationsChange={(translations) =>
                        handleLocalizedInputChange("emergencyContactName_i18n", translations)
                    }
                    onBlur={() => {
                        if (!formTouched.emergencyContactName_i18n) {
                            setFormTouched((prev) => ({ ...prev, emergencyContactName_i18n: true }));
                        }
                        validateField("emergencyContactName_i18n", formData.emergencyContactName_i18n);
                    }}
                    onFocus={() => {
                        if (!formTouched.emergencyContactName_i18n) {
                            setFormTouched((prev) => ({ ...prev, emergencyContactName_i18n: true }));
                        }
                    }}
                    translations={formData.emergencyContactName_i18n}
                    disabled={isLoading}
                    placeholder={t("emergencyContactNamePlaceHolder")}
                    symbol="user"
                    error={errors.emergencyContactName_i18n}
                />

                <TextInput
                    label={t("emergencyContacEmail")}
                    style={{ marginTop: '2.5%' }}
                    value={formData.emergencyContactEmail}
                    onChange={(e) => setField("emergencyContactEmail", e.target.value)}
                    error={errors.emergencyContactEmail}
                    placeholder={t("emergencyContactNamePlaceHolder")}
                    onBlur={() => {
                        if (!formTouched.emergencyContactEmail) {
                            setFormTouched((prev) => ({ ...prev, emergencyContactEmail: true }));
                        }
                        validateField("emergencyContactEmail", formData.emergencyContactEmail);
                    }}
                    onFocus={() => {
                        if (!formTouched.emergencyContactEmail) {
                            setFormTouched((prev) => ({ ...prev, emergencyContactEmail: true }));
                        }
                    }}
                    name="emergencyContactEmail"

                    spritemap={spritemap}
                    errorIcon="exclamation-full"
                />

                <CustomLocalizedInput
                    name="emergencyContactAddress_i18n"
                    label={t("emergencyContactAddress")}
                    locales={locales}
                    selectedLocale={getLocaleObject(localizedInputLocales.emergencyContactAddress_i18n)}
                    onSelectedLocaleChange={(newLocale) => handleLocalizedInputLocaleChange("emergencyContactAddress_i18n", newLocale)}
                    onTranslationsChange={(translations) =>
                        handleLocalizedInputChange("emergencyContactAddress_i18n", translations)
                    }
                    translations={formData.emergencyContactAddress_i18n}
                    disabled={isLoading}
                    placeholder={t("emergencyContactAddressPlaceHolder")}
                    symbol="home"
                    onBlur={() => {
                        if (!formTouched.emergencyContactAddress_i18n) {
                            setFormTouched((prev) => ({ ...prev, emergencyContactAddress_i18n: true }));
                        }
                        validateField("emergencyContactAddress_i18n", formData.emergencyContactAddress_i18n);
                    }}
                    onFocus={() => {
                        if (!formTouched.emergencyContactAddress_i18n) {
                            setFormTouched((prev) => ({ ...prev, emergencyContactAddress_i18n: true }));
                        }
                    }}
                    // rows={3}
                    // component="textarea"
                    error={errors.emergencyContactAddress_i18n}
                />
                <TextInput
                    label={t("emergencyContacPhone")}
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setField("emergencyContactPhone", e.target.value)}
                    error={errors.emergencyContactPhone}
                    placeholder={t("emergencyContactPhonePlaceHolder")}
                    name="emergencyContactPhone"
                    spritemap={spritemap}
                    errorIcon="exclamation-full"
                    onBlur={() => {
                        if (!formTouched.emergencyContactPhone) {
                            setFormTouched((prev) => ({ ...prev, emergencyContactPhone: true }));
                        }
                        validateField("emergencyContactPhone", formData.emergencyContactPhone);
                    }}
                    onFocus={() => {
                        if (!formTouched.emergencyContactPhone) {
                            setFormTouched((prev) => ({ ...prev, emergencyContactPhone: true }));
                        }
                    }}
                />

            </div>
        </div>
    );
};

export default ContactInfoSection;
