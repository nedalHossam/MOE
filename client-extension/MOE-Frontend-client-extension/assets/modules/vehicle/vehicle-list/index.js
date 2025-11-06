import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactDOM from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "@clayui/core";
import "@clayui/css/lib/css/atlas.css";
import "./style.css";
import { useTranslation } from "../../../utils/translations";
import { Table, SearchInput, Button } from "../../../components/ui";
import ClayIcon from "@clayui/icon";
import { getVehicleList } from "../hooks/api";
import FilterForm from "./components/filter-form";
import { getVehicleColumns } from "./components/data-columns";

const VehicleList = () => {
    const { t, currentLanguage, direction } = useTranslation();
    const [vehicles, setVehicles] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 2,
        lastPage: 1,
        totalCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [tablePage, setTablePage] = useState(1);
    const [tablePageSize, setTablePageSize] = useState(2);
    const [tableSort, setTableSort] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({});
    const spritemap = `${Liferay.ThemeDisplay.getPathThemeImages()}/clay/icons.svg`;
    const isInitializedRef = useRef(false);
    const lastPageRef = useRef(1); // Track the last page to prevent unwanted resets
    const isChangingPageSizeRef = useRef(false); // Track if we're in the middle of a pageSize change

    // Initialize state from URL parameters on mount and set defaults if missing
    useEffect(() => {
        // Prevent re-initialization if already initialized
        if (isInitializedRef.current) {
            return;
        }
        const urlParams = new URLSearchParams(window.location.search);
        let urlUpdated = false;

        // Initialize search value from URL
        const searchParam = urlParams.get('search');
        if (searchParam) {
            setSearchValue(searchParam);
        }

        // Initialize page from URL (default: 1)
        let page = 1;
        const pageParam = urlParams.get('page');
        if (pageParam) {
            const parsedPage = parseInt(pageParam, 10);
            if (!isNaN(parsedPage) && parsedPage > 0) {
                page = parsedPage;
            }
        } else {
            // Set default page to 1 in URL if not present
            urlParams.set('page', '1');
            urlUpdated = true;
        }

        // Initialize page size from URL (default: 2)
        let pageSize = 2;
        const pageSizeParam = urlParams.get('pageSize');
        if (pageSizeParam) {
            const parsedPageSize = parseInt(pageSizeParam, 10);
            if (!isNaN(parsedPageSize) && parsedPageSize > 0) {
                pageSize = parsedPageSize;
            }
        } else {
            // Set default pageSize to 2 in URL if not present
            urlParams.set('pageSize', '2');
            urlUpdated = true;
        }
        
        // Set both page and pageSize together to avoid race conditions
        setTablePageSize(pageSize);
        setTablePage(page);
        lastPageRef.current = page; // Initialize ref

        // Initialize sort from URL using sortBy and sortOrder parameters
        const sortByParam = urlParams.get('sortBy');
        const sortOrderParam = urlParams.get('sortOrder');
        if (sortByParam) {
            setTableSort({
                column: sortByParam,
                direction: sortOrderParam || 'ascending'
            });
        }

        // Update URL with default parameters if they were missing
        if (urlUpdated) {
            const newUrl = `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`;
            window.history.replaceState({}, '', newUrl);
        }

        isInitializedRef.current = true;
    }, []);


    // Use a ref to track tablePage to avoid stale closures
    const tablePageRef = useRef(tablePage);
    useEffect(() => {
        tablePageRef.current = tablePage;
    }, [tablePage]);

    // Use refs to track sort state to avoid stale closures
    const tableSortRef = useRef(tableSort);
    useEffect(() => {
        tableSortRef.current = tableSort;
    }, [tableSort]);

    useEffect(() => {
        if (!isInitializedRef.current) {
            return;
        }

        const handlePopState = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const pageParam = urlParams.get('page');
            if (pageParam) {
                const parsedPage = parseInt(pageParam, 10);
                const currentPage = tablePageRef.current;
                // Only sync if page is valid and different from current
                if (!isNaN(parsedPage) && parsedPage > 0 && parsedPage !== currentPage) {
                    console.log(`Browser navigation detected: syncing page from URL ${parsedPage} (current: ${currentPage})`);
                    lastPageRef.current = parsedPage;
                    setTablePage(parsedPage);
                }
            }
            
            // Sync sort from URL on browser navigation (using sortBy and sortOrder)
            const sortByParam = urlParams.get('sortBy');
            const sortOrderParam = urlParams.get('sortOrder');
            const currentSort = tableSortRef.current;
            if (sortByParam) {
                const newSort = { 
                    column: sortByParam, 
                    direction: sortOrderParam || 'ascending' 
                };
                // Only update if different from current
                if (!currentSort || currentSort.column !== newSort.column || currentSort.direction !== newSort.direction) {
                    console.log(`Browser navigation detected: syncing sort from URL sortBy=${sortByParam}, sortOrder=${sortOrderParam}`);
                    setTableSort(newSort);
                }
            } else if (currentSort) {
                // Clear sort if not in URL
                console.log(`Browser navigation detected: clearing sort (not in URL)`);
                setTableSort(null);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Map table column keys to API field names for sorting
    const mapColumnToApiField = (columnKey) => {
        const columnToApiFieldMap = {
            'vehicleNumber': 'id', // vehicleNumber is derived from id
            'plateNumber': 'plateNumber',
            'brandModel': 'carBrand', // Sort by brand first, can be changed to carModel if needed
            'year': 'carYear',
            'category': 'carCategory',
            'registrationNumber': 'registrationNumber',
            'insuranceExpiryDate': 'insuranceExpiryDate',
            'location': 'currentLocation', // Can be changed to carLocationHome if needed
            'status': 'vehicleStatus'
        };
        return columnToApiFieldMap[columnKey] || columnKey;
    };

    // Helper function to convert tableSort format to API sort format
    const getSortParam = (sort) => {
        if (!sort || !sort.column) {
            return null;
        }
        // Map table column key to API field name
        const apiField = mapColumnToApiField(sort.column);
        // Convert table format (ascending/descending) to API format (asc/desc)
        const order = sort.direction === 'descending' ? 'desc' : 'asc';
        return `${apiField}:${order}`;
    };

    // Fetch vehicle data when page, pageSize, search, or sort changes
    useEffect(() => {
        // Skip if component hasn't initialized yet
        if (!isInitializedRef.current) {
            console.log(`Skipping fetch: component not yet initialized`);
            return;
        }

        const fetchVehicles = async () => {
            try {
                setLoading(true);
                
                // CRITICAL FIX: Use lastPageRef for the most up-to-date page value
                const currentPage = lastPageRef.current;
                const currentPageSize = tablePageSize || 2;
                const currentSearch = searchValue || '';
                const sortParam = getSortParam(tableSort);
                
                console.log(`🔄 Fetching: page=${currentPage}, pageSize=${currentPageSize}, isChangingPageSize=${isChangingPageSizeRef.current}`);
                
                const response = await getVehicleList(currentPage, currentPageSize, currentSearch, sortParam, filters);
                
                // Extract pagination data from response (handle both response.pagination and top-level properties)
                const responseLastPage = response?.pagination?.lastPage || response?.lastPage || 1;
                const responseTotalCount = response?.pagination?.totalCount || response?.totalCount || 0;
                
                console.log(`vehicle listttttttt`, response, currentPage, currentPageSize);
                
                setVehicles(response.items || []);
                
                // Always use the REQUESTED page and pageSize, not what the API returns
                setPagination({
                    page: currentPage,
                    pageSize: currentPageSize,
                    lastPage: responseLastPage,
                    totalCount: responseTotalCount
                });
                
                // CRITICAL FIX: Only validate if NOT changing page size
                if (!isChangingPageSizeRef.current && currentPage > responseLastPage && responseLastPage > 0) {
                    console.log(`⚠️ Page ${currentPage} exceeds lastPage ${responseLastPage}, resetting to ${responseLastPage}`);
                    lastPageRef.current = responseLastPage;
                    setTablePage(responseLastPage);
                    
                    const urlParams = new URLSearchParams(window.location.search);
                    urlParams.set('page', responseLastPage);
                    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`);
                }
                
                // Reset the flag after fetch completes
                isChangingPageSizeRef.current = false;

            } catch (error) {
                console.error("Error fetching vehicles:", error);
                toast.error(t("failedToFetchVehicles") || "Failed to fetch vehicles");
                // Reset flag even on error
                isChangingPageSizeRef.current = false;
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tablePage, tablePageSize, searchValue, tableSort, filters]);

    // Helper function to get localized value from i18n object
    const getLocalizedValue = (field, currentLang = currentLanguage) => {
        if (!field) return "";

        // If it's an object with i18n property
        if (field.i18n && typeof field.i18n === 'object') {
            const langKey = currentLang === 'ar-SA' ? 'ar_SA' : 'en_US';
            return field.i18n[langKey] || field.name || field.key || "";
        }

        // If it's an object with name property
        if (field.name) {
            return field.name;
        }

        // If it's a string, return as is
        if (typeof field === 'string') {
            return field;
        }

        // If it's an object with key property
        if (field.key) {
            return field.key;
        }

        return "";
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "";
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        } catch (error) {
            return dateString;
        }
    };

    // Helper function to format kilometers
    const formatKilometers = (km) => {
        if (!km) return "";
        const numKm = typeof km === 'number' ? km : parseInt(km, 10);
        if (isNaN(numKm)) return "";
        // Format with Arabic-Indic numerals if Arabic, otherwise use Western numerals
        if (currentLanguage === 'ar-SA') {
            return numKm.toLocaleString('ar-SA') + ' كيلومتر';
        }
        return numKm.toLocaleString('en-US') + ' km';
    };

    // Helper function to format seats
    const formatSeats = (seats) => {
        if (!seats) return "";
        const numSeats = typeof seats === 'number' ? seats : parseInt(seats, 10);
        if (isNaN(numSeats)) return "";
        if (currentLanguage === 'ar-SA') {
            return numSeats + ' مقاعد';
        }
        return numSeats + ' Seats';
    };

    // Map API vehicle data to table row format
    const mappedVehicles = useMemo(() => {
        return vehicles.map((vehicle, index) => {
            // Generate vehicle number (you may want to use a different field from API)
            const vehicleNumber = vehicle.id ? String(vehicle.id).padStart(4, '0') : String(index + 1).padStart(4, '0');

            return {
                id: vehicle.id || index,
                vehicleNumber: vehicleNumber,
                plateNumber: vehicle.plateNumber || "",
                brandModel: vehicle.carBrand && vehicle.carModel
                    ? `${getLocalizedValue(vehicle.carBrand)} ${getLocalizedValue(vehicle.carModel)}`
                    : getLocalizedValue(vehicle.carBrand) || getLocalizedValue(vehicle.carModel) || "",
                year: vehicle.carYear || "",
                category: getLocalizedValue(vehicle.carCategory) || "",
                seats: formatSeats(vehicle.licensedCapacitySeats),
                registrationNumber: vehicle.registrationNumber || "",
                insuranceExpiryDate: formatDate(vehicle.insuranceExpiryDate),
                kilometers: formatKilometers(vehicle.currentKM || vehicle.startingKM),
                location: getLocalizedValue(vehicle.currentLocation) || getLocalizedValue(vehicle.carLocationHome) || "",
                status: getLocalizedValue(vehicle.vehicleStatus) || "Active",
                // Store original vehicle for actions
                originalVehicle: vehicle
            };
        });
    }, [vehicles, currentLanguage]);

    // Use mapped vehicles directly (filtering is done server-side)
    // Only filter client-side if needed for additional local filtering
    const filteredVehicles = useMemo(() => {
         return mappedVehicles;
    }, [mappedVehicles]);

    // Table columns configuration
    const vehicleColumns = useMemo(() => {
        return getVehicleColumns(currentLanguage);
    }, [currentLanguage]);

    // Table event handlers
    const handleTablePageChange = (page) => {
        console.log(`📄 Page change requested: ${page} (current: ${tablePage})`);
        
        // Prevent setting to the same page
        if (page === tablePage) {
            console.log(`Skipping page change: already on page ${page}`);
            return;
        }
        
        // Update ref to track intended page BEFORE state update
        lastPageRef.current = page;
        
        // Update state
        setTablePage(page);
        console.log(`📄 Page change requested: ${page} (current: ${tablePage})`);

        // Update URL
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('page', page);
        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`);
    };

    const handleTablePageSizeChange = (pageSize) => {
        console.log(`📏 Page size change requested: ${pageSize}`);
        
        // CRITICAL FIX: Set flag BEFORE any state changes
        isChangingPageSizeRef.current = true;
        
        // Reset to page 1
        lastPageRef.current = 1;
        setTablePage(1);
        setTablePageSize(pageSize);
        
        // Update URL
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('pageSize', pageSize);
        urlParams.set('page', '1');
        window.history.pushState({}, '', `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`);
    };

    const handleTableSortChange = (sort) => {
        // Update sort state
        setTableSort(sort);
        // Reset to page 1 when sort changes
        setTablePage(1);
        lastPageRef.current = 1;
        
        // Update URL with sortBy and sortOrder parameters (not sort parameter)
        const urlParams = new URLSearchParams(window.location.search);
        if (sort && sort.column) {
            urlParams.set('sortBy', sort.column);
            urlParams.set('sortOrder', sort.direction || 'ascending');
            // Remove old sort parameter if it exists
            urlParams.delete('sort');
        } else {
            // Remove sort parameters if sort is cleared
            urlParams.delete('sortBy');
            urlParams.delete('sortOrder');
            urlParams.delete('sort');
        }
        // Reset page to 1 in URL
        urlParams.set('page', '1');
        const newUrl = `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`;
        window.history.replaceState({}, '', newUrl);
    };

    const handleRowAction = (action, row) => {
        const vehicle = row.originalVehicle;
        if (action === 'details') {
            // Navigate to vehicle details page or open modal
            toast.info(currentLanguage === 'ar-SA' ? 'عرض تفاصيل المركبة' : `Viewing details for vehicle: ${row.brandModel}`);
        } else if (action === 'edit') {
            // Navigate to vehicle edit page
            const editUrl = `/vehicle-add-form-reactjs?vehicleId=${vehicle.id}`;
            window.location.href = editUrl;
        }
    };

    const handleCreateVehicle = () => {
        // Navigate to vehicle add form
        window.location.href = '/vehicle-add-form-reactjs';
    };

    const handleFilterClick = () => {
        setShowFilter(!showFilter);
    };

    const handleFilterClose = () => {
        setShowFilter(false);
    };

    const handleFilterApply = (filterValues) => {
        setFilters(filterValues);
        setTablePage(1); // Reset to page 1 when filters change
        lastPageRef.current = 1;
        setShowFilter(false);
    };

    // Actions menu configuration
    const actions = [
        {
            key: 'details',
            label: currentLanguage === 'ar-SA' ? 'تفاصيل المركبة' : 'Vehicle Details'
        },
        {
            key: 'edit',
            label: currentLanguage === 'ar-SA' ? 'تعديل المركبة' : 'Edit Vehicle'
        }
    ];

    if (loading) {
        return (
            <Provider spritemap={spritemap}>
                <div className="vehicle-list-container" dir={direction}>
                    <div className="loading-container">
                        <p>{currentLanguage === 'ar-SA' ? 'جاري التحميل...' : 'Loading...'}</p>
                    </div>
                </div>
            </Provider>
        );
    }

    return (
        <Provider spritemap={spritemap}>
            <div className="vehicle-list-container" dir={direction}>
            <div className="vehicle-table-container" >
                {/* Page Header */}

                <div className="vehicle-list-header">
                    <div className="header-titles">
                        <h2 className="sub-title">{currentLanguage === 'ar-SA' ? 'إدارة النقل' : 'Transport Management'}</h2>
                        <h1 className="main-title">{currentLanguage === 'ar-SA' ? 'المركبات' : 'Vehicles'}</h1>
                    </div>
                    <Button
                        btnStyle="btn-main-primary"
                        onClick={handleCreateVehicle}
                        className="create-vehicle-btn"
                    >
                        <ClayIcon symbol="plus" className="mr-2" spritemap={spritemap} />
                        {currentLanguage === 'ar-SA' ? 'انشاء مركبة جديدة' : 'Create New Vehicle'}
                    </Button>
                </div>

                {/* Action Bar */}
                <div className="vehicle-list-actions">
                    <div className="actions-grid">

                        <SearchInput
                            value={searchValue}
                            onChange={(e) => {
                            }}
                            onSearch={(value) => {
                                // This is called after debounce delay - only update searchValue here
                                setSearchValue(value);
                                // Reset to page 1 when search changes
                                lastPageRef.current = 1;
                                setTablePage(1);
                            }}
                            debounceDelay={2000}
                            searchWord="search"
                            placeholder={currentLanguage === 'ar-SA' ? 'ابحث هنا' : 'Search here'}
                            spritemap={spritemap}
                        />
                    <Button
                        btnStyle="btn-main-secondary"
                        onClick={handleFilterClick}
                        className="filter-btn"
                    >
                        <ClayIcon symbol="filter" className="mr-2" spritemap={spritemap} />
                        {currentLanguage === 'ar-SA' ? 'تصفية' : 'Filter'}
                    </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="vehicle-list-table-container">
                    <Table
                        items={filteredVehicles}
                        columns={vehicleColumns}
                        page={tablePage}
                        pageSize={tablePageSize }
                        onPageChange={handleTablePageChange}
                        onPageSizeChange={handleTablePageSizeChange}
                        onSortChange={handleTableSortChange}
                        sort={tableSort}
                        totalItems={pagination.totalCount}
                        onRowAction={handleRowAction}
                        showActions={true}
                        actions={actions}
                        deltas={[
                            { label: 5 },
                            { label: 10 },
                            { label: 20 },
                            { label: 50 }
                        ]}
                        spritemap={spritemap}
                    />
                </div>

                {/* Filter Sidebar Overlay */}
                {showFilter && (
                    <div 
                        className={`filter-sidebar-overlay ${showFilter ? 'active' : ''}`}
                        onClick={handleFilterClose}
                    />
                )}

                {/* Filter Sidebar */}
                {showFilter && (
                    <FilterForm
                        onFilter={handleFilterApply}
                        onClose={handleFilterClose}
                        currentLanguage={currentLanguage}
                        direction={direction}
                        spritemap={spritemap}
                    />
                )}

                {/* Toast Container */}
                <ToastContainer
                    position={currentLanguage === 'ar-SA' ? 'top-left' : 'top-right'}
                    autoClose={5000}
                    hideProgressBar={false}
                    rtl={direction === 'rtl'}
                />
            </div>
            </div>
        </Provider>
    );
};

class CustomElement extends HTMLElement {
    connectedCallback() {
        ReactDOM.render(
            <React.StrictMode>
                <VehicleList />
            </React.StrictMode>,
            this
        );
    }

    disconnectedCallback() {
        ReactDOM.unmountComponentAtNode(this);
    }
}

const ELEMENT_NAME = "vehicle-list-reactjs";
if (!customElements.get(ELEMENT_NAME)) {
    customElements.define(ELEMENT_NAME, CustomElement);
}
