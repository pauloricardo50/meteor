import React from 'react';
import PropTypes from 'prop-types';
import Overdrive from 'react-overdrive';

import { T } from 'core/components/Translation';

import { SALARY, FORTUNE, PROPERTY } from '../../../../redux/reducers/widget1';
import Widget1SingleInput from '../Widget1SingleInput';
import Widget1Finma from './Widget1Finma';

const fields = [SALARY, FORTUNE, PROPERTY];

const Widget1Inputs = ({ finma }) => (
  <div className="widget1-inputs card1">
    <h2>
      <T id="Widget1Inputs.title" />
    </h2>
    {fields.map(field => (
      <Overdrive
        id={`widget1-${field}`}
        key={field}
        duration={300}
        className="widget1-single-inputs-overdrive"
      >
        <Widget1SingleInput name={field} />
      </Overdrive>
    ))}
    <Widget1Finma {...finma} />
  </div>
);

Widget1Inputs.propTypes = {};

export default Widget1Inputs;
