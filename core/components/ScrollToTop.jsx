import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import usePrevious from '../hooks/usePrevious';

/* Every route change should scroll to top, which isn't automatic */
const ScrollToTop = ({ children, location }) => {
  const prevLocation = usePrevious(location);
  useEffect(() => {
    if (prevLocation !== location) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return children;
};

ScrollToTop.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withRouter(ScrollToTop);
