import PropTypes from 'prop-types';
import React from 'react';
import CountUp from 'react-countup';
import { injectIntl } from 'react-intl';

import Button from 'core/components/Button';
import Calculator from 'core/utils/Calculator';
import { startAuction } from 'core/api/methods';

import T from 'core/components/Translation';
import track from 'core/utils/analytics';
import ConfirmButton from '../../components/ConfirmButton';
import AuctionForm from './AuctionForm';

const styles = {
  text: {
    textAlign: 'justify',
    padding: 20,
  },
  a: {
    marginBottom: 50,
    width: '100%',
    display: 'inline-block',
  },
  formDiv: {
    marginBottom: 40,
    width: '100%',
    display: 'inline-block',
  },
  countUp: {
    display: 'inline-block',
    width: '100%',
    margin: '20px 0',
  },
  button: {
    margin: 4,
  },
};

const AuctionStart = (props) => {
  const lenderCount = Calculator.getLenderCount(props);
  const r = props.loan;
  const f = props.intl.formatMessage;
  return (
    <section className="mask1 auction-page-start">
      <h1>
        <T id="AuctionStart.title" />
      </h1>
      <h1 className="text-center display2" style={styles.countUp}>
        <CountUp
          className="custom-count"
          start={0}
          end={lenderCount}
          duration={3.5}
          useEasing
          separator=" "
          decimal=","
          prefix=""
          suffix={f({ id: 'AuctionStart.countSuffix' })}
        />
      </h1>
      <a className="bold secondary active text-center" style={styles.a}>
        <span>
          <T id="AuctionStart.lenderList" />
        </span>
      </a>

      <div className="description">
        <p>
          <T id="AuctionStart.description" values={{ count: lenderCount }} />
        </p>
      </div>

      <div className="auction-form">
        <AuctionForm {...props} />
      </div>

      <div className="col-xs-12">
        <div className="form-group text-center">
          <ConfirmButton
            raised
            label={<T id="AuctionStart.CTA" />}
            primary
            handleClick={() =>
              startAuction
                .run({ loanId: props.loan._id })
                .then(res => track('started auction', {}))
            }
            disabled={
              !(r.general.auctionMostImportant && r.general.wantedClosingDate)
            }
            style={styles.button}
          />
        </div>
        <div className="form-group text-center">
          <Button
            raised
            label={<T id="AuctionStart.cancel" />}
            onClick={() => props.history.push('/')}
            style={styles.button}
          />
        </div>
      </div>
    </section>
  );
};

AuctionStart.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default injectIntl(AuctionStart);
