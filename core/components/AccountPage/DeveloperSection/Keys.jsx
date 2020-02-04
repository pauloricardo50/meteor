//      
import React from 'react';

import T from 'core/components/Translation';
import Key from './Key';

                  
                  
  

const Keys = ({ keyPair = {} }           ) => {
  const { publicKey, privateKey, createdAt } = keyPair;
  if (!publicKey) {
    return (
      <>
        <h3>
          <T id="AccountPage.DevelopperSection.emptyState.title" />
        </h3>
        <h4 className="secondary">
          <T id="AccountPage.DevelopperSection.emptyState.description" />
        </h4>
      </>
    );
  }

  return (
    <>
      <Key
        keyValue={publicKey}
        createdAt={createdAt}
        type="public"
        hidden={!privateKey}
        key={publicKey}
      />
      {privateKey && (
        <Key
          keyValue={privateKey}
          createdAt={createdAt}
          type="private"
          hidden={false}
          key="private"
        />
      )}
    </>
  );
};

export default Keys;
