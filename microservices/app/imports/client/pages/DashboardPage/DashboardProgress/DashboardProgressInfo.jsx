// @flow
import React from 'react';
import Link from 'core/components/Link';
import cx from 'classnames';

import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import {
  getDashboardTodosArray,
  promotionTodoList,
  defaultTodoList,
} from './dashboardTodos';

type DashboardProgressInfoProps = {
  loan: Object,
};

const getTodos = loan => {
  let list = defaultTodoList;

  if (loan.hasPromotion) {
    list = promotionTodoList;
  }

  const sortedTodos = getDashboardTodosArray(list)
    .filter(({ hide }) => !hide || !hide(loan))
    .map(todo => ({ ...todo, isDone: !!todo.isDone(loan) }))
    .sort((a, b) => b.isDone - a.isDone);

  // Only display the 4 next todos that aren't done, to avoid overwhelming the user
  const max4Todos = sortedTodos.slice(
    0,
    sortedTodos.findIndex(({ isDone }) => !isDone) + 4,
  );

  return max4Todos;
};

const DashboardProgressInfo = ({ loan }: DashboardProgressInfoProps) => {
  const todos = getTodos(loan);

  return (
    <div className="dashboard-progress-info">
      {todos.map(todo => {
        const { id, link, isDone, Component } = todo;
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
            {link && !Component && !isDone && (
              <Icon type="right" className="icon-arrow" />
            )}
            {Component && (
              <Component {...todo} todos={todos} isDone={isDone} loan={loan} />
            )}
          </WrapperComponent>
        );
      })}
    </div>
  );
};

export default DashboardProgressInfo;
