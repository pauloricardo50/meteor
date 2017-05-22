import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

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

const Header = ({ borrower, borrowers, index }) => {
  const leftUrl = `/app/borrowers/${borrowers[index - 1] && borrowers[index - 1]._id}`;
  const rightUrl = `/app/borrowers/${borrowers[index + 1] && borrowers[index + 1]._id}`;
  const showLeft = index > 0;
  const showRight = index + 1 < borrowers.length;

  return (
    <header className="text-center">
      <div style={styles.div}>
        {showLeft
          ? <RaisedButton
            icon={<ArrowLeft />}
            primary
            style={styles.buttonLeft}
            containerElement={<Link to={leftUrl} />}
            className="animated fadeIn"
          />
          : <div style={styles.emptyDiv} />}

        <span className="fa fa-user-circle-o fa-5x" />

        {showRight
          ? <RaisedButton
            icon={<ArrowRight />}
            primary
            style={styles.buttonRight}
            containerElement={<Link to={rightUrl} />}
            className="animated fadeIn"
          />
          : <div style={styles.emptyDiv} />}
      </div>

      <h1>
        {borrower.firstName || `Emprunteur ${index + 1}`}
      </h1>{borrower.age && <h3 className="secondary">{borrower.age} ans</h3>}
    </header>
  );
};

Header.propTypes = {
  borrower: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  index: PropTypes.number.isRequired,
};

export default Header;
