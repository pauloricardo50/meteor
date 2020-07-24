import './Text.scss';

import React from 'react';

import htmlSerializer from '../../utils/htmlSerializer';
import { RichText } from '../prismic';

const Text = ({ primary }) => (
  <div className="text container">
    <RichText render={primary.content} htmlSerializer={htmlSerializer} />
  </div>
);

export default Text;
