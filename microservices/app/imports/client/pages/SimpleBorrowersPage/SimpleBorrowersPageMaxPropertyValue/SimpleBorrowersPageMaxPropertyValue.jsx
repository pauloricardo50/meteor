// @flow
import React from 'react';

import useMedia from 'core/hooks/useMedia';
import SimpleBorrowersPageMaxPropertyValueSticky from './SimpleBorrowersPageMaxPropertyValueSticky';

type SimpleBorrowersPageMaxPropertyValueProps = {};

const SimpleBorrowersPageMaxPropertyValue = (props: SimpleBorrowersPageMaxPropertyValueProps) => {
  const isMobile = useMedia({ maxWidth: 992 });

  if (isMobile) {
    return <SimpleBorrowersPageMaxPropertyValueSticky />;
  }

  return (
    <div className="card1 card-top simple-borrowers-page-max-property-value">
      <h2>Votre capacité d'achat maximale</h2>
    </div>
  );
};

export default SimpleBorrowersPageMaxPropertyValue;
