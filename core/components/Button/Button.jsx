import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'core/components/Icon';

import { Link } from 'react-router-dom';
import omit from 'lodash/omit';
import MuiButton from '@material-ui/core/Button';
import { withProps } from 'recompose';

const getColor = ({ primary, secondary, color }) => {
  if (primary) {
    return 'primary';
  }
  if (secondary) {
    return 'secondary';
  }

  return color;
};

const Button = (props) => {
  const childProps = omit(props, [
    'primary',
    'secondary',
    'label',
    'icon',
    'link',
    'raised',
  ]);

  return (
    <MuiButton
      {...childProps}
      color={props.color || getColor(props)}
      variant={
        props.variant || (props.raised ? 'raised' : undefined) || undefined
      }
      component={props.component || (props.link ? Link : 'button')}
      to={props.to || undefined}
    >
      {props.icon}
      {props.icon && <span style={{ height: '100%', width: 8 }} />}
      {props.label || props.children}
    </MuiButton>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.node,
  label: PropTypes.node,
  link: PropTypes.bool,
  raised: PropTypes.bool,
};

Button.defaultProps = {
  raised: false,
  link: false,
};

const withLoadingProp = withProps(({ loading }) =>
  (loading ? { disabled: true, icon: <Icon type="loop-spin" /> } : null));

export default withLoadingProp(Button);
