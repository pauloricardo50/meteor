import React, { Component } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import Template from '/imports/ui/components/general/HomePageLaunchaco.jsx';

export default class HomePage extends Component {
  componentDidMount() {
    DocHead.setTitle('e-Potek');
  }

  render() {
    return <Template style={{ display: 'unset !important' }} />;
  }
}
