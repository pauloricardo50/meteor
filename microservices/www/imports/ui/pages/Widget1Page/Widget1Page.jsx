import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import { T } from 'core/components/Translation';
import Widget1PageContainer from './Widget1PageContainer';
import Widget1Nav from './Widget1Nav';
import Widget1Part1 from './Widget1Part1';
import Widget1Part2 from './Widget1Part2';

const Widget1Page = ({ step }) => (
  <div className="widget1-page">
    <Widget1Nav />
    {step <= 2 && <Widget1Part1 step={step} />}
    {step > 2 && <Widget1Part2 />}
    {step > 2 && (
      <Button color="secondary" className="cta" variant="raised">
        <T id="general.continue" />
      </Button>
    )}
  </div>
);

Widget1Page.propTypes = {
  step: PropTypes.number.isRequired,
};

export { SALARY, FORTUNE, PROPERTY } from '../../../redux/reducers/widget1';
export default Widget1PageContainer(Widget1Page);
