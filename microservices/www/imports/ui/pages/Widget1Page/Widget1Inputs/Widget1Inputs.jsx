import React from 'react';

import { T } from 'core/components/Translation';

import { SALARY, FORTUNE, PROPERTY } from '../../../../redux/reducers/widget1';
import Widget1SingleInput from '../Widget1SingleInput';
import Widget1InputsError from './Widget1InputsError';

const fields = [SALARY, FORTUNE, PROPERTY];

const Widget1Inputs = ({ finma }) => (
  <div className="widget1-inputs card1">
    <h2>
      <T id="Widget1Inputs.title" />
    </h2>
    {fields.map(field => <Widget1SingleInput key={field} name={field} />)}
    <Widget1InputsError {...finma} />
  </div>
);

export default Widget1Inputs;
