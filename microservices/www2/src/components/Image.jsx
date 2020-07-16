import React from 'react';
import Img from 'gatsby-image';

const Image = ({ prismicImage, ...rest }) => {
  const sharpImage = prismicImage?.childImageSharp?.fluid;

  if (sharpImage) {
    return <Img fluid={sharpImage} {...rest} />;
  }

  return <img src={prismicImage?.url} alt={prismicImage.alt} {...rest} />;
};

export default Image;
