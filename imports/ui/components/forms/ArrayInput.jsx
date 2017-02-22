import React, {PropTypes} from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import TextInput from './TextInput.jsx';
import RadioInput from './RadioInput.jsx';
import SelectFieldInput from './SelectFieldInput.jsx';
import ConditionalInput from './ConditionalInput.jsx';
import DateInput from './DateInput.jsx';
import DropzoneInput from './DropzoneInput.jsx';
import DropzoneArray from '../general/DropzoneArray.jsx';

const components = {
  TextInput,
  RadioInput,
  SelectFieldInput,
  ConditionalInput,
  DateInput,
  DropzoneInput,
  DropzoneArray,
};

const styles = {
  button: {
    marginRight: 8,
  },
};

export default class ArrayInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: (this.props.currentValue && this.props.currentValue.length) || 1,
    };

    this.removeValue = this.removeValue.bind(this);
    this.addValue = this.addValue.bind(this);
    this.getArray = this.getArray.bind(this);
  }

  removeValue() {
    // Only remove a  value if there's more than 1 left
    if (this.state.count > 1) {
      this.setState({ count: this.state.count - 1 });
    }
  }

  addValue() {
    this.setState({ count: this.state.count + 1 });
  }

  getArray() {
    const array = [];

    for (var i = 0; i < this.state.count; i++) {
      // If there are multiple components per array item
      this.props.components.forEach((comp, i) => {
        const Tag = components[comp.type];

        // array.push(
        //   <Tag>
        //     {...comp}
        //     id={`${this.props.id}.${i}.${comp.id}`}
        //     currentValue={''}
        //   </Tag>
        // );
      });
    }

    return array;
  }

  render() {
    return (
      <div>

        <div>
          {this.getArray()}
        </div>


        <div className="text-center">
          <RaisedButton
            label="-"
            onTouchTap={this.removeValue}
            style={styles.button}
            disabled={this.state.count <= 1}
          />
          <RaisedButton label="+" onTouchTap={this.addValue} primary />
        </div>
      </div>
    );
  }
}

ArrayInput.propTypes = {
  components: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentValue: PropTypes.arrayOf(PropTypes.any),
  id: PropTypes.string.isRequired,
};
