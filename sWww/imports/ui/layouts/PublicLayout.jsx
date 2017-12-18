import PropTypes from 'prop-types';
import React from 'react';

import TopNav from 'core/components/TopNav';

const PublicLayout = props => (
  <div style={{ height: 'inherit', width: 'inherit' }}>
    <TopNav {...props} public />
    <main className="public-layout">
      {props.children && React.cloneElement(props.children, { ...props })}
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

export default PublicLayout;
