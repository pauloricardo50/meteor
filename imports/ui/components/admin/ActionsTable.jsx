import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative } from 'react-intl';

import Button from '/imports/ui/components/general/Button';
import Select from '/imports/ui/components/general/Select';
import Table from '/imports/ui/components/general/Table';
import { T } from '/imports/ui/components/general/Translation';

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
    format: handleClick => (
      <Button
        label="Go"
        onClick={(event) => {
          event.stopPropagation();
          handleClick();
        }}
        primary
      />
    ),
    align: 'center',
    style: { paddingLeft: 0, paddingRight: 0, width: 88 },
  },
];

export default class ActionsTable extends Component {
  constructor(props) {
    super(props);

    this.state = { selectedRow: '', filter: 'active' };
  }

  getFilteredActions = () =>
    this.props.adminActions.filter(a => a.status === this.state.filter);

  handleFilter = (_, newFilter) =>
    this.setState({ filter: newFilter, selectedRow: '' });

  handleRowSelection = (index) => {
    if (Number.isInteger(index)) {
      this.setState({ selectedRow: this.getFilteredActions()[index]._id });
    } else {
      this.setState({ selectedRow: '' });
    }
  };

  handleClick = () =>
    completeAction.call({ id: this.state.selectedRow }, (err) => {
      if (err) {
        console.log(err);
      }
    });

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
          <Select
            value={this.state.filter}
            onChange={this.handleFilter}
            options={[
              { id: 'active', label: 'Actif' },
              { id: 'completed', label: 'Complété' },
            ]}
            renderValue={value => (value === 'active' ? 'Actif' : 'Complété')}
          />
          <Button
            label="Marquer comme complété"
            onClick={this.handleClick}
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
          rows={actions.map((action) => {
            const request = this.props.loanRequests.find(
              r => r._id === action.requestId,
            );
            const title = <T id={`adminAction.${action.type}`} />;
            const actionDetails = getActions.find(a => a.id === action.type);

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

        {actions.length === 0 && (
          <div className="text-center" style={{ padding: 16 }}>
            <h2 className="secondary">Aucune action</h2>
          </div>
        )}
      </article>
    );
  }
}

ActionsTable.propTypes = {
  adminActions: PropTypes.arrayOf(PropTypes.object).isRequired,
  loanRequests: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
