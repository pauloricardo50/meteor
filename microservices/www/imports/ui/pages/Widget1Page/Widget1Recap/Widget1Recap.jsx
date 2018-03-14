import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';

const Widget1Recap = props => (
  <div className="card1 widget1-recap">
    <h2>
      <T id="Widget1Recap.title" />
    </h2>
  </div>
);

Widget1Recap.propTypes = {};

export default Widget1Recap;
