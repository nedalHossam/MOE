import React, { useState, useEffect } from 'react';
import ClayIcon from "@clayui/icon";
import { getPicklistOptions } from "../../hooks/api";
import { SelectComponent, DatePicker } from "../../../../components/ui";

const FilterForm = ({ onFilter, onClose, currentLanguage, direction, spritemap }) => {
    const [filters, setFilters] = useState({
        status: '',
        brand: '',
        model: '',
        category: '',
        location: '',
        yearFrom: '',
        yearTo: '',
        registrationExpiryFrom: '',
        registrationExpiryTo: '',
        insuranceExpiryFrom: '',
        insuranceExpiryTo: '',
        department: ''
    });

    const [options, setOptions] = useState({
        status: [],
        brands: [],
        models: [],
        categories: [],
        locations: [],
        departments: []
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setLoading(true);
                const [
                    statusList,
                    brandsList,
                    modelsList,
                    categoriesList,
                    locationsList,
                    departmentsList
                ] = await Promise.all([
                    getPicklistOptions("Status"),
                    getPicklistOptions("MOE Vehicle Makers"),
                    getPicklistOptions("Maker – Models"),
                    getPicklistOptions("MOE Vehicle Categories"),
                    getPicklistOptions("MOE Locations"),
                    getPicklistOptions("Departments")
                ]);

                setOptions({
                    status: statusList,
                    brands: brandsList,
                    models: modelsList,
                    categories: categoriesList,
                    locations: locationsList,
                    departments: departmentsList
                });
            } catch (error) {
                console.error('Error fetching filter options:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, []);

    const handleChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const applyFilters = () => {
        onFilter(filters);
    };

    const clearFilters = () => {
        const emptyFilters = {
            status: '',
            brand: '',
            model: '',
            category: '',
            location: '',
            yearFrom: '',
            yearTo: '',
            registrationExpiryFrom: '',
            registrationExpiryTo: '',
            insuranceExpiryFrom: '',
            insuranceExpiryTo: '',
            department: ''
        };
        setFilters(emptyFilters);
        onFilter(emptyFilters);
    };


    const filterText = currentLanguage === 'ar-SA' ? 'تصفية' : 'Filter';
    const resetText = currentLanguage === 'ar-SA' ? 'اعادة' : 'Reset';
    const classificationText = currentLanguage === 'ar-SA' ? 'تصنيف' : 'Classification';
    const statusText = currentLanguage === 'ar-SA' ? 'الحالة' : 'Status';
    const brandText = currentLanguage === 'ar-SA' ? 'علامة تجارية' : 'Brand';
    const modelText = currentLanguage === 'ar-SA' ? 'طراز' : 'Model';
    const categoryText = currentLanguage === 'ar-SA' ? 'فئة' : 'Category';
    const locationText = currentLanguage === 'ar-SA' ? 'موقع' : 'Location';
    const yearText = currentLanguage === 'ar-SA' ? 'السنة' : 'Year';
    const registrationExpiryText = currentLanguage === 'ar-SA' ? 'تاريخ انتهاء التسجيل' : 'Registration Expiry Date';
    const insuranceExpiryText = currentLanguage === 'ar-SA' ? 'تاريخ انتهاء التأمين' : 'Insurance Expiry Date';
    const departmentText = currentLanguage === 'ar-SA' ? 'القسم' : 'Department';
    const fromText = currentLanguage === 'ar-SA' ? 'من' : 'From';
    const toText = currentLanguage === 'ar-SA' ? 'الي' : 'To';

    if (loading) {
        return (
            <div className="filter-sidebar">
                <div className="filter-sidebar-header">
                    <button className="filter-close-btn" onClick={onClose}>
                        <ClayIcon symbol="times" spritemap={spritemap} />
                    </button>
                    <h3 className="filter-sidebar-title">{classificationText}</h3>
                </div>
                <div className="filter-sidebar-content">
                    <p>{currentLanguage === 'ar-SA' ? 'جاري التحميل...' : 'Loading...'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="filter-sidebar">
            <div className="filter-sidebar-header">
                <button className="filter-close-btn" onClick={onClose}>
                    <ClayIcon symbol="times" spritemap={spritemap} />
                </button>
                <h3 className="filter-sidebar-title">{classificationText}</h3>
            </div>
            <div className="filter-sidebar-content">
                {/* Status Filter */}
                <div className="filter-field">
                    <label className="filter-label">{statusText}</label>
                    <SelectComponent
                        options={options.status}
                        value={filters.status}
                        onChange={(value) => handleChange('status', value || '')}
                        placeholder={statusText}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                </div>

                {/* Brand Filter */}
                <div className="filter-field">
                    <label className="filter-label">{brandText}</label>
                    <SelectComponent
                        options={options.brands}
                        value={filters.brand}
                        onChange={(value) => handleChange('brand', value || '')}
                        placeholder={brandText}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                </div>

                {/* Model Filter */}
                <div className="filter-field">
                    <label className="filter-label">{modelText}</label>
                    <SelectComponent
                        options={options.models}
                        value={filters.model}
                        onChange={(value) => handleChange('model', value || '')}
                        placeholder={modelText}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                </div>

                {/* Category Filter */}
                <div className="filter-field">
                    <label className="filter-label">{categoryText}</label>
                    <SelectComponent
                        options={options.categories}
                        value={filters.category}
                        onChange={(value) => handleChange('category', value || '')}
                        placeholder={categoryText}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                </div>

                {/* Location Filter */}
                <div className="filter-field">
                    <label className="filter-label">{locationText}</label>
                    <SelectComponent
                        options={options.locations}
                        value={filters.location}
                        onChange={(value) => handleChange('location', value || '')}
                        placeholder={locationText}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                </div>

                {/* Department Filter */}
                <div className="filter-field">
                    <label className="filter-label">{departmentText}</label>
                    <SelectComponent
                        options={options.departments}
                        value={filters.department}
                        onChange={(value) => handleChange('department', value || '')}
                        placeholder={departmentText}
                        isMulti={false}
                        currentLanguage={currentLanguage}
                    />
                </div>

                {/* Year Range Filter */}
                <div className="filter-field">
                    <label className="filter-label">{yearText}</label>
                    <div className="filter-date-grid">
                        <div className="filter-date-item">
                            <DatePicker
                                value={filters.yearFrom}
                                onChange={(value) => handleChange('yearFrom', value || '')}
                                placeholder={fromText}
                                spritemap={spritemap}
                                years={{
                                    start: 1900,
                                    end: 2100
                                }}
                                dateFormat="YYYY"
                            />
                        </div>
                        <div className="filter-date-item">
                            <DatePicker
                                value={filters.yearTo}
                                onChange={(value) => handleChange('yearTo', value || '')}
                                placeholder={toText}
                                spritemap={spritemap}
                                years={{
                                    start: 1900,
                                    end: 2100
                                }}
                                dateFormat="YYYY"
                            />
                        </div>
                    </div>
                </div>

                {/* Registration Expiry Date Range Filter */}
                <div className="filter-field">
                    <label className="filter-label">{registrationExpiryText}</label>
                    <div className="filter-date-grid">
                        <div className="filter-date-item">
                            <DatePicker
                                value={filters.registrationExpiryFrom}
                                onChange={(value) => handleChange('registrationExpiryFrom', value || '')}
                                placeholder={fromText}
                                spritemap={spritemap}
                                dateFormat="yyyy-MM-dd"
                                years={{
                                    end: 2050,
                                    start: new Date().getFullYear(),
                                }}
                            />
                        </div>
                        <div className="filter-date-item">
                            <DatePicker
                                value={filters.registrationExpiryTo}
                                onChange={(value) => handleChange('registrationExpiryTo', value || '')}
                                placeholder={toText}
                                spritemap={spritemap}
                                dateFormat="yyyy-MM-dd"
                                years={{
                                    end: 2050,
                                    start: new Date().getFullYear(),
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Insurance Expiry Date Range Filter */}
                <div className="filter-field">
                    <label className="filter-label">{insuranceExpiryText}</label>
                    <div className="filter-date-grid">
                        <div className="filter-date-item">
                            <DatePicker
                                value={filters.insuranceExpiryFrom}
                                onChange={(value) => handleChange('insuranceExpiryFrom', value || '')}
                                placeholder={fromText}
                                spritemap={spritemap}
                                dateFormat="yyyy-MM-dd"
                                years={{
                                    end: 2050,
                                    start: new Date().getFullYear(),
                                }}
                            />
                        </div>
                        <div className="filter-date-item">
                            <DatePicker
                                value={filters.insuranceExpiryTo}
                                onChange={(value) => handleChange('insuranceExpiryTo', value || '')}
                                placeholder={toText}
                                spritemap={spritemap}
                                dateFormat="yyyy-MM-dd"
                                years={{
                                    end: 2050,
                                    start: new Date().getFullYear(),
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="filter-actions">
                    <button className="filter-btn-primary" onClick={applyFilters}>
                        {filterText}
                    </button>
                    <button className="filter-btn-secondary" onClick={clearFilters}>
                        {resetText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterForm;

