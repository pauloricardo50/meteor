// @flow
import React from 'react';
import T from 'core/components/Translation';
import StarRating from 'core/components/OfferList/StarRating.jsx';

import MicrolocationFactor from './MicrolocationFactor';

type MicrolocationProps = {
  microlocation: Object,
};

const Microlocation = ({
  microlocation: { grade, factors },
}: MicrolocationProps) => (
  <div className="microlocation">
    <h3>
      <T id="Microlocation.title" />
    </h3>
    <StarRating value={grade} />
    <div className="microlocation-factors">
      {Object.keys(factors).map(factor => (
        <MicrolocationFactor
          key={factor}
          label={factor}
          factors={factors[factor]}
        />
      ))}
    </div>
  </div>
);

export default Microlocation;
