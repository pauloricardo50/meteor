import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';

import Icon from 'core/components/Icon';
import Table from 'core/components/Table';
import { T } from 'core/components/Translation';
import { getBorrowerFullName } from 'core/utils/borrowerFunctions';
import IconLink from 'core/components/IconLink';
import Loading from 'core/components/Loading';
import TaskAssignDropdown from '../../components/AssignAdminDropdown/TaskAssignDropdown';
import TasksStatusDropdown from './TasksStatusDropdown';

const formatDateTime = date => moment(date).format('D MMM YY à HH:mm:ss');

class TasksTable extends Component {
  getRelatedDoc = ({ borrower, loan, property, user }) => {
    if (borrower) {
      const { _id, firstName, lastName } = borrower;
      if (!_id) {
        return {};
      }

      return {
        link: `/borrowers/${_id}`,
        icon: 'people',
        text: getBorrowerFullName({ firstName, lastName }),
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
      const { _id, username, emails } = user;
      if (!_id) {
        return {};
      }

      return {
        link: `/users/${_id}`,
        icon: 'contactMail',
        text: username || emails[0].address,
        translationId: 'user',
      };
    }

    return {};
  };

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

  getColumns = ({ showAssignee, index, task }) => {
    const {
      type,
      status,
      createdAt,
      updatedAt,
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
      label: link ? <IconLink link={link} icon={icon} text={text || translationId} /> : null,
      raw: text,
    };

    const columns = [
      index + 1,
      { raw: type, label: <T id={`TasksStatusDropdown.${type}`} key="type" /> },
      {
        raw: status,
        label: <T id={`TasksStatusDropdown.${status}`} key="status" />,
      },
      formatDateTime(createdAt),
      formatDateTime(updatedAt),
      formatDateTime(dueAt),
      formatDateTime(completedAt),
      relatedDoc,
    ];
    if (showAssignee) {
      if (assignedEmployee) {
        const cellText =
          assignedEmployee.username || assignedEmployee.emails[0].address;
        columns.push({
          label: <Link to={`/users/${assignedEmployee._id}`}>{cellText}</Link>,
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

  setupRows = ({ data, showAssignee }) =>
    data.map((task, index) => ({
      id: task._id,
      columns: this.getColumns({ showAssignee, index, task }),
    }));

  render() {
    const { data, isLoading, showAssignee } = this.props;

    if (isLoading) {
      return <Loading />;
    }

    return (
      <Table
        columnOptions={this.getColumnOptions({ showAssignee })}
        rows={this.setupRows({ data, showAssignee })}
        noIntl
      />
    );
  }
}

TasksTable.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  showAssignee: PropTypes.bool,
};

TasksTable.defaultProps = {
  showAssignee: false,
};

export default withRouter(TasksTable)