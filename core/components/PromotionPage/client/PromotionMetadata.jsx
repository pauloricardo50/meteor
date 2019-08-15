import React from 'react';

const PromotionMetadataContext = React.createContext();

export const injectPromotionMetadata = metadata => Component => (props) => {
  let meta = metadata;
  if (typeof metadata === 'function') {
    meta = metadata(props);
  }
  // Metadata shouldn't change often, so don't rerender all affected
  // consumers if this is rerendered. Because Consumer uses shallow
  // equality to determine if it should rerender
  return (
    <PromotionMetadataContext.Provider value={meta}>
      <Component {...props} />
    </PromotionMetadataContext.Provider>
  );
};

export default PromotionMetadataContext;
