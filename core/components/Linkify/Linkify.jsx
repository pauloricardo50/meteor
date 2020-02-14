import React from 'react';
import DefaultLinkify from 'react-linkify';

const makeComponentDecorator = props => (href, text, key) => {
  const { newTab = true, textTransform, style = {}, Front } = props;
  return (
    <b>
      <a
        className="linkify-link"
        href={href}
        key={key}
        target={newTab ? '_blank' : '_self'}
        style={style}
        onClick={event => {
          event.stopPropagation();
          if (Front) {
            console.log('Front:', Front);
            event.preventDefault();
            Front.openUrl(href);
          }
        }}
      >
        {textTransform ? textTransform(text) : text}
      </a>
    </b>
  );
};

const Linkify = ({ children, ...props }) => (
  <DefaultLinkify componentDecorator={makeComponentDecorator(props)}>
    {children}
  </DefaultLinkify>
);

export default Linkify;
