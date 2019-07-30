import React from 'react';
import PropTypes from 'prop-types';

import AutoTooltip from '../tooltips/AutoTooltip';
import defaultIntlValues from './defaultIntlValues';
import FormattedMessage from './FormattedMessage';

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
  }
  if (typeof id !== 'string') {
    return id;
  }
  if (!id) {
    throw new Error('Undefined id in Translation component');
  }

  const Auto = makeAutoTooltip(props);

  return (
    <FormattedMessage
      id={id}
      values={{ ...defaultIntlValues, ...values }}
      {...rest}
    >
      {(...formattedMessage) => formattedMessage.map((msg, i) => Auto(msg, i))}
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
