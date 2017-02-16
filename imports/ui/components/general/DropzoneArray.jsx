import React, {PropTypes} from 'react';

import DropzoneArrayItem from './DropzoneArrayItem.jsx';


const styles = {
  div: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
};

export default class DropzoneArray extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: -1,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(i) {
    if (this.state.active === i) {
      this.setState({ active: -1 });
    } else {
      this.setState({ active: i });
    }
  }

  render() {
    return (
      <div style={styles.div}>
        {this.props.array.map((dropzoneItem, i) => (
          <DropzoneArrayItem
            key={i}
            {...dropzoneItem}
            handleClick={() => this.handleClick(i)}
            active={this.state.active === i}
            requestId={this.props.requestId}
          />
        ))}
      </div>
    );
  }
}

DropzoneArray.propTypes = {
  array: PropTypes.arrayOf(PropTypes.object).isRequired,
};
