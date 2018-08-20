import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';

const formatTitle = ({ titleId, title }, formatMessage) => {
  if (title && typeof title === 'string') {
    return ` | ${title}`;
  }
  if (titleId) {
    if (titleId.includes('.title')) {
      return ` | ${formatMessage({ id: `${titleId}` })}`;
    }
    return ` | ${formatMessage({ id: `${titleId}.title` })}`;
  }

  return '';
};

export const PageHead = ({
  descriptionId,
  intl: { formatMessage },
  ...props
}) => (
  <Helmet defaultTitle="e-Potek">
    <meta charSet="UTF-8" />
    <title>
      e-Potek
      {formatTitle(props, formatMessage)}
    </title>
    {descriptionId && (
      <meta name="description" content={formatMessage({ id: descriptionId })} />
    )}
  </Helmet>
);

PageHead.propTypes = {
  descriptionId: PropTypes.string,
  intl: PropTypes.object.isRequired,
  titleId: PropTypes.string,
};

PageHead.defaultProps = {
  titleId: undefined,
  descriptionId: undefined,
};

export default injectIntl(PageHead);
