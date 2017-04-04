import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import Lock from 'material-ui/svg-icons/action/lock';
import LockOpen from 'material-ui/svg-icons/action/lock-open';

import { toMoney } from '/imports/js/helpers/conversionFunctions';

import StartSlider from './StartSlider.jsx';

const styles = {
  sliders: {
    margin: 0,
  },
  h2: {
    marginBottom: 0,
  },
};

export default class FortuneSliders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locked: false,
    };

    this.handleChangeFortune = this.handleChangeFortune.bind(this);
    this.handleChangeInsurance = this.handleChangeInsurance.bind(this);
  }

  handleChangeFortune(e, fortune) {
    if (this.state.locked) {
      this.props.setFormState(
        'insuranceFortuneUsed',
        this.props.formState.minFortune - Math.round(fortune),
      );
      this.props.setFormState('fortuneUsed', Math.round(fortune));
    }
  }

  handleChangeInsurance(e, insuranceFortune) {
    if (this.state.locked) {
      this.props.setFormState(
        'fortuneUsed',
        this.props.formState.minFortune - Math.round(insuranceFortune),
      );
      this.props.setFormState(
        'insuranceFortuneUsed',
        Math.round(insuranceFortune),
      );
    }
  }

  render() {
    const hasToUseLpp = this.props.formState.fortune <
      this.props.formState.minFortune;
    return (
      <div className="fortune-sliders" key={this.props.key}>

        <h1 className="fixed-size">
          {this.props.text1}
        </h1>

        <h2 className="fixed-size" style={styles.h2}>
          Fortune:
          {' '}
          <span className="active">
            CHF
            {' '}
            {toMoney(
              this.props.formState.fortuneUsed ||
                this.props.sliders[0].sliderMin,
            )}
          </span>
        </h2>
        <StartSlider
          {...this.props}
          {...this.props.sliders[0]}
          setFormState={this.handleChangeFortune}
          style={styles.sliders}
        />

        {this.props.formState.useInsurance &&
          <div className="animated fadeIn" style={{ position: 'relative' }}>
            <h2 className="fixed-size" style={styles.h2}>
              2ème Pilier: <span className="active">
                CHF {toMoney(this.props.formState.insuranceFortuneUsed || 0)}
              </span>
            </h2>
            <StartSlider
              {...this.props}
              {...this.props.sliders[1]}
              setFormState={this.handleChangeInsurance}
              style={styles.sliders}
            />
            <div className="locked-toggle">
              <div className="wrapper">
                <RaisedButton
                  label=""
                  onTouchTap={() =>
                    this.setState({ locked: !this.state.locked })}
                  icon={
                    this.state.locked
                      ? <Lock color="#d8d8d8" />
                      : <LockOpen color="#d8d8d8" />
                  }
                  style={{ minWidth: 'unset' }}
                  overlayStyle={{ padding: '0 8px' }}
                />
              </div>
            </div>
          </div>}
        {!this.props.formState.useInsurance &&
          <div className="text-center animated fadeIn">
            <h2 className="fixed-size">
              {hasToUseLpp &&
                'Vous devez utiliser votre 2ème pilier pour ce projet'}
              {!hasToUseLpp &&
                'Vous êtes éligible pour utiliser votre 2ème pilier'}
            </h2>
            <RaisedButton
              label="Utiliser"
              style={{ marginRight: 8 }}
              onTouchTap={() => {
                this.props.setFormState('useInsurance', true);
                this.setState({ locked: true });
              }}
              primary
            />
            <RaisedButton label="Pourquoi?" />
          </div>}
      </div>
    );
  }
}

FortuneSliders.propTypes = {
  formState: PropTypes.objectOf(PropTypes.any).isRequired,
  setFormState: PropTypes.func.isRequired,
  sliders: PropTypes.arrayOf(PropTypes.object).isRequired,
  text1: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  key: PropTypes.number.isRequired,
};
