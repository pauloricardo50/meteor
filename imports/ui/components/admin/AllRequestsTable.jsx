import React, { Component, PropTypes } from 'react';


import { Table, Column, Cell } from 'fixed-data-table';
import moment from 'moment';


import { toMoney } from '/imports/js/finance-math';


class DataListWrapper {
  constructor(indexMap, data) {
    this._indexMap = indexMap;
    this._data = data;
  }

  getSize() {
    return this._indexMap.length;
  }
}


export default class AllRequestsTable extends Component {
  constructor(props) {
    super(props);

    const array = [];

    this.props.creditRequests.forEach((request, index) => {
      const row = {
        id: index + 1,
        name: request.requestName,
        createdAt: moment(request.createdAt).format('D MMM YY à HH:mm:ss'),
        step: request.logic.step + 1,
        value: `CHF ${toMoney(request.propertyInfo.value)}`,
        fortune: `CHF ${toMoney(request.financialInfo.fortune + request.financialInfo.insuranceFortune)}`,
        salary: `CHF ${toMoney(request.financialInfo.salary)}`,
        quality: 'Très Bon',
      };
      array.push(row);
    });
    const indexArray = Array(array.length).fill().map((x, i) => i);

    this._dataList = new DataListWrapper(indexArray, array);

    this._defaultSortIndexes = [];
    const size = this._dataList.getSize();
    for (var index = 0; index < size; index++) {
      this._defaultSortIndexes.push(index);
    }

    this.state = {
      sortedDataList: this._dataList,
      colSortDirs: {},
    };

    this.onSortChange = this.onSortChange.bind(this);
  }


  onSortChange(columnKey, sortDir) {
    const sortIndexes = this._defaultSortIndexes.slice();
    sortIndexes.sort((indexA, indexB) => {
      const valueA = this._dataList._data[indexA][columnKey];
      const valueB = this._dataList._data[indexB][columnKey];
      let sortVal = 0;
      if (valueA > valueB) {
        sortVal = 1;
      }
      if (valueA < valueB) {
        sortVal = -1;
      }
      if (sortVal !== 0 && sortDir === SortTypes.ASC) {
        sortVal *= -1;
      }

      return sortVal;
    });


    this.setState({
      sortedDataList: new DataListWrapper(sortIndexes, this._dataList._data),
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  }

  render() {
    var { sortedDataList, colSortDirs } = this.state;
    return (
      <Table
        rowHeight={50}
        rowsCount={sortedDataList.getSize()}
        width={700}
        height={500}
        headerHeight={50}
      >
        <Column
          columnKey="id"
          header={
            <SortHeaderCell
              onSortChange={this.onSortChange}
              sortDir={colSortDirs.id}
            >
              id
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={100}
        />
        <Column
          columnKey="name"
          header={
            <SortHeaderCell
              onSortChange={this.onSortChange}
              sortDir={colSortDirs.name}
            >
              Nom
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={150}
        />
        <Column
          columnKey="createdAt"
          header={
            <SortHeaderCell
              onSortChange={this.onSortChange}
              sortDir={colSortDirs.createdAt}
            >
              Créé le
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={170}
        />
        <Column
          columnKey="step"
          header={
            <SortHeaderCell
              onSortChange={this.onSortChange}
              sortDir={colSortDirs.step}
            >
              Étape
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={60}
        />
        <Column
          columnKey="value"
          header={
            <SortHeaderCell
              onSortChange={this.onSortChange}
              sortDir={colSortDirs.value}
            >
              Montant
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={100}
        />
        <Column
          columnKey="fortune"
          header={
            <SortHeaderCell
              onSortChange={this.onSortChange}
              sortDir={colSortDirs.fortune}
            >
              Fonds Propres
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={100}
        />
        <Column
          columnKey="salary"
          header={
            <SortHeaderCell
              onSortChange={this.onSortChange}
              sortDir={colSortDirs.salary}
            >
              Revenus
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={100}
        />
        <Column
          columnKey="quality"
          header={
            <SortHeaderCell
              onSortChange={this.onSortChange}
              sortDir={colSortDirs.quality}
            >
              Qualité
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={100}
        />
      </Table>
    );
  }
}


AllRequestsTable.propTypes = {
  creditRequests: PropTypes.arrayOf(PropTypes.any),
};


const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};


function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}


// Table Cells
class SortHeaderCell extends React.Component {
  constructor(props) {
    super(props);

    this.onSortChange = this.onSortChange.bind(this);
  }


  onSortChange(e) {
    e.preventDefault();

    if (this.props.onSortChange) {
      this.props.onSortChange(
        this.props.columnKey,
        this.props.sortDir ?
          reverseSortDirection(this.props.sortDir) :
          SortTypes.DESC
      );
    }
  }


  render() {
    const { sortDir, children } = this.props;
    return (
      <Cell>
        <a onClick={this.onSortChange}>
          {children} {sortDir ? (sortDir === SortTypes.DESC ? '↓' : '↑') : ''}
        </a>
      </Cell>
    );
  }
}

const TextCell = ({ rowIndex, data, columnKey }) => (
  <Cell>
    {data._data[data._indexMap[rowIndex]][columnKey]}
  </Cell>
);
