import React from 'react';
import {Provider} from '@clayui/core';
import Form, {ClayInput} from '@clayui/form';
import Button from './Button';
import '@clayui/css/lib/css/atlas.css';

/**
 * Props:
 * - label: string (optional) - Label for the input group
 * - required: boolean (optional) - Whether the field is required
 * - prependButton: { label, onClick, displayType, type, ...props } (optional)
 * - appendButton: { label, onClick, displayType, type, ...props } (optional)
 * - prependText: string (optional)
 * - appendText: string (optional)
 * - inputProps: props for ClayInput (placeholder, value, onChange, etc)
 * - groupProps: props for ClayInput.Group
 * - groupItemProps: props for ClayInput.GroupItem
 * - className: string (optional) - Additional CSS classes
 * - error: boolean (optional) - Whether to show error state
 * - disabled: boolean (optional) - Whether the input is disabled
 */
export default function InputGroup({
  label,
  required,
  prependButton,
  appendButton,
  prependText,
  appendText,
  inputProps = {},
  groupProps = {},
  prependItemProps = {},
  appendItemProps = {},
  groupItemProps = {},
  className = '',
  error = false,
  disabled = false,
  ...formGroupProps
}) {
  // Determine the input group type for proper styling
  const getInputGroupType = () => {
    if (prependButton || prependText) {
      if (appendButton || appendText) return 'both';
      return 'prepend';
    }
    if (appendButton || appendText) return 'append';
    return 'default';
  };

  const inputGroupType = getInputGroupType();
  
  // Build CSS classes
  const formGroupClass = `clay-form-group ${className}`.trim();
  const inputGroupClass = `clay-input-group ${inputGroupType} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`.trim();

  return (
    <Provider spritemap="/public/icons.svg">
      <Form.Group className={formGroupClass} {...formGroupProps}>
        {label && (
          <label htmlFor={inputProps.name || 'input-group'}>
            {label}
            {required && <span className="required-asterisk"> *</span>}
          </label>
        )}
        <ClayInput.Group className={inputGroupClass} {...groupProps}>
          {prependButton && (
            <ClayInput.GroupItem shrink prepend className="clay-input-group-item" {...prependItemProps}>
              <Button {...prependButton} className="clay-btn">{prependButton.label}</Button>
            </ClayInput.GroupItem>
          )}
          {prependText && (
            <ClayInput.GroupItem shrink prepend className="clay-input-group-item" {...prependItemProps}>
              <ClayInput.GroupText className="clay-input-group-text">{prependText}</ClayInput.GroupText>
            </ClayInput.GroupItem>
          )}
          <ClayInput.GroupItem className="clay-input-group-item" {...groupItemProps}>
            <ClayInput 
              {...inputProps} 
              className="clay-input"
              disabled={disabled}
            />
          </ClayInput.GroupItem>
          {appendText && (
            <ClayInput.GroupItem append shrink className="clay-input-group-item" {...appendItemProps}>
              <ClayInput.GroupText className="clay-input-group-text">{appendText}</ClayInput.GroupText>
            </ClayInput.GroupItem>
          )}
          {appendButton && (
            <ClayInput.GroupItem append shrink className="clay-input-group-item" {...appendItemProps}>
              <Button {...appendButton} className="clay-btn">{appendButton.label}</Button>
            </ClayInput.GroupItem>
          )}
        </ClayInput.Group>
      </Form.Group>
    </Provider>
  );
} 