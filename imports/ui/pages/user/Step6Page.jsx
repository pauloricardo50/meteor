import React, { PropTypes } from 'react';

const styles = {
  home: {
    width: '100%',
  },
};

const Step6Page = () => (
  <div className="animated fadeIn">
    <span
      className="fa fa-home fa-5x animated pulse infinite active text-center"
      style={styles.home}
    />
  </div>
);

Step6Page.propTypes = {};

export default Step6Page;
