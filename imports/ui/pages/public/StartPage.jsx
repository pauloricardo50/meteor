import React, { Component } from 'react';
import { DocHead } from 'meteor/kadira:dochead';


import Line1 from '/imports/ui/components/start/Line1.jsx';
import Line2 from '/imports/ui/components/start/Line2.jsx';
import Line3 from '/imports/ui/components/start/Line3.jsx';
import Line4 from '/imports/ui/components/start/Line4.jsx';
import Line5 from '/imports/ui/components/start/Line5.jsx';
import Line6 from '/imports/ui/components/start/Line6.jsx';
import Line7 from '/imports/ui/components/start/Line7.jsx';
import Line8 from '/imports/ui/components/start/Line8.jsx';


const styles = {
  section: {
    display: 'table',
    height: '100%',
    width: '100%',
  },
  div: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
};


export default class StartPage extends Component {
  constructor(props) {
    super(props);

    const lines = [
      Line1,
      Line2,
      Line3,
      Line4,
      Line5,
      Line6,
      Line7,
      Line8,
    ];

    this.state = {
      lines,
      step: 0,
      maxStep: 0,
      twoBuyers: false,
      genderRequired: false,
      propertyKnown: true,
      propertyValue: 0,
    };

    this.classes = this.classes.bind(this);
    this.setStep = this.setStep.bind(this);
    this.completeStep = this.completeStep.bind(this);
    this.setBuyers = this.setBuyers.bind(this);
  }


  componentWillMount() {
    DocHead.setTitle('e-Potek');
  }


  // Called when the user clicks on an available line
  setStep(i) {
    this.setState({
      step: i,
    });
  }

  // Change the twoBuyers state
  setBuyers(value) {
    this.setState({
      twoBuyers: value,
    });
  }


  // Change the genderRequired state
  setGenderRequired(value) {
    this.setState({
      genderRequired: value,
    });
  }

  // Change the propertyKnown state
  setPropertyKnown(value) {
    this.setState({
      propertyKnown: value,
    });
  }


  // Change the propertyKnown state
  setPropertyValue(value) {
    this.setState({
      propertyValue: value,
    });
  }


  // Called when a step was finished,
  completeStep(i, event, alsoSetStep) {
    // Prevent the call of setStep() when this is called, only call it if an event is passed
    if (event) {
      event.stopPropagation();
    }

    if (this.state.maxStep <= i) {
      this.setState({ maxStep: i + 1 });
      if (alsoSetStep) {
        this.setState({ step: i + 1 });
      }
    }
  }


  classes(i) {
    const classes = {
      text: 'col-sm-8 col-sm-offset-2 startLine',
      extra: 'col-sm-8 col-sm-offset-2 animated fadeIn',
    };

    if (i === this.state.step) {
      classes.text = classes.text.concat(' active');
    }
    return classes;
  }


  render() {
    return (
      <section style={styles.section} className="NLForm">
        <div style={styles.div}>
          {this.state.lines.slice(0, this.state.maxStep + 1).map((ComponentX, index) =>
            <ComponentX
              classes={this.classes(index)}
              step={this.state.step}
              twoBuyers={this.state.twoBuyers}
              genderRequired={this.state.genderRequired}
              propertyKnown={this.state.propertyKnown}
              propertyValue={this.state.propertyValue}
              setStep={() => this.setStep(index)}
              completeStep={(event, alsoStep) => this.completeStep(index, event, alsoStep)}
              setBuyers={value => this.setBuyers(value)}
              setGenderRequired={value => this.setGenderRequired(value)}
              setPropertyKnown={value => this.setPropertyKnown(value)}
              setPropertyValue={value => this.setPropertyValue(value)}
              key={index}
            />
          )}
        </div>
      </section>
    );
  }
}
