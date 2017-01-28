import React, { Component, PropTypes } from 'react';

import FortuneSliders from '/imports/ui/components/general/FortuneSliders.jsx';


const styles = {
  article: {
  },
};

export default class RecapLine2 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article
        className="col-sm-10 col-sm-offset-1 startLine RecapLine mask2"
        style={styles.article}
      >
        <FortuneSliders />
      </article>
    );
  }
}

RecapLine2.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,

  propertyValue: PropTypes.string.isRequired,
  fortune: PropTypes.string.isRequired,
  insuranceFortune: PropTypes.string.isRequired,
  isFinished: PropTypes.bool.isRequired,
  isValid: PropTypes.arrayOf(PropTypes.bool).isRequired,
};
