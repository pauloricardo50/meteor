import React from 'react';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';

import Icon from 'core/components/Icon';
import Link from 'core/components/Link';
import T from 'core/components/Translation';

import { EMAIL, PHONE, PHONE_COMPACT } from '../ContactPage/contactConstants';

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
  <AccordionSummary
    {...props}
    expandIcon={
      <Icon type="expandMore" className="faq-page-faqs-expand-icon" />
    }
  >
    <h4>
      <T id={`FaqPageFaqs.${faq}.question`} />
    </h4>
  </AccordionSummary>
));

Faq.Details = React.memo(({ faq }) => (
  <AccordionDetails>
    <p className="description">
      <T id={`FaqPageFaqs.${faq}.answer`} values={answerValues} />
    </p>
  </AccordionDetails>
));

Faq.Summary.muiName = AccordionDetails.muiName;

export default Faq;
