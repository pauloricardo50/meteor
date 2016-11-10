import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';


const styles = {
  temporary: {
    height: 500,
  },
};

export default class FinancePage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    DocHead.setTitle('Mon Financement - e-Potek');
  }

  render() {
    return (
      <section className="mask1 animated fadeIn" style={styles.temporary}>
        <h1>Mon Financement</h1>
      </section>
    );
  }
}

FinancePage.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
