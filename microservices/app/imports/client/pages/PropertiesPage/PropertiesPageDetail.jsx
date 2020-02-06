//
import React from 'react';

import DashboardRecapProperty from '../DashboardPage/DashboardRecap/DashboardRecapProperty';

const PropertiesPageDetail = ({ property, loanId }) => (
  <div className="properties-page-detail">
    <DashboardRecapProperty property={property} loanId={loanId} />
  </div>
);

export default PropertiesPageDetail;
