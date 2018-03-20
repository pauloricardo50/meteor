import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';

import Table from 'core/components/Table';
import { T } from 'core/components/Translation';
import TaskAssignDropdown from '../../components/AssignAdminDropdown/TaskAssignDropdown';
import TasksStatusDropdown from './TasksStatusDropdown';

const styles = {
  dropdownButtons: { display: 'inline', width: '50%' },
};

export default class TasksTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: this.setupRows(this.props),
      columnOptions: this.getColumnOptions(this.props),
    };
  }

  componentWillReceiveProps(nextProps) {
    const newRows = this.setupRows(nextProps);
    this.setState({
      rows: newRows,
      columnOptions: this.getColumnOptions(nextProps),
    });
  }

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
    const columns = [
      index + 1,
      <T id={`TasksStatusDropdown.${task.type}`} />,
      <T id={`TasksStatusDropdown.${task.status}`} />,
      moment(task.createdAt).format('D MMM YY à HH:mm:ss'),
      moment(task.updatedAt).format('D MMM YY à HH:mm:ss'),
      moment(task.dueAt).format('D MMM YY à HH:mm:ss'),
      moment(task.completedAt).format('D MMM YY à HH:mm:ss'),
      task.user && (task.user.username || task.user.emails[0].address || ''),
      // TODO: also check& add other related docs
    ];
    if (props.showAssignee) {
      columns.push(task.assignedEmployee &&
          (task.assignedEmployee.username ||
            task.assignedEmployee.emails[0].address ||
            ''));
    }

    columns.push(<div style={{ display: 'flex' }}>
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
    const { columnOptions, rows } = this.state;

    if (!isLoading) {
      return <Table columnOptions={columnOptions} rows={rows} noIntl />;
    }
    return null;
  }
}

TasksTable.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
