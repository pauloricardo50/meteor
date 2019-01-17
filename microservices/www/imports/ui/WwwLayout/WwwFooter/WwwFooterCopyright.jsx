import React from 'react';

import Icon from 'core/components/Icon';

const WwwFooterCopyright = () => (
  <small className="copyright">
    Copyright - e-Potek {new Date().getFullYear()} &bull; Hébergé et sécurisé en{' '}
    <Icon type="health" className="switzerland" />
    <br />
    UID : CHE-405.084.029 -{' '}
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
