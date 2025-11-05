import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import api from "../../../utils/apiConfig";
import { fetchCurrentUser, fetchAllUsers } from "../../../utils/userServices";
// Cache for picklist options
const picklistCache = {};

const fetchPicklistOptions = async (listTypeDefinitionName) => {
    try {
        const { data: definitionsData } = await api.get(
            `headless-admin-list-type/v1.0/list-type-definitions?filter=name eq '${listTypeDefinitionName}'`
        );

        if (!definitionsData.items.length) {
            console.warn(
                `No list type definition found with name: ${listTypeDefinitionName}`
            );
            return [];
        }

        const definitionId = definitionsData.items[0].id;
        const { data: entriesData } = await api.get(
            `headless-admin-list-type/v1.0/list-type-definitions/${definitionId}/list-type-entries?pageSize=100`
        );

        return entriesData.items.map((entry) => ({
            value: entry.key,
            label: entry.name,
            name: entry.name,
            key: entry.key,
            name_i18n: entry.name_i18n || {},
            entry,
        }));
    } catch (error) {
        console.error(`Error fetching picklist ${listTypeDefinitionName}:`, error);
        toast.error(`Failed to load ${listTypeDefinitionName} options`);
        return [];
    }
};

const getPicklistOptions = async (listTypeDefinitionName) => {
    if (picklistCache[listTypeDefinitionName]) {
        return picklistCache[listTypeDefinitionName];
    }
    // here fetch the pick list -------------------
    const options = await fetchPicklistOptions(listTypeDefinitionName);
    picklistCache[listTypeDefinitionName] = options;
    return options;
};


export const useApiData = () => {
    const [picklistData, setPicklistData] = useState({
        DriverStatus: [],
        LicenseClass: [],
        LicenseStatus: [],
        Nationality: [],
        EmployeeType: [],
        Department: [],
    });
    const [currentUser, setCurrentUser] = useState(null);
    const [optionsLoading, setOptionsLoading] = useState(true);

    const fetchAllData = useCallback(async () => {
        try {
            setOptionsLoading(true);
            const [
                driverStatus,
                licenseClass,
                licenseStatus,
                nationality,
                employeeType,
                department,
                allUsers,
                currentUserData,
            ] = await Promise.all([
                getPicklistOptions("DriverStatus"),
                getPicklistOptions("LicenseClass"),
                getPicklistOptions("LicenseStatus"),
                getPicklistOptions("Nationality"),
                getPicklistOptions("EmployeeType"),
                getPicklistOptions("Department"),
                fetchAllUsers(),
                fetchCurrentUser(),
            ]);

            setPicklistData({
                driverStatus,
                licenseClass,
                licenseStatus,
                nationality,
                employeeType,
                department,
                passengers: allUsers,
                administrations: allUsers,
            });

            setCurrentUser(currentUserData);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load some data");
        } finally {
            setOptionsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    return {
        picklistData,
        currentUser,
        optionsLoading,
        refetchData: fetchAllData,
    };
};
