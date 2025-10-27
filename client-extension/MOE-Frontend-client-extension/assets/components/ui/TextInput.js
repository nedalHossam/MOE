import React from 'react';
import ClayForm, { ClayInput } from '@clayui/form';
import ClayIcon from '@clayui/icon';

const TextInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required, 
  name, 
  className = '',
  error = false,
  disabled = false,
  errorMessage = null,
  errorIcon = null,
  spritemap = null,
  ...props 
}) => {
  const formGroupClass = `form-group ${error ? 'error' : ''} ${disabled ? 'disabled' : ''} ${className}`.trim();
  const inputClass = `clay-input ${error ? 'error' : ''}`.trim();
  
  return (
    <ClayForm.Group className={formGroupClass}>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="required-asterisk"> *</span>}
        </label>
      )}
      <ClayInput
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={inputClass}
        disabled={disabled}
        {...props}
      />
      {errorMessage && (
        <div className="form-error">
          {errorIcon && spritemap && (
            <ClayIcon symbol={errorIcon} className="error-icon" spritemap={spritemap} />
          )}
          {errorMessage}
        </div>
      )}
    </ClayForm.Group>
  );
};

export default TextInput;