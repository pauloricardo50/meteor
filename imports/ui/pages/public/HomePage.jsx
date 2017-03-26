import React, { Component } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

const Template = require('/imports/ui/components/general/HomePageLaunchaco.jsx');

export default class HomePage extends Component {
  componentWillMount() {
    if (this.props.currentUser) {
      const referrer = document.referrer;
      if (!referrer.includes('localhost')) {
        this.props.history.push('/app');
      }
    }
  }

  componentDidMount() {
    DocHead.setTitle('e-Potek');
  }

  render() {
    return <Template style={{ display: 'unset !important' }} />;
  }
}
