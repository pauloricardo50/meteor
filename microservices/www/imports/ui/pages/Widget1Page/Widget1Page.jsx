import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import CTAS from 'core/api/analytics/ctas';
import { ctaClicked } from 'core/api/analytics/helpers';
import Button from 'core/components/Button';
import PageHead from 'core/components/PageHead';
import {
  TOOLTIP_LISTS,
  TooltipProviderContainer,
} from 'core/components/tooltips/TooltipContext';
import T from 'core/components/Translation';
import Widget1Options from 'core/components/widget1/Widget1Options';
import Widget1Part1 from 'core/components/widget1/Widget1Part1';
import Widget1Part2 from 'core/components/widget1/Widget1Part2';

import { WWW_ROUTES } from '../../../startup/shared/Routes';
import WwwLayout from '../../WwwLayout';
import { VARIANTS } from '../../WwwLayout/WwwTopNav';
import Widget1PageContainer from './Widget1PageContainer';
import Widget1PageDisclaimer from './Widget1PageDisclaimer';

const Widget1Page = ({ step, finishedTutorial, finma, fields, history }) => {
  const showPart2 = finishedTutorial;
  return (
    <WwwLayout className="widget1-page">
      <PageHead
        titleId="Widget1Page.title"
        descriptionId="Widget1Page.description"
      />
      <WwwLayout.TopNav variant={VARIANTS.GREY} />
      <WwwLayout.Content>
        <div className="widget1-page-content">
          <Widget1Options />
          {!showPart2 && <Widget1Part1 step={step} fields={fields} />}
          {showPart2 && <Widget1Part2 finma={finma} />}
          {showPart2 && (
            <Button
              secondary
              className="cta"
              raised
              href={Meteor.settings.public.subdomains.app}
              onClick={() => {
                ctaClicked({ name: CTAS.START, history, routes: WWW_ROUTES });
              }}
            >
              <T id="general.continue" />
            </Button>
          )}
        </div>
        {showPart2 && <Widget1PageDisclaimer />}
      </WwwLayout.Content>
    </WwwLayout>
  );
};

Widget1Page.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  finishedTutorial: PropTypes.bool.isRequired,
  finma: PropTypes.object.isRequired,
  step: PropTypes.number.isRequired,
};

export default compose(
  TooltipProviderContainer(TOOLTIP_LISTS.WIDGET1),
  Widget1PageContainer,
)(Widget1Page);
