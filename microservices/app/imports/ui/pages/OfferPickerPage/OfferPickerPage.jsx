import React from 'react';
import PropTypes from 'prop-types';

import ProcessPage from '/imports/ui/components/ProcessPage';
import { T } from 'core/components/Translation';

import OfferList from './OfferList';

const OfferPickerPage = (props) => {
  const { offers, loan } = props;
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
          loan={loan}
          disabled={loan.logic.step > 2}
        />
      </section>
    </ProcessPage>
  );
};

OfferPickerPage.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default OfferPickerPage;
