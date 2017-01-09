import React, { Component } from 'react';
import { DocHead } from 'meteor/kadira:dochead';


const Template = require('/imports/ui/launchaco/index.jsx');


export default class HomePage extends Component {
  componentDidMount() {
    DocHead.setTitle('e-Potek');
  }

  render() {
    return (
      <Template style={{ display: 'unset !important' }} />
    );
  }
}
