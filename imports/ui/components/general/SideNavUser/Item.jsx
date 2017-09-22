import React from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import Icon from '/imports/ui/components/general/Icon';
import CircularProgress from 'material-ui/CircularProgress';

import { T } from '/imports/ui/components/general/Translation';
import colors from '/imports/js/config/colors';

const getIcon = (item, isWaiting) => {
  if (item.isDone()) {
    return (
      <div className="icon success">
        <Icon type="check" color={colors.secondary} />
      </div>
    );
  } else if (item.disabled) {
    return (
      <div className="icon">
        <Icon type="lock" />
      </div>
    );
  } else if (isWaiting) {
    return (
      <div className="icon warning">
        <Icon type="waiting" />
      </div>
    );
  } else if (typeof item.percent === 'function' && item.percent() > 0) {
    return (
      <div className="icon">
        <span className="available-icon" />
        <CircularProgress
          mode="determinate"
          value={item.percent() * 100}
          className="circular-progress"
        />
      </div>
    );
  }
  return (
    <div className="icon">
      <span className="available-icon" />
    </div>
  );
};

const Item = ({ item, history, handleClickLink }) => {
  const { disabled, link, id, isDone, waiting } = item;
  const isWaiting = typeof waiting === 'function' && waiting() && !isDone();

  return (
    <NavLink
      to={
        disabled ? history.location.pathname : link || history.location.pathname
      }
      key={id}
      className={classnames({
        item: true,
        disable: disabled || !link,
        off: disabled,
      })}
      activeClassName={link !== undefined && !disabled ? 'active' : ''}
    >
      <div
        className="onclick-wrapper"
        onClick={link ? handleClickLink : () => null}
      >
        {getIcon(item, isWaiting)}
        <div className="text">
          <span className="title">
            <T id={`steps.${id}.title`} />
          </span>
          <span className={classnames({ subtitle: true, warning: isWaiting })}>
            <T
              id={isWaiting ? `steps.${id}.waiting` : `steps.${id}.subtitle`}
            />
          </span>
        </div>
      </div>
    </NavLink>
  );
};

Item.propTypes = {
  item: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  handleClickLink: PropTypes.func.isRequired,
};

export default Item;
