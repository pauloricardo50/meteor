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
      .sort((a, b) => b.isDone(loan) - a.isDone(loan))
      .map(({ id, link, isDone: isDoneFunc, hide }) => {
        if (hide && hide(loan)) {
          return null;
        }
        const isDone = isDoneFunc(loan);
        const Component = link && !isDone ? Link : 'div';
        return (
          <Component
            to={link && link(loan)}
            className={cx('todo', { link, isDone })}
            key={id}
          >
            <Icon
              className="icon"
              type={isDone ? 'check' : 'radioButtonChecked'}
            />
            <p>
              <T id={`DashboardProgressInfo.${id}`} />
            </p>
            {link && !isDone && <Icon type="right" className="icon-arrow" />}
          </Component>
        );
      })}
  </div>
);

export default DashboardProgressInfo;
