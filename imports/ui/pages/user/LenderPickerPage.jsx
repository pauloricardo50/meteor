import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';

import {
  getLoanValue,
  loanStrategySuccess,
} from '/imports/js/helpers/requestFunctions';

import FortuneSliders from './lenderPickerPage/FortuneSliders.jsx';
import AmortizingPicker from './lenderPickerPage/AmortizingPicker.jsx';
import LoanStrategyPicker from './lenderPickerPage/LoanStrategyPicker.jsx';
import LenderTable from './lenderPickerPage/LenderTable.jsx';

const handleSubmit = () => {
  const object = {};
};

const getLoan = (props, state) => {
  return getLoanValue(props.loanRequest);
};

export default class LenderPickerPage extends React.Component {
  constructor(props) {
    super(props);

    const r = this.props.loanRequest;

    this.state = {
      validatedFortune: r.logic.lender,
      chosenLender: r.logic.lender,
      fortuneUsed: r.general.fortuneUsed,
      insuranceFortuneUsed: r.general.insuranceFortuneUsed,
      partnerFilter: 'monthly',
      amortizing: r.logic.amortizingStrategyPreset,
      loanStrategyPreset: r.logic.loanStrategyPreset,
      loanTranches: r.general.loanTranches || [],
      loanStrategyValidated: r.logic.loanStrategyPreset &&
        loanStrategySuccess(r.general.loanTranches, getLoanValue(r)),
    };

    this.setFormState = this.setFormState.bind(this);
  }

  setFormState(id, value, callback, obj) {
    // If a whole object is given, set that object to state
    if (obj) {
      this.setState(obj, () => {
        if (typeof callback === 'function') {
          callback();
        }
      });
    } else {
      // Else, simple set one value to state
      const object = {};
      object[id] = value;

      this.setState(object, () => {
        if (typeof callback === 'function') {
          callback();
        }
      });
    }
  }

  getSteps() {
    const props = {
      formState: this.state,
      setFormState: this.setFormState,
      loanRequest: this.props.loanRequest,
      borrowers: this.props.borrowers,
      offers: this.props.offers,
      loanValue: getLoan(this.props, this.state),
      scroll: i => {
        const options = {
          duration: 350,
          delay: 0,
          smooth: true,
        };
        Meteor.defer(() => Scroll.scroller.scrollTo(`${i}`, options));
      },
    };

    const array = [<FortuneSliders {...props} />];

    if (this.state.validatedFortune) {
      array.push(<AmortizingPicker {...props} />);
    }
    if (this.state.amortizing) {
      array.push(<LoanStrategyPicker {...props} />);
    }
    if (this.state.loanStrategyValidated) {
      array.push(<LenderTable {...props} />);
    }

    return array;
  }

  render() {
    return (
      <section className="mask1 partner-picker">
        <h1 className="text-center" style={{ marginBottom: 50 }}>
          Choisissez votre prêteur
        </h1>

        {this.getSteps().map((step, i) => (
          <Scroll.Element name={`${i}`} key={i}>
            {i > 0 && <hr />}
            {step}
          </Scroll.Element>
        ))}
      </section>
    );
  }
}

LenderPickerPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
