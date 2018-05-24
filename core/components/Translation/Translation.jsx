import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import AutoTooltip from '../tooltips/AutoTooltip';
import defaultIntlValues from './defaultIntlValues';

const makeAutoTooltip = props => (content, key) => (
  <AutoTooltip {...props} placement={props.tooltipPlacement} key={key}>
    {content}
  </AutoTooltip>
);

/**
 * T - A wrapper around react-intl's Formatted Message, it
 * automatically adds tooltips if they exist.
 * It is only rerendered if the id changes
 * @extends Component
 */
export const T = (props) => {
  const { noTooltips, id, values, tooltipPlacement, ...rest } = props;

  if (noTooltips) {
    return <FormattedMessage {...props} />;
  } else if (id === undefined) {
    return null;
  } else if (typeof id !== 'string') {
    return id;
  }

  // formattedMessage provides an array of values in the children function.
  // When there is more than a simple string to render, for example a rich
  // HTML element was added as a values prop, then it returns several values
  // To avoid unnecessary spans, separate those with a single message
  // and those, rare, with more.
  const Auto = makeAutoTooltip(props);

  return (
    <FormattedMessage
      id={id}
      values={{ ...values, ...defaultIntlValues }}
      {...rest}
    >
      {(...formattedMessage) => (
        <React.Fragment>
          {formattedMessage.map((msg, i) => Auto(msg, i))}
        </React.Fragment>
      )}
    </FormattedMessage>
  );
};

T.propTypes = {
  id: PropTypes.string.isRequired,
  noTooltips: PropTypes.bool,
  tooltipPlacement: PropTypes.string,
  values: PropTypes.object,
};

T.defaultProps = {
  noTooltips: false,
  tooltipPlacement: undefined,
  values: {},
};

export default T;
