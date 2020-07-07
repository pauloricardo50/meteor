import './Quote.scss';

import React from 'react';
// import { faQuoteRight } from '@fortawesome/pro-duotone-svg-icons/faQuoteRight';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons/faQuoteRight';
import { RichText } from 'prismic-reactjs';

import FaIcon from 'core/components/Icon/FaIcon';
import colors from 'core/config/colors';

const Quote = ({ primary }) => (
  <div className="quote container">
    <figure>
      <FaIcon icon={faQuoteRight} color={colors.primary} size="3x" />
      <blockquote>{RichText.asText(primary.quote)}</blockquote>
      <figcaption>&ndash;&nbsp;{primary.quote_source}</figcaption>
    </figure>
  </div>
);

export default Quote;
