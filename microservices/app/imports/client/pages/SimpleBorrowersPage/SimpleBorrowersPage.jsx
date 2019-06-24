// @flow
import React from 'react';
import cx from 'classnames';
import { withState, compose } from 'recompose';

import useMedia from 'core/hooks/useMedia';
import withSimpleAppPage from '../../components/SimpleAppPage/SimpleAppPage';
import SimpleBorrowerPageForms from './SimpleBorrowerPageForms';
import SimpleBorrowersPageMaxPropertyValue from './SimpleBorrowersPageMaxPropertyValue';
import SimpleBorrowersPageHeader from './SimpleBorrowersPageHeader';
import MaxPropertyValueCTA from './MaxPropertyValueCTA';
import BorrowersAdder from '../../components/BorrowersAdder/BorrowersAdder';
import SimpleFormSwitch from './SimpleFormSwitch';

type SimpleBorrowersPageProps = {};

const maxPropertyValueHeight = 600;
const topSpaceHeight = 132;

const SimpleBorrowersPage = ({
  loan,
  simpleForm,
  setSimpleForm,
}: SimpleBorrowersPageProps) => {
  const isMobile = useMedia({ maxWidth: 1200 });
  const hasEnoughHeight = useMedia({
    minHeight: maxPropertyValueHeight + topSpaceHeight,
  });
  const { borrowers = [] } = loan;

  if (!borrowers.length) {
    return <BorrowersAdder loanId={loan._id} />;
  }

  return (
    <div className="simple-borrowers-page animated fadeIn">
      <div
        className={cx('simple-borrowers-page-container', {
          grow: hasEnoughHeight,
        })}
      >
        <div className="card1 card-top simple-borrowers-page-forms">
          <SimpleBorrowersPageHeader loan={loan} simpleForm={simpleForm} />
          <SimpleFormSwitch
            simpleForm={simpleForm}
            setSimpleForm={setSimpleForm}
          />
          <SimpleBorrowerPageForms loan={loan} simpleForm={simpleForm} />
        </div>
        <MaxPropertyValueCTA
          loan={loan}
          isMobile={isMobile}
          hasEnoughHeight={hasEnoughHeight}
        />
      </div>
      <SimpleBorrowersPageMaxPropertyValue
        loan={loan}
        isMobile={isMobile}
        hasEnoughHeight={hasEnoughHeight}
        blue
      />
    </div>
  );
};
export default compose(
  withSimpleAppPage,
  withState('simpleForm', 'setSimpleForm', true),
)(SimpleBorrowersPage);
