import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';


const styles = {
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
};

export default class ButtonInput extends Component {
  handleClick(event, value) {
    event.stopPropagation();

    // If this button triggers a field to appear, make sure to delete its value if the user hits no
    if (value === false && this.props.deleteId) {
      this.props.setFormState(this.props.deleteId, undefined);
    }

    this.props.setFormState(this.props.id, value,
      () => this.props.setActiveLine(''),
    );
  }

  getText() {
    if (this.props.id === 'error') {
      return '';
    }

    const currentValue = this.props.formState[this.props.id];
    if (currentValue !== undefined) {
      const currentButton = this.props.buttons.find(button => button.id === currentValue);

      return currentButton.label || currentButton.id;
    }
    return '...';
  }

  render() {
    return (
      <article
        className={this.props.className}
        onTouchTap={() => this.props.setActiveLine(this.props.id)}
      >

        <h1 className="fixed-size">
          <span className={this.props.id === 'error' && 'error'}>{this.props.text1}</span>
          &nbsp;
          {this.props.question && <br />}
          <span className="active">{this.getText()}</span>
          &nbsp;
          {this.props.text2 || ''}
        </h1>

        <div style={styles.buttons} className={!this.props.active ? 'inputHider' : 'animated fadeIn'}>
          {this.props.buttons.map((button, index) => (
            <RaisedButton
              label={button.label || button.id}
              onTouchTap={(e) => {
                this.handleClick(e, button.id);
                if (typeof button.onClick === 'function') {
                  button.onClick();
                }
              }}
              style={styles.button}
              primary={!button.noPrimary}
              key={index}
            />
          ))}
        </div>

      </article>
    );
  }
}

ButtonInput.propTypes = {
  id: PropTypes.string.isRequired,
  text1: PropTypes.string.isRequired,
  text2: PropTypes.string,
  question: PropTypes.bool,
  buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
  setFormState: PropTypes.func.isRequired,
  formState: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string.isRequired,
  setActiveLine: PropTypes.func.isRequired,
  deleteId: PropTypes.string,
};
