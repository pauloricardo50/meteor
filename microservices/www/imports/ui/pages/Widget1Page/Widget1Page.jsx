import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { compose } from 'recompose';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import TogglePoint, { TOGGLE_POINTS } from 'core/components/TogglePoint';
import {
  TooltipProviderContainer,
  TOOLTIP_LISTS,
} from 'core/components/tooltips/TooltipContext';
import Widget1PageContainer from './Widget1PageContainer';
import Widget1Part1 from './Widget1Part1';
import Widget1Part2 from './Widget1Part2';
import Widget1PageDisclaimer from './Widget1PageDisclaimer';
import Widget1Options from './Widget1Options';
import WwwLayout from '../../WwwLayout';
import { VARIANTS } from '../../WwwLayout/WwwTopNav';

const getUrl = ({ salary, fortune, propertyValue }) => {
  const queryparams = {
    property: Math.round(propertyValue),
    income: Math.round(salary),
    fortune: Math.round(fortune),
  };

  return `/start/2?${queryString.stringify(queryparams)}`;
};


const Widget1Page = ({ step, finishedTutorial, finma, fields, ...rest }) => {
  const showPart2 = finishedTutorial;
  return (
    <WwwLayout className="widget1-page">
      <WwwLayout.TopNav variant={VARIANTS.GREY} />
      <main className="www-main">
      <div className="widget1-page-content">
        <Widget1Options />
        {!showPart2 && <Widget1Part1 step={step} fields={fields} />}
        {showPart2 && <Widget1Part2 finma={finma} />}
        {showPart2 && (
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
      {showPart2 && <Widget1PageDisclaimer />}
      </main>
    </WwwLayout>
  );
};


Widget1Page.propTypes = {
  step: PropTypes.number.isRequired,
  finishedTutorial: PropTypes.bool.isRequired,
  finma: PropTypes.object.isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export { SALARY, FORTUNE, PROPERTY } from '../../../redux/reducers/widget1';
export default compose(
  TooltipProviderContainer(TOOLTIP_LISTS.WIDGET1),
  Widget1PageContainer,
)(Widget1Page);
