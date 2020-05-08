import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import collectionIcons from 'core/arrays/collectionIcons';
import Icon from 'core/components/Icon/Icon';
import Select from 'core/components/Select';
import T from 'core/components/Translation';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import AllLoansTable from '../../components/AllLoansTable';
import LoansPageContainer from './LoansPageContainer';

const LoansPage = ({ assignees, setAssignees, ...props }) => {
  const { data: admins = [], loading } = useStaticMeteorData({
    query: USERS_COLLECTION,
    params: {
      $filters: { 'roles._id': ROLES.ADMIN },
      firstName: 1,
      $options: { sort: { firstName: 1 } },
    },
  });

  return (
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

      {!loading && (
        <Select
          label="Conseiller"
          value={assignees}
          onChange={setAssignees}
          options={admins.map(({ _id, firstName }) => ({
            id: _id,
            label: firstName,
          }))}
          style={{ minWidth: 200 }}
          multiple
        />
      )}

      <AllLoansTable {...props} />
    </section>
  );
};

LoansPage.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
};

LoansPage.defaultProps = {
  data: undefined,
};

export default LoansPageContainer(LoansPage);
