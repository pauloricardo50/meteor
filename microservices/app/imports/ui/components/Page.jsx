import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DocHead } from 'meteor/kadira:dochead';
import { injectIntl } from 'react-intl';
import { T } from 'core/components/Translation';

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
    const { id, className, rightComponent, children, fullWidth } = this.props;
    return (
      <section className="page-title">
        <div className={`top-bar ${className}`}>
          <h3 className="title fixed-size bold secondary">
            <T id={`${id}.title`} />
          </h3>
          {rightComponent}
        </div>
        <div
          className={`children animated fadeIn page ${fullWidth
            ? 'full-width'
            : ''}`}
        >
          {children}
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
  fullWidth: PropTypes.bool,
};

Page.defaultProps = {
  rightComponent: null,
  className: '',
  fullWidth: false,
};

export default injectIntl(Page);
