import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';

import Widget1SingleInput from '../Widget1SingleInput';
import Widget1InputsError from './Widget1InputsError';
import Widget1InputsReset from './Widget1InputsReset';
import Widget1InputsContainer from './Widget1InputsContainer';

export const Widget1Inputs = ({ finma, fields }) => (
  <div className="widget1-inputs card1">
    <h3>
      <T id="Widget1Inputs.title" />
    </h3>
    <Widget1InputsReset />
    {fields.map(field => <Widget1SingleInput key={field} name={field} />)}
    <Widget1InputsError {...finma} />
  </div>
);

Widget1Inputs.propTypes = {
  finma: PropTypes.object.isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Widget1InputsContainer(Widget1Inputs);
