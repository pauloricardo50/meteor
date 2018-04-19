import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Button from 'core/components/Button';
import { T } from 'core/components/Translation';
import TogglePoint, { TOGGLE_POINTS } from 'core/components/TogglePoint';
import Widget1PageContainer from './Widget1PageContainer';
import Widget1Nav from './Widget1Nav';
import Widget1Part1 from './Widget1Part1';
import Widget1Part2 from './Widget1Part2';

const getUrl = ({ salary, fortune, propertyValue }) => {
  const queryparams = {
    property: Math.round(propertyValue),
    income: Math.round(salary),
    fortune: Math.round(fortune),
  };

  return `/start/2?${queryString.stringify(queryparams)}`;
};

const Widget1Page = ({ step, finma, ...rest }) => (
  <div className="widget1-page">
    <Widget1Nav />
    {step <= 2 && <Widget1Part1 step={step} />}
    {step > 2 && <Widget1Part2 finma={finma} />}
    {step > 2 && (
      <TogglePoint id={TOGGLE_POINTS.WIDGET1_CONTINUE_BUTTON}>
        <Button
          color="secondary"
          className="cta"
          variant="raised"
          link
          to={getUrl(rest)}
        >
          <T id="general.continue" />
        </Button>
      </TogglePoint>
    )}
  </div>
);

Widget1Page.propTypes = {
  step: PropTypes.number.isRequired,
};

export { SALARY, FORTUNE, PROPERTY } from '../../../redux/reducers/widget1';
export default Widget1PageContainer(Widget1Page);
