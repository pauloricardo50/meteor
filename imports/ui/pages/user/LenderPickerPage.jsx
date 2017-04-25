import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';

import { getLoanValue, loanStrategySuccess } from '/imports/js/helpers/requestFunctions';

import LenderPickerStart from './lenderPickerPage/LenderPickerStart.jsx';
import RankStrategy from './lenderPickerPage/RankStrategy.jsx';
import AmortizingPicker from './lenderPickerPage/AmortizingPicker.jsx';
import LoanStrategyPicker from './lenderPickerPage/LoanStrategyPicker.jsx';
import LenderTable from './lenderPickerPage/LenderTable.jsx';

const handleSubmit = () => {
  const object = {};
};

const getLoan = (props, state) => {
  return getLoanValue(props.loanRequest);
};

const getComponents = state => [
  {
    component: LenderPickerStart,
    condition: true,
  },
  {
    component: RankStrategy,
    condition: false,
  },
  {
    component: AmortizingPicker,
    condition: state.initialContinue,
  },
  {
    component: LoanStrategyPicker,
    condition: state.amortizationStrategyPreset,
  },
  {
    component: LenderTable,
    condition: state.loanStrategyValidated,
  },
];

export default class LenderPickerPage extends React.Component {
  constructor(props) {
    super(props);

    const r = this.props.loanRequest;

    this.state = {
      initialContinue: r.logic.lender,
      chosenLender: r.logic.lender,
      fortuneUsed: r.general.fortuneUsed,
      insuranceFortuneUsed: r.general.insuranceFortuneUsed,
      partnerFilter: 'monthly',
      amortizationStrategyPreset: r.logic.amortizationStrategyPreset,
      loanStrategyPreset: r.logic.loanStrategyPreset,
      loanTranches: r.general.loanTranches || [],
      loanStrategyValidated: r.logic.loanStrategyPreset &&
        loanStrategySuccess(r.general.loanTranches, getLoanValue(r)),
    };
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

    const array = [];
    getComponents(this.state).forEach((c, i) => {
      if (c.condition || this.props.loanRequest.logic.lender) {
        array.push(<c.component {...props} index={i} />);
      }
    });
    return array;
  }

  setFormState = (id, value, callback, obj) => {
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
  };

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
