import React from 'react';
import { RichText } from 'prismic-reactjs';
import Button from '../Button';
import './Hero.scss';

const EqualSplit = ({ primary, fields }) => (
  <div className="equal-split">
    <div
      className="equal-split__image"
      style={{ backgroundImage: `url(${primary.images.url})` }}
    />

    <div className="equal-split__content">
      {primary.content && RichText.asText(primary.content) !== '' ? (
        <>
          <span className="image-label">
            {RichText.asText(primary.content)}
          </span>
          <div>
            {/* TODO: add logic for ExternalLink vs. Page */}
            {fields.length > 0 &&
              fields.map((field, idx) => (
                <Button
                  key={idx}
                  className="cta--button"
                  raised
                  primary
                  link
                  to={field.cta_link.url}
                >
                  {field.cta_text}
                </Button>
              ))}
          </div>
        </>
      ) : null}
    </div>
  </div>
);

const FullWidthImage = ({ primary, fields }) => (
  <div
    className="full-width-image"
    style={{ backgroundImage: `url(${primary.images.url})` }}
  >
    <div className="wrapper">
      {primary.content && RichText.asText(primary.content) !== '' ? (
        <>
          <span className="image-label">
            {RichText.asText(primary.content)}
          </span>
          <div>
            {fields.length > 0 &&
              fields.map((field, idx) => (
                <a
                  key={idx}
                  href={field.cta_link.url}
                  className="cta-button"
                  type="button"
                >
                  {field.cta_text}
                </a>
              ))}
          </div>
        </>
      ) : null}
    </div>
  </div>
);

const Hero = ({ primary, fields }) => {
  // NOTE: no field validation in Prismic, so data checks will need to be added
  if (!primary.images?.url) return null;

  switch (primary.image_layout) {
    case 'Equal Split':
      return <EqualSplit primary={primary} fields={fields} />;
    default:
      return <FullWidthImage primary={primary} fields={fields} />;
  }
};

export default Hero;
