import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import PropTypes from 'prop-types';

import Faq from './Faq';

const FaqPageFaqs = ({ faqs }) => (
  <>
    {faqs.map(faq => (
      <Accordion key={faq}>
        <Faq.Summary faq={faq} />
        <Faq.Details faq={faq} />
      </Accordion>
    ))}
  </>
);

FaqPageFaqs.propTypes = {
  faqs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default FaqPageFaqs;
