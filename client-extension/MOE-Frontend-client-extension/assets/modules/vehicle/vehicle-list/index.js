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
    
    // Initialize state from URL parameters immediately
    const getInitialStateFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Get page from URL, default to 1
        const pageParam = urlParams.get('page');
        const initialPage = pageParam ? (() => {
            const pageNum = parseInt(pageParam, 10);
            return !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;
        })() : 1;
        
        // Get pageSize from URL, default to 5
        const pageSizeParam = urlParams.get('pageSize');
        const initialPageSize = pageSizeParam ? (() => {
            const pageSizeNum = parseInt(pageSizeParam, 10);
            return !isNaN(pageSizeNum) && pageSizeNum > 0 ? pageSizeNum : 10;
        })() : 10;
        
        // Get search from URL
        const searchParam = urlParams.get('search');
        const initialSearch = searchParam || "";
        
        // Get sort from URL
        const sortByParam = urlParams.get('sortBy');
        const sortOrderParam = urlParams.get('sortOrder');
        const initialSort = sortByParam ? {
            column: sortByParam,
            direction: sortOrderParam || 'ascending'
        } : null;
        
        return {
            page: initialPage,
            pageSize: initialPageSize,
            search: initialSearch,
            sort: initialSort
        };
    };
    
    const initialState = getInitialStateFromURL();
    
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState(initialState.search);
    const [tableSort, setTableSort] = useState(initialState.sort);
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(initialState.page);
    const [pageSize, setPageSize] = useState(initialState.pageSize);
    const [totalCount, setTotalCount] = useState(0);
    const spritemap = `${Liferay.ThemeDisplay.getPathThemeImages()}/clay/icons.svg`;
    const isInitializedRef = useRef(false);

    // Mark as initialized on mount (state already initialized from URL)
    useEffect(() => {
        if (!isInitializedRef.current) {
            console.log("Component initialized with URL params:", {
                page,
                pageSize,
                search: searchValue,
                sort: tableSort
            });
            isInitializedRef.current = true;
        }
    }, []);


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

            // Sync page from URL on browser navigation
            const pageParam = urlParams.get('page');
            if (pageParam) {
                const pageNum = parseInt(pageParam, 10);
                if (!isNaN(pageNum) && pageNum > 0) {
                    setPage(pageNum);
                }
            } else {
                setPage(1);
            }

            // Sync pageSize from URL on browser navigation
            const pageSizeParam = urlParams.get('pageSize');
            if (pageSizeParam) {
                const pageSizeNum = parseInt(pageSizeParam, 10);
                if (!isNaN(pageSizeNum) && pageSizeNum > 0) {
                    setPageSize(pageSizeNum);
                }
            } else {
                setPageSize(10);
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

    // Track if this is the first render after initialization
    const isFirstRenderRef = useRef(true);
    
    // Reset to page 1 when search, sort, or filters change (but not on initial mount)
    useEffect(() => {
        if (!isInitializedRef.current) {
            return;
        }
        
        // Skip reset on first render after initialization (to preserve URL page parameter)
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false;
            return;
        }
        
        // Reset to page 1 when filters/search/sort change
        setPage(1);
    }, [searchValue, tableSort, filters]);

    // Fetch vehicle data when search, sort, filters, page, or pageSize change
    useEffect(() => {
        // Skip if component hasn't initialized yet
        if (!isInitializedRef.current) {
            console.log(`Skipping fetch: component not yet initialized`);
            return;
        }

        const fetchVehicles = async () => {
            try {
                setLoading(true);
                
                const currentSearch = searchValue || '';
                const sortParam = getSortParam(tableSort);
                
                // Fetch vehicles with current pagination
                const response = await getVehicleList(page, pageSize, currentSearch, sortParam, filters);
                
                console.log(`vehicle list`, response);
                
                setVehicles(response.items || []);
                setTotalCount(response.pagination?.totalCount || 0);

            } catch (error) {
                console.error("Error fetching vehicles:", error);
                toast.error(t("failedToFetchVehicles") || "Failed to fetch vehicles");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue, tableSort, filters, page, pageSize]);

    const getLanguageKey = (lang) => (lang === 'ar-SA' ? 'ar_SA' : 'en_US');

    const extractDisplayValue = (value) => {
        if (!value) return "";
        if (typeof value === "string") return value;
        if (typeof value === "object") {
            return value.name || value.label || value.title || value.value || value.key || "";
        }
        return "";
    };

    // Helper function to get localized value from i18n object
    const getLocalizedValue = (field, currentLang = currentLanguage) => {
        if (!field) return "";

        const langKey = getLanguageKey(currentLang);

        // If it's an object with i18n property
        if (field.i18n && typeof field.i18n === 'object') {
            const localizedEntry =
                field.i18n[langKey] ||
                (field.defaultLanguageId && field.i18n[field.defaultLanguageId]) ||
                field.i18n.en_US ||
                field.i18n.ar_SA ||
                field.i18n[currentLang];

            const localizedValue = extractDisplayValue(localizedEntry);
            if (localizedValue) {
                return localizedValue;
            }
        }

        // If it's a map of locales
        if (typeof field === 'object') {
            const localizedEntry =
                field[langKey] ||
                field[currentLang] ||
                (field.defaultLanguageId && field[field.defaultLanguageId]) ||
                field.en_US ||
                field.ar_SA;

            const localizedValue = extractDisplayValue(localizedEntry);
            if (localizedValue) {
                return localizedValue;
            }
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

    const getLocalizedFieldValue = (record, fieldName, currentLang = currentLanguage) => {
        if (!record || !fieldName) return "";

        const langKey = getLanguageKey(currentLang);
        const localizedMap = record[`${fieldName}_i18n`];

        if (localizedMap && typeof localizedMap === "object") {
            const localizedEntry =
                localizedMap[langKey] ||
                localizedMap[currentLang] ||
                (record.defaultLanguageId && localizedMap[record.defaultLanguageId]) ||
                localizedMap.en_US ||
                localizedMap.ar_SA;

            const localizedValue = extractDisplayValue(localizedEntry);
            if (localizedValue) {
                return localizedValue;
            }
        }

        return getLocalizedValue(record[fieldName], currentLang);
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
        if (!km && km !== 0) return "";
        const numKm = typeof km === 'number' ? km : parseInt(km, 10);
        if (isNaN(numKm)) return "";
        const locale = currentLanguage === 'ar-SA' ? 'ar-SA' : 'en-US';
        const unit = t('kmUnit') || (currentLanguage === 'ar-SA' ? 'كيلومتر' : 'km');
        return `${numKm.toLocaleString(locale)} ${unit}`;
    };

    // Helper function to format seats
    const formatSeats = (seats) => {
        if (!seats) return "";
        const numSeats = typeof seats === 'number' ? seats : parseInt(seats, 10);
        if (isNaN(numSeats)) return "";
        const unit = t('seatsUnit') || (currentLanguage === 'ar-SA' ? 'مقاعد' : 'Seats');
        return `${numSeats} ${unit}`;
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
                brandModel: (() => {
                    const brand = getLocalizedFieldValue(vehicle, 'carBrand');
                    const model = getLocalizedFieldValue(vehicle, 'carModel');
                    if (brand && model) {
                        return `${brand} ${model}`;
                    }
                    return brand || model || "";
                })(),
                year: vehicle.carYear || "",
                category: getLocalizedFieldValue(vehicle, 'carCategory') || "",
                seats: formatSeats(vehicle.licensedCapacitySeats),
                registrationNumber: vehicle.registrationNumber || "",
                insuranceExpiryDate: formatDate(vehicle.insuranceExpiryDate),
                kilometers: formatKilometers(vehicle.currentKM || vehicle.startingKM),
                location:
                    getLocalizedFieldValue(vehicle, 'currentLocation') ||
                    getLocalizedFieldValue(vehicle, 'carLocationHome') ||
                    "",
                status: getLocalizedFieldValue(vehicle, 'vehicleStatus') || t('active') || "Active",
                // Store original vehicle for actions
                originalVehicle: vehicle
            };
        });
    }, [vehicles, currentLanguage, t]);

    // Use mapped vehicles directly (filtering is done server-side)
    // Only filter client-side if needed for additional local filtering
    const filteredVehicles = useMemo(() => {
         return mappedVehicles;
    }, [mappedVehicles]);

    // Table columns configuration
    const vehicleColumns = useMemo(() => {
        return getVehicleColumns({ t, currentLanguage, spritemap });
    }, [t, currentLanguage, spritemap]);

    // Table event handlers
    const handleTableSortChange = (sort) => {
        // Update sort state
        setTableSort(sort);
        
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
        const newUrl = `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`;
        window.history.replaceState({}, '', newUrl);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        
        // Update URL with page parameter (always include page in URL for consistency)
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('page', newPage.toString());
        const newUrl = `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`;
        window.history.replaceState({}, '', newUrl);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        setPage(1); // Reset to first page when page size changes
        
        // Update URL with pageSize parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (newPageSize !== 10) {
            urlParams.set('pageSize', newPageSize.toString());
        } else {
            urlParams.delete('pageSize');
        }
        urlParams.set('page', '1'); // Reset to page 1 (always include page in URL)
        const newUrl = `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`;
        window.history.replaceState({}, '', newUrl);
    };

    const handleRowAction = (action, row) => {
        const vehicle = row.originalVehicle;
        if (action === 'details') {
            // Navigate to vehicle details page or open modal
            const message = row.brandModel
                ? `${t('viewingVehicleDetails')}: ${row.brandModel}`
                : t('viewingVehicleDetails');
            toast.info(message);
        } else if (action === 'edit') {
            // Navigate to vehicle edit page
            const editUrl = `/vehicle-add-form-reactjs?vehicleId=${vehicle.id}`;
            window.location.href = editUrl;
        }
    };

    const handleCreateVehicle = () => {
        // Navigate to vehicle add form
        window.location.href = '/vehicle-management';
    };

    const handleFilterClick = () => {
        setShowFilter(!showFilter);
    };

    const handleFilterClose = () => {
        setShowFilter(false);
    };

    const handleFilterApply = (filterValues) => {
        setFilters(filterValues);
        setShowFilter(false);
    };

    // Actions menu configuration
    const actions = [
        {
            key: 'details',
            label: t('vehicleDetails') || (currentLanguage === 'ar-SA' ? 'تفاصيل المركبة' : 'Vehicle Details')
        },
        {
            key: 'edit',
            label: t('editVehicle') || (currentLanguage === 'ar-SA' ? 'تعديل المركبة' : 'Edit Vehicle')
        }
    ];

    if (loading) {
        return (
            <Provider spritemap={spritemap}>
                <div className="vehicle-list-container" dir={direction}>
                    <div className="loading-container">
                        <p>{t('loading') || (currentLanguage === 'ar-SA' ? 'جاري التحميل...' : 'Loading...')}</p>
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
                        <h2 className="sub-title">{t('transportManagement') || (currentLanguage === 'ar-SA' ? 'إدارة النقل' : 'Transport Management')}</h2>
                        <h1 className="main-title">{t('vehicles') || (currentLanguage === 'ar-SA' ? 'المركبات' : 'Vehicles')}</h1>
                    </div>
                    <Button
                        btnStyle="btn-main-primary"
                        onClick={handleCreateVehicle}
                        className="create-vehicle-btn"
                    >
                        <ClayIcon symbol="plus" className="mr-2" spritemap={spritemap} />
                        {t('createNewVehicle') || (currentLanguage === 'ar-SA' ? 'انشاء مركبة جديدة' : 'Create New Vehicle')}
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
                            }}
                            debounceDelay={1000}
                            searchWord="search"
                            placeholder={t('vehicleListSearchPlaceholder') || (currentLanguage === 'ar-SA' ? 'ابحث هنا' : 'Search here')}
                            spritemap={spritemap}
                        />
                    <Button
                        btnStyle="btn-main-secondary"
                        onClick={handleFilterClick}
                        className="filter-btn"
                    >
                        <ClayIcon symbol="filter" className="mr-2" spritemap={spritemap} />
                        {t('filter') || (currentLanguage === 'ar-SA' ? 'تصفية' : 'Filter')}
                    </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="vehicle-list-table-container">
                    <Table
                        items={filteredVehicles}
                        columns={vehicleColumns}
                        onSortChange={handleTableSortChange}
                        sort={tableSort}
                        onRowAction={handleRowAction}
                        showActions={true}
                        actions={actions}
                        actionsLabel={t('actions') || (currentLanguage === 'ar-SA' ? 'الإجراءات' : 'Actions')}
                        spritemap={spritemap}
                        page={page}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        totalItems={totalCount}
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
                        t={t}
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
