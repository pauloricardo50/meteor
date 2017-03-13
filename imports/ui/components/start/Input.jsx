import React, { Component, PropTypes } from 'react';


import StartTextField from './StartTextField';
import StartSelectField from './StartSelectField';


export default class Input extends Component {
  render() {
    return (
      <article
        className={this.props.className}
        onClick={() => this.props.setActiveLine(this.props.id)}
      >

        <h1 className="fixed-size">
          {this.props.text1}
          &nbsp;

          {this.props.question && <br />}

          <span className="active">
            {this.props.text && <StartTextField {...this.props} />}
            {this.props.select && <StartSelectField {...this.props} />}
          </span>

          {this.props.text2}
        </h1>

      </article>
    );
  }
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  text1: PropTypes.string.isRequired,
  text2: PropTypes.string,
  className: PropTypes.string.isRequired,
  setActiveLine: PropTypes.func.isRequired,
  question: PropTypes.bool,
  text: PropTypes.bool,
  select: PropTypes.bool,
};

Input.defaultProps = {
  text2: undefined,
  money: false,
  question: false,
  text: false,
  select: false,
};
