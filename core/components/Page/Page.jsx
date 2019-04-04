import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { injectIntl } from 'react-intl';

import PageHead from '../PageHead';
import T from '../Translation';

const Page = ({
  id,
  className,
  rightComponent,
  children,
  fullWidth,
  topFullWidth,
  shouldShowSideNav,
  title,
}) => (
  <section id={id} className="page-title">
    <PageHead titleId={id} title={title} />
    <div
      className={classnames('top-bar', className, {
        'full-width': topFullWidth || !shouldShowSideNav,
      })}
    >
      <h3 className="title fixed-size bold secondary">
        {title || <T id={`${id}.title`} />}
      </h3>
      {rightComponent}
    </div>
    <div
      className={classnames('children animated fadeIn page', {
        'full-width': fullWidth,
      })}
    >
      {children}
    </div>
  </section>
);

Page.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  id: PropTypes.string.isRequired,
  rightComponent: PropTypes.element,
  title: PropTypes.node,
};

Page.defaultProps = {
  rightComponent: null,
  className: '',
  fullWidth: false,
  title: undefined,
};

export default injectIntl(Page);
