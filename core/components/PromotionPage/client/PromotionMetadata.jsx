import React, { useState } from 'react';

const PromotionMetadataContext = React.createContext();

export const injectPromotionMetadata = metadata => Component => (props) => {
  // Metadata shouldn't change often, so don't rerender all affected
  // consumers if this is rerendered. Because Consumer uses shallow
  // equality to determine if it should rerender
  const [metadataMemo] = useState(metadata);
  return (
    <PromotionMetadataContext.Provider value={metadataMemo}>
      <Component {...props} />
    </PromotionMetadataContext.Provider>
  );
};

export default PromotionMetadataContext;
