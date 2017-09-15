import React from 'react';
import PropTypes from 'prop-types';

import ProcessPage from '/imports/ui/components/general/ProcessPage';
import { T } from '/imports/ui/components/general/Translation';
import OfferList from './OfferList';

const OfferPickerPage = props => (
  <ProcessPage {...props} stepNb={2} id="offerPicker">
    <section className="mask1">
      <h1>
        <T id="OfferPickerPage.title" />
      </h1>
      <p style={{ paddingTop: 40, paddingBottom: 40 }}>
        <T id="OfferPickerPage.description" />
      </p>

      <span>TODO: Filtre</span>

      <OfferList offers={props.offers} loanRequest={props.loanRequest} />
    </section>
  </ProcessPage>
);

OfferPickerPage.propTypes = {};

export default OfferPickerPage;
