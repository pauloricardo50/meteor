import React from 'react';
import PropTypes from 'prop-types';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Icon from 'core/components/Icon';
import { T } from 'core/components/Translation';

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
          <p>
            <T id={`FaqPageFaqs.${faq}.answer`} />
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
