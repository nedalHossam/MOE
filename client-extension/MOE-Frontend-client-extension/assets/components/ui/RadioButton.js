import React from 'react';
import ClayForm from '@clayui/form';
import ClayIcon from '@clayui/icon';

/**
 * RadioButton Component
 * A reusable radio button group component with Clay UI styling
 * 
 * @param {Object} props - Component props
 * @param {string} props.name - Name attribute for radio buttons
 * @param {string} props.label - Label text for the radio group
 * @param {boolean} props.required - Whether the field is required
 * @param {Array} props.options - Array of options {value, name, icon?}
 * @param {string} props.value - Currently selected value
 * @param {Function} props.onChange - Callback when selection changes
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.errors - Error object for validation
 * @param {string} props.spritemap - Path to spritemap for icons
 * @param {string} props.ariaLabel - ARIA label for accessibility
 */
const RadioButton = ({
  name,
  label,
  required = false,
  options = [],
  value,
  onChange,
  className = '',
  errors = {},
  spritemap = '/o/classic-theme/images/lexicon/icons.svg',
  ariaLabel,
  ...props
}) => {
  const fieldName = name;
  const hasError = errors[fieldName];
  const errorMessage = hasError;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <ClayForm.Group className={className}>
      <label className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <div 
        className="btn-group" 
        role="group" 
        aria-label={ariaLabel || label}
      >
        {options.map((option) => (
          <div key={option.value} className="form-check form-check-inline flex-fill">
            <input
              className="form-check-input"
              type="radio"
              name={name}
              id={`${name}_${option.value}`}
              value={option.value}
              checked={value === option.value}
              onChange={handleChange}
              {...props}
            />
            <label 
              className="form-check-label d-flex" 
              htmlFor={`${name}_${option.value}`}
            >
              {option.name}
            </label>
          </div>
        ))}
      </div>
      {errorMessage && (
        <div className="form-error">
          <ClayIcon 
            symbol="exclamation-full" 
            className="error-icon" 
            spritemap={spritemap} 
          />
          {errorMessage}
        </div>
      )}
    </ClayForm.Group>
  );
};

export default RadioButton;
