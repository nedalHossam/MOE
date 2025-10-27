import React, { useState } from 'react';
import ClayModal, { useModal, ClayModalProvider } from '@clayui/modal';
import ClayButton from '@clayui/button';

const Modal = ({
  title,
  children,
  confirmButtonLabel = 'Confirm',
  cancelButtonLabel = 'Cancel',
  onConfirm,
  onCancel,
  trigger,
}) => {
  const [visible, setVisible] = useState(false);
  const { observer, onClose } = useModal({
    onClose: () => setVisible(false),
  });

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <>
      {React.cloneElement(trigger, { onClick: () => setVisible(true) })}
      {visible && (
        <ClayModal
          observer={observer}
          size="lg"
          status="info"
        >
          <ClayModal.Header>{title}</ClayModal.Header>
          <ClayModal.Body>
            {children}
          </ClayModal.Body>
          <ClayModal.Footer
            last={
              <ClayButton.Group spaced>
                <ClayButton displayType="secondary" onClick={handleCancel}>{cancelButtonLabel}</ClayButton>
                <ClayButton displayType="success" onClick={handleConfirm}>{confirmButtonLabel}</ClayButton>
              </ClayButton.Group>
            }
          />
        </ClayModal>
      )}
    </>
  );
};

export default Modal; 