import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import OfferList from 'core/components/OfferList';
import Page from '../../components/Page';

const OfferPickerPage = (props) => {
  const { offers, loan, property } = props;
  return (
    <Page id="offerPicker">
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
          property={property}
          disabled={loan.logic.step > 2}
        />
      </section>
    </Page>
  );
};

OfferPickerPage.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OfferPickerPage;
