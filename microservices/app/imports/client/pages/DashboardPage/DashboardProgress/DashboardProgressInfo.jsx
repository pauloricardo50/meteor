// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import type { userLoan } from 'core/api/types';
import {
  dashboardTodosArray,
  promotionTodoList,
  defaultTodoList,
} from './dashboardTodos';

type DashboardProgressInfoProps = {
  loan: userLoan,
};

const getTodos = loan =>
  dashboardTodosArray
    .filter(({ id }) => {
      if (loan.hasPromotion) {
        return promotionTodoList[id];
      }

      return defaultTodoList[id];
    })
    .filter(({ hide }) => !hide || !hide(loan))
    .sort((a, b) => b.isDone(loan) - a.isDone(loan));

const DashboardProgressInfo = ({ loan }: DashboardProgressInfoProps) => (
  <div className="dashboard-progress-info">
    {getTodos(loan).map(({ id, link, isDone: isDoneFunc }) => {
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
