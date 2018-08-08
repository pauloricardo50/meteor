// @flow
import React from 'react';
import T from 'core/components/Translation';
import StarRating from 'core/components/OfferList/StarRating.jsx';
import Button from 'core/components/Button';

import MicrolocationFactor from './MicrolocationFactor';
import { withState } from 'recompose';

type MicrolocationProps = {
  microlocation: Object,
  open: boolean,
  setOpen: Function,
};

const Microlocation = ({
  microlocation: { grade, factors },
  open,
  setOpen,
}: MicrolocationProps) => (
  <div className="microlocation">
    <h3>
      <T id="Microlocation.title" />
    </h3>
    <StarRating value={grade} />
    <Button onClick={() => setOpen(!open)} primary>
      <T id={open ? 'Microlocation.close' : 'Microlocation.open'} />
    </Button>
    {open && (
      <div className="microlocation-factors">
        {Object.keys(factors).map(factor => (
          <MicrolocationFactor
            key={factor}
            label={factor}
            factors={factors[factor]}
          />
        ))}
      </div>
    )}
  </div>
);

export default withState('open', 'setOpen', false)(Microlocation);
