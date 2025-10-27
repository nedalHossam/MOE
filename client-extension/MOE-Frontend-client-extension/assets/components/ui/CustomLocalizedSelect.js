import React, { useMemo } from 'react';
import ClayForm from '@clayui/form';
import ClayLocalizedInput from '@clayui/localized-input';
import ClayIcon from '@clayui/icon';
import { Provider } from '@clayui/core';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const CustomLocalizedSelect = ({
  label,
  locales = [
    { label: 'en-US', symbol: 'en-us' },
    { label: 'ar-SA', symbol: 'ar-sa' }
  ],
  selectedLocale,
  onSelectedLocaleChange,
  translations = {},
  onTranslationsChange,
  required = false,
  name,
  className = '',
  error = false,
  disabled = false,
  symbol,
  options = [],
  value = '',
  onChange,
  placeholder = 'Select an option...',
  isLoading = false,
  isMulti = false,
  isClearable = false,
  ...props
}) => {
  const formGroupClass = `clay-form-group ${error ? 'error' : ''} ${disabled ? 'disabled' : ''} ${className}`.trim();
  const correctSpritemap = `${Liferay.ThemeDisplay.getPathThemeImages()}/clay/icons.svg`;

  // Create localized options based on translations
  const localizedOptions = useMemo(() => {
    if (!options || options.length === 0) return [];
    
    return options.map(option => ({
      ...option,
      label: translations[selectedLocale?.symbol] || option.label || option.value
    }));
  }, [options, translations, selectedLocale]);

  const handleSelectChange = (selectedOption) => {
    if (isMulti) {
      const values = selectedOption ? selectedOption.map(opt => opt.value) : [];
      onChange(values);
    } else {
      const value = selectedOption ? selectedOption.value : '';
      onChange(value);
    }
  };

  const getSelectedOption = () => {
    if (isMulti) {
      const selectedValues = Array.isArray(value) ? value : [];
      return options.filter(opt => selectedValues.includes(opt.value));
    } else {
      const selected = options.find(opt => opt.value === value);
      return selected;
    }
  };

  return (
    <Provider spritemap={correctSpritemap}>
      <ClayForm.Group className={formGroupClass}>
        {/* Header with label and language selector */}
        <div className="localized-select-header">
        <div>
          {label && (
            <label  className="custom-localized-select-label">
              {label}
              {required && <span className="required-asterisk">*</span>}
            </label>
          )}
          </div>
          
          {/* Language Selector - Compact inline */}
          <div className="d-flex">
        {/* Select Component */}
        <div className="localized-select-wrapper">
          <Select
            components={animatedComponents}
            options={localizedOptions}
            value={getSelectedOption()}
            onChange={handleSelectChange}
            placeholder={placeholder}
            isLoading={isLoading}
            isDisabled={disabled || isLoading}
            isMulti={isMulti}
            isClearable={isClearable}
            className={`custom-localized-select ${error ? 'has-error' : ''}`}
            {...props}
          />
        </div>
                  <div className="localized-select-locale-selector">
          <ClayLocalizedInput
            locales={locales}
            onSelectedLocaleChange={onSelectedLocaleChange}
            onTranslationsChange={onTranslationsChange}
            selectedLocale={selectedLocale}
            translations={translations}
            disabled={disabled}
            spritemap={correctSpritemap}
            component="select"
          />
        </div>
          </div>
        </div>
      </ClayForm.Group>
    </Provider>
  );
};

export default CustomLocalizedSelect;
