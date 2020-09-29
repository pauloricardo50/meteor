import React from 'react';

import Icon from '../Icon';
import T from '../Translation';

const ExternalUrl = ({ externalUrl, description, title, style }) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href={externalUrl}
    className="card1 card-top card-hover flex-col center external-url"
    style={style}
  >
    <Icon type="openInNew" className="external-url-icon" size={40} />
    {description && <h3>{description}</h3>}
    <h4 className="secondary">{title || <T id="ExternalUrl.title" />}</h4>
  </a>
);

export default ExternalUrl;
