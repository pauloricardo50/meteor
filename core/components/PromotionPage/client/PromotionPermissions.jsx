import React, { useState } from 'react';

const PromotionPermissionsContext = React.createContext();

export const injectPromotionPermissions = permissions => Component => (props) => {
  // Permissions shouldn't change often, so don't rerender all affected
  // consumers if this is rerendered. Because Consumer uses shallow
  // equality to determine if it should rerender
  const [permissionsMemo] = useState(permissions);
  return (
    <PromotionPermissionsContext.Provider value={permissionsMemo}>
      <Component {...props} />
    </PromotionPermissionsContext.Provider>
  );
};

export default PromotionPermissionsContext;
