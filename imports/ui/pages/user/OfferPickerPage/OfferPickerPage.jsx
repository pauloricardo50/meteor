import React from 'react';
import PropTypes from 'prop-types';

import ProcessPage from '/imports/ui/components/general/ProcessPage';
import { T } from '/imports/ui/components/general/Translation';

import OfferList from './OfferList';

const OfferPickerPage = (props) => {
  const { offers, loanRequest } = props;
  return (
    <ProcessPage {...props} stepNb={2} id="offerPicker">
      <section className="mask1">
        <h1>
          <T id="OfferPickerPage.title" />
        </h1>
        <p style={{ paddingTop: 40, paddingBottom: 40 }}>
          <T id="OfferPickerPage.description" />
        </p>

        <OfferList
          offers={offers}
          loanRequest={loanRequest}
          disabled={loanRequest.logic.step > 2}
        />
      </section>
    </ProcessPage>
  );
};

OfferPickerPage.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default OfferPickerPage;
