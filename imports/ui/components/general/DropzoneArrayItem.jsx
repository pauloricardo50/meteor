import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import IconButton from 'material-ui/IconButton';
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-drop-down-circle';

import DropzoneInput from './AutoForm/DropzoneInput';
import colors from '/imports/js/config/colors';

import { T } from '/imports/ui/components/general/Translation';

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
    color: currentValue && currentValue.length > 0 ? colors.secondary : '',
    borderColor:
      currentValue && currentValue.length > 0 ? colors.secondary : '',
  },
  caret: {
    transform: props.active ? 'rotate(180deg)' : '',
  },
});

const DropzoneArrayItem = (props) => {
  const {
    filesObject,
    filesObjectSelector,
    id,
    doubleTooltip,
    noTooltips,
    tooltipSuffix,
    handleClick,
    handleMouseEnter,
    active,
    disabled,
    required,
  } = props;

  const currentValue = filesObject[props.id];
  const styles = getStyles(props, currentValue);

  // Create the id to be used with mongoDB updating operations
  const mongoId = `${filesObjectSelector}.${id}`;
  const tooltipId = `files.${id}.tooltip${tooltipSuffix}`;

  console.log('mongoId:', mongoId);

  return (
    <article
      style={styles.article}
      className={classnames({ 'mask1 dropzoneArrayItem': true, disabled })}
    >
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
          <IconButton style={styles.caret} disabled={disabled}>
            <ArrowDown color="#d8d8d8" hoverColor="#a8a8a8" />
          </IconButton>
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
  handleClick: PropTypes.func.isRequired,
  handleMouseEnter: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  tooltipSuffix: PropTypes.string,
  filesObject: PropTypes.objectOf(PropTypes.array).isRequired,
  filesObjectSelector: PropTypes.string.isRequired,
  required: PropTypes.bool,
};

DropzoneArrayItem.defaultProps = {
  active: false,
  currentValue: undefined,
  tooltipSuffix: '',
  required: true,
};

export default DropzoneArrayItem;
