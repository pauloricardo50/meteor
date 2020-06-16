import React, { useContext } from 'react';

const PromotionPageContext = React.createContext({ permissions: {} });

export const withPromotionPageContext = (
  getData = {},
) => Component => props => {
  const { promotion } = props;

  const data = {
    promotion,
    permissions: {},
    ...(typeof getData === 'function' ? getData(props) : getData),
  };

  return (
    <PromotionPageContext.Provider value={data}>
      <Component {...props} />
    </PromotionPageContext.Provider>
  );
};

export const usePromotion = () => useContext(PromotionPageContext);
