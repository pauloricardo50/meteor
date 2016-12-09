import React, { Component } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import Scroll from 'react-scroll';


import Line1 from '/imports/ui/components/start/Line1.jsx';
import Line2 from '/imports/ui/components/start/Line2.jsx';
import Line3 from '/imports/ui/components/start/Line3.jsx';
import Line4_1 from '/imports/ui/components/start/Line4_1.jsx';

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
    paddingBottom: 50,
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
      isValid: [true, true, true, true, true, true, true, true, true, true, true, true], // 12x
      isFinished: false,
      timeout: 1500,

      twoBuyers: false,
      age1: '',
      age2: '',
      genderRequired: false,
      gender1: '',
      gender2: '',
      purchaseType: '',
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
    this.setValid = this.setValid.bind(this);
    this.completeStep = this.completeStep.bind(this);
    this.setPropertyKnown = this.setPropertyKnown.bind(this);
    this.classes = this.classes.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
  }

  componentWillMount() {
    DocHead.setTitle('Passez Le Test | e-Potek');
  }

  setStep(i) {
    this.setState({ step: i });
    this.scroll(i);
  }

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
            maxStep: 8,
            fortune: '',
            insuranceFortune: '',
          });
          if (alsoStep) {
            // When the user chooses that the propertyValue is not known after having filled
            // some fields beyond step 6 in path a), set step to 7
            this.setState({ step: 8 });
            this.scroll();
          }
        }
      }
    );
  }

  setValid(step, value) {
    const array = this.state.isValid;
    array[step] = value;

    this.setState({
      isValid: array,
    });
  }

  // Called when a step was finished
  completeStep(i, event, alsoSetStep, isButton = false) {
    // Prevent the call of setStep() when this is called, only call it if an event is passed
    if (event) {
      event.stopPropagation();
    }

    const finalA = 11;
    const finalB = 9;
    const max = this.state.maxStep;
    const finished = this.state.propertyKnown ? max === finalA : max === finalB;

    if (max <= i) {
      this.setState({ maxStep: i + 1 },
        () => {
          // Make sure step is never higher than maxStep, and verify step is higher than before
          if (alsoSetStep && (i + 1 <= this.state.maxStep) && i + 1 > this.state.step) {
            this.setState({ step: i + 1 });
            this.scroll();
          }
        }
      );
    } else if ((finished && alsoSetStep) || isButton) {
      // If the form is finished, always set the last step to be active
      this.setState({ step: max });
      this.scroll();
    }
  }

  classes(i) {
    const classes = {
      text: 'col-sm-10 col-sm-offset-1 startLine',
      errorText: 'col-sm-10 col-sm-offset-1 startLine errorText',
      extra: 'col-sm-10 col-sm-offset-1 animated fadeIn',
    };

    if (i === this.state.step) {
      classes.text = classes.text.concat(' active');
      classes.errorText = classes.errorText.concat(' active');
    }
    return classes;
  }

  isFormValid() {
    return this.state.isValid.every(bool => bool);
  }

  scroll(step = null) {
    const options = {
      duration: 300,
      delay: 0,
      smooth: true,
    };
    if (step) {
      Scroll.scroller.scrollTo(step.toString(), options);
    } else {
      Scroll.animateScroll.scrollToBottom(options);
    }
  }

  render() {
    let lines;
    if (this.state.propertyKnown) {
      lines = [Line1, Line2, Line3, Line4_1, Line4, Line5, Line6, Line7, Line8a, Line9a, Line10a, Line11a];
    } else {
      lines = [Line1, Line2, Line3, Line4_1, Line4, Line5, Line6, Line7, Line8b, Line9b];
    }

    return (
      <section style={styles.section} className="NLForm">
        <div style={styles.div}>
          {lines.slice(0, this.state.maxStep + 1).map((ComponentX, index) =>
            <Scroll.Element name={index.toString()} key={index}>
              <ComponentX
                {...this.state}
                setStateValue={this.setStateValue}
                setStep={() => this.setStep(index)}
                setValid={value => this.setValid(index, value)}
                completeStep={(event, alsoStep, isButton) =>
                  this.completeStep(index, event, alsoStep, isButton)
                }
                setPropertyKnown={this.setPropertyKnown}
                classes={this.classes(index)}
                index={index}
              />
            </Scroll.Element>
          )}
        </div>
      </section>
    );
  }
}
