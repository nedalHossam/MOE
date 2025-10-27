import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

const api = async (url, options = {}) => {
    return fetch(window.location.origin + "/" + url, {
        headers: {
            "Content-Type": "application/json",
            "x-csrf-token": Liferay.authToken,
        },
        ...options,
    });
};

// Cache for picklist options
const picklistCache = {};

const fetchPicklistOptions = async (listTypeDefinitionName) => {
    try {
        const definitionsResponse = await api(`o/headless-admin-list-type/v1.0/list-type-definitions?filter=name eq '${listTypeDefinitionName}'`);

        if (!definitionsResponse.ok) {
            throw new Error("Failed to fetch list type definitions");
        }

        const definitionsData = await definitionsResponse.json();
        if (definitionsData.items.length === 0) {
            console.warn(`No list type definition found with name: ${listTypeDefinitionName}`);
            return [];
        }

        const definitionId = definitionsData.items[0].id;
        const entriesResponse = await api(`o/headless-admin-list-type/v1.0/list-type-definitions/${definitionId}/list-type-entries?pageSize=100`);

        if (!entriesResponse.ok) {
            throw new Error("Failed to fetch list type entries");
        }

        const entriesData = await entriesResponse.json();
        return entriesData.items.map((entry) => ({
            value: entry.key,
            label: entry.name,
            name: entry.name,
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

    const options = await fetchPicklistOptions(listTypeDefinitionName);
    picklistCache[listTypeDefinitionName] = options;
    return options;
};

// Fetch all users
const fetchAllUsers = async () => {
    try {
        const response = await api(`o/headless-admin-user/v1.0/user-accounts?pageSize=100`);

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        return data.items.map((user) => ({
            value: user.id,
            label: `${user.givenName} ${user.familyName} (${user.emailAddress})`,
            name: `${user.givenName} ${user.familyName}`,
            email: user.emailAddress,
            id: user.id,
        }));
    } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
        return [];
    }
};

// Fetch current user
const fetchCurrentUser = async () => {
    try {
        const response = await api(`o/headless-admin-user/v1.0/my-user-account`);

        if (!response.ok) {
            throw new Error("Failed to fetch current user");
        }

        const user = await response.json();
        return {
            id: user.id,
            givenName: user.givenName,
            familyName: user.familyName,
            emailAddress: user.emailAddress,
            fullName: `${user.givenName} ${user.familyName}`,
            screenName: user.screenName,
            roleBriefs: user.roleBriefs || [],
            circleID: user.circleID || null,
        };
    } catch (error) {
        console.error("Error fetching current user:", error);
        toast.error("Failed to load current user information");
        return null;
    }
};

export const useApiData = () => {
    const [picklistData, setPicklistData] = useState({
        driverStatus: [],
        licenseClass: [],
        licenseStatus: [],
        nationality: [],
        employerType: [],
        passengers: [],
        administrations: [],
    });
    const [currentUser, setCurrentUser] = useState(null);
    const [optionsLoading, setOptionsLoading] = useState(true);

    const fetchAllData = useCallback(async () => {
        try {
            setOptionsLoading(true);
            const [driverStatus, licenseClass, licenseStatus, nationality, employerType, allUsers, currentUserData] = await Promise.all([
                getPicklistOptions("DriverStatus-picklist"),
                getPicklistOptions("LicenseClass-picklist"),
                getPicklistOptions("LicenseStatus-picklist"),
                getPicklistOptions("Nationality-picklist"),
                getPicklistOptions("EmployerType-picklist"),
                fetchAllUsers(),
                fetchCurrentUser(),
            ]);

            setPicklistData({
                driverStatus,
                licenseClass,
                licenseStatus,
                nationality,
                employerType,
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
