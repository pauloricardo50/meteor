import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import IconButton from 'core/components/IconButton';

import DropzoneInput from 'core/components/AutoForm/DropzoneInput';
import colors from 'core/config/colors';

import T from 'core/components/Translation';

const getStyles = (props, currentValue) => ({
  article: {
    width: props.active ? '100%' : '',
    maxWidth: props.active ? 800 : '',
    height: props.active ? 380 : 80,
    backgroundColor: props.active ? 'white' : '',
  },
  topDiv: {
    borderBottom: props.active ? 'solid 1px #ddd' : '',
  },
  icon: {
    color: currentValue && currentValue.length > 0 ? colors.success : '',
    borderColor: currentValue && currentValue.length > 0 ? colors.success : '',
  },
  caret: {
    transform: props.active ? 'rotate(180deg)' : '',
  },
});

const DropzoneArrayItem = props => {
  const {
    active,
    disabled,
    doubleTooltip,
    filesObject,
    filesObjectSelector,
    handleClick,
    handleMouseEnter,
    id,
    noTooltips,
    required,
    tooltipSuffix,
  } = props;

  const currentValue = filesObject[props.id];
  const styles = getStyles(props, currentValue);

  // Create the id to be used with mongoDB updating operations
  const mongoId = `${filesObjectSelector}.${id}`;
  const tooltipId = `files.${id}.tooltip${tooltipSuffix}`;

  return (
    <article
      style={styles.article}
      className={classnames('card1 card-top dropzoneArrayItem', { disabled })}
    >
      card1 card-top
      <div
        style={styles.topDiv}
        className="top"
        onClick={disabled ? () => {} : event => handleClick(event)}
        onDragEnter={handleMouseEnter}
      >
        <div className="left">
          {currentValue && currentValue.length > 0 ? (
            <span className="fa fa-check" style={styles.icon} />
          ) : (
            <span />
          )}
        </div>

        <div className="text">
          <h3>
            <T
              id={`files.${id}`}
              tooltipId={doubleTooltip ? [tooltipId] : tooltipId}
              pureId
              noTooltips={noTooltips}
              tooltipPlacement="top"
            />
            {required === false ? '' : ' *'}
          </h3>
          <h5 className="secondary">
            <T
              id="DropzoneArrayItem.fileCount"
              values={{ count: (currentValue && currentValue.length) || 0 }}
            />
          </h5>
        </div>

        <div className="right">
          <IconButton
            type="dropdown"
            style={styles.caret}
            disabled={disabled}
            iconProps={{ color: '#d8d8d8', hoverColor: '#a8a8a8' }}
          />
        </div>
      </div>
      {active && (
        <div className="dropzoneDiv">
          <DropzoneInput
            {...props}
            currentValue={currentValue}
            mongoId={mongoId}
            label=""
          />
        </div>
      )}
    </article>
  );
};

DropzoneArrayItem.propTypes = {
  active: PropTypes.bool,
  filesObject: PropTypes.objectOf(PropTypes.array).isRequired,
  filesObjectSelector: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleMouseEnter: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  required: PropTypes.bool,
  tooltipSuffix: PropTypes.string,
};

DropzoneArrayItem.defaultProps = {
  active: false,
  currentValue: undefined,
  required: true,
  tooltipSuffix: '',
};

export default DropzoneArrayItem;
