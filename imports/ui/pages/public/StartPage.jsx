import React, { Component } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import Scroll from 'react-scroll';


import BorrowerCountLine from '/imports/ui/components/start/BorrowerCountLine.jsx';
import AgeLine from '/imports/ui/components/start/AgeLine.jsx';
import GenderLine from '/imports/ui/components/start/GenderLine.jsx';
import PurchaseTypeLine from '/imports/ui/components/start/PurchaseTypeLine.jsx';

import Line4 from '/imports/ui/components/start/UsageTypeLine.jsx';
import Line5 from '/imports/ui/components/start/IncomeLine.jsx';
import BonusLine from '/imports/ui/components/start/BonusLine.jsx';
import PropertyValueLine from '/imports/ui/components/start/PropertyValueLine.jsx';
import CashConfirmLine from '/imports/ui/components/start/CashConfirmLine.jsx';
import MaxCashLine from '/imports/ui/components/start/MaxCashLine.jsx';
import NoPropertyLine1 from '/imports/ui/components/start/NoPropertyLine1.jsx';
import MaxDebtLine from '/imports/ui/components/start/MaxDebtLine.jsx';
import NoPropertyLine2 from '/imports/ui/components/start/NoPropertyLine2.jsx';
import SliderLine from '/imports/ui/components/start/SliderLine.jsx';
import RecapLine from '/imports/ui/components/start/RecapLine.jsx';
import RecapLine2 from '/imports/ui/components/start/RecapLine2.jsx';


import EmailLine from '/imports/ui/components/start/EmailLine.jsx';
import PasswordLine from '/imports/ui/components/start/PasswordLine.jsx';


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

      email: '',
      password: '',
      login: false,
      createAccount: false,
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
    this.setState({ step: i }, this.scroll(i));
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
      },
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

    const finalA = 13;
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
        },
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
    // Checks if all values are in the array are valid
    return this.state.isValid.every(bool => bool);
  }

  scroll(step = -1) {
    const options = {
      duration: 500,
      delay: 0,
      smooth: true,
      offset: -100,
    };
    if (step >= 0) {
      Scroll.scroller.scrollTo(`scroll${step}`, options);
    } else {
      Scroll.animateScroll.scrollToBottom(options);
    }
  }

  render() {
    let lines;
    if (this.state.propertyKnown) {
      lines = [BorrowerCountLine, AgeLine, GenderLine, PurchaseTypeLine, Line4, Line5, BonusLine,
        // PropertyValueLine, CashConfirmLine, RecapLine2,
        PropertyValueLine, CashConfirmLine, MaxCashLine, MaxDebtLine, SliderLine, RecapLine,
        EmailLine, PasswordLine,
      ];
    } else {
      lines = [BorrowerCountLine, AgeLine, GenderLine, PurchaseTypeLine, Line4, Line5, BonusLine,
        PropertyValueLine, NoPropertyLine1, NoPropertyLine2,
      ];
    }

    return (
      <section style={styles.section} className="NLForm">
        <div style={styles.div}>
          {lines.slice(0, this.state.maxStep + 1).map((ComponentX, index) =>
            <Scroll.Element
              name={`scroll${index}`}
              key={index}
              style={
                index !== 2 ?
                  styles.scrollElement :
                  (this.state.genderRequired ?
                    styles.scrollElement :
                      styles.noGender
                  )
               }
            >
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
            </Scroll.Element>,
          )}
        </div>
      </section>
    );
  }
}
