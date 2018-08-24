import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import T from 'core/components/Translation';

const DetailSideNavPagination = ({ showMore, isEnd }) => {
  if (isEnd) {
    return (
      <p className="side-nav-pagination">
        <T id="DetailSideNavPagination.end" />
      </p>
    );
  }

  return (
    <div className="side-nav-pagination">
      <Button raised onClick={showMore}>
        <T id="DetailSideNavPagination.showMore" />
      </Button>
    </div>
  );
};

DetailSideNavPagination.propTypes = {
  isEnd: PropTypes.bool.isRequired,
  showMore: PropTypes.func.isRequired,
};

export default DetailSideNavPagination;
