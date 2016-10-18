import React from 'react';

export default class ConditionalInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conditionalValue: 1,
    };
  }

  onConditionalChange(event) {
    
  }

  render() {
    return (
      <div className="form-group">
        {React.cloneElement(this.props.children[0], { onChange: this.state.onConditionalChange })}
        <div className="hidden animated fadeIn">
          {this.props.children[1]}
        </div>
      </div>
    );
  }
}
