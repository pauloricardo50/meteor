import React from 'react';

import Button from '../../../Button';

const copyLinkToClipboard = link => {
  navigator.clipboard
    .writeText(link)
    .then(() => import('../../../../utils/message'))
    .then(({ default: message }) => {
      message.success('Lien copié dans le presse-papier !');
    });
};

const PublicLink = ({ link }) => (
  <div className="public-link">
    <a className="public-link-value" href={link}>
      {link}
    </a>
    <Button
      primary
      raised
      label="Copier le lien"
      onClick={() => copyLinkToClipboard(link)}
    />
  </div>
);

export default PublicLink;
