import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';

import T from 'core/components/Translation';
import Icon from 'core/components/Icon/Icon';
import { LOANS_COLLECTION } from 'core/api/constants';
import collectionIcons from 'core/arrays/collectionIcons';
import AllLoansTable from '../../components/AllLoansTable';
import LoansPageContainer from './LoansPageContainer';

const LoansPage = props => (
  <section className="card1 card-top loans-page">
    <Helmet>
      <title>Hypothèques</title>
    </Helmet>
    <h1 className="flex center-align">
      <Icon
        type={collectionIcons[LOANS_COLLECTION]}
        style={{ marginRight: 8 }}
        size={32}
      />
      <T id="LoansPage.title" />
    </h1>

    <AllLoansTable {...props} />
  </section>
);

LoansPage.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
};

LoansPage.defaultProps = {
  data: undefined,
};

export default LoansPageContainer(LoansPage);
