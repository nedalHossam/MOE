import React from "react";
import ClayForm from "@clayui/form";
import { useTranslation } from "../../../../utils/translations";
import SelectComponent from "../../../../components/ui/MultiSelect";
import CustomLocalizedInput from "../../../../components/ui/CustomLocalizedInput";
import InputFileUpload from "../../../../components/ui/InputFileUpload";
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
    validateField,
    coordinators, // 👈
    administrators,
    handleFileUpload,
    // PreferredAdministrationOrPreferredMOEPassenger,
    // formTouched,
    // setFormTouched,
    t,
    // spritemap,
}) => {
    const { currentLanguage } = useTranslation();
    return (
        <div id="operational-info" className="form-section">
            <div className="form-grid form-grid-3">
                <ClayForm.Group>
                    <label className="form-label">{t("preferredAdministration")}</label>
                    <SelectComponent
                        name="preferredAdministrations"
                        // options={picklistData.administrations}
                        options={administrators}
                        value={formData.preferredAdministrations}
                        onChange={(value) => {
                            setField("preferredAdministrations", value);
                            // validateField("preferredAdministrations", value);
                        }}
                        isMulti={true}
                        isClearable={true}
                        isLoading={optionsLoading}
                        currentLanguage={currentLanguage}
                        placeholder={t("preferredAdministrationPlaceholder")}
                        isDisabled={optionsLoading}
                    />
                    {errors.preferredAdministrations && (
                        <div className="form-error">{errors.preferredAdministrations}</div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group>
                    <label className="form-label">{t("preferredMOEPassenger")}</label>
                    <SelectComponent
                        // options={picklistData.passengers}
                        options={coordinators}
                        name="preferredMoePassengers"
                        value={formData.preferredMoePassengers}
                        onChange={(value) => {
                            setField("preferredMoePassengers", value);
                            validateField("preferredMoePassengers", value);
                        }}
                        isMulti={true}
                        isLoading={optionsLoading}
                        isClearable={true}
                        currentLanguage={currentLanguage}
                        placeholder={t("preferredMOEPassengerPlaceholder")}
                        isDisabled={optionsLoading}
                    />
                    {errors.preferredMoePassengers && (
                        <div className="form-error">{errors.preferredMoePassengers}</div>
                    )}
                </ClayForm.Group>

                <InputFileUpload
                    label={t("attachments")}
                    className="file-test"
                    name="attachmentFile"
                    accept="application/pdf,image/jpeg,image/png"
                    // disabled={isLoading}
                    onChange={async (e) => {
                        const file = e.target.files && e.target.files[0];
                        if (!file) return;

                        // Validate file type and size
                        if (
                            !["application/pdf", "image/jpeg", "image/png"].includes(
                                file.type
                            ) ||
                            file.size > 10 * 1024 * 1024
                        ) {
                            toast.error(t("invalidFileTypeOrSize"));
                            return;
                        }

                        setField("attachmentFile", file);

                        const uploaded = await handleFileUpload(file, "attachment");
                        if (uploaded) {
                            setFileList([uploaded]);
                            validateField(
                                "attachmentDescription",
                                formData.attachmentDescription
                            );
                        }
                    }}
                    placeholder={t("selectFile")}
                    error={errors.attachmentFile}
                />

                
                    <ClayForm.Group>
                        <CustomLocalizedInput
                            id="attachmentDescription_i18n"
                            name="attachmentDescription_i18n"
                            label={t("attachmentDescription")}
                            locales={locales}
                            selectedLocale={getLocaleObject(
                                localizedInputLocales.attachmentDescription
                            )}
                            onSelectedLocaleChange={(newLocale) =>
                                handleLocalizedInputLocaleChange(
                                    "attachmentDescription",
                                    newLocale
                                )
                            }
                            onTranslationsChange={(translations) =>
                                handleLocalizedInputChange(
                                    "attachmentDescription_i18n",
                                    translations
                                )
                            }
                            translations={formData.attachmentDescription_i18n}
                            disabled={isLoading}
                            className={errors.attachmentDescription ? "has-error" : ""}
                            placeholder={t("attachmentDescriptionPlaceholder")}
                            symbol="paperclip"
                            required
                        />

                        {errors.attachmentDescription && (
                            <div className="form-error">{errors.attachmentDescription}</div>
                        )}
                    </ClayForm.Group>
               

               
            </div>
             <div className="full-row">
                    <CustomLocalizedInput
                        name="notes_i18n"
                        label={t("notes")}
                        locales={locales}
                        selectedLocale={getLocaleObject(localizedInputLocales.notes)}
                        onSelectedLocaleChange={(newLocale) =>
                            handleLocalizedInputLocaleChange("notes", newLocale)
                        }
                        onTranslationsChange={(translations) =>
                            handleLocalizedInputChange("notes_i18n", translations)
                        }
                        translations={formData.notes_i18n}
                        disabled={isLoading}
                        error={errors.notes}
                        placeholder={t("NotesPlaceholder")}
                        symbol="document-text"
                        component="textarea"
                        rows={4}
                    />
                </div>
        </div>
    );
};

export default OperationalInfoSection;
