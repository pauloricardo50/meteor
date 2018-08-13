// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import type { userLoan } from 'core/api/types';
import { dashboardTodosArray } from './dashboardTodos';

type DashboardProgressInfoProps = {
  loan: userLoan,
};

const DashboardProgressInfo = ({ loan }: DashboardProgressInfoProps) => (
  <div className="dashboard-progress-info">
    {dashboardTodosArray
      .filter(({ condition }) => condition(loan))
      .map(({ id, link }) => {
        const Component = link ? Link : 'div';
        return (
          <Component
            to={link && link(loan)}
            className={cx('todo', { link })}
            key={id}
          >
            <Icon className="icon" type="radioButtonChecked" />
            <p>
              <T id={`DashboardProgressInfo.${id}`} />
            </p>
            {link && <Icon type="right" className="icon-arrow" />}
          </Component>
        );
      })}
  </div>
);

export default DashboardProgressInfo;
