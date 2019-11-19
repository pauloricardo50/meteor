// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type EmptyChartStateProps = {};

const EmptyChartState = ({ icon, text }: EmptyChartStateProps) => (
  <div className="empty">
    <FontAwesomeIcon icon={icon} className="icon" />
    <h2 className="secondary">Aucune donnée</h2>
    <p>{text}</p>
  </div>
);

export default EmptyChartState;
