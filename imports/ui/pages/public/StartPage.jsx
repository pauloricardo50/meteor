import React, { Component } from 'react';
import { DocHead } from 'meteor/kadira:dochead';


import Line1 from '/imports/ui/components/start/Line1.jsx';
import Line2 from '/imports/ui/components/start/Line2.jsx';
import Line3 from '/imports/ui/components/start/Line3.jsx';
import Line4 from '/imports/ui/components/start/Line4.jsx';
import Line5 from '/imports/ui/components/start/Line5.jsx';
import Line6 from '/imports/ui/components/start/Line6.jsx';
import Line7 from '/imports/ui/components/start/Line7.jsx';
import Line8a from '/imports/ui/components/start/Line8a.jsx';
import Line8b from '/imports/ui/components/start/Line8b.jsx';
import Line9a from '/imports/ui/components/start/Line9a.jsx';
import Line9b from '/imports/ui/components/start/Line9b.jsx';
import Line10a from '/imports/ui/components/start/Line10a.jsx';
import Line11a from '/imports/ui/components/start/Line11a.jsx';


const styles = {
  section: {
    display: 'table',
    height: '100%',
    width: '100%',
    paddingBottom: 100,
  },
  div: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
};


export default class StartPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      maxStep: 0,
      isValid: false,
      isFinished: false,

      twoBuyers: false,
      age1: '',
      age2: '',
      genderRequired: false,
      gender1: '',
      gender2: '',
      propertyType: '',
      salary: '',
      bonusExists: false,
      bonus: '',
      propertyKnown: true,
      propertyValue: '',
      maxCash: true,
      maxDebt: true,
      fortune: '',
      insuranceFortune: '',
    };

    this.setStep = this.setStep.bind(this);
    this.setStateValue = this.setStateValue.bind(this);
    this.completeStep = this.completeStep.bind(this);
    this.setPropertyKnown = this.setPropertyKnown.bind(this);
    this.classes = this.classes.bind(this);
  }

  componentWillMount() {
    DocHead.setTitle('e-Potek');
  }

  setStep(i) { this.setState({ step: i }); }

  setStateValue(name, value, callback) {
    const object = {};
    object[name] = value;

    this.setState(object, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  setPropertyKnown(value, alsoStep) {
    const oldState = this.state.propertyKnown;

    this.setState({ propertyKnown: value },
      () => {
        // If this value is different from before, the user switches from branch a) to b),
        // therefore reset maxStep to 8, and cancel fortune and insuranceFortune
        if (oldState !== value) {
          this.setState({
            maxStep: 7,
            fortune: '',
            insuranceFortune: '',
          });
          if (alsoStep) {
            // When the user chooses that the propertyValue is not known after having filled
            // some fields beyond step 6 in path a), set step to 7
            this.setState({ step: 7 });
          }
        }
      }
    );
  }

  // Called when a step was finished
  completeStep(i, event, alsoSetStep) {
    // Prevent the call of setStep() when this is called, only call it if an event is passed
    if (event) {
      event.stopPropagation();
    }

    const finalA = 10;
    const finalB = 8;
    const max = this.state.maxStep;
    const finished = this.state.propertyKnown ? max === finalA : max === finalB;

    if (max <= i) {
      this.setState({ maxStep: i + 1 },
        () => {
          // Make sure step is never higher than maxStep, and verify the step is higher than before
          if (alsoSetStep && (i + 1 <= this.state.maxStep) && i + 1 > this.state.step) {
            this.setState({ step: i + 1 });
          }
        }
      );
    } else if (finished && alsoSetStep) {
      // If the form is finished, always set the last step to be active
      this.setState({ step: max });
    }
  }

  classes(i) {
    const classes = {
      text: 'col-sm-10 col-sm-offset-1 startLine',
      extra: 'col-sm-10 col-sm-offset-1 animated fadeIn',
    };

    if (i === this.state.step) {
      classes.text = classes.text.concat(' active');
    }
    return classes;
  }

  render() {
    let lines;
    if (this.state.propertyKnown) {
      lines = [Line1, Line2, Line3, Line4, Line5, Line6, Line7, Line8a, Line9a, Line10a, Line11a];
    } else {
      lines = [Line1, Line2, Line3, Line4, Line5, Line6, Line7, Line8b, Line9b];
    }

    return (
      <section style={styles.section} className="NLForm">
        <div style={styles.div}>
          {lines.slice(0, this.state.maxStep + 1).map((ComponentX, index) =>
            <ComponentX
              {...this.state}
              setStateValue={this.setStateValue}
              setStep={() => this.setStep(index)}
              completeStep={(event, alsoStep) => this.completeStep(index, event, alsoStep)}
              setPropertyKnown={this.setPropertyKnown}
              classes={this.classes(index)}
              key={index}
            />
          )}
        </div>
      </section>
    );
  }
}
