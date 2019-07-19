// @flow
import React from 'react';

type DialogContentSectionProps = {
  title: String,
  description: String,
  buttons: Array,
};

const DialogContentSection = ({
  title,
  description,
  buttons,
}: DialogContentSectionProps) => (
  <div className="loan-status-modifier-dialog-content-section">
    <h4>{title}</h4>
    <p className="description">{description}</p>
    <div className="loan-status-modifier-dialog-content-section-buttons">
      {buttons}
    </div>
  </div>
);

export default DialogContentSection;
