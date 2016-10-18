import React from 'react';

export default class ConditionalInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conditional: false,
    };

    this.onConditionalChange = this.onConditionalChange.bind(this);
  }

  onConditionalChange(event) {
    // If the event's value matches the one that is correct, change state to true
    if (event.target.value === this.props.conditionalTrueValue) {
      this.setState({
        conditional: true,
      });
    } else {
      this.setState({
        conditional: false,
      });
    }
  }

  render() {
    return (
      <div className="form-group">
        {React.cloneElement(
          this.props.children[0],
          { onChange: this.onConditionalChange }
        )}
        {this.state.conditional ?
          <div className="animated fadeIn">{this.props.children.slice(1)}</div> :
          ''
        }
      </div>
    );
  }
}

ConditionalInput.propTypes = {
  conditionalTrueValue: React.PropTypes.string.isRequired,
};
