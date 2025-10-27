import React from "react";
import ClayForm from "@clayui/form";
import { InputFileUpload, CustomLocalizedInput } from "../../../../components/ui";
import { locales } from "../constants";

const AttachmentsStep = ({
    formData,
    setField,
    handleLocalizedInputLocaleChange,
    handleLocalizedInputChange,
    handleFileUpload,
    setFileList,
    t,
    toast,
    localizedInputLocales,
}) => {
    // Helper function to get locale object by symbol
    const getLocaleObject = (symbol) => {
        return locales.find((loc) => loc.symbol === symbol) || locales[0];
    };

    return (
        <div className="step-content">
            <div className="form-grid form-grid-2">
                <InputFileUpload
                    label={t("attachments")}
                    name="attachments"
                    accept="application/pdf,image/jpeg,image/png"
                    onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type) || file.size > 10 * 1024 * 1024) {
                            toast.error(t("invalidFileType"));
                            return;
                        }
                        setField("attachments", file);
                        const uploaded = await handleFileUpload(file, "attachments");
                        if (uploaded) {
                            setFileList([uploaded]);
                        }
                    }}
                    placeholder={t("selectFile")}
                />

                <ClayForm.Group>
                    <CustomLocalizedInput
                        id="attachmentDescription_i18n"
                        name="attachmentDescription_i18n"
                        label={t("description")}
                        locales={locales}
                        selectedLocale={getLocaleObject(localizedInputLocales.attachmentDescription)}
                        onSelectedLocaleChange={(newLocale) => handleLocalizedInputLocaleChange("attachmentDescription", newLocale)}
                        onTranslationsChange={(translations) => handleLocalizedInputChange("attachmentDescription_i18n", translations)}
                        translations={formData.attachmentDescription_i18n}
                        value={formData.attachmentDescription}
                        placeholder={t("attachmentDescriptionPlaceholder")}
                        rows={4}
                        symbol="document-text"
                    />
                </ClayForm.Group>
            </div>
        </div>
    );
};

export default AttachmentsStep;
