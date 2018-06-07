import React from 'react';
import PropTypes from 'prop-types';

import { withProps } from 'recompose';
import T from 'core/components/Translation';
import faqs from './faqs';
import FaqPageFaqs from './FaqPageFaqs';

export const FaqPageList = ({ faqList }) => (
  <div className="faq-page-list">
    {Object.keys(faqList).map(faqCategory => (
      <div
        className="faq-page-list-category"
        key={faqCategory}
        id={faqCategory}
      >
        <h2>
          <T id={`FaqPage.categories.${faqCategory}`} />
        </h2>
        <FaqPageFaqs faqs={faqList[faqCategory]} />
      </div>
    ))}
  </div>
);

FaqPageList.propTypes = {
  faqList: PropTypes.object.isRequired,
};

export default withProps({ faqList: faqs })(FaqPageList);
