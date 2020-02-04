//      
import React, { Component } from 'react';

                            
                       
              
  
                            
                 
  

export default class FinancingLabel extends Component 
                      
                      
  {
  constructor(props) {
    super(props);
    this.state = { height: 0 };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ height: this.getLabelHeight() }), 0);
  }

  getLabelHeight = () => {
    const { id } = this.props;
    if (id) {
      // Set height of label field to be as high as the rest of the lines
      const nodes = document.querySelectorAll(`.${id}`);
      const heights = Array.prototype.slice
        .call(nodes)
        .map(({ clientHeight }) => clientHeight);

      // This complains if heights is an empty array, so add 0 by default
      return Math.max(...heights, 0);
    }
    return 0;
  };

  render() {
    const { height } = this.state;
    const { children } = this.props;

    return (
      <span className="label" style={{ height }}>
        {children}
      </span>
    );
  }
}
