import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Table from 'core/components/Table';
import { T } from 'core/components/Translation/';
import { LoadingComponent } from 'core/components/Loading';
import UserAssignDropdown from
  'core/components/AssignAdminDropdown/UserAssignDropdown';
import UsersTableContainer from './UsersTableContainer';

class UsersTable extends Component {
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
      { id: <T id="UsersTable.email" /> },
      { id: <T id="UsersTable.createdAt" /> },
      { id: <T id="UsersTable.roles" /> },
    ];
    if (showAssignee) {
      columnOptions.push({
        id: <T id="UsersTable.assignedTo" />,
      });
    }
    columnOptions.push({
      id: <T id="UsersTable.actions" />,
    });
    return columnOptions;
  };

  getColumns = ({ props, index, user }) => {
    const columns = [
      <Link to={`/users/${user._id}`} key="0" > {index + 1} </Link>,
      <Link to={`/users/${user._id}`} key="1" >
        {user.emails[0].address.toString()}
      </Link>,
      <Link to={`/users/${user._id}`} key="2" >
        {moment(user.createdAt).format('D MMM YY à HH:mm:ss')}
      </Link>,
      <Link to={`/users/${user._id}`} key="3" >
        {user.roles ? user.roles.toString() : ''}
      </Link>,
    ];
    if (props.showAssignee) {
      columns.push((user.assignedEmployee &&
          (user.assignedEmployee.username ||
            user.assignedEmployee.emails[0].address)) ||
          '');
    }

    columns.push(<div>
      <ImpersonateLink userId={user._id} history={this.props.history} />
      <UserAssignDropdown doc={user} />
                 </div>);

    return columns;
  };

  setupRows = (props) => {
    const users = props.data;

    if (users && users.length) {
      this.rows = users.map((user, index) => ({
        id: user._id,
        columns: this.getColumns({
          props,
          index,
          user,
        }),
        // handleClick: () => this.props.history.push(`/users/${user._id}`),
      }));
      return this.rows;
    }
    return [];
  };

  render() {
    const { isLoading, showAssignee, data } = this.props;
    const { columnOptions, rows } = this.state;
    
    if (isLoading) {
      return <LoadingComponent />;
    }

    return (
      <Table
        columnOptions={columnOptions}
        rows={rows}
        noIntl
        showAssignee
      />
    );
  }
}

UsersTable.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  isLoading: PropTypes.bool.isRequired,
  showAssignee: PropTypes.bool,
  data: PropTypes.array.isRequired,
};

UsersTable.defaultProps = {
  showAssignee: false,
};

export default UsersTableContainer(UsersTable);
