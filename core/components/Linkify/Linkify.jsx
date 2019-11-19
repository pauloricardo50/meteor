// @flow
import React from 'react';
import DefaultLinkify from 'react-linkify';

type LinkifyProps = {};

const makeComponentDecorator = props => (href, text, key) => {
  const { newTab = true, textTransform, style = {} } = props;
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
        }}
      >
        {textTransform ? textTransform(text) : text}
      </a>
    </b>
  );
};

const Linkify = ({ children, ...props }: LinkifyProps) => (
  <DefaultLinkify componentDecorator={makeComponentDecorator(props)}>
    {children}
  </DefaultLinkify>
);

export default Linkify;
