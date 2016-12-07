import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import FinanceStrategyPicker from '/imports/ui/components/general/FinanceStrategyPicker.jsx';


export default class FinancePage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    DocHead.setTitle('Mon Financement - e-Potek');
  }

  render() {
    return (
      <section className="mask1 animated fadeIn">
        <h1>Mon Financement</h1>

        {/* <FinanceStrategyPicker creditRequest={this.props.creditRequest} /> */}
      </section>
    );
  }
}

FinancePage.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
