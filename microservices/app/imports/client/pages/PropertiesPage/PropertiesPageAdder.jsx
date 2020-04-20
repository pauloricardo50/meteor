import React, { useContext } from 'react';

import { PropertyAdder } from 'core/components/PropertyForm';
import T from 'core/components/Translation';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';

const PropertiesPageAdder = ({ loanId }) => {
  const currentUser = useContext(CurrentUserContext);

  return (
    <div className="properties-page-detail property-adder card1 card-hover">
      <PropertyAdder
        loanId={loanId}
        userId={currentUser?._id}
        TriggerComponent={
          <div className="property-adder-button">
            <span className="plus">+</span>
            <h3>
              <T id="PropertyForm.adderLabel" />
            </h3>
          </div>
        }
        className="card-top"
      />
    </div>
  );
};

export default PropertiesPageAdder;
