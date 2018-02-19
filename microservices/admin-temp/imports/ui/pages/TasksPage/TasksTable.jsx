import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Roles } from 'meteor/alanning:roles';
import moment from 'moment';
import Table from 'core/components/Table';
import TasksStatusDropdown from './TasksStatusDropdown';
import TasksUserWithData from './TasksUsersWithData';
import { T } from 'core/components/Translation/';

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
      {
        id: <T id="TasksTable.status" />,
      },
      {
        id: <T id="TasksTable.createdAt" />,
      },
      {
        id: <T id="TasksTable.updatedAt" />,
      },
      {
        id: <T id="TasksTable.dueAt" />,
      },
      {
        id: <T id="TasksTable.completedAt" />,
      },
    ];
    if (showAssignee) {
      columnOptions.push({
        id: <T id="TasksTable.asignedTo" />,
      });
    }
    columnOptions.push({
      id: <T id="TasksTable.actions" />,
    });
    return columnOptions;
  };

  getColumns = ({ props, index, task }) => {
    const columns = [
      index + 1,
      <T id={`TasksStatusDropdown.${task.status}`} />,
      moment(task.createdAt).format('D MMM YY à HH:mm:ss'),
      moment(task.updatedAt).format('D MMM YY à HH:mm:ss'),
      moment(task.dueAt).format('D MMM YY à HH:mm:ss'),
      moment(task.completedAt).format('D MMM YY à HH:mm:ss'),
    ];
    if (props.showAssignee) {
      columns.push((task.assignedUser &&
          (task.assignedUser.username ||
            task.assignedUser.emails[0].address.toString())) ||
          '');
    }
    columns.push(<div>
      <TasksStatusDropdown
        {...props}
        currentUser={Meteor.user()}
        taskId={task._id}
        taskStatus={task.status}
        styles={styles.dropdownButtons}
      />
      <TasksUserWithData
        {...props}
        taskId={task._id}
        taskUser={task.user}
        styles={styles.dropdownButtons}
      />
    </div>);

    return columns;
  };

  setupRows = (props) => {
    const tasks = props.data;

    this.rows = tasks.map((task, index) => ({
      id: task._id,
      columns: this.getColumns({
        props,
        index,
        task,
      }),
    }));

    return this.rows;
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
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
