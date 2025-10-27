import React, { useMemo, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ClayIcon from '@clayui/icon';

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Enter text...', 
  className = '',
  style = {},
  disabled = false,
  readOnly = false,
  height = '200px'
}) => {
  const quillRef = useRef(null);

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
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <div className={`rich-text-editor ${className}`} style={style}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        modules={quillModules}
        formats={quillFormats}
        readOnly={readOnly}
        style={{ height: height }}
      />
    </div>
  );
};

export default RichTextEditor;
