import React from 'react';
import { RichText } from 'prismic-reactjs';
import './Testimonials.scss';

const Testimonials = ({ primary, fields }) => (
  <div className="testimonials container">
    <div className="testimonials__heading">
      {RichText.render(primary.testimonials_heading)}
    </div>

    {fields &&
      fields.map((field, idx) => (
        <div key={idx} className="testimonial">
          <div className="testimonial__image">
            <img
              className="profile-image"
              src={field.profile_image.url}
              alt={field.customer_name}
            />
          </div>

          <div className="testimonial__content">
            <div className="testimonial__customer">
              {RichText.render(field.customer_name)}
              {RichText.render(field.customer_title)}
            </div>
            <blockquote>{RichText.render(field.customer_quote)}</blockquote>
          </div>
        </div>
      ))}
  </div>
);

export default Testimonials;
