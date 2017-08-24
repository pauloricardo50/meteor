import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProcessPage from '/imports/ui/components/general/ProcessPage.jsx';

export default class LenderPickerPage extends Component {
  render() {
    return (
      <ProcessPage {...this.props} stepNb={2} id="lenderPicker">
        <section className="mask1">
          <h1>Hello world</h1>
        </section>
      </ProcessPage>
    );
  }
}

LenderPickerPage.propTypes = {};
