// @flow
import React from 'react';

type DialogContentSectionProps = {
  title: String,
  description: String,
  buttons: Array,
  children: React.Node,
};

const DialogContentSection = ({
  title,
  description,
  buttons,
  children,
  styles: { buttons: buttonsStyle = {} } = {},
}: DialogContentSectionProps) => (
  <div className="loan-status-modifier-dialog-content-section">
    {title && <h4>{title}</h4>}
    {description && <p className="description">{description}</p>}
    {children}
    {buttons && (
      <div
        className="loan-status-modifier-dialog-content-buttons"
        style={buttonsStyle}
      >
        {buttons}
      </div>
    )}
  </div>
);

export default DialogContentSection;
