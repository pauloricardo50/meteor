import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';

import Table from 'core/components/Table';
import T from 'core/components/Translation';
import { getTaskRelatedLoan } from 'core/utils/taskFunctions';
import IconLink from 'core/components/IconLink';
import Loading from 'core/components/Loading';
import { TASK_TYPE } from 'core/api/tasks/taskConstants';
import TaskAssignDropdown from '../../components/AssignAdminDropdown/TaskAssignDropdown';
import TasksStatusDropdown from './TasksStatusDropdown';

const formatDateTime = (date, toNow) => (date ? moment(date)[toNow ? 'toNow' : 'fromNow']() : '-');

class TasksTable extends Component {
  getRelatedDoc = ({ borrower, loan, property, user }) => {
    if (borrower) {
      const { _id, name } = borrower;
      if (!_id) {
        return {};
      }

      return {
        link: `/borrowers/${_id}`,
        icon: 'people',
        text: name,
        translationId: 'borrower',
      };
    }

    if (loan) {
      const { _id, name } = loan;
      if (!_id) {
        return {};
      }

      return {
        link: `/loans/${_id}`,
        icon: 'dollarSign',
        text: name,
        translationId: 'loan',
      };
    }

    if (property) {
      const { _id, address1 } = property;
      if (!_id) {
        return {};
      }

      return {
        link: `/properties/${_id}`,
        icon: 'building',
        text: address1,
        translationId: 'property',
      };
    }

    if (user) {
      const { _id, name } = user;
      if (!_id) {
        return {};
      }

      return {
        link: `/users/${_id}`,
        icon: 'contactMail',
        text: name,
        translationId: 'user',
      };
    }

    return {};
  };

  getColumnOptions = ({ showAssignee }) => {
    const columnOptions = [
      { id: 'relatedTo', label: <T id="TasksTable.relatedTo" /> },
      { id: 'title', label: <T id="TasksTable.title" /> },
      { id: 'status', label: <T id="TasksTable.status" /> },
      { id: 'createdAt', label: <T id="TasksTable.createdAt" /> },
      { id: 'dueAt', label: <T id="TasksTable.dueAt" /> },
      { id: 'completedAt', label: <T id="TasksTable.completedAt" /> },
    ];
    if (showAssignee) {
      columnOptions.push({
        id: 'assignedTo',
        label: <T id="TasksTable.assignedTo" />,
      });
    }
    columnOptions.push({ id: 'actions', label: <T id="TasksTable.actions" /> });
    return columnOptions;
  };

  getColumns = ({ showAssignee, index, task }) => {
    const {
      type,
      status,
      createdAt,
      title,
      dueAt,
      completedAt,
      user,
      borrower,
      property,
      loan,
      assignedEmployee,
    } = task;

    const { link, icon, text, translationId } = this.getRelatedDoc({
      borrower,
      loan,
      property,
      user,
    });

    const relatedDoc = {
      label: link ? (
        <IconLink link={link} icon={icon} text={text || translationId} />
      ) : null,
      raw: text,
    };

    const columns = [
      relatedDoc,
      title || {
        raw: type,
        label: <T id={`TasksStatusDropdown.${type}`} key="type" />,
      },
      {
        raw: status,
        label: <T id={`TasksStatusDropdown.${status}`} key="status" />,
      },
      formatDateTime(createdAt),
      formatDateTime(dueAt, true),
      formatDateTime(completedAt),
    ];
    if (showAssignee) {
      if (assignedEmployee) {
        const { _id, name } = assignedEmployee;
        const cellText = name;
        columns.push({
          label: <Link to={`/users/${_id}`}>{cellText}</Link>,
          raw: cellText,
        });
      } else {
        columns.push({ raw: '', label: '' });
      }
    }

    columns.push(<div style={{ display: 'flex' }}>
      <TasksStatusDropdown
        currentUser={Meteor.user()}
        taskId={task._id}
        taskStatus={task.status}
      />
      <TaskAssignDropdown doc={task} />
    </div>);

    return columns;
  };

  setupRows = ({ data, showAssignee }) => {
    const { history } = this.props;

    return data.map((task, index) => ({
      id: task._id,
      columns: this.getColumns({ showAssignee, index, task }),
      handleClick: () => {
        if (task.type === TASK_TYPE.USER_ADDED_FILE) {
          const { _id } = getTaskRelatedLoan(task);
          history.push(`/loans/${_id}/forms`);
        }
      },
    }));
  };

  render() {
    const {
      data,
      isLoading,
      showAssignee,
      children,
      hideIfNoData,
      hideIfNoDataText,
    } = this.props;

    if (isLoading) {
      return <Loading />;
    }

    const rows = this.setupRows({ data, showAssignee });

    return (
      <React.Fragment>
        {children}
        {hideIfNoData && !rows.length ? (
          <p className="text-center">{hideIfNoDataText}</p>
        ) : (
          <Table
            columnOptions={this.getColumnOptions({ showAssignee })}
            rows={rows}
            noIntl
            className="tasks-table"
            clickable
          />
        )}
      </React.Fragment>
    );
  }
}

TasksTable.propTypes = {
  children: PropTypes.node,
  data: PropTypes.array.isRequired,
  hideIfNoData: PropTypes.bool,
  hideIfNoDataText: PropTypes.string,
  history: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  showAssignee: PropTypes.bool,
};

TasksTable.defaultProps = {
  showAssignee: false,
  children: null,
  hideIfNoData: false,
  hideIfNoDataText: "Pas de taches pour l'instant",
};

export default withRouter(TasksTable);
