import React, { Component, PropTypes } from 'react';


import RaisedButton from 'material-ui/RaisedButton';


const styles = {
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
  button2: {
    marginRight: 24,
    marginBottom: 8,
  },
  extra: {
    marginBottom: 16,
  },
  hr: {
    width: '10%',
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 8, // add 8 to compensate for the button bottom margin
  },
};


export default class Line3 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gender1Text: '',
      gender2Text: '',
    };

    this.changeState = this.changeState.bind(this);
  }

  componentDidMount() {
    // If this line is not required, immediately jump to step 3
    if (!this.props.genderRequired) {
      this.props.completeStep(null, true);
      this.props.setStep(3);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const p = this.props;
    const n = nextProps;

    return (
      p.classes !== n.classes ||
      p.twoBuyers !== n.twoBuyers ||
      p.genderRequired !== n.genderRequired ||
      p.gender1 !== n.gender1 ||
      p.gender2 !== n.gender2
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.genderRequired !== nextProps.genderRequired) {
      // If age is modified, make sure this step is cancelled/activated
      if (!nextProps.genderRequired) {
        nextProps.completeStep(null, true);
        nextProps.setStep(this.props.index + 1);
      }
    }
  }


  setCompleted() {
    const p = this.props;

    // If all required values are set, go to next step
    if (p.twoBuyers) {
      if (p.gender1 && p.gender2) {
        p.completeStep(null, true, true);
      }
    } else if (p.gender1) {
      p.completeStep(null, true, true);
    }
  }


  changeState(i) {
    // React to a button press, adjust gender accordingly
    switch (i) {
      case 1:
        this.props.setStateValue('gender1', 'f', () => this.setCompleted());
        this.setState({ gender1Text: 'une femme' });
        break;
      case 2:
        this.props.setStateValue('gender1', 'm', () => this.setCompleted());
        this.setState({ gender1Text: 'un homme' });
        break;
      case 3:
        this.props.setStateValue('gender2', 'f', () => this.setCompleted());
        this.setState({ gender2Text: 'une femme' });
        break;
      case 4:
        this.props.setStateValue('gender2', 'm', () => this.setCompleted());
        this.setState({ gender2Text: 'un homme' });
        break;
      default: break;
    }
  }


  render() {
    if (this.props.genderRequired) {
      return (
        <article onClick={this.props.setStep}>

          <h1 className={this.props.classes.text}>
            {this.props.twoBuyers ? 'Nous sommes ' : 'Je suis '}
            {this.props.gender1 ? <span className="value">{this.state.gender1Text}</span> : '..'}
            {this.props.twoBuyers ? ' et ' : '.'}
            {this.props.twoBuyers && (this.props.gender2 ?
              <span className="value">{this.state.gender2Text}</span> : '..')}
            {this.props.twoBuyers ? ' respectivement.' : ''}
          </h1>

          {this.props.step === this.props.index &&
            <div className={this.props.classes.extra} style={styles.extra}>
              <RaisedButton
                label="une femme"
                style={styles.button}
                primary={!this.props.gender1}
                onClick={() => this.changeState(1)}
              />
              <RaisedButton
                label="un homme"
                style={styles.button2}
                primary={!this.props.gender1}
                onClick={() => this.changeState(2)}
              />
              {this.props.twoBuyers &&
                <span>
                  <hr style={styles.hr} />
                  <RaisedButton
                    label="une femme"
                    style={styles.button}
                    primary={!this.props.gender2}
                    onClick={() => this.changeState(3)}
                  />
                  <RaisedButton
                    label="un homme"
                    primary={!this.props.gender2}
                    onClick={() => this.changeState(4)}
                  />
                </span>
              }
            </div>
          }

        </article>
      );
    }
    // If gender is not required, return null
    return null;
  }
}

Line3.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,

  twoBuyers: PropTypes.bool.isRequired,
  genderRequired: PropTypes.bool.isRequired,
  gender1: PropTypes.string.isRequired,
  gender2: PropTypes.string.isRequired,
};
