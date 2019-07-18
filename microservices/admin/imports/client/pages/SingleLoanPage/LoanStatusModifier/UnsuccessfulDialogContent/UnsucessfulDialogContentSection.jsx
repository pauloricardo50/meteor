// @flow
import React from 'react';

type UnsuccessfulDialogContentSectionProps = {
  title: String,
  description: String,
  buttons: Array,
};

const UnsuccessfulDialogContentSection = ({
  title,
  description,
  buttons,
}: UnsuccessfulDialogContentSectionProps) => (
  <div className="unsuccessful-dialog-content-section">
    <h4>{title}</h4>
    <p className="description">{description}</p>
    <div className="unsuccessful-dialog-content-section-buttons">{buttons}</div>
  </div>
);

export default UnsuccessfulDialogContentSection;
