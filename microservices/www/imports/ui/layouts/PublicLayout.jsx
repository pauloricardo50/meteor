import PropTypes from 'prop-types';
import React from 'react';

import TopNav from 'core/components/TopNav';
import { generalContainer } from 'core/containers/Containers';

export const PublicLayout = ({ children, ...rest }) => (
  <div style={{ height: 'inherit', width: 'inherit' }}>
    <TopNav {...rest} public />
    <main className="public-layout">
      {children && React.cloneElement(children, rest)}
    </main>
  </div>
);

PublicLayout.propTypes = {
  children: PropTypes.element,
  currentUser: PropTypes.objectOf(PropTypes.any),
};

PublicLayout.defaultProps = {
  currentUser: undefined,
  children: undefined,
};

export default generalContainer(PublicLayout);
