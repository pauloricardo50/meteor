import React from 'react';
import PropTypes from 'prop-types';

import BorrowerAdder from 'core/components/BorrowerAdder';
import Icon from 'core/components/Icon';
import PercentWithStatus from 'core/components/PercentWithStatus';
import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';

import DeactivatedFormInfo from '../../components/DeactivatedFormInfo';
import PageApp from '../../components/PageApp';
import ReturnToDashboard from '../../components/ReturnToDashboard';
import BorrowerHeader from './BorrowerHeader';
import BorrowersPageContainer from './BorrowersPageContainer';
import BorrowersPageNextTab from './BorrowersPageNextTab';
import BorrowersPageTitle from './BorrowersPageTitle';
import Finance from './Finance';
import Info from './Info';

const getTabs = props => {
  const { loan } = props;
  return [
    {
      id: 'personal',
      content: <Info {...props} />,
      percent: Calculator.borrowerInfoPercent({ loan }),
    },
    {
      id: 'finance',
      content: <Finance {...props} />,
      percent: Calculator.borrowerFinancePercent({ loan }),
    },
  ].map(tab => ({
    ...tab,
    content: (
      <>
        <DeactivatedFormInfo loan={loan} style={{ marginBottom: 32 }} />
        <BorrowerHeader {...props} />
        {tab.content}
      </>
    ),
    label: (
      <span className="borrower-tab-labels">
        <T id={`BorrowersPage.${tab.id}`} noTooltips />
        &nbsp;&bull;&nbsp;
        <PercentWithStatus
          value={tab.percent}
          status={tab.percent < 1 ? null : undefined}
          rounded
        />
      </span>
    ),
    to: `/loans/${loan._id}/borrowers/${tab.id}`,
  }));
};

const BorrowersPage = props => {
  const {
    tabId,
    loan: { borrowers, _id: loanId, user: { _id: userId } = {} },
  } = props;

  if (borrowers.length === 0) {
    return (
      <div className="flex-col center center-align">
        <Icon
          type="people"
          style={{ width: '50px', height: '50px', color: 'rgba(0,0,0,0.5)' }}
        />
        <h3 className="secondary">Aucun emprunteur pour l'instant</h3>
        <BorrowerAdder loanId={loanId} userId={userId} />
      </div>
    );
  }

  const tabs = getTabs(props);
  const initialIndex = tabs.map(({ id }) => id).indexOf(tabId);

  return (
    <PageApp
      id="BorrowersPage"
      title={<BorrowersPageTitle borrowers={borrowers} />}
    >
      <section className="borrower-page">
        <Tabs tabs={tabs} initialIndex={initialIndex} />
      </section>
      <span className="borrowers-page-buttons">
        <ReturnToDashboard />
        <BorrowersPageNextTab
          tabId={tabId}
          makeLink={tab => `/loans/${props.loan._id}/borrowers/${tab}`}
        />
      </span>
    </PageApp>
  );
};

BorrowersPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  tabId: PropTypes.string,
};

BorrowersPage.defaultProps = {
  tabId: 'personal',
};

export default BorrowersPageContainer(BorrowersPage);
