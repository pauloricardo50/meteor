import PropTypes from 'prop-types';
import React, { Component } from 'react';

import DropzoneArrayItem from './DropzoneArrayItem';

const styles = {
  div: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
};

export default class DropzoneArray extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: -1,
    };
  }

  handleClick = i => {
    if (this.state.active === i) {
      this.setState({ active: -1 });
    } else {
      this.setState({ active: i });
    }
  };

  handleMouseEnter = i => {
    this.setState({ active: i });
  };

  render() {
    return (
      <div style={styles.div}>
        {this.props.array.map(
          (dropzoneItem, i) =>
            dropzoneItem.condition !== false &&
            <DropzoneArrayItem
              {...this.props}
              key={i}
              {...dropzoneItem}
              handleClick={() => this.handleClick(i)}
              handleMouseEnter={() => this.handleMouseEnter(i)}
              active={this.state.active === i}
            />,
        )}
      </div>
    );
  }
}

DropzoneArray.propTypes = {
  array: PropTypes.arrayOf(PropTypes.object).isRequired,
};
