// @flow
import React from 'react';
import { Link } from 'react-router-dom';

import Icon from 'core/components/Icon';
import IconButton from 'core/components/IconButton';
import T from 'core/components/Translation';
import type { userLoan } from 'core/api/types';
import dashboardTodos from './dashboardTodos';

type DashboardProgressInfoProps = {
  loan: userLoan,
};

const DashboardProgressInfo = ({ loan }: DashboardProgressInfoProps) => (
  <div className="dashboard-progress-info">
    {dashboardTodos
      .filter(({ condition }) => condition(loan))
      .map(({ id, link }) => (
        <div className="todo" key={id}>
          <Icon className="icon" type="radioButtonChecked" />
          <p>
            <T id={`DashboardProgressInfo.${id}`} />
          </p>
          <Link to={link(loan)} className="link">
            <IconButton type="right" />
          </Link>
        </div>
      ))}
  </div>
);

export default DashboardProgressInfo;
