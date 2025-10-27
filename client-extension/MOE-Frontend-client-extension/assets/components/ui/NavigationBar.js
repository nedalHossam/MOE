import React, { useState } from 'react';
import ClayButton from '@clayui/button';

const NavigationBar = ({ 
  triggerLabel = 'Navigation',
  items = [],
  className = '',
  ...props 
}) => {
  const [active, setActive] = useState(items[0]?.id || 'default');

  const handleItemClick = (itemId) => {
    setActive(itemId);
    if (props.onItemChange) {
      props.onItemChange(itemId);
    }
  };

  return (
    <nav className={`navbar ${className}`} {...props}>
      <div className="navbar-nav">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`nav-item ${active === item.id ? 'active' : ''}`}
          >
            {item.type === 'button' ? (
              <ClayButton 
                onClick={() => handleItemClick(item.id)}
                displayType={item.displayType || 'unstyled'}
              >
                {item.label}
              </ClayButton>
            ) : (
              <a
                href={item.href || '#'}
                onClick={(event) => {
                  event.preventDefault();
                  handleItemClick(item.id);
                }}
                className="nav-link"
              >
                {item.label}
              </a>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default NavigationBar;
