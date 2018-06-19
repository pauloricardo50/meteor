import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';

export const PageHead = ({
  intl: { formatMessage },
  titleId,
  descriptionId,
}) => (
  <Helmet defaultTitle="e-Potek">
    <meta charSet="UTF-8" />
    <title>
      e-Potek{titleId ? ` | ${formatMessage({ id: titleId })}` : ''}
    </title>
    {descriptionId && (
      <meta name="description" content={formatMessage({ id: descriptionId })} />
    )}
  </Helmet>
);

PageHead.propTypes = {
  titleId: PropTypes.string,
  descriptionId: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

PageHead.defaultProps = {
  titleId: undefined,
  descriptionId: undefined,
};

export default injectIntl(PageHead);
