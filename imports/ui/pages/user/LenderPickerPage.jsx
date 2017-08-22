import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';

import {
  getLoanValue,
  loanStrategySuccess,
} from '/imports/js/helpers/requestFunctions';

import ProcessPage from '/imports/ui/components/general/ProcessPage.jsx';
import LenderPickerStart from './lenderPickerPage/LenderPickerStart.jsx';
import RankStrategy from './lenderPickerPage/RankStrategy.jsx';
import AmortizingPicker from './lenderPickerPage/AmortizingPicker.jsx';
import InsuranceStrategy from './lenderPickerPage/InsuranceStrategy.jsx';
import LoanStrategyPicker from './lenderPickerPage/LoanStrategyPicker.jsx';
import LenderTable from './lenderPickerPage/LenderTable.jsx';

const handleSubmit = () => {
  const object = {};
};

const getLoan = (props, state) => getLoanValue(props.loanRequest);

const getComponents = (props, state) => [
  // {
  //   component: LenderPickerStart,
  //   condition: true,
  //   next: state.initialContinue,
  // },
  // {
  //   component: RankStrategy,
  //   condition: false,
  //   next: true,
  // },
  {
    component: InsuranceStrategy,
    condition: props.loanRequest.general.insuranceFortuneUsed > 0,
    next: state.insuranceUsePreset,
  },
  {
    component: AmortizingPicker,
    condition: true,
    next: state.amortizationStrategyPreset,
  },
  {
    component: LoanStrategyPicker,
    condition: true,
    next: state.loanStrategyValidated && state.loanStrategyPreset,
  },
  // {
  //   component: LenderTable,
  //   condition: true,
  // },
];

export default class LenderPickerPage extends React.Component {
  constructor(props) {
    super(props);

    const r = this.props.loanRequest;

    this.state = {
      initialContinue: r.logic.lender && r.logic.lender.offerId,
      chosenLender: r.logic.lender && r.logic.lender.offerId,
      fortuneUsed: r.general.fortuneUsed,
      insuranceFortuneUsed: r.general.insuranceFortuneUsed,
      partnerFilter: 'monthly',
      insuranceUsePreset: r.logic.insuranceUsePreset,
      amortizationStrategyPreset: r.logic.amortizationStrategyPreset,
      loanStrategyPreset: r.logic.loanStrategyPreset,
      loanTranches: r.general.loanTranches || [],
      loanStrategyValidated:
        r.logic.loanStrategyPreset &&
        loanStrategySuccess(r.general.loanTranches, getLoanValue(r)),
      standard: true,
    };
  }

  getSteps = () => {
    const props = {
      formState: this.state,
      setFormState: this.setFormState,
      loanRequest: this.props.loanRequest,
      borrowers: this.props.borrowers,
      offers: this.props.offers,
      loanValue: getLoan(this.props, this.state),
      history: this.props.history,
      scroll: () => {},
      // scroll: (i) => {
      //   const options = {
      //     duration: 350,
      //     delay: 0,
      //     smooth: true,
      //   };
      //   Meteor.defer(() => Scroll.scroller.scrollTo(`${i}`, options));
      // },
    };

    const componentsShown = [];
    getComponents(this.props, this.state).every((c) => {
      const nb = componentsShown.length;

      if (c.condition === false) {
        // skip
        return true;
      }
      componentsShown.push(<c.component {...props} index={nb} />);
      if (!c.next) {
        // break
        return false;
      }

      return true;
    });
    return componentsShown;
  };

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
      <ProcessPage
        {...this.props}
        stepNb={2}
        id="lenderPicker"
        showBottom={!!this.props.loanRequest.logic.lender.offerId}
      >
        <section className="mask1 partner-picker">
          {this.getSteps().map((step, i) =>
            (<Scroll.Element name={`${i}`} key={i}>
              {i > 0 && <hr style={{ margin: '32px 0' }} />}
              {step}
            </Scroll.Element>),
          )}
        </section>
      </ProcessPage>
    );
  }
}

LenderPickerPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
