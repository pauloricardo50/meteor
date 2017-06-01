import PropTypes from 'prop-types';
import React from 'react';

import TopNav from '/imports/ui/components/general/TopNav.jsx';
// import RouteTransition from '/imports/ui/components/general/RouteTransition.jsx';

const PublicLayout = props => (
  <div>
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
