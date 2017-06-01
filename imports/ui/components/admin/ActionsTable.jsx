import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { FormattedRelative } from 'react-intl';

import adminActions from '/imports/js/arrays/adminActions';

const getActions = props => {
  const array = [];

  props.loanRequests.forEach(r => {
    array.push(...adminActions(r, props.history.push));
  });

  return array;
};

const columns = ['Nom du Projet', 'Action', 'Date', 'Commentaire'];

export default class ActionsTable extends Component {
  constructor(props) {
    super(props);

    this.state = { actions: getActions(this.props) };
  }

  componentDidMount() {
    this.timer = Meteor.setInterval(() => {
      this.setState({ actions: getActions(this.props) });
    }, 10000);
  }

  componentWillUnmount() {
    Meteor.clearInterval(this.timer);
  }

  render() {
    if (!this.state.actions.length) {
      return (
        <h2 className="secondary text-center" style={{ margin: '40px 0' }}>
          Rien à faire en ce moment
        </h2>
      );
    }

    return (
      <Table
        // height={500}
        fixedHeader
        selectable={false}
      >
        <TableHeader displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn colSpan={columns.length} style={{ textAlign: 'center' }}>
              À Faire
            </TableHeaderColumn>
          </TableRow>
          <TableRow>
            {columns.map(c => <TableHeaderColumn key={c}>{c}</TableHeaderColumn>)}
          </TableRow>
        </TableHeader>
        <TableBody showRowHover stripedRows displayRowCheckbox={false}>
          {this.state.actions.length &&
            this.state.actions.map(action => (
              <TableRow
                key={`${action.id}${action.requestId}`}
                onTouchTap={() => action.handleClick()}
              >
                <TableRowColumn>{action.requestName}</TableRowColumn>
                <TableRowColumn>{action.title()}</TableRowColumn>
                <TableRowColumn>
                  <FormattedRelative value={action.date && action.date()} />
                </TableRowColumn>
                <TableRowColumn>{action.comment && action.comment()}</TableRowColumn>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    );
  }
}

ActionsTable.propTypes = {};
