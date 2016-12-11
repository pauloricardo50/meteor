import React, { Component, PropTypes } from 'react';


import RaisedButton from 'material-ui/RaisedButton';

import HelpModal from './HelpModal.jsx';


const styles = {
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
  extra: {
    marginBottom: 16,
  },
};


export default class Line8a extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };

    this.changeState = this.changeState.bind(this);
  }

  componentDidMount() {
    // If this line is not required, immediately jump to step 3
    if (this.props.propertyType !== 'primary') {
      this.props.completeStep(null, true);
      this.props.setStep(this.props.step + 1);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const p = this.props;
    const n = nextProps;

    return (
      p.classes !== n.classes ||
      p.twoBuyers !== n.twoBuyers ||
      p.maxCash !== n.maxCash ||
      p.propertyType !== n.propertyType
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.propertyType !== nextProps.propertyType) {
      // If age is modified, make sure this step is cancelled/activated
      if (nextProps.propertyType !== 'primary') {
        nextProps.completeStep(null, true);
        nextProps.setStep(this.props.index + 1);
      }
    }
  }

  changeState(e, maxCash) {
    this.props.setStateValue('maxCash', maxCash);
    this.props.completeStep(e, true, true);

    if (maxCash) {
      this.setState({ text: 'un max de fortune' });
    } else {
      this.setState({ text: 'un max de 2ème pilier' });
    }
  }

  render() {

    if (this.props.propertyType === 'primary') {
      return (
        <article onClick={this.props.setStep}>

          <h1 className={this.props.classes.text}>
            {this.props.twoBuyers ? 'Nous voulons utiliser ' : 'Je veux utiliser '}
            {this.state.text}
          </h1>

          {this.props.step === this.props.index &&
            <div className={this.props.classes.extra} style={styles.extra}>
              <RaisedButton
                label="Un max de fortune"
                style={styles.button}
                primary={!this.state.text}
                onClick={e => this.changeState(e, true)}
              />
              <RaisedButton
                label="Un max de 2ème pilier"
                style={styles.button}
                primary={!this.state.text}
                onClick={e => this.changeState(e, false)}
              />
              <HelpModal
                buttonLabel="Aidez-moi à choisir"
                title="2ème pilier ou fortune?"
                content="La LPP c'est de la bombe!"
              />
            </div>
          }

        </article>
      );
    }

    return null;
  }
}

Line8a.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,

  twoBuyers: PropTypes.bool.isRequired,
  propertyType: PropTypes.string.isRequired,
};
