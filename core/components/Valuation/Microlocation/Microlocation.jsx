// @flow
import { Meteor } from 'meteor/meteor';
import React from 'react';
import T from 'core/components/Translation';
import StarRating from 'core/components/StarRating';
import Button from 'core/components/Button';

import { withState } from 'recompose';
import MicrolocationFactor from './MicrolocationFactor';

type MicrolocationProps = {
  microlocation: Object,
  open: boolean,
  setOpen: Function,
};

export const Microlocation = ({
  microlocation: { grade, factors },
  open,
  setOpen,
}: MicrolocationProps) => (
  <div className="microlocation animated fadeIn">
    <h3>
      <T id="Microlocation.title" />
    </h3>
    <StarRating value={grade} />
    &nbsp;
    {Meteor.microservice === 'admin' && (
      <Button onClick={() => setOpen(!open)} primary raised={!open}>
        <T id={open ? 'Microlocation.close' : 'Microlocation.open'} />
      </Button>
    )}
    {open && (
      <div className="microlocation-factors animated fadeIn">
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
