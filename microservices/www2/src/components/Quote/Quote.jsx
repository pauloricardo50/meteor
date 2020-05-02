import React from 'react';
import { RichText } from 'prismic-reactjs';
import './Quote.scss';

export default ({ slice }) => (
  <div className="post-quote container">
    <blockquote>{RichText.asText(slice.primary.quote)}</blockquote>
  </div>
);
