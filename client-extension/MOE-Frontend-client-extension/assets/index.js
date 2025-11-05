/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from '@clayui/core';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@clayui/css/lib/css/atlas.css';


// Import all UI components
import {
  Alert,
  Button,
  CustomLocalizedInput,
  CustomLocalizedSelect,
  DatePicker,
  InputFileUpload,
  InputGroup,
  LocalizedRichTextEditor,
  Modal,
  MultiSelect,
  NavigationBar,
  Pagination,
  RadioButton,
  RichTextEditor,
  SearchInput,
  Steps,
  SuccessPopup,
  Table,
  Textarea,
  TextInput
} from './components/ui';

// Import form modules
import './modules/driver/driver-add-form/index.js'
import './modules/vehicle/vehicle-add-form/index.js'
import './modules/vehicle/vehicle-list/index.js'

// UI Components Demo
const UIComponentsDemo = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [textValue, setTextValue] = React.useState('');
  const [textareaValue, setTextareaValue] = React.useState('');
  const [selectValue, setSelectValue] = React.useState('');
  const [multiSelectValue, setMultiSelectValue] = React.useState([]);
  const [dateValue, setDateValue] = React.useState('');
  const [localizedValue, setLocalizedValue] = React.useState({});
  const [richTextValue, setRichTextValue] = React.useState('');
  const [localizedRichTextValue, setLocalizedRichTextValue] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const [radioValue, setRadioValue] = React.useState('');
  const [tablePage, setTablePage] = React.useState(1);
  const [tablePageSize, setTablePageSize] = React.useState(10);
  const [searchValue, setSearchValue] = React.useState('');
  const [tableSort, setTableSort] = React.useState(null);

  // Initialize state from URL parameters on mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Initialize search value from URL
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchValue(searchParam);
    }
    
    // Initialize page from URL
    const pageParam = urlParams.get('page');
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page) && page > 0) {
        setTablePage(page);
      }
    }
    
    // Initialize page size from URL
    const pageSizeParam = urlParams.get('pageSize');
    if (pageSizeParam) {
      const pageSize = parseInt(pageSizeParam, 10);
      if (!isNaN(pageSize) && pageSize > 0) {
        setTablePageSize(pageSize);
      }
    }
    
    // Initialize sort from URL
    const sortByParam = urlParams.get('sortBy');
    const sortOrderParam = urlParams.get('sortOrder');
    if (sortByParam) {
      setTableSort({
        column: sortByParam,
        direction: sortOrderParam || 'ascending'
      });
    }
  }, []); // Run only on mount

  const locales = [
    { label: 'en-US', symbol: 'en-us' },
    { label: 'ar-SA', symbol: 'ar-sa' }
  ];

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  const multiSelectOptions = [
    { value: 'item1', label: 'Item 1' },
    { value: 'item2', label: 'Item 2' },
    { value: 'item3', label: 'Item 3' },
    { value: 'item4', label: 'Item 4' }
  ];

  const navigationItems = [
    { id: 'home', label: 'Home', type: 'link', href: '#' },
    { id: 'about', label: 'About', type: 'button' },
    { id: 'contact', label: 'Contact', type: 'link', href: '#' }
  ];


  const stepItems = [
    { title: 'Step 1', description: 'First step' },
    { title: 'Step 2', description: 'Second step' },
    { title: 'Step 3', description: 'Third step' }
  ];

  // Vehicle Management Data
  const vehicleData = [
    { 
      id: 1, 
      vehicleId: '0033', 
      plateNumber: '2223-DND', 
      brandModel: 'Toyota Corolla', 
      year: '2022', 
      category: 'Sedan', 
      seats: '5 Seats', 
      regExp: '2026-06-30', 
      insExp: '2026-06-30', 
      km: '45,300 Km', 
      location: 'Muscat, Oman', 
      status: 'Active' 
    },
    { 
      id: 2, 
      vehicleId: '0034', 
      plateNumber: '1234-ABC', 
      brandModel: 'Honda Civic', 
      year: '2021', 
      category: 'Sedan', 
      seats: '5 Seats', 
      regExp: '2025-12-15', 
      insExp: '2025-12-15', 
      km: '32,100 Km', 
      location: 'Dubai, UAE', 
      status: 'Active' 
    },
    { 
      id: 3, 
      vehicleId: '0035', 
      plateNumber: '5678-XYZ', 
      brandModel: 'Ford Explorer', 
      year: '2023', 
      category: 'SUV', 
      seats: '7 Seats', 
      regExp: '2027-03-20', 
      insExp: '2027-03-20', 
      km: '18,500 Km', 
      location: 'Riyadh, Saudi Arabia', 
      status: 'Inactive' 
    },
    { 
      id: 4, 
      vehicleId: '0036', 
      plateNumber: '9012-DEF', 
      brandModel: 'BMW X5', 
      year: '2022', 
      category: 'SUV', 
      seats: '5 Seats', 
      regExp: '2026-08-10', 
      insExp: '2026-08-10', 
      km: '28,750 Km', 
      location: 'Kuwait City, Kuwait', 
      status: 'Active' 
    },
    { 
      id: 5, 
      vehicleId: '0037', 
      plateNumber: '3456-GHI', 
      brandModel: 'Mercedes C-Class', 
      year: '2023', 
      category: 'Sedan', 
      seats: '5 Seats', 
      regExp: '2027-01-25', 
      insExp: '2027-01-25', 
      km: '15,200 Km', 
      location: 'Doha, Qatar', 
      status: 'Active' 
    },
    { 
      id: 6, 
      vehicleId: '0038', 
      plateNumber: '7890-JKL', 
      brandModel: 'Audi A4', 
      year: '2021', 
      category: 'Sedan', 
      seats: '5 Seats', 
      regExp: '2025-11-30', 
      insExp: '2025-11-30', 
      km: '41,800 Km', 
      location: 'Abu Dhabi, UAE', 
      status: 'Inactive' 
    },
    { 
      id: 7, 
      vehicleId: '0039', 
      plateNumber: '2468-MNO', 
      brandModel: 'Nissan Pathfinder', 
      year: '2022', 
      category: 'SUV', 
      seats: '7 Seats', 
      regExp: '2026-09-15', 
      insExp: '2026-09-15', 
      km: '22,300 Km', 
      location: 'Manama, Bahrain', 
      status: 'Active' 
    },
    { 
      id: 8, 
      vehicleId: '0040', 
      plateNumber: '1357-PQR', 
      brandModel: 'Hyundai Elantra', 
      year: '2023', 
      category: 'Sedan', 
      seats: '5 Seats', 
      regExp: '2027-02-28', 
      insExp: '2027-02-28', 
      km: '12,900 Km', 
      location: 'Muscat, Oman', 
      status: 'Active' 
    },
    { 
      id: 9, 
      vehicleId: '0041', 
      plateNumber: '9753-STU', 
      brandModel: 'Chevrolet Tahoe', 
      year: '2021', 
      category: 'SUV', 
      seats: '8 Seats', 
      regExp: '2025-10-05', 
      insExp: '2025-10-05', 
      km: '38,600 Km', 
      location: 'Dubai, UAE', 
      status: 'Inactive' 
    },
    { 
      id: 10, 
      vehicleId: '0042', 
      plateNumber: '8642-VWX', 
      brandModel: 'Volkswagen Passat', 
      year: '2022', 
      category: 'Sedan', 
      seats: '5 Seats', 
      regExp: '2026-07-12', 
      insExp: '2026-07-12', 
      km: '31,400 Km', 
      location: 'Riyadh, Saudi Arabia', 
      status: 'Active' 
    },
     {
          id: 10,
          vehicleId: '0042',
          plateNumber: '8642-VWX',
          brandModel: 'Volkswagen Passat',
          year: '2022',
          category: 'Sedan',
          seats: '5 Seats',
          regExp: '2026-07-12',
          insExp: '2026-07-12',
          km: '31,400 Km',
          location: 'Riyadh, Saudi Arabia',
          status: 'Active'
        },
         {
              id: 10,
              vehicleId: '0042',
              plateNumber: '8642-VWX',
              brandModel: 'Volkswagen Passat',
              year: '2022',
              category: 'Sedan',
              seats: '5 Seats',
              regExp: '2026-07-12',
              insExp: '2026-07-12',
              km: '31,400 Km',
              location: 'Riyadh, Saudi Arabia',
              status: 'Active'
            },
           {
                id: 10,
                vehicleId: '0042',
                plateNumber: '8642-VWX',
                brandModel: 'Volkswagen Passat',
                year: '2022',
                category: 'Sedan',
                seats: '5 Seats',
                regExp: '2026-07-12',
                insExp: '2026-07-12',
                km: '31,400 Km',
                location: 'Riyadh, Saudi Arabia',
                status: 'Active'
              },
               {
                    id: 10,
                    vehicleId: '0042',
                    plateNumber: '8642-VWX',
                    brandModel: 'Volkswagen Passat',
                    year: '2022',
                    category: 'Sedan',
                    seats: '5 Seats',
                    regExp: '2026-07-12',
                    insExp: '2026-07-12',
                    km: '31,400 Km',
                    location: 'Riyadh, Saudi Arabia',
                    status: 'Active'
                  }
  ];

  // Vehicle Management Columns Configuration
  const vehicleColumns = [
    { key: 'vehicleId', label: 'Vehicle ID', sortable: true },
    { key: 'plateNumber', label: 'Plate Number', sortable: true },
    { key: 'brandModel', label: 'Brand/Model', sortable: true },
    { key: 'year', label: 'Year', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'seats', label: 'Seats' },
    { key: 'regExp', label: 'Reg. Exp' },
    { key: 'insExp', label: 'Ins. Exp' },
    { key: 'km', label: 'KM' },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status' }
  ];


  const radioOptions = [
    { value: 'individual', name: 'Individual', icon: 'user' },
    { value: 'company', name: 'Company', icon: 'building' },
    { value: 'government', name: 'Government', icon: 'globe' }
  ];

  const spritemap = `${Liferay.ThemeDisplay.getPathThemeImages()}/clay/icons.svg`;

  // Table event handlers
  const handleTablePageChange = (page) => {
    setTablePage(page);
  };

  const handleTablePageSizeChange = (pageSize) => {
    setTablePageSize(pageSize);
    setTablePage(1); // Reset to first page when changing page size
  };

  const handleTableSortChange = (sort) => {
    console.log('Table sort changed:', sort);
    setTableSort(sort);
    setTablePage(1); // Reset to first page when sorting changes
  };

  const handleRowAction = (action, row) => {
    console.log(`${action} clicked for vehicle:`, row);
    // You can add your custom logic here for handling row actions
    if (action === 'details') {
      alert(`Viewing details for vehicle: ${row.brandModel} (${row.plateNumber})`);
    } else if (action === 'edit') {
      alert(`Editing vehicle: ${row.brandModel} (${row.plateNumber})`);
    } else if (action === 'delete') {
      if (confirm(`Are you sure you want to delete vehicle: ${row.brandModel} (${row.plateNumber})?`)) {
        alert(`Vehicle ${row.brandModel} (${row.plateNumber}) has been deleted!`);
      }
    }
  };

  // Filter vehicles based on search value
  const filteredVehicleData = React.useMemo(() => {
    if (!searchValue.trim()) {
      return vehicleData;
    }
    const searchLower = searchValue.toLowerCase();
    return vehicleData.filter(vehicle => 
      vehicle.vehicleId?.toLowerCase().includes(searchLower) ||
      vehicle.plateNumber?.toLowerCase().includes(searchLower) ||
      vehicle.brandModel?.toLowerCase().includes(searchLower) ||
      vehicle.location?.toLowerCase().includes(searchLower) ||
      vehicle.category?.toLowerCase().includes(searchLower) ||
      vehicle.status?.toLowerCase().includes(searchLower)
    );
  }, [searchValue]);


  return (
    <Provider spritemap={spritemap}>
      <div style={{ padding: '20px', margin: '0 auto' }}>
        <h1>UI Components Demo</h1>
        
        {/* Alert Component */}
        <section style={{ marginBottom: '30px' }}>
          <h2>Alert</h2>
          <Alert
            title="Success Alert"
            displayType="success"
            onClose={() => console.log('Alert closed')}
          >
            This is a success message
          </Alert>
        </section>

        {/* Button Component */}
        <section style={{ marginBottom: '30px' }}>
          <h2>Buttons</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button displayType="primary" onClick={() => console.log('Primary clicked')}>
              Primary Button
            </Button>
            <Button displayType="secondary" onClick={() => setShowModal(true)}>
              Open Modal
            </Button>
            <Button displayType="success" onClick={() => setShowSuccessPopup(true)}>
              Show Success Popup
            </Button>
          </div>
          
          <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Custom Button Styles</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn-style btn-main-primary"
              onClick={() => console.log('Next clicked')}
            >Next</button>
              <button
             className="btn-style btn-main-primary-outline"
              onClick={() => console.log('Previous clicked')}
              >Previous
              </button>
             <button
              className="btn-style btn-main-primary-disabled"
              disabled={true}
            > Disabled </button>
              <button
              className="btn-style btn-main-primary"
              isLoading={true}
              loadingText="Submitting..."
            >Submit
              </button>
          </div>
        </section>

        {/* Form Components Container */}
        <section style={{ marginBottom: '30px' }}>
          <h2>Form Components</h2>
          <div className="form-wrapper">
            <div className="form-grid">
              <TextInput
                label="Text Input"
                value={textValue}
                onChange={setTextValue}
                placeholder="Enter text here"
                required
              />
              <div className="form-group">
                <label className="form-label">VIN <span className="required-asterisk">*</span></label>
                <input 
                  placeholder="Enter 17-character VIN" 
                  maxLength="17" 
                  className="form-control" 
                  type="text" 
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Form Components Grid */}
        <section style={{ marginBottom: '30px' }}>
          <h2>Form Components Grid</h2>
          <div className="form-wrapper">
            <div className="form-grid">
              <Textarea
                label="Textarea"
                value={textareaValue}
                onChange={setTextareaValue}
                placeholder="Enter multiline text here"
                rows={4}
              />
              
              <CustomLocalizedSelect
                label="Select Option"
                options={selectOptions}
                value={selectValue}
                onChange={setSelectValue}
                placeholder="Choose an option"
                locales={locales}
                selectedLocale={locales[0]}
                onSelectedLocaleChange={() => {}}
                onTranslationsChange={() => {}}
                translations={{}}
              />
              
              <MultiSelect
                options={multiSelectOptions}
                value={multiSelectValue}
                onChange={setMultiSelectValue}
                placeholder="Choose multiple items"
              />
              
              <DatePicker
                label="Select Date"
                value={dateValue}
                onChange={setDateValue}
                placeholder="Choose a date"
              />
              
              
              <CustomLocalizedInput
                label="Localized Input"
                locales={locales}
                selectedLocale={locales[0]}
                onSelectedLocaleChange={() => {}}
                onTranslationsChange={setLocalizedValue}
                translations={localizedValue}
                placeholder="Enter localized text"
                required
              />
            </div>
          </div>
        </section>

        {/* Rich Text and Upload Components */}
        <section style={{ marginBottom: '30px' }}>
          <h2>Rich Text and Upload Components</h2>
          <div className="form-wrapper">
            <div className="form-grid">
              <RichTextEditor
                value={richTextValue}
                onChange={setRichTextValue}
                placeholder="Enter rich text content"
              />
              
              <LocalizedRichTextEditor
                value={localizedRichTextValue}
                onChange={setLocalizedRichTextValue}
                locales={locales}
                selectedLocale={locales[0]}
                onSelectedLocaleChange={() => {}}
                placeholder="Enter localized rich text"
              />
              
              <InputFileUpload
                label="المرفق"
                onChange={(e) => console.log('File selected:', e.target.files[0])}
                accept="image/*"
                name="imageUpload"
                required
              />
              
              <InputFileUpload
                label="Document Upload"
                onChange={(e) => console.log('Document selected:', e.target.files[0])}
                accept=".pdf,.doc,.docx"
                name="documentUpload"
                placeholder="Choose document"
                className="ltr-upload"
              />
              
              <InputGroup
                label="Input Group"
                value={textValue}
                onChange={setTextValue}
                placeholder="Enter value"
                append={<Button displayType="secondary">Go</Button>}
              />
              
              <RadioButton
                name="ownershipType"
                label="Ownership Type"
                required
                options={radioOptions}
                value={radioValue}
                onChange={setRadioValue}
                spritemap={spritemap}
                ariaLabel="Ownership Type Selection"
              />
            </div>
          </div>
        </section>

        {/* Navigation Bar Component */}
        <section style={{ marginBottom: '30px' }}>
          <h2>Navigation Bar</h2>
          <NavigationBar
            items={navigationItems}
            onItemChange={(itemId) => console.log('Navigation item changed:', itemId)}
          />
        </section>



        {/* Steps Component */}
        <section style={{ marginBottom: '30px' }}>
          <h2>Steps</h2>
          <Steps
            steps={stepItems}
            activeIndex={currentStep}
            direction="horizontal"
            onStepClick={setCurrentStep}
          />
        </section>

        {/* Vehicle Management Table */}
        <section style={{ marginBottom: '30px' }}>
          <h2>Vehicle Management Table</h2>

              <SearchInput
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onSearch={(value) => {
                  setSearchValue(value);
                  setTablePage(1);
                }}
                placeholder="ابحث هنا"
                spritemap={spritemap}
              />

          <Table
            items={filteredVehicleData}
            columns={vehicleColumns}
            page={tablePage}
            pageSize={tablePageSize}
            onPageChange={handleTablePageChange}
            onPageSizeChange={handleTablePageSizeChange}
            onSortChange={handleTableSortChange}
            sort={tableSort}
            totalItems={filteredVehicleData.length}
            onRowAction={handleRowAction}
            showActions={true}
            actions={[
              { key: 'details', label: 'Vehicle Details', icon: '📋' },
              { key: 'edit', label: 'Edit Vehicle', icon: '✏️' },
              { key: 'delete', label: 'Delete Vehicle', icon: '🗑️' }
            ]}
            deltas={[
              { label: 5 },
              { label: 10 },
              { label: 20 },
              { label: 50 }
            ]}
          />
        </section>


        {/* Modal Component */}
        {showModal && (
          <Modal
            title="Sample Modal"
            onConfirm={() => setShowModal(false)}
            onCancel={() => setShowModal(false)}
            confirmButtonLabel="Confirm"
            cancelButtonLabel="Cancel"
          >
            <p>This is a sample modal content. You can put any content here.</p>
          </Modal>
        )}

        {/* Success Popup Component */}
        <SuccessPopup
          isVisible={showSuccessPopup}
          onClose={() => setShowSuccessPopup(false)}
          message="Operation completed successfully!"
          image="/path/to/success-icon.png"
        />

        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      </div>
    </Provider>
  );
};

class CustomElement extends HTMLElement {
	connectedCallback() {
    ReactDOM.render(
      <React.StrictMode>
        <UIComponentsDemo />
      </React.StrictMode>,
      this
    );
	}

	disconnectedCallback() {
    ReactDOM.unmountComponentAtNode(this);
	}
}

const ELEMENT_NAME = 'ui-components-demo';

if (!customElements.get(ELEMENT_NAME)) {
	customElements.define(ELEMENT_NAME, CustomElement);
}
