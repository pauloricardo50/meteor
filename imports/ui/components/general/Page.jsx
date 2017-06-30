import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DocHead } from 'meteor/kadira:dochead';
import { injectIntl } from 'react-intl';
import { T } from '/imports/ui/components/general/Translation.jsx';

class Page extends Component {
  componentDidMount() {
    if (this.props.id) {
      DocHead.setTitle(
        `${this.props.intl.formatMessage({
          id: `${this.props.id}.title`,
        })} | e-Potek`,
      );
    } else {
      DocHead.setTitle('e-Potek');
    }
  }

  render() {
    return (
      <section className="page-title">
        <div className={`top-bar ${this.props.className}`}>
          <h3 className="title fixed-size bold secondary">
            <T id={`${this.props.id}.title`} />
          </h3>
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
  id: PropTypes.string.isRequired,
  rightComponent: PropTypes.element,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
    .isRequired,
  className: PropTypes.string,
};

Page.defaultProps = {
  rightComponent: null,
  className: '',
};

export default injectIntl(Page);
