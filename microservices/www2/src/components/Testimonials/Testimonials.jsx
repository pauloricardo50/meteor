import React from 'react';
import { RichText } from 'prismic-reactjs';
import './Testimonials.scss';

const Testimonials = ({ primary, fields }) => (
  <div className="testimonials">
    <div className="testimonials__heading container">
      {RichText.render(primary.testimonials_heading)}
      {/* TODO: add left/right navigation */}
    </div>

    <div className="testimonials__content">
      {fields &&
        fields.map((field, idx) => (
          <div key={idx} className="testimonial">
            <div className="testimonial__image center">
              <div className="outer-circle center">
                <div className="inner-circle center">
                  <img
                    className="profile-image"
                    src={field.profile_image.url}
                    alt={field.customer_name}
                  />
                </div>
              </div>
            </div>

            <div className="testimonial__customer">
              {RichText.render(field.customer_name)}
              {RichText.render(field.customer_title)}
            </div>

            <blockquote className="testimonial__quote">
              {RichText.asText(field.customer_quote)}
            </blockquote>
          </div>
        ))}
    </div>
  </div>
);

export default Testimonials;
