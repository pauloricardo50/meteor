import React, { Component, PropTypes } from 'react';
import Step1InitialForm from '/imports/ui/components/steps/Step1InitialForm.jsx';


const styles = {
  mask: {
    marginBottom: 40,
  },
  p: {
    padding: 40,
  },
};


export default class Step1Part1 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="mask2" style={styles.mask}>
        <h2>Mon Projet</h2>

        <Step1InitialForm loanRequest={this.props.loanRequest} />
      </article>
    );
  }
}

Step1Part1.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
