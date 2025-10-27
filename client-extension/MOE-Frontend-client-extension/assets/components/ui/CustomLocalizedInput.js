import React from 'react';
import ClayForm from '@clayui/form';
import ClayLocalizedInput from '@clayui/localized-input';
import ClayIcon from '@clayui/icon';
import { Provider } from '@clayui/core';

const CustomLocalizedInput = ({
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
  component = 'input',
  rows = 4,
  placeholder,
  ...props
}) => {
  const formGroupClass = `clay-form-group ${error ? 'error' : ''} ${disabled ? 'disabled' : ''} ${className}`.trim();
  const correctSpritemap = `${Liferay.ThemeDisplay.getPathThemeImages()}/clay/icons.svg`;

  return (
    <Provider spritemap={correctSpritemap}>
      <ClayForm.Group className={formGroupClass}>
        {label && (
          <label htmlFor={name} className="custom-localized-input-label">
            {label}
            {required && <span className="required-asterisk">*</span>}
          </label>
        )}
        <ClayLocalizedInput
          id={name}
          name={name}
          locales={locales}
          onSelectedLocaleChange={onSelectedLocaleChange}
          onTranslationsChange={onTranslationsChange}
          selectedLocale={selectedLocale}
          translations={translations}
          disabled={disabled}
          spritemap={correctSpritemap}
          component={component}
          rows={rows}
          placeholder={placeholder}
          {...props}
        />
      </ClayForm.Group>
    </Provider>
  );
};

export default CustomLocalizedInput;
