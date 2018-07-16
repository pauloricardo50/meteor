import React from 'react';
import PropTypes from 'prop-types';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import withMatchParam from 'core/containers/withMatchParam';
import Page from '../../components/Page';
import Info from './Info';
import Finance from './Finance';
import Files from './Files';
import BorrowerHeader from './BorrowerHeader';

const getTabs = (props) => {
  const { loan } = props;
  const { borrowers } = loan;
  return [
    { id: 'personal', content: <Info {...props} /> },
    { id: 'finance', content: <Finance {...props} /> },
    { id: 'files', content: <Files {...props} /> },
  ].map(tab => ({
    ...tab,
    content: (
      <React.Fragment>
        <BorrowerHeader {...props} />
        {tab.content}
      </React.Fragment>
    ),
    label: <T id={`BorrowerPage.${tab.id}`} noTooltips />,
    to: `/loans/${loan._id}/borrowers/${borrowers[0]._id}/${tab.id}`,
  }));
};

const BorrowerPage = (props) => {
  const { tabId } = props;
  const tabs = getTabs(props);
  const initialIndex = tabs.map(({ id }) => id).indexOf(tabId);

  return (
    <Page id="borrowers">
      <section className="borrower-page">
        <Tabs tabs={tabs} initialIndex={initialIndex} />
      </section>
    </Page>
  );
};

BorrowerPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  tabId: PropTypes.string.isRequired,
};

export default withMatchParam('tabId')(BorrowerPage);
