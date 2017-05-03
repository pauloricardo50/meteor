import PropTypes from 'prop-types';
import React from 'react';

import IconButton from 'material-ui/IconButton';
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-drop-down-circle';

import DropzoneInput from '../autoform/DropzoneInput.jsx';
import colors from '/imports/js/config/colors';

const getStyles = (props, currentValue) => {
  return {
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
      borderColor: currentValue && currentValue.length > 0 ? colors.secondary : '',
    },
    caret: {
      transform: props.active ? 'rotate(180deg)' : '',
    },
  };
};

const DropzoneArrayItem = props => {
  const currentValue = props.filesObject[props.id];

  const styles = getStyles(props, currentValue);

  // Create the id to be used with mongoDB updating operations
  const mongoId = `${props.filesObjectSelector}.${props.id}`;

  return (
    <article style={styles.article} className="mask1 dropzoneArrayItem">
      <div style={styles.topDiv} className="top" onTouchTap={props.handleClick}>
        <div className="left">
          {currentValue && currentValue.length > 0
            ? <span className="fa fa-check" style={styles.icon} />
            : <span />}
        </div>

        <div className="text">
          <h3>{props.title}</h3>
          <h5 className="secondary">
            {(currentValue && currentValue.length) || 0}
            &nbsp;
            {currentValue && currentValue.length === 1 ? 'fichier' : 'fichiers'}
          </h5>
        </div>

        <div className="right">
          <IconButton style={styles.caret}>
            <ArrowDown color="#d8d8d8" hoverColor="#a8a8a8" />
          </IconButton>
        </div>
      </div>

      {props.active &&
        <div className="dropzoneDiv">
          <DropzoneInput {...props} currentValue={currentValue} mongoId={mongoId} />
        </div>}
    </article>
  );
};

DropzoneArrayItem.propTypes = {
  title: PropTypes.string.isRequired,
  active: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  filesObject: PropTypes.objectOf(PropTypes.array).isRequired,
  filesObjectSelector: PropTypes.string.isRequired,
};

DropzoneArrayItem.defaultProps = {
  active: false,
  currentValue: undefined,
};

export default DropzoneArrayItem;
