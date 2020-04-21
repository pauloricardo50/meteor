import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import { PropertyAdder } from 'core/components/PropertyForm';
import T from 'core/components/Translation';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import { createRoute } from 'core/utils/routerUtils';

import APP_ROUTES from '../../../startup/client/appRoutes';

const triggerComponent = ({ onClick }) => (
  <div className="property-adder-button" onClick={onClick}>
    <span className="plus">+</span>
    <h3>
      <T id="PropertyForm.adderLabel" />
    </h3>
  </div>
);

const makeOnSubmitSuccess = ({ history, loanId }) => propertyId =>
  history.push(
    createRoute(APP_ROUTES.PROPERTY_PAGE.path, {
      loanId,
      propertyId,
    }),
  );

const PropertiesPageAdder = ({ loanId, purchaseType }) => {
  const history = useHistory();
  const currentUser = useContext(CurrentUserContext);
  const onSubmitSuccess = makeOnSubmitSuccess({ history, loanId });
  return (
    <div className="properties-page-detail property-adder card1 card-hover">
      <PropertyAdder
        loanId={loanId}
        userId={currentUser?._id}
        triggerComponent={triggerComponent}
        className="card-top"
        onSubmitSuccess={onSubmitSuccess}
        isRefinancing={purchaseType === PURCHASE_TYPE.REFINANCING}
      />
    </div>
  );
};

export default PropertiesPageAdder;
