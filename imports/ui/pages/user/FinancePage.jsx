import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';


export default class FinancePage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    DocHead.setTitle('Mon Financement - e-Potek');
  }

  render() {
    return (<h1>Mon Financement!</h1>);
  }
}

FinancePage.propTypes = {
};
