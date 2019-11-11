import React from 'react';

const PromotionMetadataContext = React.createContext({ permissions: {} });

export const injectPromotionMetadata = metadata => Component => props => {
  let meta = metadata;
  if (typeof metadata === 'function') {
    meta = metadata(props);
  }

  return (
    <PromotionMetadataContext.Provider value={meta}>
      <Component {...props} />
    </PromotionMetadataContext.Provider>
  );
};

export default PromotionMetadataContext;
