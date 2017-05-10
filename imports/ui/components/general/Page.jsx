import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DocHead } from 'meteor/kadira:dochead';

export default class Page extends Component {
  componentDidMount() {
    if (this.props.title) {
      DocHead.setTitle(`${this.props.title} | e-Potek`);
    } else {
      DocHead.setTitle('e-Potek');
    }
  }

  render() {
    return (
      <section className="page-title">
        <div className="top-bar">
          <h3 className="title fixed-size bold secondary">{this.props.title}</h3>
          {this.props.rightComponent}
        </div>
        <div className="children animated fadeIn">
          {this.props.children}
        </div>
      </section>
    );
  }
}

Page.propTypes = {
  title: PropTypes.string.isRequired,
  rightComponent: PropTypes.element,
  children: PropTypes.element.isRequired,
};

Page.defaultProps = {
  rightComponent: null,
};
