import React from "react";
import FormField from "../FormField/FormField";

const AttachmentSection = ({
    formData,
    errors,
    setField,
    handleFileUpload,
    validateField,
    isLoading,
    locales,
    localizedInputLocales,
    handleLocalizedInputLocaleChange,
    handleLocalizedInputChange,
    getLocaleObject,
}) => {
    return (
        <div id="attachment" className="form-section">
            <h3 className="section-title">Section E: Attachment</h3>
            <div className="form-grid form-grid-2">
                <div className="full-row">
                    <FormField
                        type="file"
                        label="Attachment: File"
                        name="attachmentFile"
                        onChange={async (e) => {
                            const file = e.target.files && e.target.files[0];
                            if (!file) return;
                            if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type) || file.size > 10 * 1024 * 1024) {
                                toast.error("Invalid file type or size.");
                                return;
                            }
                            setField("attachmentFile", file);
                            const uploaded = await handleFileUpload(file, "attachment");
                            if (uploaded) {
                                setFileList([uploaded]);
                                validateField("attachmentDescription", formData.attachmentDescription);
                            }
                        }}
                        accept="application/pdf,image/jpeg,image/png"
                    />
                </div>

                <div className="full-row">
                    <FormField
                        type="localized"
                        name="attachmentDescription_i18n"
                        label="Attachment: Description"
                        locales={locales}
                        selectedLocale={getLocaleObject(localizedInputLocales.attachmentDescription)}
                        onSelectedLocaleChange={(newLocale) => handleLocalizedInputLocaleChange("attachmentDescription", newLocale)}
                        onTranslationsChange={(translations) => handleLocalizedInputChange("attachmentDescription_i18n", translations)}
                        translations={formData.attachmentDescription_i18n}
                        disabled={isLoading}
                        error={errors.attachmentDescription}
                        placeholder="Enter attachment description"
                        symbol="paperclip"
                    />
                </div>
            </div>
        </div>
    );
};

export default AttachmentSection;
