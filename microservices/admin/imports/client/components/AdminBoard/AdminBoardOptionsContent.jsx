import React from 'react';

import Button from 'core/components/Button';
import IconButton from 'core/components/IconButton';

import { ACTIONS } from './AdminBoardConstants';
import AdminBoardOptionsSelect from './AdminBoardOptionsSelect';

const AdminBoardOptionsContent = ({
  makeOptionsSelect = () => [],
  makeOnChange,
  refetch,
  dispatch,
  ...props
}) => {
  console.log('makeOptionsSelect:', makeOptionsSelect);
  const optionsSelect = makeOptionsSelect({ makeOnChange, dispatch, ...props });
  console.log('optionsSelect:', optionsSelect);

  return (
    <>
      <div className="left">
        {optionsSelect.map(({ label, value, options, onChange, ...rest }) => (
          <AdminBoardOptionsSelect
            key={label}
            label={label}
            value={value}
            options={options}
            onChange={onChange}
            {...rest}
          />
        ))}
      </div>
      <div className="right">
        <Button
          raised
          primary
          onClick={() => dispatch({ type: ACTIONS.RESET })}
        >
          Reset
        </Button>
        <IconButton onClick={refetch} type="loop" />
      </div>
    </>
  );
};

export default AdminBoardOptionsContent;
