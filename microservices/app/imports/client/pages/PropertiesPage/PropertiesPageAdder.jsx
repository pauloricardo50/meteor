// @flow
import React from 'react';

import T from 'core/components/Translation';
import { PropertyAdder, PropertyReuser } from 'core/components/PropertyForm';

type PropertiesPageAdderProps = {};

const PropertiesPageAdder = ({ loanId }: PropertiesPageAdderProps) => (
  <div className="properties-page-detail property-adder card1 card-hover">
    <PropertyAdder
      loanId={loanId}
      triggerComponent={handleOpen => (
        <div className="property-adder-button" onClick={handleOpen}>
          <span className="plus">+</span>
          <h3>
            <T id="PropertyForm.adderLabel" />
          </h3>
        </div>
      )}
      className="card-top"
    />

    <div className="card-bottom">
      <PropertyReuser loanId={loanId} />
    </div>
  </div>
);

export default PropertiesPageAdder;
