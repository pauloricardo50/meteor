import React from 'react';
import cx from 'classnames';

import Icon from 'core/components/Icon';
import Link from 'core/components/Link';
import T from 'core/components/Translation';

import AppLoanClosingChecklists from '../../../../core/components/LoanClosingChecklist/AppLoanClosingChecklists';
import {
  defaultTodoList,
  getDashboardTodosArray,
  promotionTodoList,
} from './dashboardTodos';

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

const TodoItem = ({ label, loan, todo = {}, todos, onClick, className }) => {
  const { Component, id, link, isDone } = todo;
  const WrapperComponent = link && !isDone ? Link : 'div';

  return (
    <WrapperComponent
      to={link?.(loan)}
      className={cx('todo', { link, isDone }, className)}
      key={id}
      onClick={onClick}
    >
      <Icon className="icon" type={isDone ? 'check' : 'radioButtonChecked'} />
      <p>{label}</p>
      {link && !Component && !isDone && (
        <Icon type="right" className="icon-arrow" />
      )}
      {Component && (
        <Component {...todo} todos={todos} isDone={isDone} loan={loan} />
      )}
    </WrapperComponent>
  );
};

const DashboardProgressInfo = ({ loan }) => {
  const { showClosingChecklists } = loan;
  const todos = getTodos(loan);

  return (
    <div className="dashboard-progress-info">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          label={<T id={`DashboardProgressInfo.${todo.id}`} />}
          loan={loan}
          todo={todo}
          todos={todos}
        />
      ))}

      {showClosingChecklists && (
        <AppLoanClosingChecklists
          loanId={loan._id}
          renderTrigger={({ handleOpen, done, total }) => (
            <TodoItem
              label={
                <div className="flex center-align">
                  <span>
                    <T id="LoanClosingChecklist.makeProgress" />
                    &nbsp;({done}/{total})
                  </span>
                  <Icon type="right" className="icon-arrow" />
                </div>
              }
              onClick={handleOpen}
              className="animated fadeInUp pointer"
            />
          )}
        />
      )}
    </div>
  );
};

export default DashboardProgressInfo;
