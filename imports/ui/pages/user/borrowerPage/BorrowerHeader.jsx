import React from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button.jsx';
import { Link } from 'react-router-dom';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

import { T } from '/imports/ui/components/general/Translation.jsx';

const styles = {
  div: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRight: {
    minWidth: 'unset',
    width: 36,
    marginLeft: 16,
  },
  buttonLeft: {
    minWidth: 'unset',
    width: 36,
    marginRight: 16,
  },
  emptyDiv: {
    width: 52, // Should add up to the button width + margin
  },
};

const BorrowerHeader = ({ requestId, borrower, borrowers, index, tab }) => {
  const leftUrl = `/app/requests/${requestId}/borrowers/${borrowers[index - 1] &&
    borrowers[index - 1]._id}/${tab}`;
  const rightUrl = `/app/requests/${requestId}/borrowers/${borrowers[index + 1] &&
    borrowers[index + 1]._id}/${tab}`;
  const showLeft = index > 0;
  const showRight = index + 1 < borrowers.length;

  return (
    <header className="text-center">
      <div style={styles.div}>
        {showLeft
          ? <Button raised
            icon={<ArrowLeft />}
            primary
            style={styles.buttonLeft}
            containerElement={<Link to={leftUrl} />}
            className="animated fadeIn"
          />
          : <div style={styles.emptyDiv} />}

        <span className="fa fa-user-circle-o fa-5x" />

        {showRight
          ? <Button raised
            icon={<ArrowRight />}
            primary
            style={styles.buttonRight}
            containerElement={<Link to={rightUrl} />}
            className="animated fadeIn"
          />
          : <div style={styles.emptyDiv} />}
      </div>

      <h1>
        {borrower.firstName || <T id="BorrowerHeader.title" values={{ index: index + 1 }} />}
      </h1>
      {borrower.age &&
        <h3 className="secondary">
          <T id="BorrowerHeader.age" values={{ value: borrower.age }} />
        </h3>}
    </header>
  );
};

BorrowerHeader.propTypes = {
  borrower: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  index: PropTypes.number.isRequired,
};

export default BorrowerHeader;
