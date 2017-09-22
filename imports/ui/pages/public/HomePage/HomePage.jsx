import React, { Component } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import Header from './Header';
import KeyPoints1 from './KeyPoints1';
import Browser from './Browser';
import KeyPoints2 from './KeyPoints2';
import Footer from './Footer';

export default class HomePage extends Component {
  componentDidMount() {
    DocHead.setTitle('e-Potek');
  }

  render() {
    return (
      <div style={{ display: 'unset !important' }}>
        <div name="launchaco" style={{ display: 'unset' }}>
          <Header />
          <KeyPoints1 />
          <Browser />
          <KeyPoints2 />
          <Footer />
        </div>
      </div>
    );
  }
}
