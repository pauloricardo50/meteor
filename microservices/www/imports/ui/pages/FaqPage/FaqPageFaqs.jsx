import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import { PHONE, PHONE_COMPACT, EMAIL } from '../ContactPage/contactConstants';

const answerValues = {
  contactPhone: <a href={`tel:${PHONE_COMPACT}`}>{PHONE}</a>,
  contactMail: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>,
  start1Link: (
    <Link to="/start/1">
      <T id="general.here" />
    </Link>
  ),
};

const FaqPageFaqs = ({ faqs }) => (
  <React.Fragment>
    {faqs.map(faq => (
      <ExpansionPanel key={faq}>
        <ExpansionPanelSummary
          expandIcon={
            <Icon type="expandMore" className="faq-page-faqs-expand-icon" />
          }
        >
          <h4>
            <T id={`FaqPageFaqs.${faq}.question`} />
          </h4>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <p className="description">
            <T id={`FaqPageFaqs.${faq}.answer`} values={answerValues} />
          </p>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    ))}
  </React.Fragment>
);

FaqPageFaqs.propTypes = {
  faqs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default FaqPageFaqs;
