import React, { useRef, useState } from 'react';
import { useTranslation } from '../../utils/translations';
import ClayForm from '@clayui/form';

const InputFileUpload = ({ 
  label = "المرفق", 
  onChange, 
  required = false, 
  name, 
  accept = ".jpeg,.jpg,.png,.pdf",
  placeholder = "المرفق",
  className = "",
  value = null // Accept value prop for uploaded file name
}) => {
  const [fileName, setFileName] = useState(value || '');
  const fileInputRef = useRef();
  const { t } = useTranslation();

  // Update fileName when value prop changes
  React.useEffect(() => {
    setFileName(value || '');
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName('');
    }
    if (onChange) onChange(e);
  };

  const handleInputClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) {
      const event = { target: { name, value: '' } };
      onChange(event);
    }
  };

  return (
    <ClayForm.Group className={`file-upload-group ${className}`}>
      {label && (
        <label htmlFor={name} className="file-upload-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      
      <div className="file-upload-container" onClick={handleInputClick}>
        <div className="file-upload-content">
          {fileName ? (
            <span className="file-name">{fileName}</span>
          ) : (
            <span className="file-placeholder">{placeholder}</span>
          )}
        </div>
        
        <div className="file-upload-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {fileName && (
          <button
            type="button"
            onClick={handleRemoveFile}
            className="file-remove-btn"
            title="Remove file"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
      
      <div className="file-upload-hint">{t('uploadHint10MB')}</div>

      <input
        id={name}
        name={name}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        required={required}
        ref={fileInputRef}
        className="file-input-hidden"
        style={{ display: 'none' }}
      />
    </ClayForm.Group>
  );
};

export default InputFileUpload;
