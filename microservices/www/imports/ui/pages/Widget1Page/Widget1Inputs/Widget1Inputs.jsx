import React from 'react';

import T from 'core/components/Translation';

import { SALARY, FORTUNE, PROPERTY } from '../../../../redux/reducers/widget1';
import Widget1SingleInput from '../Widget1SingleInput';
import Widget1InputsError from './Widget1InputsError';
import Widget1InputsReset from './Widget1InputsReset';

const fields = [SALARY, FORTUNE, PROPERTY];

const Widget1Inputs = ({ finma }) => (
  <div className="widget1-inputs card1">
    <h3>
      <T id="Widget1Inputs.title" />
    </h3>
    <Widget1InputsReset />
    {fields.map(field => <Widget1SingleInput key={field} name={field} />)}
    <Widget1InputsError {...finma} />
  </div>
);

export default Widget1Inputs;
