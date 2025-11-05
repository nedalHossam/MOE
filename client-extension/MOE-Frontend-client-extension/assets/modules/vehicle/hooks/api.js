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

export const getVehicleById = async (vehicleId) => {
    try {
        if (!vehicleId) {
            console.warn("Vehicle ID is required");
            return null;
        }

        const response = await api(`o/c/vehicles/${vehicleId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch vehicle");
        }

        const vehicleData = await response.json();
        return vehicleData;
    } catch (error) {
        console.error("Error fetching vehicle by ID:", error);
        return null;
    }
};

export const getVehicleList = async (page, pageSize , search = '', sort = null, filters = {}) => {
    try {
        const urlParams = new URLSearchParams();
        urlParams.append('page', page);
        urlParams.append('pageSize', pageSize);
        
        // Add search parameter if provided
        if (search && search.trim()) {
            urlParams.append('search', search.trim());
        }
        
        // Add sort parameter if provided (format: field:order, e.g., "id:asc" or "plateNumber:desc")
        if (sort) {
            urlParams.append('sort', sort);
        }
        
        // Build filter query string
        const filterExpressions = [];
        
        // Map filter fields to API field names
        const filterFieldMap = {
            status: 'vehicleStatus',
            brand: 'carBrand',
            model: 'carModel',
            category: 'carCategory',
            location: 'currentLocation',
            department: 'department'
        };
        
        // Add simple equality filters
        Object.keys(filterFieldMap).forEach((filterKey) => {
            if (filters[filterKey] && filters[filterKey].trim()) {
                const apiField = filterFieldMap[filterKey];
                filterExpressions.push(`${apiField} eq '${filters[filterKey].trim()}'`);
            }
        });
        
        // Add year range filter (carYear)
        if (filters.yearFrom || filters.yearTo) {
            if (filters.yearFrom && filters.yearTo) {
                filterExpressions.push(`carYear ge ${filters.yearFrom} and carYear le ${filters.yearTo}`);
            } else if (filters.yearFrom) {
                filterExpressions.push(`carYear ge ${filters.yearFrom}`);
            } else if (filters.yearTo) {
                filterExpressions.push(`carYear le ${filters.yearTo}`);
            }
        }
        
        // Add registration expiry date range filter
        if (filters.registrationExpiryFrom || filters.registrationExpiryTo) {
            if (filters.registrationExpiryFrom && filters.registrationExpiryTo) {
                filterExpressions.push(`registrationExpiryDate ge ${filters.registrationExpiryFrom} and registrationExpiryDate le ${filters.registrationExpiryTo}`);
            } else if (filters.registrationExpiryFrom) {
                filterExpressions.push(`registrationExpiryDate ge ${filters.registrationExpiryFrom}`);
            } else if (filters.registrationExpiryTo) {
                filterExpressions.push(`registrationExpiryDate le ${filters.registrationExpiryTo}`);
            }
        }
        
        // Add insurance expiry date range filter
        if (filters.insuranceExpiryFrom || filters.insuranceExpiryTo) {
            if (filters.insuranceExpiryFrom && filters.insuranceExpiryTo) {
                filterExpressions.push(`insuranceExpiryDate ge ${filters.insuranceExpiryFrom} and insuranceExpiryDate le ${filters.insuranceExpiryTo}`);
            } else if (filters.insuranceExpiryFrom) {
                filterExpressions.push(`insuranceExpiryDate ge ${filters.insuranceExpiryFrom}`);
            } else if (filters.insuranceExpiryTo) {
                filterExpressions.push(`insuranceExpiryDate le ${filters.insuranceExpiryTo}`);
            }
        }
        
        // Add filter parameter if we have any filter expressions
        if (filterExpressions.length > 0) {
            const filterQuery = filterExpressions.join(' and ');
            urlParams.append('filter', filterQuery);
        }
        
        const response = await api(`o/c/vehicles?${urlParams.toString()}`);
        if (!response.ok) {
            throw new Error("Failed to fetch vehicle data list");
        }
        const data = await response.json();
        console.log("vehicle list", data);
        
        // Return both items and pagination metadata
        return {
            items: data.items || [],
            pagination: {
                page: data.page || page,
                pageSize: data.pageSize || pageSize,
                lastPage: data.lastPage || 1,
                totalCount: data.totalCount || 0
            }
        };
    } catch (error) {
        console.error("Error fetching vehicle data list:", error);
        return {
            items: [],
            pagination: {
                page: page,
                pageSize: pageSize,
                lastPage: 1,
                totalCount: 0
            }
        };
    }
};
