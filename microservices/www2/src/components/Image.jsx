import React from 'react';
import Img from 'gatsby-image';

const Image = ({ data, at, ...rest }) => {
  const image = data[at];
  const sharpImage = data[`${at}Sharp`];

  if (sharpImage) {
    return (
      <Img
        fluid={sharpImage.childImageSharp?.fluid}
        fixed={sharpImage.childImageSharp?.fixed}
        alt={image.alt}
        {...rest}
      />
    );
  }

  return <img src={image.url} alt={image.alt} {...rest} />;
};

export default Image;
