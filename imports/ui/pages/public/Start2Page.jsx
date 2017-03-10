import React, { Component, PropTypes } from 'react';
import Scroll from 'react-scroll';

import AutoStart from '/imports/ui/components/start/AutoStart.jsx';
import Recap from '/imports/ui/components/start//Recap.jsx';
import StartResult from '/imports/ui/components/start//StartResult.jsx';


import getFormArray from '/imports/js/StartFormArray';

const styles = {
  section: {
    display: 'table',
    height: '100%',
    width: '100%',
    paddingBottom: 50,
  },
  div: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  scrollElement: {
    // Required to make them properly scale with child elements
    overflow: 'visible',
    display: 'inline-block',
    width: '100%',
  },
  noGender: {
    display: 'none',
  },
};

export default class Start2Page extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.setFormState = this.setFormState.bind(this);
    this.setActiveLine = this.setActiveLine.bind(this);
  }

  setFormState(id, value, callback) {
    const object = {};
    object[id] = value;

    this.setState(object, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  setActiveLine(id) {
    this.setState({ activeLine: id });
  }

  isFinished() {
    const s = this.state;
    // return true;
    return s.finalized;
  }


  render() {
    return (
      <section style={styles.section} className="startForm">
        <div style={styles.div}>
          <AutoStart
            formState={this.state}
            formArray={getFormArray(this.state)}
            setFormState={this.setFormState}
            setActiveLine={this.setActiveLine}
          />
          {!this.isFinished() && <Recap formState={this.state} /> }
          {this.isFinished() && <StartResult formState={this.state} /> }
        </div>
      </section>
    );
  }
}

Start2Page.propTypes = {
};
