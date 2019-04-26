import { Meteor } from 'meteor/meteor';

import React from 'react';

import Icon from 'core/components/Icon';

const WwwFooterCopyright = () => (
  <small className="copyright">
    Copyright - e-Potek {new Date().getFullYear()} &bull; Hébergé et sécurisé en{' '}
    <Icon type="health" className="switzerland" />
    <br />
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`${Meteor.settings.public.subdomains.www}/files/Privacy Policy - e-Potek.pdf`}
    >
      Privacy policy
    </a>{' '}&bull;{' '}
    UID : CHE-405.084.029 &bull;{' '}
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="http://register.finma.ch/ReportRegister.aspx?lng=fr&regnr=33709"
    >
      Finma No. 33'709
    </a>
  </small>
);

export default WwwFooterCopyright;
