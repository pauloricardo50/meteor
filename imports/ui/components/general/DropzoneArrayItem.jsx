import React, {PropTypes} from 'react';

import IconButton from 'material-ui/IconButton';
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-drop-down-circle';

import DropzoneInput from '../forms/DropzoneInput.jsx';

export default class DropzoneArrayItem extends React.Component {
  constructor(props) {
    super(props);
  }

  getStyles() {
    return {
      article: {
        width: this.props.active ? '100%' : '',
        maxWidth: this.props.active ? 800 : '',
        height: this.props.active ? 380 : 80,
        backgroundColor: this.props.active ? 'white' : '',
      },
      topDiv: {
        borderBottom: this.props.active ? 'solid 1px #ddd' : '',
      },
      icon: {
        color: this.props.currentValue && this.props.currentValue.length > 0 ? '#50E3C2' : '',
        borderColor: this.props.currentValue && this.props.currentValue.length > 0 ? '#50E3C2' : '',
      },
      caret: {
        transform: this.props.active ? 'rotate(180deg)' : '',
      },
    };
  }

  render() {
    return (
      <article style={this.getStyles().article} className="mask1 dropzoneArrayItem">
        <div style={this.getStyles().topDiv} className="top">
          <div className="left">
            {this.props.currentValue && this.props.currentValue.length > 0 ?
              <span className="fa fa-check" style={this.getStyles().icon} /> :
              <span />
              }
          </div>

          <div className="text">
            <h3>{this.props.title}</h3>
            <h5 className="secondary">
              {(this.props.currentValue && this.props.currentValue.length) || 0}
              &nbsp;
              {(this.props.currentValue && this.props.currentValue.length === 1) ? 'fichier' : 'fichiers'}
            </h5>
          </div>

          <div className="right">
            <IconButton
              style={this.getStyles().caret}
              onTouchTap={this.props.handleClick}
            >
              <ArrowDown color="#d8d8d8" hoverColor="#a8a8a8" />
            </IconButton>
          </div>
        </div>

        {this.props.active &&
          <div className="dropzoneDiv">
            <DropzoneInput {...this.props} />
          </div>
        }
      </article>
    );
  }
}

DropzoneArrayItem.propTypes = {
  active: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
  currentValue: PropTypes.arrayOf(PropTypes.object),
};
