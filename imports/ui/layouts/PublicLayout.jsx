import PropTypes from 'prop-types';
import React from 'react';

import PublicNav from '/imports/ui/components/general/PublicNav.jsx';
import RouteTransition
  from '/imports/ui/components/general/RouteTransition.jsx';

const PublicLayout = props => (
  <div>
    <PublicNav {...props} />
    <main className="public-layout">
      {React.cloneElement(props.children, { ...props })}
    </main>
  </div>
);

PublicLayout.propTypes = {
  children: PropTypes.element.isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any),
};

export default PublicLayout;
