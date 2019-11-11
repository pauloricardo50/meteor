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

// Use Helmet in a weird way because of this bug
// https://github.com/nfl/react-helmet/issues/373
export const PageHead = ({
  descriptionId,
  intl: { formatMessage },
  ...props
}) => (
  <Helmet
    defaultTitle="e-Potek"
    title={`e-Potek${formatTitle(props, formatMessage)}`}
    meta={[
      ...(descriptionId
        ? [
            {
              name: 'description',
              content: formatMessage({ id: descriptionId }),
            },
          ]
        : []),
      {
        charSet: 'UTF-8',
      },
    ]}
  />
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
