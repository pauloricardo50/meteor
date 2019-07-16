// @flow
import React from 'react';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import Icon from 'core/components/Icon';
import Link from 'core/components/Link';
import T from 'core/components/Translation';
import { PHONE, PHONE_COMPACT, EMAIL } from '../ContactPage/contactConstants';

type FaqProps = {};

const answerValues = {
  contactPhone: <a href={`tel:${PHONE_COMPACT}`}>{PHONE}</a>,
  contactMail: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>,
  start1Link: (
    <Link to="/start/1">
      <T id="general.here" />
    </Link>
  ),
};

const Faq = {};

Faq.Summary = React.memo(({ faq, ...props }) => (
  <ExpansionPanelSummary
    {...props}
    expandIcon={
      <Icon type="expandMore" className="faq-page-faqs-expand-icon" />
    }
  >
    <h4>
      <T id={`FaqPageFaqs.${faq}.question`} />
    </h4>
  </ExpansionPanelSummary>
));

Faq.Details = React.memo(({ faq }) => (
  <ExpansionPanelDetails>
    <p className="description">
      <T id={`FaqPageFaqs.${faq}.answer`} values={answerValues} />
    </p>
  </ExpansionPanelDetails>
));

Faq.Summary.muiName = ExpansionPanelSummary.muiName;

export default Faq;
