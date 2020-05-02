import React from 'react';
import { RichText } from 'prismic-reactjs';
import './Quote.scss';

const Quote = ({ primary }) => (
  <div className="quote container">
    <figure>
      <blockquote>{RichText.asText(primary.quote)}</blockquote>
      <figcaption>{primary.quote_source}</figcaption>
    </figure>
  </div>
);

export default Quote;
