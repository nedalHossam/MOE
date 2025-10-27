import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

// Helper function to normalize locale format
function normalizeLocaleToUnderscore(locale) {
  if (!locale) return 'en_US';
  const localeStr = String(locale);
  // Convert 'en-US' to 'en_US', 'ar-SA' to 'ar_SA', etc.
  return localeStr.replace('-', '_');
}

// Helper function to get the localized label for an option
function getLocalizedLabel(option, currentLanguage) {
  // Check if the option has internationalization data
  if (option.name_i18n && typeof option.name_i18n === 'object') {
    const localeUnderScore = normalizeLocaleToUnderscore(currentLanguage);
    
    // Try to get the translation for current language
    // Support both 'ar-SA' and 'ar_SA' formats
    let translatedLabel = option.name_i18n[localeUnderScore] || 
                          option.name_i18n[currentLanguage];
    
    // If current language translation is not available, try to get any available translation
    if (!translatedLabel) {
      // Try common variants
      const variants = [
        currentLanguage,
        localeUnderScore,
        'en-US',
        'en_US',
        'ar-SA',
        'ar_SA'
      ];
      
      for (const variant of variants) {
        if (option.name_i18n[variant]) {
          translatedLabel = option.name_i18n[variant];
          break;
        }
      }
    }
    
    // Return translated label if found, otherwise fall back to regular label
    return translatedLabel || option.label || option.name;
  }
  
  // No i18n data available, return the regular label
  return option.label || option.name;
}

const SelectComponent = ({ 
  items = [], 
  setItems, 
  options = [], 
  placeholder = 'Select...',
  value = [],
  onChange,
  isMulti = false, // Default to multiple selection for backward compatibility
  currentLanguage = 'en-US', // Add current language prop
  ...props 
}) => {
  // Map options to include localized labels
  const localizedOptions = React.useMemo(() => {
    return options.map(option => ({
      ...option,
      label: getLocalizedLabel(option, currentLanguage)
    }));
  }, [options, currentLanguage]);

  const handleChange = (selectedOption) => {
    let values;
    
    if (isMulti) {
      // Multiple selection mode
      values = selectedOption ? selectedOption.map(option => option.value) : [];
    } else {
      // Single selection mode
      values = selectedOption ? selectedOption.value : null;
    }
    
    if (onChange) {
      onChange(values);
    }
    if (setItems) {
      setItems(values);
    }
  };

  // Handle value conversion for both single and multiple modes
  let selectedOptions;
  if (isMulti) {
    const selectedValues = Array.isArray(value) ? value : [];
    selectedOptions = localizedOptions.filter(option => selectedValues.includes(option.value));
  } else {
    // For single selection, find the option that matches the value
    selectedOptions = localizedOptions.find(option => option.value === value) || null;
  }

  return (
    <Select
      components={isMulti ? animatedComponents : undefined}
      options={localizedOptions}
      value={selectedOptions}
      onChange={handleChange}
      placeholder={placeholder}
      isMulti={isMulti}
      isClearable
      {...props}
    />
  );
};

export default SelectComponent;