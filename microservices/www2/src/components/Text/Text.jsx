import React from 'react';
import { RichText } from 'prismic-reactjs';
import { linkResolver } from '../../utils/linkResolver';
import htmlSerializer from '../../utils/htmlSerializer';
import './Text.scss';

const Text = ({ primary }) => (
  <div className="text container">
    <div>{RichText.render(primary.content, linkResolver, htmlSerializer)}</div>
  </div>
);

export default Text;
