import React from "react";
import FormField from "../FormField/FormField";

const LicenseInfoSection = ({ formData, errors, setField, picklistData, optionsLoading, isLoading }) => {
    return (
        <div id="license-info" className="form-section">
            <h3 className="section-title">Section C: License</h3>
            <div className="form-grid form-grid-2">
                <FormField
                    type="text"
                    label="License number"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(value) => setField("licenseNumber", value)}
                    error={errors.licenseNumber}
                    placeholder="Enter license number"
                    required={true}
                />

                <FormField
                    type="select"
                    label="License class"
                    name="licenseClass"
                    value={formData.licenseClass}
                    onChange={(value) => setField("licenseClass", value)}
                    options={picklistData.licenseClass}
                    error={errors.licenseClass}
                    isLoading={optionsLoading}
                    disabled={optionsLoading}
                    placeholder="Select license class..."
                    required={true}
                />

                <FormField
                    type="date"
                    label="License expiry"
                    name="licenseExpiry"
                    value={formData.licenseExpiry}
                    onChange={(value) => setField("licenseExpiry", value)}
                    error={errors.licenseExpiry}
                    required={true}
                />

                <FormField
                    type="text"
                    label="License Status"
                    name="licenseStatus"
                    value={formData.licenseStatus || "Valid"}
                    onChange={() => {}} // Read-only
                    disabled={true}
                    placeholder="Computed automatically"
                />
            </div>
        </div>
    );
};

export default LicenseInfoSection;
