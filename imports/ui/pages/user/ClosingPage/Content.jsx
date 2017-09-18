import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation';

import ClosingItem from './ClosingItem';

// put all valid status at the end
const stepSorter = (a, b) => (a.status === 'valid' ? -1 : 0);

const Content = ({ steps }) => (
  <div className="description">
    <p>
      <T id="ClosingPage.description" />
    </p>

    {steps
      .sort(stepSorter)
      .map((step, i) => <ClosingItem step={step} key={i} />)}
  </div>
);

Content.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Content;
