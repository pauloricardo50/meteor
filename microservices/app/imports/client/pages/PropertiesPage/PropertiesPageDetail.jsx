// @flow
import React from 'react';

import DashboardRecapProperty from '../DashboardPage/DashboardRecap/DashboardRecapProperty';

type PropertiesPageDetailProps = {};

const PropertiesPageDetail = ({ property }: PropertiesPageDetailProps) => (
  <div className="card1 card-hover properties-page-detail">
    <DashboardRecapProperty property={property} />
  </div>
);

export default PropertiesPageDetail;
