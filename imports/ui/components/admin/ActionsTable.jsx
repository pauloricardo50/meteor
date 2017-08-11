import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative } from 'react-intl';

import Button from '/imports/ui/components/general/Button.jsx';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import Table from '/imports/ui/components/general/Table.jsx';
import { T } from '/imports/ui/components/general/Translation.jsx';

import getActions from '/imports/js/arrays/adminActions';
import { completeAction } from '/imports/api/adminActions/methods';

const columns = [
  {
    id: 'ActionsTable.requestName',
    align: 'left',
  },
  {
    id: 'ActionsTable.actionName',
    align: 'left',
  },
  {
    id: 'ActionsTable.date',
    align: 'left',
    format: date => <FormattedRelative value={date} />,
  },
  {
    id: 'ActionsTable.comment',
    align: 'left',
    className: 'secondary',
  },
  {
    id: 'ActionsTable.do',
    format: handleClick =>
      <Button
        label="Go"
        onTouchTap={event => {
          event.stopPropagation();
          handleClick();
        }}
        primary
      />,
    align: 'center',
    style: { paddingLeft: 0, paddingRight: 0, width: 88 },
  },
];

export default class ActionsTable extends Component {
  constructor(props) {
    super(props);

    this.state = { selectedRow: '', filter: 'active' };
  }

  handleRowSelection = index => {
    if (Number.isInteger(index)) {
      this.setState({ selectedRow: this.getFilteredActions()[index]._id });
    } else {
      this.setState({ selectedRow: '' });
    }
  };

  handleFilter = (event, index, filter) =>
    this.setState({ filter, selectedRow: '' });

  handleClick = () => {
    completeAction.call({ id: this.state.selectedRow }, err => {
      if (err) {
        console.log(err);
      }
    });
  };

  getFilteredActions = () =>
    this.props.adminActions.filter(a => a.status === this.state.filter);

  render() {
    const actions = this.getFilteredActions();
    return (
      <article>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <DropDownMenu value={this.state.filter} onChange={this.handleFilter}>
            <MenuItem value={'active'} primaryText="Actif" />
            <MenuItem value={'completed'} primaryText="Complété" />
          </DropDownMenu>
          <Button
            label="Marquer comme complété"
            onTouchTap={this.handleClick}
            disabled={!this.state.selectedRow}
            primary
          />
        </div>

        <Table
          height={actions.length === 0 ? '0px' : '500px'}
          selectable
          selected={this.state.selectedRow}
          onRowSelection={this.handleRowSelection}
          columns={columns}
          rows={actions.map(action => {
            const request = this.props.loanRequests.find(
              r => r._id === action.requestId,
            );
            const title = <T id={`adminAction.${action.actionType}`} />;
            const actionDetails = getActions.find(
              a => a.id === action.actionType,
            );

            return {
              id: action._id,
              columns: [
                request ? request.name : 'Demande supprimée',
                title,
                action.createdAt,
                actionDetails.comment && request
                  ? actionDetails.comment(request)
                  : '-',
                request
                  ? () =>
                      actionDetails.handleClick(
                        request,
                        this.props.history.push,
                      )
                  : () => {},
              ],
            };
          })}
        />

        {actions.length === 0 &&
          <div className="text-center">
            <h2 className="secondary">Aucune action</h2>
          </div>}
      </article>
    );
  }
}

ActionsTable.propTypes = {
  adminActions: PropTypes.arrayOf(PropTypes.object).isRequired,
  loanRequests: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
