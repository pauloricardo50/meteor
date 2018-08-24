import React from 'react';
import PropTypes from 'prop-types';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import withMatchParam from 'core/containers/withMatchParam';
import Page from '../../components/Page';
import ReturnToDashboard from '../../components/ReturnToDashboard';
import Info from './Info';
import Finance from './Finance';
import BorrowerHeader from './BorrowerHeader';
import BorrowersPageTitle from './BorrowersPageTitle';
import BorrowersPageNextTab from './BorrowersPageNextTab';

const getTabs = (props) => {
  const { loan } = props;
  return [
    { id: 'personal', content: <Info {...props} /> },
    { id: 'finance', content: <Finance {...props} /> },
  ].map(tab => ({
    ...tab,
    content: (
      <React.Fragment>
        <BorrowerHeader {...props} />
        {tab.content}
      </React.Fragment>
    ),
    label: <T id={`BorrowersPage.${tab.id}`} noTooltips />,
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
    <Page
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
    </Page>
  );
};

BorrowersPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  tabId: PropTypes.string.isRequired,
};

export default withMatchParam('tabId')(BorrowersPage);
