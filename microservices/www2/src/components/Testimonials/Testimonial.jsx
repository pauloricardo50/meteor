import React from 'react';
import { RichText } from 'prismic-reactjs';

const Testimonial = ({ customerName, customerTitle, quote }) => (
  <div className="testimonial animated fadeIn">
    <div className="testimonial-header">
      <div className="testimonial-header-customer">
        {RichText.render(customerName)}
        {RichText.render(customerTitle)}
      </div>
    </div>
    <blockquote className="testimonial-quote">
      {RichText.asText(quote)}
    </blockquote>
  </div>
);

export default Testimonial;
