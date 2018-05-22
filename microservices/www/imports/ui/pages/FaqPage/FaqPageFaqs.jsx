import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Icon from 'core/components/Icon';
import { T } from 'core/components/Translation';

const answerValues = {
  contactPhone: <a href="tel:+41225660110">+41 22 566 01 10</a>,
  contactMail: <a href="mailto:info@e-potek.ch">info@e-potek.ch</a>,
  howMuchCanIBorrowLink: (
    <Link to="/start/1">
      <T id="general.here" />
    </Link>
  ),
};

const FaqPageFaqs = ({ faqs }) => (
  <React.Fragment>
    {faqs.map(faq => (
      <ExpansionPanel key={faq}>
        <ExpansionPanelSummary expandIcon={<Icon type="expandMore" />}>
          <h3>
            <T id={`FaqPageFaqs.${faq}.question`} />
          </h3>
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
