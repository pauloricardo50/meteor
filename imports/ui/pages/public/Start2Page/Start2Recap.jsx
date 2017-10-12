import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation';
import Recap from '/imports/ui/components/general/Recap';

const Start2Recap = props => (
  <div className="start2recap mask1 animated fadeInUp">
    <h3 className="recap-title bold">
      <T id="Start2Page.recapTitle" />
    </h3>
    <div className="shadow-top" />
    <div className="shadow-bottom" />
    <Recap {...props} arrayName="start2" noScale />
  </div>
);

Start2Recap.propTypes = {};

export default Start2Recap;
