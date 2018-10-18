// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import type { userLoan } from 'core/api/types';
import {
  getDashboardTodosArray,
  promotionTodoList,
  defaultTodoList,
} from './dashboardTodos';

type DashboardProgressInfoProps = {
  loan: userLoan,
};

const getTodos = (loan) => {
  let list = defaultTodoList;

  if (loan.hasPromotion) {
    list = promotionTodoList;
  }

  return getDashboardTodosArray(list)
    .filter(({ hide }) => !hide || !hide(loan))
    .sort((a, b) => b.isDone(loan) - a.isDone(loan));
};

const DashboardProgressInfo = ({ loan }: DashboardProgressInfoProps) => (
  <div className="dashboard-progress-info">
    {getTodos(loan).map((todo) => {
      const { id, link, isDone: isDoneFunc, Component } = todo;
      const isDone = isDoneFunc(loan);
      const WrapperComponent = link && !isDone ? Link : 'div';
      return (
        <WrapperComponent
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
          {link
            && !Component
            && !isDone && <Icon type="right" className="icon-arrow" />}
          {Component && <Component {...todo} isDone={isDone} loan={loan} />}
        </WrapperComponent>
      );
    })}
  </div>
);

export default DashboardProgressInfo;
