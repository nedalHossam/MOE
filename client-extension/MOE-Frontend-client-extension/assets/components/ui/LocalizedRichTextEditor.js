import React, { useMemo, useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ClayIcon from '@clayui/icon';
import { LanguagePicker } from '@clayui/core';

const LocalizedRichTextEditor = ({
  value = {},
  onChange,
  placeholder = 'Enter text...',
  className = '',
  style = {},
  disabled = false,
  readOnly = false,
  height = '200px',
  locales = [
    {
      id: 'en_US',
      label: 'en-US',
      name: 'English (United States)',
      symbol: 'en-us',
    },
    {
      id: 'es_ES',
      label: 'es-ES',
      name: 'Spanish (Spain)',
      symbol: 'es-es',
    },
    {
      id: 'fr_FR',
      label: 'fr-FR',
      name: 'French (France)',
      symbol: 'fr-fr',
    },
    {
      id: 'hr_HR',
      label: 'hr-HR',
      name: 'Croatian (Croatia)',
      symbol: 'hr-hr',
    }
  ],
  selectedLocale = 'en-US',
  onLocaleChange,
  label = 'Description',
  spritemap = '/o/classic-theme/images/lexicon/icons.svg'
}) => {
  const quillRef = useRef(null);
  const [localizedContent, setLocalizedContent] = useState(value || {});

  // Update localized content when value prop changes
  useEffect(() => {
    setLocalizedContent(value || {});
  }, [value]);

  // Handle locale changes by ensuring content is properly saved and loaded
  useEffect(() => {
    // This effect runs when selectedLocale changes
    // The ReactQuill component will be re-rendered with the new key
    // and will display the content for the new locale
  }, [selectedLocale]);

  // Get current content for the selected locale
  const currentContent = localizedContent[selectedLocale] || '';

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  }), []);

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  const handleChange = (content) => {
    const updatedContent = {
      ...localizedContent,
      [selectedLocale]: content
    };
    setLocalizedContent(updatedContent);
    if (onChange) {
      onChange(updatedContent);
    }
  };

  const handleLocaleChange = (locale) => {
    // Save current content before switching languages
    if (quillRef.current) {
      const currentEditorContent = quillRef.current.getEditor().root.innerHTML;
      // Always save the current content, even if it's the same, to ensure consistency
      const updatedContent = {
        ...localizedContent,
        [selectedLocale]: currentEditorContent
      };
      setLocalizedContent(updatedContent);
      if (onChange) {
        onChange(updatedContent);
      }
    }
    
    if (onLocaleChange) {
      onLocaleChange(locale.label);
    }
  };

  const getQuillKey = () => `quill-${selectedLocale}`;

  return (
    <div className={`localized-rich-text-editor ${className}`} style={style}>
      <div className="localized-rich-text-header">
        <label className="form-label">
          <ClayIcon symbol="text" className="me-1" />
          {label}
        </label>
        <div className="locale-dropdown">
          <LanguagePicker
            locales={locales}
            onSelectedLocaleChange={handleLocaleChange}
            selectedLocale={locales.find(locale => locale.label === selectedLocale) || locales[0]}
            disabled={disabled || readOnly}
            spritemap={spritemap}
          />
        </div>
      </div>
      <div className="rich-text-editor">
        <ReactQuill
          ref={quillRef}
          key={getQuillKey()}
          theme="snow"
          value={currentContent}
          onChange={handleChange}
          placeholder={placeholder}
          modules={quillModules}
          formats={quillFormats}
          readOnly={readOnly}
          style={{ height: height }}
        />
      </div>
    </div>
  );
};

export default LocalizedRichTextEditor;