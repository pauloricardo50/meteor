import React from 'react';
import PropTypes from 'prop-types';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import Calculator from 'core/utils/Calculator';
import ReturnToDashboard from '../../components/ReturnToDashboard';
import PageApp from '../../components/PageApp';
import Info from './Info';
import Finance from './Finance';
import BorrowerHeader from './BorrowerHeader';
import BorrowersPageTitle from './BorrowersPageTitle';
import BorrowersPageNextTab from './BorrowersPageNextTab';
import BorrowersPageContainer from './BorrowersPageContainer';

const getTabs = (props) => {
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
      <React.Fragment>
        <BorrowerHeader {...props} />
        {tab.content}
      </React.Fragment>
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

const BorrowersPage = (props) => {
  const {
    tabId,
    loan: { borrowers },
  } = props;
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
