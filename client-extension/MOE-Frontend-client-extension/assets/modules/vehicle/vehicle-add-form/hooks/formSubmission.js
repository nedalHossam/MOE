/**
 * Build the API payload from form data
 * @param {Object} formData - The form data object
 * @param {boolean} isDraft - Whether this is a draft submission (default: false)
 * @returns {Object} The API payload
 */
export const buildApiPayload = (formData, isDraft = false) => {
    const apiData = {};

    // Set status to draft if it's a draft, otherwise use the selected status
    apiData.vehicleStatus = isDraft ? "Draft" : (formData.vehicleStatus || "Active");

    // Section A: Identity
    if (formData.plateNumber) apiData.plateNumber = formData.plateNumber;
    if (formData.vin) apiData.vin = formData.vin;
    if (formData.carYear) apiData.carYear = formData.carYear;
    if (formData.carBrand) apiData.carBrand = formData.carBrand;
    if (formData.carModel) apiData.carModel = formData.carModel;
    if (formData.color) apiData.carColor = formData.color;
    if (formData.carCategory) apiData.carCategory = formData.carCategory;
    if (formData.carClassification) apiData.carClassification = formData.carClassification;

    // Section B: License and insurance
    if (formData.licensedCapacitySeats) apiData.licensedCapacitySeats = formData.licensedCapacitySeats;
    if (formData.licensedCapacityKg) apiData.licensedCapacityKg = formData.licensedCapacityKg;
    if (formData.registrationNumber) apiData.registrationNumber = formData.registrationNumber;
    if (formData.registrationExpiryDate) apiData.registrationExpiryDate = formData.registrationExpiryDate;
    if (formData.insurancePolicyNumber) apiData.insurancePolicyNumber = formData.insurancePolicyNumber;
    if (formData.insuranceExpiryDate) apiData.insuranceExpiryDate = formData.insuranceExpiryDate;
    if (formData.licenseStatus) apiData.licenseStatus = formData.licenseStatus;
    if (formData.insuranceStatus) apiData.insuranceStatus = formData.insuranceStatus;
    if (formData.insurancePolicyType) apiData.insurancePolicyType = formData.insurancePolicyType;
    if (formData.insuranceCompany) apiData.insuranceCompany = formData.insuranceCompany;

    // Section C: Ownership
    if (formData.ownershipType) apiData.ownershipType = formData.ownershipType;
    if (formData.moeContractNumber) apiData.moeContractNumber = formData.moeContractNumber;
    if (formData.carValueMOE) apiData.carValueMoe = formData.carValueMOE;
    if (formData.vendorContractNumber) apiData.vendorContractNumber = formData.vendorContractNumber;
    if (formData.vendorsContactPerson) apiData.vendorsContactPerson = formData.vendorsContactPerson;
    if (formData.vendorsContactDetails) apiData.vendorsContactDetails = formData.vendorsContactDetails;
    if (formData.vendorYearlyValue) apiData.vendorYearlyValue = parseFloat(formData.vendorYearlyValue);
    if (formData.contractIncludesGas) apiData.contractIncludesGas = formData.contractIncludesGas === "Yes";

    // Section D: Operational info
    if (formData.telemetryID) apiData.telemetryID = formData.telemetryID;
    if (formData.fuelCardDeviceNumber) apiData.fuelCardDeviceNumber = formData.fuelCardDeviceNumber;
    if (formData.startingKM) apiData.startingKM = formData.startingKM;
    if (formData.monthlyKMLimit) apiData.monthlyKMLimit = formData.monthlyKMLimit;
    if (formData.monthlyGasLimit) apiData.monthlyGasLimit = formData.monthlyGasLimit;
    if (formData.fuelType) apiData.fuelType = formData.fuelType;
    if (formData.carLocationHome) apiData.carLocationHome = formData.carLocationHome;
    if (formData.currentLocation) apiData.currentLocation = formData.currentLocation;
    if (formData.department) apiData.department = formData.department;

    // Relationship fields
    if (formData.r_drivers_c_driverId && formData.r_drivers_c_driverId.length > 0) {
        // Extract the value from the selected option
        const driverValue = formData.r_drivers_c_driverId[0].value;
        apiData.r_drivers_c_driverId = driverValue;
    }
    if (formData.preferredAdministration) {
        apiData.r_preferredAdministration_userId = formData.preferredAdministration;
    }
    if (formData.preferredMOEEmployee && formData.preferredMOEEmployee.length > 0) {
        // Extract the value from the selected option
        const employeeValue = formData.preferredMOEEmployee[0].value;
        apiData.r_preferredMoeEmployee_userId = employeeValue;
    }

    // File attachments
    if (formData.attachments && formData.attachments.id) {
        apiData.attachments = formData.attachments.id;
    }

    return apiData;
};

