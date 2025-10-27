import React from 'react';
import ClayButton from '@clayui/button';

/**
 * Button Component
 * A reusable button component with Clay UI styling and custom button styles
 * 
 * @param {Object} props - Component props
 * @param {string} props.displayType - Button display type (primary, secondary, etc.)
 * @param {string} props.children - Button content
 * @param {string} props.label - Button label text (alternative to children)
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {Object} props.style - Inline styles
 * @param {string} props.btnStyle - Custom button style class (btn-main-primary, btn-main-primary-outline, etc.)
 * @param {boolean} props.isLoading - Loading state for submit buttons
 * @param {string} props.loadingText - Text to show when loading
 */
const Button = ({ 
  children, 
  label,
  onClick, 
  type = 'button', 
  displayType = '',
  className = '',
  disabled = false,
  style = {},
  btnStyle = '',
  isLoading = false,
  loadingText = 'Loading...',
  ...props 
}) => {
  // Determine the final className
  const getButtonClass = () => {
    if (btnStyle) {
      return `btn-style ${btnStyle} ${className}`.trim();
    }
    
    // Default Clay UI styling
    const baseClass = 'clay-btn';
    const displayClass = `clay-btn-${displayType}`;
    return `${baseClass} ${displayClass} ${className}`.trim();
  };

  // Determine button content
  const buttonContent = label || children;
  const displayContent = isLoading ? loadingText : buttonContent;

  // Determine if button should be disabled
  const isDisabled = disabled || isLoading;

  return (
    <ClayButton
      displayType={displayType}
      onClick={onClick}
      type={type}
      className={getButtonClass()}
      disabled={isDisabled}
      style={style}
      {...props}
    >
      {displayContent}
    </ClayButton>
  );
};

export default Button; 