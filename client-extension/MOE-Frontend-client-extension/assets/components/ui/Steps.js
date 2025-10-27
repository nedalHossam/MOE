import React from 'react';
import ClayIcon from '@clayui/icon';

/**
 * Steps component - Updated to match MultiStepNav from VehicleAddForm
 * @param {Object[]} steps - Array of step objects {title, description}
 * @param {number} currentStep - The current active step index
 * @param {function} onStepChange - Callback when a step is clicked (receives step index)
 * @param {string} spritemap - Path to the Clay icon spritemap
 * @param {string} direction - Text direction ('ltr' or 'rtl')
 * @param {boolean} isRTL - Whether the component should render in RTL mode
 */
const Steps = ({ 
  steps = [], 
  currentStep = 0, 
  onStepChange, 
  spritemap = '/o/classic-theme/images/lexicon/icons.svg',
  direction = 'ltr',
  isRTL = false
}) => {
  // For RTL, we need to reverse the steps array and adjust the currentStep index
  const displaySteps = isRTL ? [...steps].reverse() : steps;
  const displayCurrentStep = isRTL ? (steps.length - 1 - currentStep) : currentStep;
  
  // Handle step click with proper error checking
  const handleStepClick = (originalIndex) => {
    if (typeof onStepChange === 'function') {
      onStepChange(originalIndex);
    }
  };
  
  return (
    <div className={`multi-step-nav ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="multi-step-nav-container">
        {displaySteps.map((step, index) => {
          // Calculate the original index for step change handling
          const originalIndex = isRTL ? (steps.length - 1 - index) : index;
          const isCompleted = isRTL ? (originalIndex < currentStep) : (index < currentStep);
          
          return (
            <div
              key={originalIndex}
              className={`multi-step-nav-item ${index === displayCurrentStep ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => handleStepClick(originalIndex)}
              data-tooltip={step.title}
              title={step.title}
              style={{ cursor: onStepChange ? 'pointer' : 'default' }}
            >
              <div className="multi-step-nav-indicator">
                {isCompleted ? (
                  <>
                    <ClayIcon symbol="check" className="multi-step-nav-check" spritemap={spritemap} />
                    <span className="multi-step-nav-check-fallback" style={{ display: 'none' }}>✓</span>
                  </>
                ) : (
                  <span className="multi-step-nav-number">{originalIndex + 1}</span>
                )}
              </div>
              <div className="multi-step-nav-title">{step.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Steps; 