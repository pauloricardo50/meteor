// @flow
import React from 'react';

import DashboardRecapProperty from '../DashboardPage/DashboardRecap/DashboardRecapProperty';

type PropertiesPageDetailProps = {
  property: Object,
  loanId: string,
};

const PropertiesPageDetail = ({
  property,
  loanId,
}: PropertiesPageDetailProps) => (
  <div className="properties-page-detail">
    <DashboardRecapProperty property={property} loanId={loanId} />
  </div>
);

export default PropertiesPageDetail;
