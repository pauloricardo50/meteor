import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import PropTypes from 'prop-types';

import Faq from './Faq';

const FaqPageFaqs = ({ faqs }) => (
  <>
    {faqs.map(faq => (
      <ExpansionPanel key={faq}>
        <Faq.Summary faq={faq} />
        <Faq.Details faq={faq} />
      </ExpansionPanel>
    ))}
  </>
);

FaqPageFaqs.propTypes = {
  faqs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default FaqPageFaqs;
