import React from 'react';
import ClayAlert from '@clayui/alert';

const Alert = ({ displayType = 'info', title, children, ...props }) => {
  return (
    <ClayAlert displayType={displayType} title={title} role={null} {...props}>
      {children}
    </ClayAlert>
  );
};

export default Alert; 