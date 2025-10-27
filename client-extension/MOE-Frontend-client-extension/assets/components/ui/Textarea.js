import React from 'react';
import ClayForm, { ClayInput } from '@clayui/form';

const Textarea = ({ label, value, onChange, placeholder, required, name, maxLength, disabled, rows }) => (
  <ClayForm.Group>
    {label && <label htmlFor={name}>{label}{required && <span className="required-input"></span>}</label>}
    <ClayInput
      component="textarea"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows || 4}
      maxLength={maxLength}
      disabled={disabled}
    />
  </ClayForm.Group>
);

export default Textarea; 