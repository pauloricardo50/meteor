import React from 'react';
import { useHistory } from 'react-router-dom';

import { createRoute } from 'core/utils/routerUtils';

import ADMIN_ROUTES from '../../../startup/client/adminRoutes';
import InsuranceRequestAdder from '../InsuranceRequestAdder';
import InsuranceRequestSummary from './InsuranceRequestSummary';

const InsuranceRequestsSummaryList = ({
  insuranceRequests = [],
  user,
  loan,
  withKeepAssigneesCheckbox,
}) => {
  const history = useHistory();
  return (
    <div className="mt-32">
      <h3>
        Dossiers assurance
        <InsuranceRequestAdder
          user={user}
          loan={loan}
          withKeepAssigneesCheckbox={withKeepAssigneesCheckbox}
          onSuccess={insuranceRequestId =>
            history.push(
              createRoute(ADMIN_ROUTES.SINGLE_INSURANCE_REQUEST_PAGE.path, {
                insuranceRequestId,
              }),
            )
          }
        />
      </h3>
      {insuranceRequests.map(insuranceRequest => (
        <InsuranceRequestSummary
          key={insuranceRequest._id}
          insuranceRequest={insuranceRequest}
        />
      ))}
    </div>
  );
};
export default InsuranceRequestsSummaryList;
