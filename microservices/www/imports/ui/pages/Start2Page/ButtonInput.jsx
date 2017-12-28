import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import Button from 'core/components/Button';

const styles = {
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
};

const getText = (props) => {
  if (props.error) {
    return '';
  }

  const currentValue = props.formState[props.id];
  if (currentValue !== undefined) {
    const currentButton = props.buttons.find(
      button => button.id === currentValue,
    );

    return currentButton.label || currentButton.id;
  }
  return '...';
};

const handleClick = (props, event, value, callback) => {
  event.stopPropagation();

  // If this button triggers a field to appear, make sure to delete its value if the user hits no
  if (value === false && props.deleteId) {
    props.setFormState(props.deleteId, undefined);
  }

  props.setFormState(props.id, value, () =>
    props.setActiveLine('', () => {
      if (typeof callback === 'function') {
        callback(event);
      }
    }),
  );
};

const ButtonInput = (props) => {
  const {
    hideResult,
    className,
    setActiveLine,
    id,
    error,
    text1,
    text2,
    question,
    active,
    buttons,
  } = props;

  return (
    <article
      className={classnames({ [className]: true, 'no-modify': hideResult })}
      onClick={() => setActiveLine(id)}
    >
      <h1 className="fixed-size">
        <span className={error && 'error'}>{text1}&nbsp;</span>
        {!hideResult && question && <br />}
        {!hideResult && <span className="active">{getText(props)}</span>}
        {text2 ? <span>&nbsp;{text2}</span> : null}
      </h1>

      <div
        style={styles.buttons}
        className={!active ? 'inputHider' : 'animated fadeIn'}
      >
        {buttons.map(
          (button, index) =>
            (button.component ? (
              button.component
            ) : (
              <Button
                raised
                label={button.label || button.id}
                onClick={(e) => {
                  handleClick(props, e, button.id, button.onClick);
                  if (document.activeElement) {
                    // Take focus away, better UX on mobile
                    document.activeElement.blur();
                  }
                }}
                style={styles.button}
                primary={!button.noPrimary}
                secondary={button.secondary}
                key={index}
                className={button.className}
              />
            )),
        )}
      </div>
    </article>
  );
};

ButtonInput.propTypes = {
  id: PropTypes.string.isRequired,
  text1: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  text2: PropTypes.string,
  question: PropTypes.bool,
  buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
  setFormState: PropTypes.func.isRequired,
  formState: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string.isRequired,
  setActiveLine: PropTypes.func.isRequired,
  deleteId: PropTypes.string,
  hideResult: PropTypes.bool,
};

ButtonInput.defaultProps = {
  text2: '',
  question: false,
  formState: {},
  deleteId: undefined,
  hideResult: false,
};

export default ButtonInput;
