import React from 'react';

import CalendlyInline from '../Calendly/CalendlyInline';
import Dialog from '../Material/Dialog';

const CalendlyModal = props => {
  const { link, open, onClose } = props;
  return (
    <Dialog
      fullWidth
      title="Programmer un rendez-vous"
      actions={[]}
      open={open}
      onClose={onClose}
    >
      <CalendlyInline url={link} />
    </Dialog>
  );
};

export default CalendlyModal;
