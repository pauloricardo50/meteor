import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Table from 'core/components/Table';
import { T } from 'core/components/Translation';
import TaskAssignDropdown
  from '../../components/AssignAdminDropdown/TaskAssignDropdown';
import TasksStatusDropdown from './TasksStatusDropdown';
import LinkToDoc from '../LinkToDoc';

const styles = {
  dropdownButtons: { display: 'inline', width: '50%' },
};

const formatDateTime = date =>
  moment(date).format('D MMM YY à HH:mm:ss');

export default class TasksTable extends Component {
  getColumnOptions = ({ showAssignee }) => {
    const columnOptions = [
      { id: '#', style: { width: 32, textAlign: 'left' } },
      { id: 'type', label: <T id="TasksTable.type" /> },
      { id: 'status', label: <T id="TasksTable.status" /> },
      { id: 'createdAt', label: <T id="TasksTable.createdAt" /> },
      { id: 'updatedAt', label: <T id="TasksTable.updatedAt" /> },
      { id: 'dueAt', label: <T id="TasksTable.dueAt" /> },
      { id: 'completedAt', label: <T id="TasksTable.completedAt" /> },
      { id: 'relatedTo', label: <T id="TasksTable.relatedTo" /> },
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

  getColumns = ({ props, index, task }) => {
    const { type,
      status,
      createdAt,
      updatedAt,
      dueAt,
      completedAt,
      user,
      borrower,
      property,
      loan,
      assignedEmployee } = task;
    const columns = [
      index + 1,
      <T id={`TasksStatusDropdown.${type}`} key="type" />,
      <T id={`TasksStatusDropdown.${status}`} key="status" />,
      formatDateTime(createdAt),
      formatDateTime(updatedAt),
      formatDateTime(dueAt),
      formatDateTime(completedAt),
      <LinkToDoc
        loan={loan}
        borrower={borrower}
        property={property}
        user={user}
        key="relatedDoc"
      />,
    ];
    if (props.showAssignee) {
      columns.push(assignedEmployee &&
        <Link to={`/users/${assignedEmployee._id}`} >
          {assignedEmployee.username || assignedEmployee.emails[0].address}
        </Link>);
    }

    columns.push(
      <div style={{ display: 'flex' }}>
        <TasksStatusDropdown
          {...props}
          currentUser={Meteor.user()}
          taskId={task._id}
          taskStatus={task.status}
          styles={styles.dropdownButtons}
        />
        <TaskAssignDropdown doc={task} styles={styles.dropdownButtons} />
      </div>);

    return columns;
  };

  setupRows = (props) => {
    const tasks = props.data;

    if (tasks && tasks.length) {
      this.rows = tasks.map((task, index) => ({
        id: task._id,
        columns: this.getColumns({
          props,
          index,
          task,
        }),
      }));

      return this.rows;
    }

    return [];
  };

  render() {
    const { isLoading } = this.props;

    if (!isLoading) {
      return (
        <Table
          columnOptions={this.getColumnOptions(this.props)}
          rows={this.setupRows(this.props)}
          noIntl
        />
      );
    }
    return null;
  }
}

TasksTable.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
