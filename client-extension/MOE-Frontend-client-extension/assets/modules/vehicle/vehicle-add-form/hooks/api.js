// API utilities
export const api = async (url, options = {}) => {
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

export const fetchPicklistOptions = async (listTypeDefinitionName) => {
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
        const mappedOptions = entriesData.items.map((entry) => ({
            value: entry.key,
            label: entry.name,
            name: entry.name,
            key: entry.key, // Store the key for comparison logic
            name_i18n: entry.name_i18n || {},
            entry: entry,
        }));

        return mappedOptions;
    } catch (error) {
        console.error(`Error fetching picklist ${listTypeDefinitionName}:`, error);
        return [];
    }
};

export const getPicklistOptions = async (listTypeDefinitionName) => {
    if (picklistCache[listTypeDefinitionName]) {
        return picklistCache[listTypeDefinitionName];
    }

    const options = await fetchPicklistOptions(listTypeDefinitionName);
    picklistCache[listTypeDefinitionName] = options;
    return options;
};

export const fetchAllUsers = async () => {
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
        return [];
    }
};

export const fetchDriverDataList = async (departmentFilter = null) => {
    try {
        let url = `o/c/driver-data-list/get-driver-data-list`;

        if (departmentFilter) {
            const encodedFilter = encodeURIComponent(`department eq '${departmentFilter}'`);
            url += `?filter=${encodedFilter}`;
        }

        const response = await api(url);

        if (!response.ok) {
            throw new Error("Failed to fetch driver data list");
        }

        const data = await response.json();
        return data.items.map((driver) => ({
            value: driver.id,
            label: `${driver.fullName || driver.name || "Driver"}`,
            name: driver.fullName || driver.name || "Driver",
            id: driver.id,
            email: driver.email || "",
            phone: driver.phone || "",
        }));
    } catch (error) {
        console.error("Error fetching driver data list:", error);
        return [];
    }
};

export const fetchCurrentUser = async () => {
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
            department: user.department || null,
        };
    } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
    }
};

export const fetchUserRoles = async (userId) => {
    try {
        const payload = {
            p_auth: Liferay.authToken,
            userId: userId,
        };

        const formData = new FormData();
        Object.keys(payload).forEach((key) => {
            formData.append(key, payload[key]);
        });

        const response = await api("api/jsonws/role/get-user-roles", {
            method: "POST",
            headers: {
                "x-csrf-token": Liferay.authToken,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user roles");
        }

        const rolesData = await response.json();
        return rolesData;
    } catch (error) {
        console.error("Error fetching user roles:", error);
        return [];
    }
};
