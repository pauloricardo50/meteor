import React from 'react';
import moment from 'moment';
import { compose, withProps, withState } from 'recompose';

import Percent from 'core/components/Translation/numberComponents/Percent';
import T from 'core/components/Translation/Translation';

const columnOptions = [
  { id: 'date', label: <T id="Forms.date" /> },
  { id: 'rate', label: <T id="Irs10y.rate" /> },
];

const makeMapIrs10y = ({ setIrs10yToModify, setShowDialog }) => irs10y => {
  const { _id: irs10yId, date, rate } = irs10y;

  return {
    id: irs10yId,
    columns: [
      {
        raw: date,
        label: moment(date).format('DD.MM.YYYY'),
      },
      {
        raw: rate,
        label: <Percent value={rate} />,
      },
    ],
    handleClick: () => {
      setIrs10yToModify(irs10y);
      setShowDialog(true);
    },
  };
};

export default compose(
  withState('irs10yToModify', 'setIrs10yToModify', null),
  withState('showDialog', 'setShowDialog', false),
  withProps(({ irs10y = [], setIrs10yToModify, setShowDialog }) => ({
    rows: irs10y.map(makeMapIrs10y({ setIrs10yToModify, setShowDialog })),
    columnOptions,
  })),
);
