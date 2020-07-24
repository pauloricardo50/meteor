import './Quote.scss';

import React from 'react';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons/faQuoteRight';

import FaIcon from 'core/components/Icon/FaIcon';
import colors from 'core/config/colors';

import { RichText } from '../prismic';

const Quote = ({ primary }) => (
  <div className="quote container">
    <figure>
      <FaIcon icon={faQuoteRight} color={colors.primary} size="3x" />
      <blockquote>{RichText.asText(primary.quote)}</blockquote>
      {primary.quote_source && (
        <figcaption>&ndash;&nbsp;{primary.quote_source}</figcaption>
      )}
    </figure>
  </div>
);

export default Quote;
